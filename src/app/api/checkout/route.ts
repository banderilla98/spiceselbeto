import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getStripeClient } from "@/lib/stripe";


function isObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function readString(value: unknown, maxLength: number) {
  if (typeof value !== "string") return null;

  const result = value.trim();

  if (!result || result.length > maxLength) return null;

  return result;
}

function badRequest(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {

  try {
    const body: unknown = await request.json();

    if (!isObject(body) || !isObject(body.customer)) {
      return badRequest("Invalid checkout information.");
    }

    const customerData = body.customer;

    const firstName = readString(customerData.firstName, 80);
    const lastName = readString(customerData.lastName, 80);
    const email = readString(customerData.email, 254);
    const phone = readString(customerData.phone, 40);

    if (!firstName || !lastName || !email || !phone) {
      return badRequest("Please complete all required contact fields.");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return badRequest("Please provide a valid email address.");
    }

    const fulfillmentMethod = body.fulfillmentMethod;

    if (
      fulfillmentMethod !== "shipping" &&
      fulfillmentMethod !== "pickup"
    ) {
      return badRequest("Invalid fulfillment method.");
    }

    let address: string | null = null;
    let apartment: string | null = null;
    let city: string | null = null;
    let state: string | null = null;
    let zip: string | null = null;

    if (fulfillmentMethod === "shipping") {
      address = readString(customerData.address, 200);
      apartment =
        customerData.apartment === ""
          ? null
          : readString(customerData.apartment, 100);
      city = readString(customerData.city, 100);
      state = readString(customerData.state, 80);
      zip = readString(customerData.zip, 20);

      if (!address || !city || !state || !zip) {
        return badRequest("Please complete your shipping address.");
      }

      if (
        customerData.apartment !== undefined &&
        customerData.apartment !== "" &&
        !apartment
      ) {
        return badRequest("Please check your apartment or suite information.");
      }
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return badRequest("Your cart is empty.");
    }

    if (body.items.length > 50) {
      return badRequest("Too many different products in your cart.");
    }

    // Validate and combine duplicate product IDs.
    const quantities = new Map<string, number>();

    for (const item of body.items) {
      if (!isObject(item)) {
        return badRequest("Invalid cart item.");
      }

      const productId = item.productId;
      const quantity = item.quantity;

      if (
        typeof productId !== "string" ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          productId
        )
      ) {
        return badRequest("A product in your cart is invalid.");
      }

      if (
        typeof quantity !== "number" ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 99
      ) {
        return badRequest("A product quantity is invalid.");
      }

      const newQuantity =
        (quantities.get(productId) ?? 0) + quantity;

      if (newQuantity > 99) {
        return badRequest("Maximum quantity per product is 99.");
      }

      quantities.set(productId, newQuantity);
    }

    const supabase = createAdminClient();

    const productIds = [...quantities.keys()];

    // Get trusted product information from Supabase.
    const { data: products, error: productError } = await supabase
      .from("products")
      .select("id, name, price, weight, stock_quantity, is_active")
      .in("id", productIds)
      .eq("is_active", true);

    if (productError) {
      console.error("Product lookup error:", productError.message);
      return badRequest("Unable to verify your cart.", 500);
    }

    if (!products || products.length !== productIds.length) {
      return badRequest(
        "One or more products are no longer available."
      );
    }

    let subtotalCents = 0;

    const verifiedItems = [];

    for (const product of products) {
      const quantity = quantities.get(product.id);

      if (!quantity) {
        return badRequest("Invalid product quantity.");
      }

      const price = Number(product.price);
      const priceCents = Math.round(price * 100);
      const availableStock = Number(product.stock_quantity ?? 0);

      if (!Number.isFinite(priceCents) || priceCents <= 0) {
        return badRequest("A product has an invalid price.", 500);
      }

      if (availableStock < quantity) {
        return badRequest(
          `Not enough stock available for ${product.name}.`,
          409
        );
      }

      const lineTotalCents = priceCents * quantity;

      subtotalCents += lineTotalCents;

      verifiedItems.push({
        product_id: product.id,
        product_name: product.name,
        product_weight: product.weight ?? "",
        unit_price: priceCents / 100,
        quantity,
        line_total: lineTotalCents / 100,
      });
    }

    const subtotal = subtotalCents / 100;

    // TEST MODE ONLY:
    // Shipping and tax are temporarily zero.
    // We must configure real shipping and tax before launch.
    const shippingCost = 0;
    const tax = 0;
    const total = subtotal + shippingCost + tax;

    // Create the pending order.
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_first_name: firstName,
        customer_last_name: lastName,
        customer_email: email,
        customer_phone: phone,
        fulfillment_method: fulfillmentMethod,
        shipping_address_line1: address,
        shipping_address_line2: apartment,
        shipping_city: city,
        shipping_state: state,
        shipping_postal_code: zip,
        subtotal,
        shipping_cost: shippingCost,
        tax,
        total,
        status: "pending",
        payment_status: "pending",
        pickup_notes:
          fulfillmentMethod === "pickup"
            ? "Coordinate the exact pickup location and time with the customer."
            : null,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      console.error("Order creation error:", orderError?.message);
      return badRequest("Unable to create your order.", 500);
    }

    

    // Save a snapshot of the purchased products.
    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(
        verifiedItems.map((item) => ({
          ...item,
          order_id: order.id,
        }))
      );

    if (itemsError) {
      console.error("Order items error:", itemsError.message);

      await supabase
        .from("orders")
        .delete()
        .eq("id", order.id);

      return badRequest("Unable to save your order items.", 500);
    }

    const stripe = getStripeClient();

    // Create the secure Stripe Checkout Session.
    let session: Awaited<
      ReturnType<typeof stripe.checkout.sessions.create>
    >;

    try {
      session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: email,
        client_reference_id: order.id,

        metadata: {
          order_id: order.id,
        },

        line_items: verifiedItems.map((item) => ({
          quantity: item.quantity,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(item.unit_price * 100),
            product_data: {
              name: item.product_name,
              description: item.product_weight || undefined,
            },
          },
        })),

        success_url: `${new URL(request.url).origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${new URL(request.url).origin}/checkout?cancelled=1`,
      });
    } catch (stripeError) {
      console.error("Stripe session error:", stripeError);

      await supabase
        .from("orders")
        .update({
          status: "cancelled",
          payment_status: "failed",
        })
        .eq("id", order.id);

      return badRequest("Unable to start secure payment. Please try again.", 502);
    }

    if (!session.url) {
      await stripe.checkout.sessions.expire(session.id);

      await supabase
        .from("orders")
        .update({
          status: "cancelled",
          payment_status: "failed",
        })
        .eq("id", order.id);

      return badRequest("Unable to generate the payment page.", 502);
    }

    const { error: sessionUpdateError } = await supabase
      .from("orders")
      .update({
        stripe_checkout_session_id: session.id,
      })
      .eq("id", order.id);

    if (sessionUpdateError) {
      console.error("Stripe session save error:", sessionUpdateError.message);

      await stripe.checkout.sessions.expire(session.id);

      await supabase
        .from("orders")
        .update({
          status: "cancelled",
          payment_status: "failed",
        })
        .eq("id", order.id);

      return badRequest("Unable to finish preparing your payment.", 500);
    }

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error("Checkout endpoint error:", error);

    return NextResponse.json(
      { error: "Something went wrong while preparing checkout." },
      { status: 500 }
    );
  }
}
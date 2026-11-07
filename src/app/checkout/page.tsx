"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/components/CartProvider";
import { ArrowLeft, MapPin, Package } from "lucide-react";

type FulfillmentMethod = "shipping" | "pickup";

export default function CheckoutPage() {
  const { items } = useCart();

  const [method, setMethod] = useState<FulfillmentMethod>("shipping");
  const [showReview, setShowReview] = useState(false);

  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zip: "",
  });

  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  function updateCustomer(
    field: keyof typeof customer,
    value: string
  ) {
    setCustomer((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setShowReview(true);
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#FAF8F3]">
        <Navbar />

        <section className="px-6 py-24 text-center">
          <h1 className="text-3xl font-semibold text-[#432B20]">
            Your cart is empty
          </h1>

          <p className="mt-4 text-sm text-[#756456]">
            Add some spices before starting checkout.
          </p>

          <Link
            href="/shop"
            className="mt-8 inline-block bg-[#A85D3B] px-8 py-4 text-xs tracking-widest text-white"
          >
            EXPLORE OUR SPICES
          </Link>
        </section>

        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF8F3]">
      <Navbar />

      <section className="bg-[#F0E8DC] px-6 py-16 text-center">
        <p className="mb-4 text-xs tracking-[0.3em] text-[#A85D3B]">
          ALMOST THERE
        </p>

        <h1 className="text-4xl font-semibold text-[#432B20] md:text-5xl">
          Checkout
        </h1>

        <p className="mt-4 text-sm text-[#756456]">
          Choose how you would like to receive your order.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        {showReview ? (
          <div className="mx-auto max-w-2xl">
            <button
              onClick={() => setShowReview(false)}
              className="mb-8 inline-flex items-center gap-2 text-xs tracking-widest text-[#A85D3B]"
            >
              <ArrowLeft size={15} />
              EDIT INFORMATION
            </button>

            <div className="border border-[#EAE3D8] bg-white p-7 md:p-10">
              <p className="text-xs tracking-[0.25em] text-[#A85D3B]">
                REVIEW YOUR INFORMATION
              </p>

              <h2 className="mt-3 text-2xl font-semibold text-[#432B20]">
                Customer details
              </h2>

              <p className="mt-5 text-sm text-[#756456]">
                {customer.firstName} {customer.lastName}
              </p>
              <p className="mt-1 text-sm text-[#756456]">
                {customer.email}
              </p>
              <p className="mt-1 text-sm text-[#756456]">
                {customer.phone}
              </p>

              <div className="my-7 border-t border-[#EAE3D8]" />

              <h3 className="font-medium text-[#432B20]">
                Delivery preference
              </h3>

              <p className="mt-2 text-sm text-[#756456]">
  {method === "shipping"
    ? "Shipping"
    : "Local Pickup — Bakersfield, California"}
</p>

{method === "pickup" && (
  <p className="mt-2 text-sm leading-6 text-[#756456]">
    The exact pickup location and time will be arranged
    after your order is placed. Please wait for confirmation
    before traveling.
  </p>
)}

              {method === "shipping" && (
                <p className="mt-2 text-sm leading-6 text-[#756456]">
                  {customer.address}
                  {customer.apartment && `, ${customer.apartment}`}
                  <br />
                  {customer.city}, {customer.state} {customer.zip}
                </p>
              )}

              <div className="my-7 border-t border-[#EAE3D8]" />

              <h3 className="font-medium text-[#432B20]">Your items</h3>

              <div className="mt-4 space-y-3">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex justify-between gap-4 text-sm"
                  >
                    <span className="text-[#756456]">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-medium text-[#432B20]">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-between border-t border-[#EAE3D8] pt-5">
                <span className="font-semibold text-[#432B20]">
                  Product subtotal
                </span>
                <span className="text-xl font-semibold text-[#432B20]">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <p className="mt-6 rounded-sm bg-[#F0E8DC] p-4 text-xs leading-6 text-[#756456]">
                This is a preview only. Your information has not been sent,
                no order has been placed, and no payment has been collected.
                Shipping and taxes will be calculated when checkout is
                connected.
              </p>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_350px]"
          >
            <div className="space-y-12">
              {/* Customer information */}
              <div>
                <h2 className="text-2xl font-semibold text-[#432B20]">
                  Contact information
                </h2>

                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <label className="text-sm text-[#59483C]">
                    First name *
                    <input
                      required
                      autoComplete="given-name"
                      value={customer.firstName}
                      onChange={(e) =>
                        updateCustomer("firstName", e.target.value)
                      }
                      className="mt-2 w-full border border-[#EAE3D8] bg-white px-4 py-3 outline-none focus:border-[#A85D3B]"
                    />
                  </label>

                  <label className="text-sm text-[#59483C]">
                    Last name *
                    <input
                      required
                      autoComplete="family-name"
                      value={customer.lastName}
                      onChange={(e) =>
                        updateCustomer("lastName", e.target.value)
                      }
                      className="mt-2 w-full border border-[#EAE3D8] bg-white px-4 py-3 outline-none focus:border-[#A85D3B]"
                    />
                  </label>

                  <label className="text-sm text-[#59483C] sm:col-span-2">
                    Email address *
                    <input
                      required
                      type="email"
                      autoComplete="email"
                      value={customer.email}
                      onChange={(e) =>
                        updateCustomer("email", e.target.value)
                      }
                      className="mt-2 w-full border border-[#EAE3D8] bg-white px-4 py-3 outline-none focus:border-[#A85D3B]"
                    />
                  </label>

                  <label className="text-sm text-[#59483C] sm:col-span-2">
                    Phone number *
                    <input
                      required
                      type="tel"
                      autoComplete="tel"
                      value={customer.phone}
                      onChange={(e) =>
                        updateCustomer("phone", e.target.value)
                      }
                      className="mt-2 w-full border border-[#EAE3D8] bg-white px-4 py-3 outline-none focus:border-[#A85D3B]"
                    />
                  </label>
                </div>
              </div>

              {/* Fulfillment choice */}
              <div>
                <h2 className="text-2xl font-semibold text-[#432B20]">
                  How would you like your order?
                </h2>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setMethod("shipping")}
                    className={`border p-5 text-left transition-colors ${
                      method === "shipping"
                        ? "border-[#A85D3B] bg-[#F0E8DC]"
                        : "border-[#EAE3D8] bg-white"
                    }`}
                  >
                    <Package className="mb-4 text-[#A85D3B]" size={23} />
                    <span className="block font-medium text-[#432B20]">
                      Shipping
                    </span>
                    <span className="mt-2 block text-xs text-[#756456]">
                      Have your spices delivered.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod("pickup")}
                    className={`border p-5 text-left transition-colors ${
                      method === "pickup"
                        ? "border-[#A85D3B] bg-[#F0E8DC]"
                        : "border-[#EAE3D8] bg-white"
                    }`}
                  >
                    <MapPin className="mb-4 text-[#A85D3B]" size={23} />
                    <span className="block font-medium text-[#432B20]">
                      Local Pickup
                    </span>
                    <span className="mt-2 block text-xs text-[#756456]">
  Available in Bakersfield, California.
</span>
                  </button>
                </div>
              </div>
              {method === "pickup" && (
  <div className="border border-[#EAE3D8] bg-white p-6">
    <div className="flex items-start gap-3">
      <MapPin className="mt-1 shrink-0 text-[#A85D3B]" size={20} />

      <div>
        <h3 className="font-medium text-[#432B20]">
          Local Pickup — Bakersfield, CA
        </h3>

        <p className="mt-2 text-sm leading-6 text-[#756456]">
          Local pickup is available in Bakersfield, California.
          After your order is placed, we will contact you to
          arrange the exact pickup location and time.
        </p>

        <p className="mt-3 text-xs text-[#A85D3B]">
          Please wait for pickup confirmation before traveling.
        </p>
      </div>
    </div>
  </div>
)}
              {/* Shipping address */}
              {method === "shipping" && (
                <div>
                  <h2 className="text-2xl font-semibold text-[#432B20]">
                    Shipping address
                  </h2>

                  <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <label className="text-sm text-[#59483C] sm:col-span-2">
                      Street address *
                      <input
                        required
                        autoComplete="street-address"
                        value={customer.address}
                        onChange={(e) =>
                          updateCustomer("address", e.target.value)
                        }
                        className="mt-2 w-full border border-[#EAE3D8] bg-white px-4 py-3 outline-none focus:border-[#A85D3B]"
                      />
                    </label>

                    <label className="text-sm text-[#59483C] sm:col-span-2">
                      Apartment, suite, etc. (optional)
                      <input
                        autoComplete="address-line2"
                        value={customer.apartment}
                        onChange={(e) =>
                          updateCustomer("apartment", e.target.value)
                        }
                        className="mt-2 w-full border border-[#EAE3D8] bg-white px-4 py-3 outline-none focus:border-[#A85D3B]"
                      />
                    </label>

                    <label className="text-sm text-[#59483C]">
                      City *
                      <input
                        required
                        autoComplete="address-level2"
                        value={customer.city}
                        onChange={(e) =>
                          updateCustomer("city", e.target.value)
                        }
                        className="mt-2 w-full border border-[#EAE3D8] bg-white px-4 py-3 outline-none focus:border-[#A85D3B]"
                      />
                    </label>

                    <label className="text-sm text-[#59483C]">
                      State *
                      <input
                        required
                        autoComplete="address-level1"
                        value={customer.state}
                        onChange={(e) =>
                          updateCustomer("state", e.target.value)
                        }
                        className="mt-2 w-full border border-[#EAE3D8] bg-white px-4 py-3 outline-none focus:border-[#A85D3B]"
                      />
                    </label>

                    <label className="text-sm text-[#59483C]">
                      ZIP code *
                      <input
                        required
                        autoComplete="postal-code"
                        value={customer.zip}
                        onChange={(e) =>
                          updateCustomer("zip", e.target.value)
                        }
                        className="mt-2 w-full border border-[#EAE3D8] bg-white px-4 py-3 outline-none focus:border-[#A85D3B]"
                      />
                    </label>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#A85D3B] px-8 py-4 text-xs tracking-widest text-white transition-colors hover:bg-[#87452B] sm:w-auto"
              >
                REVIEW MY INFORMATION
              </button>
            </div>

            {/* Order summary */}
            <aside className="h-fit bg-[#F0E8DC] p-7">
              <h2 className="text-xl font-semibold text-[#432B20]">
                Your order
              </h2>

              <div className="mt-6 space-y-5">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex justify-between gap-4 text-sm"
                  >
                    <div>
                      <p className="font-medium text-[#432B20]">
                        {item.product.name}
                      </p>
                      <p className="mt-1 text-xs text-[#85776B]">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    <span className="font-medium text-[#432B20]">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex justify-between border-t border-[#DCCFC0] pt-6">
                <span className="font-medium text-[#432B20]">Subtotal</span>
                <span className="text-xl font-semibold text-[#432B20]">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <p className="mt-5 text-xs leading-6 text-[#85776B]">
                Shipping and applicable taxes are not included yet.
              </p>
            </aside>
          </form>
        )}
      </section>

      <Footer />
    </main>
  );
}
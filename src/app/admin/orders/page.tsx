import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";

import { getAdminUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import OrderManager from "@/components/OrderManager";

async function OrdersContent() {
  await connection();

  const user = await getAdminUser();

  if (!user) {
    redirect("/admin/login?error=unauthorized");
  }

  const supabase = await createClient();

  const { data: orders, error } = await supabase
  .from("orders")
  .select(`
    id,
    customer_first_name,
    customer_last_name,
    customer_email,
    customer_phone,
    fulfillment_method,
    shipping_address_line1,
    shipping_address_line2,
    shipping_city,
    shipping_state,
    shipping_postal_code,
    subtotal,
    shipping_cost,
    tax,
    total,
    status,
    payment_status,
    pickup_notes,
    created_at,
    order_items (
      id,
      product_name,
      product_weight,
      unit_price,
      quantity,
      line_total
    )
  `)
  .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading orders:", error.message);
    throw new Error("Unable to load orders.");
  }

  return <OrderManager initialOrders={orders ?? []} />;
}

export default function AdminOrdersPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#f8f5ef]">
          <p className="text-sm text-[#78685e]">Loading orders...</p>
        </main>
      }
    >
      <OrdersContent />
    </Suspense>
  );
}
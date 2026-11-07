"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

type OrderItem = {
  id: string;
  product_name: string;
  product_weight: string | null;
  unit_price: number;
  quantity: number;
  line_total: number;
};

type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "ready_for_pickup"
  | "completed"
  | "cancelled";

type Order = {
  id: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string | null;
  fulfillment_method: "shipping" | "pickup";
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  status: OrderStatus;
  payment_status: string;
  pickup_notes: string | null;
  created_at: string;
  order_items: OrderItem[] | null;
  shipping_address_line1: string | null;
shipping_address_line2: string | null;
shipping_city: string | null;
shipping_state: string | null;
shipping_postal_code: string | null;
};

type Props = {
  initialOrders: Order[];
};

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  ready_for_pickup: "Ready for pickup",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-indigo-100 text-indigo-800",
  ready_for_pickup: "bg-emerald-100 text-emerald-800",
  completed: "bg-stone-200 text-stone-700",
  cancelled: "bg-red-100 text-red-800",
};

const statuses: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "ready_for_pickup",
  "completed",
  "cancelled",
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value) || 0);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function OrderManager({ initialOrders }: Props) {
  const [orders, setOrders] = useState(initialOrders);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
const [statusFilter, setStatusFilter] = useState("all");
const [paymentFilter, setPaymentFilter] = useState("all");
const [fulfillmentFilter, setFulfillmentFilter] = useState("all");
  async function handleStatusChange(
    orderId: string,
    newStatus: OrderStatus
  ) {
    setError("");
    setUpdatingId(orderId);

    try {
      const supabase = createClient();

      const { error: updateError } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (updateError) {
        throw updateError;
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );
    } catch (err) {
      console.error("Order status update error:", err);
      setError("Unable to update the order status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  }

  const pendingCount = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const activeCount = orders.filter(
    (order) =>
      order.status === "processing" ||
      order.status === "ready_for_pickup"
  ).length;

  const filteredOrders = orders.filter((order) => {
  const search = searchTerm.toLowerCase().trim();

  const matchesSearch =
    !search ||
    `${order.customer_first_name} ${order.customer_last_name}`
      .toLowerCase()
      .includes(search) ||
    order.customer_email.toLowerCase().includes(search) ||
    order.id.toLowerCase().includes(search) ||
    (order.customer_phone ?? "").includes(search);

  const matchesStatus =
    statusFilter === "all" || order.status === statusFilter;

  const matchesPayment =
    paymentFilter === "all" || order.payment_status === paymentFilter;

  const matchesFulfillment =
    fulfillmentFilter === "all" ||
    order.fulfillment_method === fulfillmentFilter;

  return (
    matchesSearch &&
    matchesStatus &&
    matchesPayment &&
    matchesFulfillment
  );
});

const paidCount = orders.filter(
  (order) => order.payment_status === "paid"
).length;
  return (
    <main className="min-h-screen bg-[#f8f5ef] px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin"
              className="text-sm font-medium text-[#a65d3f] hover:underline"
            >
              ← Back to dashboard
            </Link>

            <h1 className="mt-3 text-3xl font-semibold text-[#38271f]">
              Orders
            </h1>

            <p className="mt-2 text-sm text-[#78685e]">
              Review customer orders and manage their fulfillment status.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-[#e8dfd2] bg-white p-5">
            <p className="text-sm text-[#78685e]">Total orders</p>
            <p className="mt-2 text-3xl font-semibold text-[#38271f]">
              {orders.length}
            </p>
          </div>

          <div className="rounded-xl border border-[#e8dfd2] bg-white p-5">
            <p className="text-sm text-[#78685e]">Pending</p>
            <p className="mt-2 text-3xl font-semibold text-[#38271f]">
              {pendingCount}
            </p>
          </div>

          <div className="rounded-xl border border-[#e8dfd2] bg-white p-5">
            <p className="text-sm text-[#78685e]">In progress</p>
            <p className="mt-2 text-3xl font-semibold text-[#38271f]">
              {activeCount}
            </p>
          </div>
          <div className="rounded-xl border border-[#e8dfd2] bg-white p-5">
  <p className="text-sm text-[#78685e]">Paid orders</p>
  <p className="mt-2 text-3xl font-semibold text-[#38271f]">
    {paidCount}
  </p>
</div>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <section className="mt-8">
  <div className="mb-6 rounded-xl border border-[#e8dfd2] bg-white p-5">
    <h2 className="text-lg font-semibold text-[#38271f]">
      Find orders
    </h2>

    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <input
        type="search"
        placeholder="Name, email, phone or order ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="rounded-lg border border-[#d9cfc2] px-3 py-2 text-sm"
      />

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="rounded-lg border border-[#d9cfc2] px-3 py-2 text-sm"
      >
        <option value="all">All order statuses</option>
        {statuses.map((status) => (
          <option key={status} value={status}>
            {statusLabels[status]}
          </option>
        ))}
      </select>

      <select
        value={paymentFilter}
        onChange={(e) => setPaymentFilter(e.target.value)}
        className="rounded-lg border border-[#d9cfc2] px-3 py-2 text-sm"
      >
        <option value="all">All payment statuses</option>
        <option value="pending">Pending</option>
        <option value="unpaid">Unpaid</option>
        <option value="paid">Paid</option>
        <option value="failed">Failed</option>
        <option value="refunded">Refunded</option>
      </select>

      <select
        value={fulfillmentFilter}
        onChange={(e) => setFulfillmentFilter(e.target.value)}
        className="rounded-lg border border-[#d9cfc2] px-3 py-2 text-sm"
      >
        <option value="all">All fulfillment methods</option>
        <option value="shipping">Shipping</option>
        <option value="pickup">Local pickup</option>
      </select>
    </div>

    <div className="mt-4 flex items-center justify-between">
      <p className="text-sm text-[#78685e]">
        Showing {filteredOrders.length} of {orders.length} orders
      </p>

      <button
        onClick={() => {
          setSearchTerm("");
          setStatusFilter("all");
          setPaymentFilter("all");
          setFulfillmentFilter("all");
        }}
        className="text-sm font-medium text-[#a65d3f] hover:underline"
      >
        Clear filters
      </button>
    </div>
  </div>
          {filteredOrders.length === 0 ? (
            <div className="rounded-xl border border-[#e8dfd2] bg-white px-6 py-16 text-center">
              <h2 className="text-lg font-semibold text-[#38271f]">
                No orders yet
              </h2>
              <p className="mt-2 text-sm text-[#78685e]">
                Customer orders will appear here after secure checkout is
                implemented.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredOrders.map((order) => (
                <article
                  key={order.id}
                  className="rounded-xl border border-[#e8dfd2] bg-white p-5 sm:p-6"
                >
                  <div className="flex flex-col gap-4 border-b border-[#eee7de] pb-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-[#97877b]">
                        Order #{order.id.slice(0, 8)}
                      </p>

                      <h2 className="mt-1 text-lg font-semibold text-[#38271f]">
                        {order.customer_first_name}{" "}
                        {order.customer_last_name}
                      </h2>

                      <p className="mt-1 text-sm text-[#78685e]">
                        {order.customer_email}
                      </p>

                      {order.customer_phone && (
                        <p className="mt-1 text-sm text-[#78685e]">
                          {order.customer_phone}
                        </p>
                      )}

                      <p className="mt-2 text-xs text-[#97877b]">
                        {formatDate(order.created_at)}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:items-end">
                      <span
                        className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${statusStyles[order.status]}`}
                      >
                        {statusLabels[order.status]}
                      </span>

                      <label className="flex flex-col gap-1 text-xs text-[#78685e] sm:items-end">
                        Update status
                        <select
                          value={order.status}
                          disabled={updatingId === order.id}
                          onChange={(event) =>
                            handleStatusChange(
                              order.id,
                              event.target.value as OrderStatus
                            )
                          }
                          className="rounded-lg border border-[#d9cfc2] bg-white px-3 py-2 text-sm text-[#38271f] outline-none focus:border-[#a65d3f] disabled:opacity-50"
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {statusLabels[status]}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>

                  <div className="grid gap-6 py-5 sm:grid-cols-2">
                    <div>
                      <h3 className="text-sm font-semibold text-[#38271f]">
                        Items ordered
                      </h3>

                      <div className="mt-3 space-y-3">
                        {(order.order_items ?? []).map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between gap-4 text-sm"
                          >
                            <div className="text-[#78685e]">
                              <p className="font-medium text-[#38271f]">
                                {item.product_name}
                              </p>
                              <p>
  {item.product_weight
    ? `${item.product_weight} · `
    : ""}
  {formatCurrency(Number(item.unit_price))} each
  {" · "}Qty: {item.quantity}
</p>
                            </div>

                            <p className="shrink-0 font-medium text-[#38271f]">
                              {formatCurrency(Number(item.line_total))}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-[#38271f]">
                        Order summary
                      </h3>
                      {order.fulfillment_method === "shipping" ? (
  <div className="mt-5 rounded-lg bg-[#f8f5ef] p-4">
    <h3 className="text-sm font-semibold text-[#38271f]">
      Shipping address
    </h3>

    <div className="mt-2 text-sm leading-6 text-[#78685e]">
      <p>{order.shipping_address_line1}</p>

      {order.shipping_address_line2 && (
        <p>{order.shipping_address_line2}</p>
      )}

      <p>
        {order.shipping_city}, {order.shipping_state}{" "}
        {order.shipping_postal_code}
      </p>
    </div>
  </div>
) : (
  <div className="mt-5 rounded-lg bg-[#f8f5ef] p-4">
    <h3 className="text-sm font-semibold text-[#38271f]">
      Local pickup
    </h3>

    <p className="mt-2 text-sm text-[#78685e]">
      Pickup arrangements must be confirmed with the customer.
    </p>
  </div>
)}

                      <div className="mt-3 space-y-2 text-sm text-[#78685e]">
                        <div className="flex justify-between gap-4">
                          <span>Fulfillment</span>
                          <span className="font-medium capitalize text-[#38271f]">
                            {order.fulfillment_method === "pickup"
                              ? "Local pickup"
                              : "Shipping"}
                          </span>
                        </div>

                        <div className="flex justify-between gap-4">
                          <span>Subtotal</span>
                          <span>{formatCurrency(Number(order.subtotal))}</span>
                        </div>

                        <div className="flex justify-between gap-4">
                          <span>Shipping</span>
                          <span>
                            {formatCurrency(Number(order.shipping_cost))}
                          </span>
                        </div>

                        <div className="flex justify-between gap-4">
                          <span>Tax</span>
                          <span>{formatCurrency(Number(order.tax))}</span>
                        </div>

                        <div className="flex justify-between gap-4 border-t border-[#eee7de] pt-3 text-base font-semibold text-[#38271f]">
                          <span>Total</span>
                          <span>{formatCurrency(Number(order.total))}</span>
                        </div>

                        <div className="flex justify-between gap-4 pt-2">
                          <span>Payment</span>
                          <span className="font-medium capitalize text-[#38271f]">
                            {order.payment_status.replaceAll("_", " ")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {order.pickup_notes && (
                    <div className="rounded-lg bg-[#f8f5ef] p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#78685e]">
                        Pickup notes
                      </p>
                      <p className="mt-1 text-sm text-[#38271f]">
                        {order.pickup_notes}
                      </p>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
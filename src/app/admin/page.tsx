import { connection } from "next/server";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth";
import AdminLogoutButton from "@/components/AdminLogoutButton";

async function AdminDashboard() {
  await connection();

  const user = await getAdminUser();

  if (!user) {
    redirect("/admin/login?error=unauthorized");
  }

  return (
    <main className="min-h-screen bg-[#f8f5ef]">
      <header className="border-b border-[#e8dfd2] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-sm font-semibold tracking-[0.25em] text-[#a65d3f]">
              SPICES BETO
            </p>
            <p className="mt-1 text-xs text-[#94877e]">Administration</p>
          </div>

          <AdminLogoutButton />
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-sm font-medium text-[#a65d3f]">
          STORE MANAGEMENT
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-[#38271f]">
          Welcome to your dashboard
        </h1>

        <p className="mt-3 text-[#78685e]">
          Signed in as {user.email}
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/admin/products"
            className="block rounded-xl border border-[#e8dfd2] bg-white p-6 transition hover:border-[#a65d3f] hover:shadow-sm"
          >
            <h2 className="text-lg font-semibold text-[#38271f]">
              Products
            </h2>
            <p className="mt-2 text-sm text-[#78685e]">
              Add products, update prices, manage inventory and descriptions.
            </p>
            <p className="mt-5 text-sm font-medium text-[#a65d3f]">
              Manage products →
            </p>
          </Link>

          <Link
            href="/admin/categories"
            className="block rounded-xl border border-[#e8dfd2] bg-white p-6 transition hover:border-[#a65d3f] hover:shadow-sm"
          >
            <h2 className="text-lg font-semibold text-[#38271f]">
              Categories
            </h2>

            <p className="mt-2 text-sm text-[#78685e]">
              Create categories, organize spices and manage your store catalog.
            </p>

            <p className="mt-5 text-sm font-medium text-[#a65d3f]">
              Manage categories →
            </p>
          </Link>

          <Link
            href="/admin/orders"
            className="block rounded-xl border border-[#e8dfd2] bg-white p-6 transition hover:border-[#a65d3f] hover:shadow-sm"
          >
            <h2 className="text-lg font-semibold text-[#38271f]">
              Orders
            </h2>
            <p className="mt-2 text-sm text-[#78685e]">
              View customer orders, review purchases and manage fulfillment.
            </p>
            <p className="mt-5 text-sm font-medium text-[#a65d3f]">
              Manage orders →
            </p>
          </Link>

          <div className="rounded-xl border border-[#e8dfd2] bg-white p-6">
            <h2 className="text-lg font-semibold text-[#38271f]">
              Store settings
            </h2>
            <p className="mt-2 text-sm text-[#78685e]">
              Manage store information and other settings.
            </p>
            <p className="mt-5 text-sm font-medium text-[#a65d3f]">
              Coming next
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#f8f5ef]">
          <p className="text-sm text-[#78685e]">
            Loading administration...
          </p>
        </main>
      }
    >
      <AdminDashboard />
    </Suspense>
  );
}
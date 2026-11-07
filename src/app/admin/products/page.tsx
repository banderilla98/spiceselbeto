import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";

import { getAdminUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import ProductManager from "@/components/ProductManager";

async function ProductsContent() {
  await connection();

  const user = await getAdminUser();

  if (!user) {
    redirect("/admin/login?error=unauthorized");
  }

  const supabase = await createClient();

  const [productsResult, categoriesResult] = await Promise.all([
    supabase
      .from("products")
      .select(
        "id, name, slug, sku, description, price, weight, image_url, category_id, stock_quantity, is_active, is_featured"
      )
      .order("created_at", { ascending: false }),

    supabase
      .from("categories")
      .select("id, name")
      .order("name"),
  ]);

  if (productsResult.error) {
    throw new Error("Unable to load products.");
  }

  if (categoriesResult.error) {
    throw new Error("Unable to load categories.");
  }

  return (
    <ProductManager
      initialProducts={productsResult.data ?? []}
      categories={categoriesResult.data ?? []}
    />
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#f8f5ef]">
          <p className="text-sm text-[#78685e]">
            Loading products...
          </p>
        </main>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
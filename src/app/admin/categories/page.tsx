
import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";

import { getAdminUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import CategoryManager from "@/components/CategoryManager";

async function CategoriesContent() {
  await connection();

  const user = await getAdminUser();

  if (!user) {
    redirect("/admin/login?error=unauthorized");
  }

  const supabase = await createClient();

  const [categoriesResult, productsResult] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name, slug, description, is_active")
      .order("name"),

    supabase
      .from("products")
      .select("category_id"),
  ]);

  if (categoriesResult.error) {
    throw new Error("Unable to load categories.");
  }

  if (productsResult.error) {
    throw new Error("Unable to load product counts.");
  }

  const productCounts = new Map<string, number>();

  for (const product of productsResult.data ?? []) {
    if (product.category_id) {
      productCounts.set(
        product.category_id,
        (productCounts.get(product.category_id) ?? 0) + 1
      );
    }
  }

  const categories = (categoriesResult.data ?? []).map((category) => ({
    ...category,
    product_count: productCounts.get(category.id) ?? 0,
  }));

  return <CategoryManager initialCategories={categories} />;
}

export default function AdminCategoriesPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#f8f5ef]">
          <p className="text-sm text-[#78685e]">
            Loading categories...
          </p>
        </main>
      }
    >
      <CategoriesContent />
    </Suspense>
  );
}

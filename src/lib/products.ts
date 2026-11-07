import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/data/products";

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select(
      "id, name, slug, description, price, weight, image_url, category_id, is_featured"
    )
    .eq("is_active", true)
    .order("name");

  if (error) {
    console.error("Error fetching products:", error.message);
    throw new Error("Unable to load products.");
  }

  const { data: categories, error: categoryError } = await supabase
    .from("categories")
    .select("id, name");

  if (categoryError) {
    console.error("Error fetching categories:", categoryError.message);
    throw new Error("Unable to load product categories.");
  }

  const categoryMap = new Map(
    categories.map((category) => [category.id, category.name])
  );

  return products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description ?? "",
    price: Number(product.price),
    weight: product.weight ?? "",
    category: product.category_id
      ? categoryMap.get(product.category_id) ?? "Uncategorized"
      : "Uncategorized",
    image: product.image_url ?? "",
    featured: product.is_featured,
  }));
}

export async function getProductBySlug(
  slug: string
): Promise<Product | undefined> {
  const products = await getProducts();

  return products.find((product) => product.slug === slug);
}
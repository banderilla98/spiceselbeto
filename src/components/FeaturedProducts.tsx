import Link from "next/link";
import { connection } from "next/server";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/products";

export default async function FeaturedProducts() {
  await connection();

  const products = await getProducts();
  const featuredProducts = products.filter((product) => product.featured);

  return (
    <section className="bg-[#FAF8F4] px-6 py-20 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#A85D3B]">
              Made for your kitchen
            </p>

            <h2 className="font-serif text-4xl text-[#432B20] md:text-5xl">
              Featured Spices
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-7 text-[#756456]">
              Explore some of our favorite flavors and bring new inspiration
              to your cooking.
            </p>
          </div>

          <Link
            href="/shop"
            className="text-sm font-semibold uppercase tracking-wider text-[#A85D3B] transition hover:text-[#432B20]"
          >
            View all products →
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#756456]">
            New featured products are coming soon.
          </p>
        )}
      </div>
    </section>
  );
}
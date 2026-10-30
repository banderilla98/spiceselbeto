
import { products } from "@/data/products";
import ProductCard from "./ProductCard";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function FeaturedProducts() {
  const featuredProducts = products.filter(
    (product) => product.featured
  );

  return (
    <section
      id="featured-products"
      className="bg-[#FAF8F3] py-24 px-6"
    >
      <div className="max-w-7xl mx-auto">

        {/* Section heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-xs tracking-[0.25em] text-[#A85D3B] mb-4">
              OUR COLLECTION
            </p>

            <h2 className="text-3xl md:text-5xl font-semibold text-[#432B20]">
              Explore Our Spices
            </h2>

            <p className="mt-4 text-sm text-[#85776B] max-w-lg">
              Discover carefully selected spices that bring
              warmth, aroma, and authentic flavor to your kitchen.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-3 text-xs tracking-widest text-[#A85D3B] hover:text-[#432B20] transition-colors"
          >
            VIEW ALL PRODUCTS
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
}

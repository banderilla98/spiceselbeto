
"use client";

import { useState } from "react";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function ShopCatalog() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    ...Array.from(new Set(products.map((product) => product.category))),
  ];

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (product) => product.category === selectedCategory
        );

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">

      {/* Category filters */}
      <div className="flex flex-wrap gap-3 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-3 text-xs tracking-widest transition-colors ${
              selectedCategory === category
                ? "bg-[#432B20] text-white"
                : "bg-[#EEE7DC] text-[#59483C] hover:bg-[#E3D5C5]"
            }`}
          >
            {category.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Products */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-[#85776B] py-20">
          No products found in this category.
        </p>
      )}

    </section>
  );
}

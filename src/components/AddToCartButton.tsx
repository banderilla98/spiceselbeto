"use client";

import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/components/CartProvider";

export default function AddToCartButton({
  product,
}: {
  product: Product;
}) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    addToCart(product);
    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  }

  return (
    <button
      onClick={handleAddToCart}
      className="mt-8 flex w-full items-center justify-center gap-3 bg-[#A85D3B] px-8 py-4 text-xs tracking-widest text-white transition-colors hover:bg-[#87452B] md:w-auto"
    >
      {added ? <Check size={17} /> : <ShoppingBag size={17} />}
      {added ? "ADDED TO CART" : "ADD TO CART"}
    </button>
  );
}
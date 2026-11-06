"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/components/CartProvider";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart } = useCart();

  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-[#FAF8F3]">
      <Navbar />

      <section className="bg-[#F0E8DC] px-6 py-16 text-center">
        <p className="mb-4 text-xs tracking-[0.3em] text-[#A85D3B]">
          YOUR SELECTION
        </p>

        <h1 className="text-4xl font-semibold text-[#432B20] md:text-5xl">
          Shopping Cart
        </h1>

        <p className="mt-4 text-sm text-[#756456]">
          Review your selected spices before checkout.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        {items.length === 0 ? (
          <div className="py-16 text-center">
            <ShoppingBag
              size={48}
              strokeWidth={1}
              className="mx-auto text-[#A85D3B]"
            />

            <h2 className="mt-6 text-2xl font-semibold text-[#432B20]">
              Your cart is empty
            </h2>

            <p className="mt-3 text-sm text-[#756456]">
              Discover something delicious for your kitchen.
            </p>

            <Link
              href="/shop"
              className="mt-8 inline-block bg-[#A85D3B] px-8 py-4 text-xs tracking-widest text-white transition-colors hover:bg-[#87452B]"
            >
              EXPLORE OUR SPICES
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_350px]">
            {/* Cart products */}
            <div>
              <div className="mb-6 hidden grid-cols-[1fr_120px_100px] border-b border-[#EAE3D8] pb-4 text-xs tracking-widest text-[#85776B] md:grid">
                <span>PRODUCT</span>
                <span className="text-center">QUANTITY</span>
                <span className="text-right">TOTAL</span>
              </div>

              <div className="space-y-8">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="grid grid-cols-1 items-center gap-5 border-b border-[#EAE3D8] pb-8 md:grid-cols-[1fr_120px_100px]"
                  >
                    {/* Product information */}
                    <div className="flex items-center gap-5">
                      <div
                        role="img"
                        aria-label={item.product.name}
                        className="h-28 w-24 shrink-0 rounded-sm bg-[#EEE7DC] bg-cover bg-center"
                        style={{
                          backgroundImage: `url("${item.product.image}")`,
                        }}
                      />

                      <div>
                        <p className="text-[10px] tracking-widest text-[#A85D3B]">
                          {item.product.category.toUpperCase()}
                        </p>

                        <h2 className="mt-2 font-medium text-[#432B20]">
                          {item.product.name}
                        </h2>

                        <p className="mt-1 text-xs text-[#85776B]">
                          {item.product.weight}
                        </p>

                        <p className="mt-2 text-sm text-[#432B20]">
                          ${item.product.price.toFixed(2)}
                        </p>

                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="mt-3 inline-flex items-center gap-2 text-xs text-[#A85D3B] hover:text-[#432B20]"
                        >
                          <Trash2 size={13} />
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-3 md:justify-center">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity - 1
                          )
                        }
                        aria-label={`Decrease ${item.product.name} quantity`}
                        className="border border-[#EAE3D8] p-2 text-[#432B20] hover:bg-[#F0E8DC]"
                      >
                        <Minus size={14} />
                      </button>

                      <span className="min-w-5 text-center text-sm text-[#432B20]">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity + 1
                          )
                        }
                        aria-label={`Increase ${item.product.name} quantity`}
                        disabled={item.quantity >= 99}
                        className="border border-[#EAE3D8] p-2 text-[#432B20] hover:bg-[#F0E8DC] disabled:opacity-40"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Item total */}
                    <p className="text-sm font-semibold text-[#432B20] md:text-right">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <Link
                href="/shop"
                className="mt-8 inline-block text-xs tracking-widest text-[#A85D3B] hover:text-[#432B20]"
              >
                ← CONTINUE SHOPPING
              </Link>
            </div>

            {/* Order summary */}
            <aside className="h-fit rounded-sm bg-[#F0E8DC] p-7">
              <h2 className="text-xl font-semibold text-[#432B20]">
                Order Summary
              </h2>

              <div className="mt-7 flex justify-between border-b border-[#DCCFC0] pb-5 text-sm">
                <span className="text-[#756456]">Subtotal</span>
                <span className="font-medium text-[#432B20]">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between border-b border-[#DCCFC0] py-5 text-sm">
                <span className="text-[#756456]">Shipping</span>
                <span className="text-[#756456]">Calculated later</span>
              </div>

              <div className="flex justify-between pt-6">
                <span className="font-semibold text-[#432B20]">
                  Subtotal
                </span>
                <span className="text-xl font-semibold text-[#432B20]">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <p className="mt-5 text-xs leading-6 text-[#85776B]">
                Shipping or local pickup options, applicable taxes, and
                final order totals will be confirmed during checkout.
              </p>

              <Link
  href="/checkout"
  className="mt-8 block w-full bg-[#A85D3B] px-6 py-4 text-center text-xs tracking-widest text-white transition-colors hover:bg-[#87452B]"
>
  CONTINUE TO CHECKOUT
</Link>
            </aside>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
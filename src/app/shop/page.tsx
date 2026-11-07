import { connection } from "next/server";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShopCatalog from "@/components/ShopCatalog";
import { getProducts } from "@/lib/products";

async function ShopContent() {
  await connection();

  const products = await getProducts();

  return <ShopCatalog products={products} />;
}

export default function ShopPage() {
  return (
    <>
      <Navbar />

      <main>
        <section className="bg-[#F5F0E8] px-6 py-20 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#A85D3B]">
            Explore our collection
          </p>

          <h1 className="font-serif text-4xl text-[#432B20] md:text-6xl">
            Our Spices
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#756456]">
            Discover flavorful spices and carefully selected ingredients
            to bring something special to your kitchen.
          </p>
        </section>

        <Suspense
          fallback={
            <section className="px-6 py-20 text-center">
              Loading our spices...
            </section>
          }
        >
          <ShopContent />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}
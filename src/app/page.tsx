
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";
import { Suspense } from "react";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Suspense
  fallback={
    <section className="px-6 py-20 text-center">
      Loading featured spices...
    </section>
  }
>
  <FeaturedProducts />
</Suspense>
      <Footer />
    </main>
  );
}

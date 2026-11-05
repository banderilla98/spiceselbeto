
import Navbar from "@/components/Navbar";
import ShopCatalog from "@/components/ShopCatalog";
import Footer from "@/components/Footer";

export default function ShopPage() {
  return (
    <main className="bg-[#FAF8F3] min-h-screen">
      <Navbar />

      <section className="bg-[#F0E8DC] py-20 px-6 text-center">
        <p className="text-xs tracking-[0.3em] text-[#A85D3B] mb-5">
          THE SPICES BETO COLLECTION
        </p>

        <h1 className="text-4xl md:text-6xl font-semibold text-[#432B20]">
          Our Spices
        </h1>

        <p className="mt-5 text-sm text-[#756456] max-w-lg mx-auto">
          Explore our selection of spices and discover new
          flavors for your kitchen.
        </p>
      </section>

      <ShopCatalog />

      <Footer />
    </main>
  );
}

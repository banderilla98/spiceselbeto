
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products } from "@/data/products";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const product = products.find(
    (item) => item.slug === slug
  );

  if (!product) {
    notFound();
  }

  return (
    <main className="bg-[#FAF8F3] min-h-screen">
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-12">

        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs tracking-widest text-[#A85D3B] hover:text-[#432B20] mb-10"
        >
          <ArrowLeft size={16} />
          BACK TO SHOP
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Product image */}
          <div
            role="img"
            aria-label={product.name}
            className="aspect-[4/5] bg-[#EEE7DC] bg-cover bg-center rounded-sm"
            style={{
              backgroundImage: `url("${product.image}")`,
            }}
          />

          {/* Product details */}
          <div>
            <p className="text-xs tracking-[0.25em] text-[#A85D3B] mb-5">
              {product.category.toUpperCase()}
            </p>

            <h1 className="text-4xl md:text-5xl font-semibold text-[#432B20]">
              {product.name}
            </h1>

            <p className="text-2xl font-semibold text-[#432B20] mt-7">
              ${product.price.toFixed(2)}
            </p>

            <div className="border-y border-[#EAE3D8] py-6 mt-8 space-y-4">

              <div className="flex justify-between text-sm">
                <span className="text-[#85776B]">Weight</span>
                <span className="text-[#432B20] font-medium">
                  {product.weight}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-[#85776B]">Category</span>
                <span className="text-[#432B20] font-medium">
                  {product.category}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-[#5E7952]">
                <CheckCircle2 size={17} />
                Product information available
              </div>
            </div>

            <h2 className="text-lg font-medium text-[#432B20] mt-8 mb-3">
              Product Description
            </h2>

            <p className="text-sm leading-relaxed text-[#756456]">
              {product.description}
            </p>

            <p className="text-xs leading-relaxed text-[#85776B] mt-8">
              Shipping and local pickup options will be available
              during checkout.
            </p>

            <div className="flex flex-wrap items-center gap-4">
  <AddToCartButton product={product} />

  <Link
    href="/shop"
    className="mt-8 inline-block border border-[#A85D3B] px-8 py-4 text-xs tracking-widest text-[#A85D3B] transition-colors hover:bg-[#A85D3B] hover:text-white"
  >
    CONTINUE SHOPPING
  </Link>
</div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}

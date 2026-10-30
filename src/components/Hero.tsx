
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[650px] md:min-h-[740px] flex items-center overflow-hidden bg-[#432B20]">

      {/* Background photography */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        role="img"
        aria-label="An assortment of colorful aromatic spices"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=2200&q=90")',
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#21150F]/85 via-[#21150F]/55 to-[#21150F]/15" />

      {/* Hero content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 py-24">

        <div className="max-w-2xl">

          <p className="text-[#E6B58C] text-xs tracking-[0.35em] mb-8">
            AUTHENTIC FLAVORS · QUALITY SPICES
          </p>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold leading-[1.08] tracking-tight text-[#FAF8F3]">
            Bring Your
            <br />
            Kitchen to
            <br />
            <span className="text-[#E6B58C] italic">
              Life.
            </span>
          </h1>

          <p className="mt-8 text-base md:text-lg leading-relaxed text-[#F0E8DE] max-w-md">
            Discover the richness of authentic spices.
            Carefully selected flavors to make every meal
            a little more special.
          </p>

          <div className="flex flex-wrap items-center gap-5 mt-10">

            <Link
              href="#featured-products"
              className="inline-flex items-center gap-3 bg-[#A85D3B] hover:bg-[#87452B] text-white px-7 py-4 text-xs tracking-widest transition-colors"
            >
              EXPLORE OUR COLLECTION
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/about"
              className="text-white text-xs tracking-widest border-b border-white/50 pb-2 hover:border-white transition-colors"
            >
              OUR STORY
            </Link>

          </div>
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <div className="absolute bottom-8 right-8 hidden md:flex items-center gap-3 text-white/70">
        <span className="text-[9px] tracking-[0.2em]">
          DISCOVER MORE
        </span>
        <ArrowDown size={15} />
      </div>

    </section>
  );
}

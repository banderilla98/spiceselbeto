import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F3]">
      <Navbar />

      {/* Page introduction */}
      <section className="bg-[#F0E8DC] px-6 py-24 text-center">
        <p className="mb-5 text-xs tracking-[0.3em] text-[#A85D3B]">
          OUR STORY
        </p>

        <h1 className="text-4xl font-semibold text-[#432B20] md:text-6xl">
          A Love for Flavor
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-[#756456] md:text-base">
          Welcome to SPICES BETO, where we believe that great food starts
          with great flavor.
        </p>
      </section>

      {/* Our story */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 md:grid-cols-2 md:gap-20">
        <div
          role="img"
          aria-label="A selection of colorful spices"
          className="aspect-[4/5] rounded-sm bg-[#EEE7DC] bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=85")',
          }}
        />

        <div>
          <p className="mb-5 text-xs tracking-[0.25em] text-[#A85D3B]">
            WHO WE ARE
          </p>

          <h2 className="text-3xl font-semibold leading-tight text-[#432B20] md:text-4xl">
            Bringing flavor into every kitchen.
          </h2>

          <div className="mt-7 space-y-5 text-sm leading-7 text-[#756456]">
            <p>
              SPICES BETO is a family-inspired business built around a simple
              idea: food brings people together, and the right flavors can
              make every meal more special.
            </p>

            <p>
              We want to make discovering and enjoying spices simple.
              Whether you are preparing a favorite family recipe or trying
              something new, we are here to help bring more flavor to your
              kitchen.
            </p>

            <p>
              Thank you for supporting our small business and being part of
              the SPICES BETO journey.
            </p>
          </div>

          <Link
            href="/shop"
            className="mt-9 inline-block bg-[#A85D3B] px-8 py-4 text-xs tracking-widest text-white transition-colors hover:bg-[#87452B]"
          >
            EXPLORE OUR SPICES
          </Link>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#F0E8DC] px-6 py-20">
        <div className="mx-auto max-w-7xl text-center">
          <p className="mb-4 text-xs tracking-[0.25em] text-[#A85D3B]">
            THE SPICES BETO EXPERIENCE
          </p>

          <h2 className="text-3xl font-semibold text-[#432B20] md:text-4xl">
            Simple, flavorful, personal.
          </h2>

          <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3">
            <div>
              <h3 className="text-lg font-medium text-[#432B20]">
                Made for Cooking
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#756456]">
                Discover spices to inspire everyday meals and special
                occasions.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-[#432B20]">
                Personal Service
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#756456]">
                We are here to help with questions about products and orders.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-[#432B20]">
                Convenient Options
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#756456]">
                Choose shipping or local pickup when placing an order.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
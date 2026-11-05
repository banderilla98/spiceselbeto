import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MapPin, MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F3]">
      <Navbar />

      {/* Page introduction */}
      <section className="bg-[#F0E8DC] px-6 py-24 text-center">
        <p className="mb-5 text-xs tracking-[0.3em] text-[#A85D3B]">
          GET IN TOUCH
        </p>

        <h1 className="text-4xl font-semibold text-[#432B20] md:text-6xl">
          We Love to Hear From You
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-[#756456] md:text-base">
          Have a question about our spices, an order, shipping, or local
          pickup? We&apos;d be happy to hear from you.
        </p>
      </section>

      {/* Contact information */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <p className="mb-5 text-xs tracking-[0.25em] text-[#A85D3B]">
              CONTACT SPICES BETO
            </p>

            <h2 className="text-3xl font-semibold leading-tight text-[#432B20] md:text-4xl">
              How can we help?
            </h2>

            <p className="mt-6 text-sm leading-7 text-[#756456]">
              Whether you are looking for product information, need help with
              an order, or want to learn more about local pickup, please
              reach out.
            </p>

            <div className="mt-10 space-y-8">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-[#F0E8DC] p-3 text-[#A85D3B]">
                  <Mail size={20} />
                </div>

                <div>
                  <h3 className="font-medium text-[#432B20]">Email</h3>
                  <a
                    href="mailto:YOUR_EMAIL_HERE"
                    className="mt-1 text-sm text-[#A85D3B] hover:text-[#432B20]"
                  >
                    Add your business email here
                  </a>
                  <p className="mt-1 text-xs text-[#85776B]">
                    For product and order questions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-full bg-[#F0E8DC] p-3 text-[#A85D3B]">
                  <MapPin size={20} />
                </div>

                <div>
                  <h3 className="font-medium text-[#432B20]">
                    Local Pickup
                  </h3>
                  <p className="mt-1 text-sm text-[#756456]">
                    Local pickup options will be available for eligible
                    orders.
                  </p>
                  <p className="mt-1 text-xs text-[#85776B]">
                    Pickup details will be provided when ordering.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-full bg-[#F0E8DC] p-3 text-[#A85D3B]">
                  <MessageCircle size={20} />
                </div>

                <div>
                  <h3 className="font-medium text-[#432B20]">
                    Order Assistance
                  </h3>
                  <p className="mt-1 text-sm text-[#756456]">
                    Contact us if you need help choosing products or
                    understanding your order.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact call to action */}
          <div className="flex flex-col justify-center rounded-sm bg-[#F0E8DC] p-8 md:p-12">
            <p className="mb-4 text-xs tracking-[0.25em] text-[#A85D3B]">
              READY TO EXPLORE?
            </p>

            <h2 className="text-3xl font-semibold leading-tight text-[#432B20]">
              Find your next favorite flavor.
            </h2>

            <p className="mt-5 text-sm leading-7 text-[#756456]">
              Browse our collection and discover spices to bring something
              special to your kitchen.
            </p>

            <Link
              href="/shop"
              className="mt-8 inline-block self-start bg-[#A85D3B] px-8 py-4 text-xs tracking-widest text-white transition-colors hover:bg-[#87452B]"
            >
              SHOP OUR COLLECTION
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
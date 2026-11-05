import Link from "next/link";
import { Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#432B20] text-[#FAF8F3]">
      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Brand */}
          <div>
            <Link href="/" className="inline-block">
              <h2 className="text-2xl font-bold tracking-[0.15em]">
                SPICES BETO
              </h2>
            </Link>

            <p className="text-xs tracking-[0.2em] text-[#D6AD8B] mt-2">
              AUTHENTIC FLAVORS
            </p>

            <p className="text-sm text-[#D8C9BC] leading-relaxed mt-6 max-w-xs">
              Discover quality spices and bring authentic
              flavors into your kitchen.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs tracking-[0.2em] mb-6">
              EXPLORE
            </h3>

            <div className="flex flex-col gap-4 text-sm text-[#D8C9BC]">
              <Link href="/" className="hover:text-white">Home</Link>
              <Link href="/shop" className="hover:text-white">Shop</Link>
              <Link href="/about" className="hover:text-white">About Us</Link>
              <Link href="/contact" className="hover:text-white">Contact</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs tracking-[0.2em] mb-6">
              GET IN TOUCH
            </h3>

            <div className="flex flex-col gap-5 text-sm text-[#D8C9BC]">
              <div className="flex items-center gap-3">
                <Mail size={17} />
                <span>Contact information coming soon</span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin size={17} />
                <span>Local pickup available</span>
              </div>
            </div>

            <div className="flex gap-5 mt-7">
              <a href="https://www.instagram.com/" target="_blank"
                rel="noopener noreferrer" aria-label="Instagram"
                className="hover:text-[#D6AD8B]">
                <span className="text-sm font-semibold">IG</span>
              </a>

              <a href="https://www.facebook.com/" target="_blank"
                rel="noopener noreferrer" aria-label="Facebook"
                className="hover:text-[#D6AD8B]">
                <span className="text-sm font-bold">f</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/15 mt-14 pt-7 flex flex-col md:flex-row justify-between gap-4 text-xs text-[#BFAFA2]">
          <p>© 2026 SPICES BETO. All rights reserved.</p>
          <p>Made with care for spice lovers.</p>
        </div>

      </div>
    </footer>
  );
}

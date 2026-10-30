
"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { name: "HOME", href: "/" },
    { name: "SHOP", href: "/shop" },
    { name: "ABOUT", href: "/about" },
    { name: "CONTACT", href: "/contact" },
  ];

  return (
    <header className="w-full bg-[#FAF8F3] border-b border-[#EAE3D8]">
      <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

        {/* Brand */}
        <Link href="/" className="flex flex-col">
          <span className="text-2xl font-bold tracking-[0.15em] text-[#432B20]">
            SPICES BETO
          </span>
          <span className="text-[9px] tracking-[0.25em] text-[#A85D3B]">
            AUTHENTIC FLAVORS
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-xs font-medium tracking-widest text-[#59483C] hover:text-[#A85D3B] transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Cart and mobile menu */}
        <div className="flex items-center gap-5">
          <Link
            href="/cart"
            aria-label="Shopping cart"
            className="text-[#432B20] hover:text-[#A85D3B] transition-colors"
          >
            <ShoppingBag size={21} strokeWidth={1.6} />
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="md:hidden text-[#432B20]"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile navigation */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#EAE3D8] px-6 py-5 flex flex-col gap-5">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm tracking-widest text-[#59483C] hover:text-[#A85D3B]"
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

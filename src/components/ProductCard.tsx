
import type { Product } from "@/data/products";
import { ArrowUpRight } from "lucide-react";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group">
      {/* Product image */}
      <div
        role="img"
        aria-label={product.name}
        className="relative aspect-[4/5] overflow-hidden bg-[#EEE7DC] rounded-sm"
        style={{
          backgroundImage: `url("${product.image}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {product.featured && (
          <span className="absolute top-4 left-4 bg-[#FAF8F3] px-3 py-2 text-[9px] tracking-widest text-[#432B20]">
            BESTSELLER
          </span>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
      </div>

      {/* Product information */}
      <div className="pt-4 space-y-2">
        <p className="text-[10px] tracking-[0.18em] text-[#A85D3B] uppercase">
          {product.category}
        </p>

        <div className="flex justify-between items-start gap-3">
          <div>
            <h3 className="text-lg font-medium text-[#432B20]">
              {product.name}
            </h3>

            <p className="text-xs text-[#85776B] mt-1">
              {product.weight}
            </p>
          </div>

          <ArrowUpRight
            size={18}
            className="text-[#A85D3B] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
          />
        </div>

        <p className="text-sm text-[#756456] leading-relaxed">
          {product.description}
        </p>

        <p className="text-base font-semibold text-[#432B20] pt-1">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </article>
  );
}

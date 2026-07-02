import { Product } from "../types";
import { Sparkles, Star, ShoppingCart, Plus, Check, Award, Shirt, Dumbbell, ShieldCheck } from "lucide-react";

interface AestheticVaultProps {
  products: Product[];
  activeIds: string[];
  onToggleAccelerator: (product: Product) => void;
  onSimulatePurchase: (product: Product) => void;
}

export default function AestheticVault({
  products,
  activeIds,
  onToggleAccelerator,
  onSimulatePurchase,
}: AestheticVaultProps) {
  return (
    <div className="rounded-lg border border-[#2C2C2E] bg-[#121212] p-6 shadow-2xl">
      <div className="mb-6 flex items-center justify-between border-b border-[#2C2C2E] pb-4">
        <div className="flex items-center gap-2.5">
          <Award className="h-4 w-4 text-[#D4AF37]" />
          <h2 className="font-sans text-sm font-bold tracking-widest text-white uppercase">
            Aesthetic Inventory &amp; Gear
          </h2>
        </div>
        <span className="font-mono text-[10px] text-[#D4AF37] tracking-widest uppercase bg-[#D4AF37]/10 px-2 py-0.5 rounded">
          Approved Catalogs Only
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const isActive = activeIds.includes(product.id);
          return (
            <div
              key={product.id}
              className={`group flex flex-col justify-between rounded-lg border bg-[#0A0A0A] p-5 transition-all duration-300 ${
                isActive ? "border-[#D4AF37] ring-1 ring-[#D4AF37]/20" : "border-[#2C2C2E] hover:border-[#8E8E93]/40"
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[9px] font-bold text-[#D4AF37] tracking-widest uppercase bg-[#D4AF37]/10 px-2 py-0.5 rounded">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1 font-mono text-[10px] text-[#D4AF37]">
                    <Star className="h-3 w-3 fill-current" />
                    <span>{product.rating}</span>
                  </div>
                </div>

                <h3 className="mt-2.5 font-sans text-sm font-bold text-white transition-colors group-hover:text-[#D4AF37]">
                  {product.name}
                </h3>
                <p className="mt-1.5 font-sans text-xs leading-relaxed text-[#8E8E93]">
                  {product.description}
                </p>

                {/* Benefits list */}
                <ul className="mt-3.5 space-y-1">
                  {product.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-[10px] text-[#8E8E93]">
                      <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#D4AF37]" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 pt-4 border-t border-[#2C2C2E]/60">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-sm font-bold text-white">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="font-mono text-[9px] text-[#8E8E93] uppercase tracking-wider">
                    In Stock
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onToggleAccelerator(product)}
                    className={`flex items-center justify-center gap-1 rounded py-2 text-[10px] font-bold uppercase tracking-wider transition ${
                      isActive
                        ? "bg-[#D4AF37] text-black"
                        : "border border-[#2C2C2E] bg-transparent text-[#8E8E93] hover:border-[#D4AF37] hover:text-[#D4AF37]"
                    }`}
                  >
                    {isActive ? (
                      <>
                        <Check className="h-3 w-3" />
                        <span>Stacked</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-3 w-3" />
                        <span>Stack Bio</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onSimulatePurchase(product)}
                    className="flex items-center justify-center gap-1 rounded border border-[#D4AF37]/40 bg-[#D4AF37]/5 py-2 text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] transition hover:bg-[#D4AF37]/10"
                  >
                    <ShoppingCart className="h-3 w-3" />
                    <span>Acquire</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

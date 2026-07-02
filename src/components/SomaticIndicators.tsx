import { CalculatedStats, Product } from "../types";
import { Activity, Flame, GlassWater, BarChart3, Star, Sparkles, AlertCircle } from "lucide-react";

interface SomaticIndicatorsProps {
  stats: CalculatedStats | null;
  activeAccelerators: Product[];
  onRemoveAccelerator: (productId: string) => void;
}

export default function SomaticIndicators({ stats, activeAccelerators, onRemoveAccelerator }: SomaticIndicatorsProps) {
  if (!stats) {
    return (
      <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-[#2C2C2E] bg-[#121212]/30 p-8 text-center">
        <AlertCircle className="mb-4 h-10 w-10 text-[#8E8E93]" />
        <h3 className="font-sans text-sm font-bold tracking-widest text-white uppercase">
          Biometrics Uninitialized
        </h3>
        <p className="mt-2 max-w-xs text-xs text-[#8E8E93]">
          Please calibrate your clinical metrics in the Somatic Diagnostics panel to initialize your macro metrics and muscle hypertrophy targets.
        </p>
      </div>
    );
  }

  // Calculate dynamic values incorporating active supplements
  const hasWhey = activeAccelerators.some((p) => p.id === "whey-isolate");
  const hasCreatine = activeAccelerators.some((p) => p.id === "creatine");
  const hasStack = activeAccelerators.some((p) => p.id === "essential-stack");

  // If whey isolate is active, add 26g of protein to targets!
  const baseProtein = stats.macros.protein.grams;
  const extraProtein = hasWhey ? 26 : 0;
  const totalProtein = baseProtein + extraProtein;

  // If creatine is active, increase hydration target by 0.5 Liters
  const baseHydration = stats.hydrationLiters;
  const extraHydration = hasCreatine ? 0.5 : 0;
  const totalHydration = baseHydration + extraHydration;

  // Compute percentage ratios of macros based on calories
  const proteinKcal = totalProtein * 4;
  const carbsKcal = stats.macros.carbs.calories;
  const fatKcal = stats.macros.fat.calories;
  const totalCalWithWhey = stats.targetCalories + (extraProtein * 4);

  const proteinPct = Math.round((proteinKcal / totalCalWithWhey) * 100);
  const carbsPct = Math.round((carbsKcal / totalCalWithWhey) * 100);
  const fatPct = Math.round((fatKcal / totalCalWithWhey) * 100);

  return (
    <div className="space-y-6">
      {/* Primary Biometrics Header */}
      <div className="rounded-lg border border-[#2C2C2E] bg-[#121212] p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between border-b border-[#2C2C2E] pb-4">
          <div className="flex items-center gap-2.5">
            <Activity className="h-4 w-4 text-[#D4AF37]" />
            <h2 className="font-sans text-sm font-bold tracking-widest text-white uppercase">
              Physique Architecture
            </h2>
          </div>
          <div className="rounded bg-[#D4AF37]/10 px-2 py-0.5">
            <span className="font-mono text-[9px] font-bold text-[#D4AF37] uppercase tracking-widest">
              Live Diagnostics
            </span>
          </div>
        </div>

        {/* Primary 2x2 Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded border border-[#2C2C2E] bg-[#0A0A0A] p-4 text-center">
            <span className="font-sans text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider">
              Caloric Ceiling
            </span>
            <div className="mt-1 flex items-center justify-center gap-1.5">
              <Flame className="h-4 w-4 text-[#D4AF37]" />
              <span className="font-mono text-xl font-bold text-white">
                {totalCalWithWhey}
              </span>
            </div>
            <span className="mt-0.5 block font-sans text-[9px] text-[#8E8E93] uppercase tracking-tight">
              kcal / day {hasWhey && <span className="text-[#D4AF37] font-semibold">(+104 whey)</span>}
            </span>
          </div>

          <div className="rounded border border-[#2C2C2E] bg-[#0A0A0A] p-4 text-center">
            <span className="font-sans text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider">
              Anatomical Index (BMI)
            </span>
            <div className="mt-1.5 font-mono text-xl font-bold text-white">
              {stats.bmi}
            </div>
            <span className="mt-0.5 block font-sans text-[9px] text-[#8E8E93] uppercase tracking-tight">
              {stats.bmi < 18.5 ? "Underweight Range" : stats.bmi < 25 ? "Optimal Symmetry" : stats.bmi < 30 ? "Hypertrophic Range" : "Metabolic Caution"}
            </span>
          </div>

          <div className="rounded border border-[#2C2C2E] bg-[#0A0A0A] p-4 text-center">
            <span className="font-sans text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider">
              Metabolic Base (BMR)
            </span>
            <div className="mt-1.5 font-mono text-lg font-bold text-white">
              {stats.bmr} <span className="text-xs text-[#8E8E93]">kcal</span>
            </div>
            <span className="mt-0.5 block font-sans text-[9px] text-[#8E8E93] uppercase tracking-tight">
              Basal Rest rate
            </span>
          </div>

          <div className="rounded border border-[#2C2C2E] bg-[#0A0A0A] p-4 text-center">
            <span className="font-sans text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider">
              Total Expenditure (TDEE)
            </span>
            <div className="mt-1.5 font-mono text-lg font-bold text-white">
              {stats.tdee} <span className="text-xs text-[#8E8E93]">kcal</span>
            </div>
            <span className="mt-0.5 block font-sans text-[9px] text-[#8E8E93] uppercase tracking-tight">
              Including physical activity
            </span>
          </div>
        </div>

        {/* Hydration Target */}
        <div className="mt-4 flex items-center justify-between rounded border border-[#2C2C2E] bg-[#0A0A0A] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-[#D4AF37]/10">
              <GlassWater className="h-4 w-4 text-[#D4AF37]" />
            </div>
            <div>
              <span className="block font-sans text-[10px] font-bold text-white uppercase tracking-wider">
                Somatic Hydration Target
              </span>
              <span className="text-[10px] text-[#8E8E93]">
                Critical for myofibrillar fullness and muscle pump
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-lg font-bold text-white">
              {totalHydration} <span className="text-xs text-[#8E8E93]">Liters</span>
            </div>
            {hasCreatine && (
              <span className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-widest">
                +0.5L creatine active
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Macronutrient Ratios */}
      <div className="rounded-lg border border-[#2C2C2E] bg-[#121212] p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BarChart3 className="h-4 w-4 text-[#D4AF37]" />
            <h2 className="font-sans text-sm font-bold tracking-widest text-white uppercase">
              Macronutrient Architecture
            </h2>
          </div>
          <span className="font-mono text-[10px] font-bold text-[#8E8E93]">
            HIGH-PROTEIN BIAS
          </span>
        </div>

        <div className="space-y-4">
          {/* Protein */}
          <div>
            <div className="mb-1.5 flex justify-between text-xs">
              <span className="font-sans font-bold text-white uppercase tracking-wider">
                Protein <span className="text-[#D4AF37] font-mono text-[11px] font-medium">({proteinPct}%)</span>
              </span>
              <span className="font-mono text-white">
                {totalProtein}g <span className="text-[#8E8E93]">/ {proteinKcal} kcal</span>
              </span>
            </div>
            <div className="h-2 w-full rounded bg-[#0A0A0A] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#FFF] transition-all duration-500"
                style={{ width: `${Math.min(proteinPct * 2, 100)}%` }}
              />
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-[9px] text-[#8E8E93] uppercase tracking-wide">
                Optimal muscle protein synthesis threshold
              </span>
              {hasWhey && (
                <span className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-wider">
                  +26g isolate stacked
                </span>
              )}
            </div>
          </div>

          {/* Carbohydrates */}
          <div>
            <div className="mb-1.5 flex justify-between text-xs">
              <span className="font-sans font-bold text-white uppercase tracking-wider">
                Carbohydrates <span className="text-[#8E8E93] font-mono text-[11px]">({carbsPct}%)</span>
              </span>
              <span className="font-mono text-white">
                {stats.macros.carbs.grams}g <span className="text-[#8E8E93]">/ {carbsKcal} kcal</span>
              </span>
            </div>
            <div className="h-2 w-full rounded bg-[#0A0A0A] overflow-hidden">
              <div
                className="h-full bg-[#8E8E93] transition-all duration-500"
                style={{ width: `${Math.min(carbsPct * 2, 100)}%` }}
              />
            </div>
            <span className="mt-1 block text-[9px] text-[#8E8E93] uppercase tracking-wide">
              Muscle glycogen replenishment architecture
            </span>
          </div>

          {/* Fats */}
          <div>
            <div className="mb-1.5 flex justify-between text-xs">
              <span className="font-sans font-bold text-white uppercase tracking-wider">
                Essential Lipids <span className="text-[#8E8E93] font-mono text-[11px]">({fatPct}%)</span>
              </span>
              <span className="font-mono text-white">
                {stats.macros.fat.grams}g <span className="text-[#8E8E93]">/ {fatKcal} kcal</span>
              </span>
            </div>
            <div className="h-2 w-full rounded bg-[#0A0A0A] overflow-hidden">
              <div
                className="h-full bg-[#2C2C2E] transition-all duration-500"
                style={{ width: `${Math.min(fatPct * 2, 100)}%` }}
              />
            </div>
            <span className="mt-1 block text-[9px] text-[#8E8E93] uppercase tracking-wide">
              Androgenic stabilization &amp; joint cellular recovery
            </span>
          </div>
        </div>
      </div>

      {/* Stacked Performance Accelerators */}
      {activeAccelerators.length > 0 && (
        <div className="rounded-lg border border-[#D4AF37]/30 bg-[#121212] p-5 shadow-xl">
          <div className="mb-3.5 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#D4AF37] animate-pulse" />
            <h3 className="font-sans text-xs font-bold tracking-widest text-white uppercase">
              Active Accelerators Stacked ({activeAccelerators.length})
            </h3>
          </div>
          <div className="space-y-2.5">
            {activeAccelerators.map((acc) => (
              <div
                key={acc.id}
                className="flex items-center justify-between rounded border border-[#2C2C2E] bg-[#0A0A0A] p-2.5"
              >
                <div>
                  <span className="block text-xs font-bold text-white">{acc.name}</span>
                  <span className="text-[10px] font-medium text-[#D4AF37] uppercase tracking-wider">
                    {acc.id === "whey-isolate" && "Protein Booster (+26g Premium Isolate)"}
                    {acc.id === "creatine" && "Hydration & Muscle Fullness Maximizer (+0.5L Water)"}
                    {acc.id === "essential-stack" && "Micronutrient Satiety Saturated"}
                    {acc.id === "pump-cover" && "Emphasized Shoulders & V-Taper Frame"}
                    {acc.id === "wrist-wraps" && "Pressed Mechanics Stabilized (+5-10% Compound Load)"}
                    {acc.id === "lifting-straps" && "Pulling Leverage Saturated (Grip Gap Solved)"}
                  </span>
                </div>
                <button
                  onClick={() => onRemoveAccelerator(acc.id)}
                  className="rounded px-2.5 py-1 font-mono text-[9px] font-bold text-[#8E8E93] uppercase tracking-wider hover:bg-red-500/10 hover:text-red-400 transition"
                >
                  Dismount
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

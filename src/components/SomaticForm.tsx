import React from "react";
import { UserProfile } from "../types";
import { User, Scale, ArrowRight, Compass, Dumbbell, Award, Flame } from "lucide-react";

interface SomaticFormProps {
  profile: UserProfile;
  onChange: (profile: UserProfile) => void;
  onSubmit: () => void;
  loading: boolean;
}

export default function SomaticForm({ profile, onChange, onSubmit, loading }: SomaticFormProps) {
  const handleSelect = (key: keyof UserProfile, value: string) => {
    onChange({
      ...profile,
      [key]: value,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({
      ...profile,
      [name]: value,
    });
  };

  return (
    <div className="rounded-lg border border-[#2C2C2E] bg-[#121212] p-6 shadow-2xl">
      <div className="mb-5 flex items-center gap-2.5">
        <User className="h-4 w-4 text-[#D4AF37]" />
        <h2 className="font-sans text-sm font-bold tracking-widest text-white uppercase">
          Somatic Diagnostics
        </h2>
      </div>

      <div className="space-y-5">
        {/* Row 1: Age & Sex */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block font-sans text-[10px] font-bold tracking-wider text-[#8E8E93] uppercase">
              Age (Years)
            </label>
            <div className="relative">
              <input
                type="number"
                name="age"
                value={profile.age}
                onChange={handleInputChange}
                min="16"
                max="100"
                className="w-full rounded border border-[#2C2C2E] bg-[#0A0A0A] py-2.5 pl-3 pr-8 font-mono text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                placeholder="24"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block font-sans text-[10px] font-bold tracking-wider text-[#8E8E93] uppercase">
              Biological Sex
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(["Male", "Female"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSelect("sex", s)}
                  className={`rounded border py-2 text-center text-xs font-semibold uppercase tracking-wider transition ${
                    profile.sex === s
                      ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]"
                      : "border-[#2C2C2E] bg-[#0A0A0A] text-[#8E8E93] hover:border-[#8E8E93]/40"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Height & Weight */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block font-sans text-[10px] font-bold tracking-wider text-[#8E8E93] uppercase">
              Height (cm)
            </label>
            <div className="relative">
              <input
                type="number"
                name="heightCm"
                value={profile.heightCm}
                onChange={handleInputChange}
                min="100"
                max="250"
                className="w-full rounded border border-[#2C2C2E] bg-[#0A0A0A] py-2.5 px-3 font-mono text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                placeholder="178"
              />
              <span className="absolute right-3 top-3 font-mono text-[10px] text-[#8E8E93]">cm</span>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block font-sans text-[10px] font-bold tracking-wider text-[#8E8E93] uppercase">
              Body Weight (kg)
            </label>
            <div className="relative">
              <input
                type="number"
                name="weightKg"
                value={profile.weightKg}
                onChange={handleInputChange}
                min="30"
                max="250"
                className="w-full rounded border border-[#2C2C2E] bg-[#0A0A0A] py-2.5 px-3 font-mono text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                placeholder="75"
              />
              <Scale className="absolute right-3 top-3.5 h-3.5 w-3.5 text-[#8E8E93]" />
            </div>
          </div>
        </div>

        {/* Objective Selector */}
        <div>
          <label className="mb-1.5 block font-sans text-[10px] font-bold tracking-wider text-[#8E8E93] uppercase">
            Primary Fitness Objective
          </label>
          <div className="space-y-2">
            {[
              { id: "Lean Muscle Hypertrophy", label: "Lean Muscle Hypertrophy", desc: "Scientific mass sculpting focusing on classic aesthetic symmetry" },
              { id: "Targeted Fat Loss", label: "Targeted Fat Loss", desc: "Accelerated cellular lipid reduction with strict preservation of lean tissues" },
              { id: "Body Recomposition", label: "Body Recomposition", desc: "Simultaneous skeletal muscle building and metabolic adipose burn" }
            ].map((obj) => (
              <button
                key={obj.id}
                type="button"
                onClick={() => handleSelect("goal", obj.id)}
                className={`flex w-full flex-col rounded border p-3 text-left transition ${
                  profile.goal === obj.id
                    ? "border-[#D4AF37] bg-[#D4AF37]/5 text-white"
                    : "border-[#2C2C2E] bg-[#0A0A0A] text-[#8E8E93] hover:border-[#8E8E93]/30"
                }`}
              >
                <span className={`text-xs font-bold tracking-wide ${profile.goal === obj.id ? "text-[#D4AF37]" : "text-white"}`}>
                  {obj.label}
                </span>
                <span className="mt-0.5 text-[10px] text-[#8E8E93]">{obj.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dietary Constraints */}
        <div>
          <label className="mb-1.5 block font-sans text-[10px] font-bold tracking-wider text-[#8E8E93] uppercase">
            Dietary Regimen
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "Vegetarian", label: "Vegetarian" },
              { id: "Vegan", label: "Vegan" },
              { id: "Eggitarian", label: "Eggitarian" },
              { id: "Non-Vegetarian", label: "Non-Veg" }
            ].map((diet) => (
              <button
                key={diet.id}
                type="button"
                onClick={() => handleSelect("dietaryConstraint", diet.id)}
                className={`rounded border py-2.5 text-center text-xs font-semibold tracking-wide transition ${
                  profile.dietaryConstraint === diet.id
                    ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]"
                    : "border-[#2C2C2E] bg-[#0A0A0A] text-[#8E8E93] hover:border-[#8E8E93]/40"
                }`}
              >
                {diet.label}
              </button>
            ))}
          </div>
        </div>

        {/* Experience Level & Activity Multipliers */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block font-sans text-[10px] font-bold tracking-wider text-[#8E8E93] uppercase">
              Experience Level
            </label>
            <select
              value={profile.experienceLevel}
              onChange={(e) => handleSelect("experienceLevel", e.target.value)}
              className="w-full rounded border border-[#2C2C2E] bg-[#0A0A0A] py-2.5 px-2.5 font-sans text-xs text-white focus:border-[#D4AF37] focus:outline-none"
            >
              <option value="Beginner">Beginner (&lt;1 yr)</option>
              <option value="Intermediate">Intermediate (1-3 yrs)</option>
              <option value="Advanced">Advanced (3+ yrs)</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block font-sans text-[10px] font-bold tracking-wider text-[#8E8E93] uppercase">
              Activity Level
            </label>
            <select
              value={profile.activityLevel}
              onChange={(e) => handleSelect("activityLevel", e.target.value)}
              className="w-full rounded border border-[#2C2C2E] bg-[#0A0A0A] py-2.5 px-2.5 font-sans text-xs text-white focus:border-[#D4AF37] focus:outline-none"
            >
              <option value="Sedentary">Sedentary (Desk)</option>
              <option value="Lightly Active">Lightly Active (1-2 days)</option>
              <option value="Moderately Active">Moderately Active (3-4 days)</option>
              <option value="Very Active">Very Active (5-6 days)</option>
              <option value="Extra Active">Extra Active (Elite Ath)</option>
            </select>
          </div>
        </div>

        {/* Submit Consultation Request */}
        <button
          onClick={onSubmit}
          disabled={loading || !profile.age || !profile.heightCm || !profile.weightKg}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded bg-gradient-to-r from-[#D4AF37] to-[#AA8000] py-3.5 text-center text-xs font-bold uppercase tracking-widest text-[#0A0A0A] shadow-lg shadow-[#D4AF37]/10 transition hover:scale-[1.01] hover:shadow-[#D4AF37]/25 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#0A0A0A] border-t-transparent" />
              <span>Analyzing Clinical Data...</span>
            </div>
          ) : (
            <>
              <span>Generate Customized Roadmap</span>
              <ArrowRight className="h-4 w-4 text-[#0A0A0A]" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

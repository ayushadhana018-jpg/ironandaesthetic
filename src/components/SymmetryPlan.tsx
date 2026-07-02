import { UserProfile } from "../types";
import { Award, Compass, Sparkles, Zap, ShieldCheck } from "lucide-react";

interface SymmetryPlanProps {
  profile: UserProfile;
}

export default function SymmetryPlan({ profile }: SymmetryPlanProps) {
  // Dynamically tailor the workout plan depending on the selected objective and experience
  const isLoss = profile.goal === "Targeted Fat Loss";
  const isRecomp = profile.goal === "Body Recomposition";
  
  // Custom training splits
  let splitName = "Push-Pull-Legs (Elite Symmetry Split)";
  let targetArea = "Primary Focus: Upper Chest Density, Clavicular Width & Lats Width";
  let routine = [
    {
      num: "01",
      exercise: "Incline DB Bench Press (Symmetry Load)",
      setsReps: isLoss ? "3 Sets x 8-10 Reps" : "4 Sets x 6-8 Reps",
      metrics: "RPE 9 | 120s Rest | Focus: Clavicular Pec Fiber Activation",
    },
    {
      num: "02",
      exercise: "Seated Cable Lateral Raise (Constant Tension)",
      setsReps: "3 Sets x 12-15 Reps",
      metrics: "RPE 9.5 | 90s Rest | Focus: Lateral Deltoid Width",
    },
    {
      num: "03",
      exercise: "Pronated Lat Pull Downs (Lats Extension)",
      setsReps: "4 Sets x 10-12 Reps",
      metrics: "RPE 8.5 | 100s Rest | Focus: V-Taper Lat Expansion",
    },
    {
      num: "04",
      exercise: "Rear Delt Dumbbell Flyes (Pec Dec or Incline Bench)",
      setsReps: "3 Sets x 15 Reps",
      metrics: "RPE 10 | 60s Rest | Focus: Posterior Deltoid Density",
    },
  ];

  if (isLoss) {
    splitName = "Upper-Lower Hypertrophic Recomposition Split";
    targetArea = "Primary Focus: Metabolic Density & Localized Fiber Activation";
    routine = [
      {
        num: "01",
        exercise: "Barbell Incline Press (High Tension)",
        setsReps: "3 Sets x 8-10 Reps",
        metrics: "RPE 9 | 150s Rest | Heavy Mechanical Load",
      },
      {
        num: "02",
        exercise: "Chest-Supported T-Bar Row (Thick Lat Focus)",
        setsReps: "3 Sets x 10-12 Reps",
        metrics: "RPE 8.5 | 120s Rest | Squeeze Scapula Depressed",
      },
      {
        num: "03",
        exercise: "Dumbbell Lateral Raise (Constant Tension)",
        setsReps: "4 Sets x 15-20 Reps",
        metrics: "RPE 10 | 75s Rest | Complete Drop Sets on Set 4",
      },
      {
        num: "04",
        exercise: "Decline Cable Crunches (Strict Rectus Abdominis)",
        setsReps: "3 Sets x 12-15 Reps",
        metrics: "RPE 9 | 60s Rest | Heavy Midsection Conditioning",
      },
    ];
  } else if (isRecomp) {
    splitName = "Arnold Golden Era Split (High Aesthetic Bias)";
    targetArea = "Primary Focus: Sculpting Broad Shoulders, Narrow Waist Symmetry";
    routine = [
      {
        num: "01",
        exercise: "Overhead Barbell Press (Deltoid Mass Anchor)",
        setsReps: "4 Sets x 6-8 Reps",
        metrics: "RPE 9 | 150s Rest | Controlled Eccentric phase",
      },
      {
        num: "02",
        exercise: "Weighted Wide-Grip Pull Ups",
        setsReps: "3 Sets x Max Reps (RIR 1)",
        metrics: "RPE 9.5 | 120s Rest | Squeeze at Peak Contraction",
      },
      {
        num: "03",
        exercise: "Cable Crossover (Upper Chest Alignment)",
        setsReps: "3 Sets x 12-15 Reps",
        metrics: "RPE 9 | 90s Rest | Cross Wrist Under Sternum",
      },
      {
        num: "04",
        exercise: "Standing Dumbbell Hammer Curls (Brachialis)",
        setsReps: "3 Sets x 10 Reps",
        metrics: "RPE 8.5 | 90s Rest | Thicken Arm Silhouette",
      },
    ];
  }

  return (
    <div className="relative rounded-lg border border-[#2C2C2E] bg-[#121212] p-6 shadow-2xl overflow-hidden">
      {/* Visual background watermarks */}
      <div className="absolute top-4 right-6 pointer-events-none opacity-5">
        <span className="font-mono text-[70px] font-extrabold text-white leading-none">
          PHASE II
        </span>
      </div>

      <div className="mb-6 flex items-center gap-2.5 border-b border-[#2C2C2E] pb-4">
        <Zap className="h-4 w-4 text-[#D4AF37]" />
        <div>
          <h2 className="font-sans text-sm font-bold tracking-widest text-white uppercase">
            Structural Symmetry Plan
          </h2>
          <p className="font-mono text-[10px] text-[#8E8E93] uppercase">
            {splitName}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
          {targetArea}
        </p>
        <p className="mt-1 text-[11px] text-[#8E8E93]">
          Executing high mechanical tension during initial sets, combined with constant tension on accessories to optimize myofibrillar synthesis and the legendary "V-Shape".
        </p>
      </div>

      <div className="space-y-3.5">
        {routine.map((ex) => (
          <div
            key={ex.num}
            className="flex items-center justify-between rounded border border-[#2C2C2E] bg-[#0A0A0A] p-4 transition duration-300 hover:border-[#D4AF37]/50"
          >
            <div className="flex flex-col">
              <span className="font-mono text-[9px] font-extrabold text-[#D4AF37] uppercase tracking-widest">
                Exercise {ex.num}
              </span>
              <span className="mt-0.5 font-sans text-xs font-bold uppercase text-white tracking-wide">
                {ex.exercise}
              </span>
              <span className="mt-1 font-mono text-[9px] text-[#8E8E93]">
                {ex.metrics}
              </span>
            </div>
            <div className="text-right">
              <span className="block font-mono text-[11px] font-bold text-white uppercase tracking-wider">
                {ex.setsReps}
              </span>
              <span className="block font-sans text-[8px] text-[#8E8E93] uppercase tracking-widest mt-0.5">
                Progressive Overload
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Aesthetic advice alert */}
      <div className="mt-5 rounded border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-4 flex items-start gap-3">
        <ShieldCheck className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />
        <div>
          <h4 className="font-sans text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
            Biomechanical Symmetry Directive
          </h4>
          <p className="mt-0.5 text-[10px] text-[#8E8E93] leading-relaxed">
            Ensure you execute clean, controlled eccentric movements (3-second count on descending phases). Record working weights weekly. Prioritize shoulder girdle mobility before lateral raise sequences.
          </p>
        </div>
      </div>
    </div>
  );
}

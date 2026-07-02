import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// Lazy initialize Gemini Client to avoid crashing if API key is not ready
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured in Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// 1. Premium Product Catalog Endpoint
const PRODUCTS_CATALOG = [
  {
    id: "creatine",
    name: "Premium Creatine Monohydrate",
    category: "Supplements",
    price: 35.0,
    rating: 4.9,
    description: "Micro-crystallized, ultra-pure creatine monohydrate engineered for cellular hydration, ATP replenishment, and maximal hypertrophic muscle fullness.",
    benefits: ["Enhances intramuscular cellular hydration", "Boosts maximum power output (RPE 8-10)", "Supports faster ATP synthesis between heavy working sets"],
    imagePrompt: "A minimalist luxury black jar of premium creatine, gold metallic logo, dark concrete background, dramatic side lighting",
    iconName: "Droplet",
  },
  {
    id: "whey-isolate",
    name: "High-Quality Whey Protein Isolate",
    category: "Supplements",
    price: 70.0,
    rating: 4.8,
    description: "Cross-flow micro-filtered whey isolate delivering 26g of pure, fast-absorbing bioavailable protein with near-zero fat and lactose.",
    benefits: ["26g Ultra-Pure Protein per serving", "Rich in Branched-Chain Amino Acids (BCAAs)", "Perfect for convenient post-workout recovery management"],
    imagePrompt: "A sleek matte black tub of whey protein isolate with gold elegant accents, studio lighting, hyper-clean aesthetic",
    iconName: "Activity",
  },
  {
    id: "essential-stack",
    name: "Essential Health Stack",
    category: "Supplements",
    price: 45.0,
    rating: 4.9,
    description: "Premium micronutrient architecture combining bioavailable Magnesium Glycinate, Zinc, Omega-3 Fish Oil, Vitamin D3, and Vitamin B12.",
    benefits: ["Optimizes deep sleep recovery and nervous system function", "Supports optimal androgenic profiles and joint integrity", "Specifically addresses micronutrient gaps in vegetarian diets"],
    imagePrompt: "An elegant glass vitamin bottle with a metallic gold cap, minimalist label, luxury look",
    iconName: "Shield",
  },
  {
    id: "pump-cover",
    name: "Oversized Premium Pump Cover",
    category: "Apparel",
    price: 50.0,
    rating: 4.7,
    description: "Heavyweight 360gsm French Terry cotton designed with a custom aesthetic drop-shoulder silhouette, keeping you warm until your peak pump.",
    benefits: ["Premium heavy drape engineered for a wider upper-body look", "Discreet, high-end embroidered 'Iron & Aesthetic' logo", "Ultra-breathable premium natural fabric"],
    imagePrompt: "A premium thick heavy black drop shoulder t-shirt hanging on a minimalist brass hanger, dark aesthetic studio",
    iconName: "Shirt",
  },
  {
    id: "wrist-wraps",
    name: "Elite Structural Wrist Wraps",
    category: "Gear",
    price: 25.0,
    rating: 4.8,
    description: "Heavy-duty tension-elastomer wrist wraps designed to stabilize the carpal bones during maximal load horizontal and vertical presses.",
    benefits: ["Reinforced thumb loop with industrial-strength velcro strap", "Protects joints on high-RPE heavy chest and shoulder presses", "Provides concrete structural rigidity under maximal loads"],
    imagePrompt: "Heavy-duty black and gold wrist wraps rolled up on a dark metallic steel plate, raw elite aesthetic",
    iconName: "Dumbbell",
  },
  {
    id: "lifting-straps",
    name: "Ergonomic Silicon-Grip Lifting Straps",
    category: "Gear",
    price: 20.0,
    rating: 4.9,
    description: "Coated structural pulling straps engineered with non-slip silicone tactile nodes to entirely eliminate grip strength bottlenecks.",
    benefits: ["Allows complete hypertrophy focus on the Latissimus Dorsi", "Ergonomic neoprene padding around the wrist joint to eliminate bruising", "Tested on heavy mechanical tension pulling movements"],
    imagePrompt: "Minimalist black canvas lifting straps with subtle golden silicone grip stripes, lying next to a barbell",
    iconName: "Anchor",
  },
];

app.get("/api/products", (req, res) => {
  res.json({ products: PRODUCTS_CATALOG });
});

// Helper function to calculate exact scientific metrics
function calculateMetrics(age: number, sex: string, heightCm: number, weightKg: number, activityLevel: string, goal: string) {
  // 1. BMI calculation
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  // 2. BMR calculation (Mifflin-St Jeor)
  let bmr = 0;
  if (sex === "Male") {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }

  // 3. TDEE multiplier
  let activityMultiplier = 1.2;
  switch (activityLevel) {
    case "Sedentary": activityMultiplier = 1.2; break;
    case "Lightly Active": activityMultiplier = 1.375; break;
    case "Moderately Active": activityMultiplier = 1.55; break;
    case "Very Active": activityMultiplier = 1.725; break;
    case "Extra Active": activityMultiplier = 1.9; break;
  }
  const tdee = bmr * activityMultiplier;

  // 4. Goal adjustments
  let targetCalories = tdee;
  if (goal === "Lean Muscle Hypertrophy") {
    targetCalories = tdee + 300; // Controlled lean surplus
  } else if (goal === "Targeted Fat Loss") {
    targetCalories = tdee - 500; // Optimal caloric deficit
  } else {
    targetCalories = tdee - 100; // Body Recomposition
  }

  // 5. High-Protein Dominance: 2.0g per kg of body weight
  const proteinG = weightKg * 2.0;
  const proteinKcal = proteinG * 4;

  // Fat calculation (approx 25% of target calories)
  const fatG = (targetCalories * 0.25) / 9;
  const fatKcal = fatG * 9;

  // Carbs calculation (remaining calories)
  const carbKcal = targetCalories - proteinKcal - fatKcal;
  const carbG = carbKcal / 4;

  return {
    bmi: parseFloat(bmi.toFixed(1)),
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetCalories: Math.round(targetCalories),
    macros: {
      protein: { grams: Math.round(proteinG), calories: Math.round(proteinKcal) },
      carbs: { grams: Math.round(carbG), calories: Math.round(carbKcal) },
      fat: { grams: Math.round(fatG), calories: Math.round(fatKcal) },
    },
    hydrationLiters: parseFloat((weightKg * 0.035).toFixed(1)),
  };
}

// 2. Interactive Consultation Endpoint
app.post("/api/consultation", async (req, res) => {
  try {
    const {
      age,
      sex,
      heightCm,
      weightKg,
      goal,
      activityLevel,
      dietaryConstraint,
      experienceLevel,
      chatHistory = [],
      message = ""
    } = req.body;

    if (!age || !sex || !heightCm || !weightKg || !goal || !activityLevel || !dietaryConstraint) {
      return res.status(400).json({ error: "Missing required anthropometric or clinical metrics." });
    }

    // Compute scientific indices
    const stats = calculateMetrics(Number(age), sex, Number(heightCm), Number(weightKg), activityLevel, goal);

    // Formulate a structured input for the Gemini Model
    const systemInstruction = `
You are the Elite AI Personal Coach and Lead Fitness Specialist for "Iron & Aesthetic" - a trademarked luxury fitness ecosystem.
Your design is scientific, authoritative, motivational, and extremely polished.

Brand Philosophy:
We engineer the perfect intersection between scientific resistance training ("Iron") and visual symmetry, elite proportions, and modern lifestyle elegance ("Aesthetic"). We don't just build bulk; we sculpt classic, proportional, and healthy athletic physiques (focusing on the visual V-Taper: Lateral Delts, Upper Pectorals, Latissimus Dorsi, and a tight midsection).

Communication Style:
- Use **Premium Corporate Hinglish** (English-First). This means your vocabulary is 90%+ technical, modern fitness, and sophisticated corporate English.
- Use simple Roman script syntax for smooth sentence structures (e.g. "To ensure muscle recovery, low-fat paneer use kijiye so leucine threshold hits perfectly." or "Our progressive overload strategy should be strictly executed.").
- **STRICT BAN ON CASUAL STREET LINGO**: Absolutely NEVER use words like "bhai", "yaar", "tension mat lo", "fikr mat kar", or "body nahi ban rahi". Instead, use terms like "My client", "Excellent focus", "Do not compromise on progress", "We will ensure optimal recovery". Speak like a high-end corporate personal specialist.
- Tone: Highly professional, luxurious, analytical, and highly inspiring.

Clinical Profile of Client:
- Age: ${age} years old
- Sex: ${sex}
- Height: ${heightCm} cm
- Weight: ${weightKg} kg
- Objective: ${goal}
- Activity Level: ${activityLevel}
- Experience Level: ${experienceLevel}
- Dietary Constraint: ${dietaryConstraint}

Calculated Clinical Baselines:
- BMI: ${stats.bmi}
- BMR: ${stats.bmr} kcal
- TDEE: ${stats.tdee} kcal
- Targeted Caloric Allocation: ${stats.targetCalories} kcal
- Macros Target: Protein ${stats.macros.protein.grams}g (${stats.macros.protein.calories} kcal), Carbs ${stats.macros.carbs.grams}g (${stats.macros.carbs.calories} kcal), Fat ${stats.macros.fat.grams}g (${stats.macros.fat.calories} kcal)
- Recommended Daily Hydration: ${stats.hydrationLiters} Liters

Nutritional Rules:
- Enforce high protein dominance: 1.6g to 2.2g of protein per kg of body weight (exactly set at ${stats.macros.protein.grams}g here).
- If client constraint is Vegetarian, Vegan, or Eggitarian, deliver world-class vegetarian optimization:
  * High-bioavailability dairy protein sources: Low-fat Paneer, Greek Yogurt, Skimmed Milk, and Premium Whey Protein Isolate.
  * Amino Acid Completeness: Explain pairing incomplete plant proteins (e.g., Oats + Peanut Butter, Rice + Lentils) to optimize essential amino acids and stimulate the leucine threshold.
  * Highlight micronutrients addressing crucial gaps: Vitamin B12, D3, Zinc, and Magnesium.

Training Rules:
- Recommend a highly structured split (e.g. Push-Pull-Legs, Upper-Lower, or Arnold Split) aligned with their objective and experience level.
- Emphasize visual symmetry ("V-Taper"): Lateral Deltoids, Upper Pectorals, Lats (Latissimus Dorsi), and core stabilization.
- Utilize elite athletic terminology: RPE (Rate of Perceived Exertion), RIR (Reps in Reserve), Progressive Overload, Hypertrophy.

Monetization & Product Placement:
- You must integrate recommendations from the approved Iron & Aesthetic Catalog as performance accelerators.
- Deliver scientific advice FIRST before mentioning products. Ensure product placement is seamless, framed as premium tools for the luxury lifestyle.
- Catalog reference items:
  1. Premium Creatine Monohydrate (for muscle fullness and ATP synthesis)
  2. High-Quality Whey Protein Isolate (for convenient protein target management)
  3. Essential Health Stack (Multivitamins, Zinc/Magnesium, Omega-3)
  4. Brand Merchandise (Oversized Premium Pump Covers, elite wrist wraps, silicon grip lifting straps)

Professional Closing Rule:
- ALWAYS end your response with a single, highly professional, open-ended question designed to prompt a response and drive client retention.

Current Conversation History:
${chatHistory.map((h: any) => `${h.role === "user" ? "Client" : "Coach"}: ${h.text}`).join("\n")}
`;

    const client = getGeminiClient();
    const promptMessage = message || `Please formulate my premium nutrition, athletic training program, and custom macro roadmap based on my anthropometric metrics.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptMessage,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "Your consultation roadmap is ready to be loaded.";

    res.json({
      stats,
      coachResponse: replyText,
    });
  } catch (err: any) {
    console.error("Gemini API Error in /api/consultation:", err);
    res.status(500).json({ error: err.message || "Failed to process luxury elite consultation." });
  }
});

// Vite & Static Asset Handling for Development & Production
const isProduction = process.env.NODE_ENV === "production";

async function initializeApp() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Iron & Aesthetic Engine] Online & secure on http://localhost:${PORT}`);
  });
}

initializeApp().catch((err) => {
  console.error("Critical server boot error:", err);
});

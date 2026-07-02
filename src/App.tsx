import { useState, useEffect } from "react";
import { UserProfile, CalculatedStats, ChatMessage, Product } from "./types";
import Header from "./components/Header";
import SomaticForm from "./components/SomaticForm";
import SomaticIndicators from "./components/SomaticIndicators";
import SymmetryPlan from "./components/SymmetryPlan";
import CoachConsole from "./components/CoachConsole";
import AestheticVault from "./components/AestheticVault";
import { Shield, Sparkles, Award, ShoppingBag, X, Check, Dumbbell, Compass } from "lucide-react";

export default function App() {
  // 1. Initial Profile State (clinical intake)
  const [profile, setProfile] = useState<UserProfile>({
    age: "24",
    sex: "Male",
    heightCm: "178",
    weightKg: "75",
    goal: "Lean Muscle Hypertrophy",
    activityLevel: "Moderately Active",
    dietaryConstraint: "Vegetarian",
    experienceLevel: "Intermediate",
  });

  // 2. Computed Biometrics
  const [stats, setStats] = useState<CalculatedStats | null>(null);

  // 3. Chat Consultation State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingConsultation, setLoadingConsultation] = useState(false);

  // 4. Products Inventory & Active Stack State
  const [products, setProducts] = useState<Product[]>([]);
  const [activeAccelerators, setActiveAccelerators] = useState<Product[]>([]);

  // 5. Notifications/Orders modal simulation
  const [acquiredProduct, setAcquiredProduct] = useState<Product | null>(null);
  const [showOrderToast, setShowOrderToast] = useState(false);

  // Fetch initial products and compute initial stats on load
  useEffect(() => {
    fetchProducts();
    triggerBiometricsCalculation();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error("Failed to fetch product catalog:", err);
    }
  };

  const triggerBiometricsCalculation = () => {
    // Perform standard calculations matching server-side mathematics for real-time smoothness
    const ageNum = Number(profile.age) || 24;
    const heightNum = Number(profile.heightCm) || 178;
    const weightNum = Number(profile.weightKg) || 75;

    const heightM = heightNum / 100;
    const bmi = weightNum / (heightM * heightM);

    let bmr = 0;
    if (profile.sex === "Male") {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
    }

    let activityMultiplier = 1.55;
    switch (profile.activityLevel) {
      case "Sedentary": activityMultiplier = 1.2; break;
      case "Lightly Active": activityMultiplier = 1.375; break;
      case "Moderately Active": activityMultiplier = 1.55; break;
      case "Very Active": activityMultiplier = 1.725; break;
      case "Extra Active": activityMultiplier = 1.9; break;
    }
    const tdee = bmr * activityMultiplier;

    let targetCalories = tdee;
    if (profile.goal === "Lean Muscle Hypertrophy") {
      targetCalories = tdee + 300;
    } else if (profile.goal === "Targeted Fat Loss") {
      targetCalories = tdee - 500;
    } else {
      targetCalories = tdee - 100;
    }

    const proteinG = weightNum * 2.0;
    const proteinKcal = proteinG * 4;
    const fatG = (targetCalories * 0.25) / 9;
    const fatKcal = fatG * 9;
    const carbKcal = targetCalories - proteinKcal - fatKcal;
    const carbG = carbKcal / 4;

    setStats({
      bmi: parseFloat(bmi.toFixed(1)),
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: Math.round(targetCalories),
      macros: {
        protein: { grams: Math.round(proteinG), calories: Math.round(proteinKcal) },
        carbs: { grams: Math.round(carbG), calories: Math.round(carbKcal) },
        fat: { grams: Math.round(fatG), calories: Math.round(fatKcal) },
      },
      hydrationLiters: parseFloat((weightNum * 0.035).toFixed(1)),
    });
  };

  // Submit full diagnostic to start consultation session or refresh advice
  const handleDiagnosticsSubmit = async () => {
    setLoadingConsultation(true);
    triggerBiometricsCalculation();

    try {
      const payload = {
        ...profile,
        chatHistory: messages.map(m => ({ role: m.role, text: m.text })),
        message: `I have updated my metrics: Age ${profile.age}, Weight ${profile.weightKg}kg, Height ${profile.heightCm}cm, Goal is ${profile.goal}, Dietary constraint: ${profile.dietaryConstraint}. Please generate/update my scientific somatic roadmap.`,
      };

      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const responseText = data.coachResponse;

        // Set computed stats from server precisely
        if (data.stats) {
          setStats(data.stats);
        }

        const systemMsg: ChatMessage = {
          id: Date.now().toString(),
          role: "model",
          text: responseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, systemMsg]);
      } else {
        const errData = await res.json();
        console.error("API error details:", errData);
      }
    } catch (err) {
      console.error("Failed to connect to consultation engine:", err);
    } finally {
      setLoadingConsultation(false);
    }
  };

  // Chat message submission
  const handleSendMessage = async (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoadingConsultation(true);

    try {
      const payload = {
        ...profile,
        chatHistory: [...messages, userMsg].map(m => ({ role: m.role, text: m.text })),
        message: userText,
      };

      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const coachReply: ChatMessage = {
          id: `coach-${Date.now()}`,
          role: "model",
          text: data.coachResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, coachReply]);
      }
    } catch (err) {
      console.error("Failed to transmit query to consultation engine:", err);
    } finally {
      setLoadingConsultation(false);
    }
  };

  // Toggle products on active dynamic biometrics stack
  const handleToggleAccelerator = (product: Product) => {
    const activeIds = activeAccelerators.map((p) => p.id);
    if (activeIds.includes(product.id)) {
      setActiveAccelerators((prev) => prev.filter((p) => p.id !== product.id));
    } else {
      setActiveAccelerators((prev) => [...prev, product]);
    }
  };

  const handleRemoveAccelerator = (productId: string) => {
    setActiveAccelerators((prev) => prev.filter((p) => p.id !== productId));
  };

  // Simulate order checkout with beautiful confirmation Toast modal
  const handleSimulatePurchase = (product: Product) => {
    setAcquiredProduct(product);
    setShowOrderToast(true);
    setTimeout(() => {
      setShowOrderToast(false);
    }, 5000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0A0A0A] text-[#FFFFFF] font-sans overflow-x-hidden selection:bg-[#D4AF37]/30 selection:text-[#D4AF37]">
      {/* Dynamic Toast for acquisition */}
      {showOrderToast && acquiredProduct && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md animate-fade-in-up rounded-lg border border-[#D4AF37] bg-[#121212] p-4 shadow-2xl">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/10 text-[#D4AF37]">
              <Check className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold uppercase tracking-widest text-white">
                Premium Request Transmitted
              </h4>
              <p className="mt-1 font-sans text-[11px] leading-relaxed text-[#8E8E93]">
                Your acquisition request for <span className="text-[#D4AF37] font-semibold">{acquiredProduct.name}</span> has been processed. Our concierge will calibrate your shipping route.
              </p>
              <div className="mt-2.5 flex items-center justify-between border-t border-[#2C2C2E] pt-2">
                <span className="font-mono text-[9px] text-[#8E8E93]">STATUS: PREPARATION</span>
                <span className="font-mono text-[10px] font-bold text-[#D4AF37]">${acquiredProduct.price.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => setShowOrderToast(false)}
              className="text-[#8E8E93] hover:text-white transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Corporate Premium Header */}
      <Header />

      {/* Main Container */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-8">
        
        {/* Elite Brand Intro card */}
        <div className="relative mb-8 overflow-hidden rounded-lg border border-[#2C2C2E] bg-gradient-to-br from-[#121212] to-[#0A0A0A] p-6 md:p-8">
          <div className="absolute top-0 right-0 p-8 pointer-events-none opacity-5">
            <Award className="h-[120px] w-[120px] text-[#D4AF37]" />
          </div>
          <div className="max-w-2xl">
            <span className="font-mono text-[9px] font-bold text-[#D4AF37] tracking-widest uppercase bg-[#D4AF37]/10 px-2.5 py-1 rounded">
              Elite Somatic Optimization
            </span>
            <h2 className="mt-3.5 font-sans text-2xl font-light tracking-tight text-white uppercase sm:text-3xl">
              Scientific <span className="text-[#D4AF37] font-bold">Iron &amp; Aesthetic</span> Architecture
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-[#8E8E93] md:text-sm">
              We design the perfect matrix between heavy resistance load training and proportional physical symmetry. Complete your high-end clinical profiling to generate tailored nutritional algorithms, leucine threshold pairing advice, and structured hypertrophy workouts.
            </p>
          </div>
        </div>

        {/* 3-Column Interactive Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* Column 1: Diagnostics and Indicators (Col-span 4) */}
          <div className="lg:col-span-4 space-y-8">
            <SomaticForm
              profile={profile}
              onChange={setProfile}
              onSubmit={handleDiagnosticsSubmit}
              loading={loadingConsultation}
            />

            <SomaticIndicators
              stats={stats}
              activeAccelerators={activeAccelerators}
              onRemoveAccelerator={handleRemoveAccelerator}
            />
          </div>

          {/* Column 2: Symmetry Plan & Consultation (Col-span 8) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <SymmetryPlan profile={profile} />
              
              <div className="flex flex-col h-full justify-between rounded-lg border border-[#2C2C2E] bg-[#121212] p-6 shadow-xl">
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <Award className="h-4 w-4 text-[#D4AF37]" />
                    <h3 className="font-sans text-xs font-bold tracking-widest text-white uppercase">
                      Bioavailability Optimization
                    </h3>
                  </div>
                  
                  <div className="relative h-28 flex items-center justify-center mb-4">
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                      <div className="w-24 h-24 rounded-full border-4 border-[#D4AF37] border-t-transparent animate-spin" style={{ animationDuration: "10s" }}></div>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-light text-[#D4AF37] tracking-wider">94%</p>
                      <p className="text-[9px] text-[#8E8E93] uppercase tracking-widest mt-0.5">Absorption Efficiency</p>
                    </div>
                  </div>

                  <p className="font-sans text-xs leading-relaxed text-[#8E8E93]">
                    Your current <span className="text-[#D4AF37] font-semibold">{profile.dietaryConstraint}</span> protocol is dynamically paired for optimal cellular leucine thresholds. Stack <span className="text-[#D4AF37]">Whey Isolate</span> and low-fat dairy proteins to maximize myofibrillar synthesis and tissue repair.
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#2C2C2E]/60 flex items-center justify-between">
                  <span className="font-mono text-[9px] text-[#8E8E93] uppercase tracking-wider">
                    RECOVERY SPEED: HIGH
                  </span>
                  <span className="font-mono text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
                    METABOLICALLY BALANCED
                  </span>
                </div>
              </div>
            </div>

            <CoachConsole
              messages={messages}
              onSendMessage={handleSendMessage}
              loading={loadingConsultation}
              profile={profile}
            />
          </div>
        </div>

        {/* Catalog Section (Full Width row) */}
        <div className="mt-12">
          <AestheticVault
            products={products}
            activeIds={activeAccelerators.map((p) => p.id)}
            onToggleAccelerator={handleToggleAccelerator}
            onSimulatePurchase={handleSimulatePurchase}
          />
        </div>

      </main>

      {/* Bottom Status footer */}
      <footer className="mt-16 border-t border-[#2C2C2E] bg-[#121212] py-6 px-6 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-wrap gap-6 justify-center">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="font-mono text-[9px] text-[#8E8E93] uppercase tracking-widest">
                Scientific Resistance Active
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] text-[#8E8E93] uppercase tracking-widest">
                API Latency: <span className="text-white font-semibold">14ms</span>
              </span>
            </div>
          </div>
          <div>
            <span className="font-mono text-[9px] text-[#8E8E93] uppercase tracking-widest italic">
              &copy; 2026 Iron &amp; Aesthetic. All Rights Reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

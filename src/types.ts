export interface UserProfile {
  age: string;
  sex: "Male" | "Female";
  heightCm: string;
  weightKg: string;
  goal: "Lean Muscle Hypertrophy" | "Targeted Fat Loss" | "Body Recomposition";
  activityLevel: "Sedentary" | "Lightly Active" | "Moderately Active" | "Very Active" | "Extra Active";
  dietaryConstraint: "Vegetarian" | "Vegan" | "Eggitarian" | "Non-Vegetarian";
  experienceLevel: "Beginner" | "Intermediate" | "Advanced";
}

export interface MacroUnit {
  grams: number;
  calories: number;
}

export interface CalculatedStats {
  bmi: number;
  bmr: number;
  tdee: number;
  targetCalories: number;
  macros: {
    protein: MacroUnit;
    carbs: MacroUnit;
    fat: MacroUnit;
  };
  hydrationLiters: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export interface Product {
  id: string;
  name: string;
  category: "Supplements" | "Apparel" | "Gear" | string;
  price: number;
  rating: number;
  description: string;
  benefits: string[];
  imagePrompt: string;
  iconName: string;
}

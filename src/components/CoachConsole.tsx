import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, UserProfile } from "../types";
import { Sparkles, Send, Brain, Compass, HelpCircle, Trophy } from "lucide-react";

interface CoachConsoleProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  loading: boolean;
  profile: UserProfile;
}

export default function CoachConsole({ messages, onSendMessage, loading, profile }: CoachConsoleProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;
    onSendMessage(inputValue);
    setInputValue("");
  };

  const suggestions = [
    {
      label: "V-Taper Blueprint",
      prompt: "Give me the scientific focus strategy to optimize my classic aesthetic silhouette and V-Taper ratios.",
    },
    {
      label: "Optimize Leucine & Bioavailability",
      prompt: "Explain how to optimize leucine thresholds and protein bioavailability under my current dietary regimen.",
    },
    {
      label: "Symmetry Load & Overload",
      prompt: "Explain how to structure my progressive overload and training volume for peak myofibrillar hypertrophy.",
    },
    {
      label: "Elite Micronutrient Stack",
      prompt: "What micronutrient architecture should I implement to address critical biochemical markers?",
    },
  ];

  return (
    <div className="flex h-full flex-col rounded-lg border border-[#2C2C2E] bg-[#121212] overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#2C2C2E] bg-[#0A0A0A] px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 animate-pulse">
            <Brain className="h-4 w-4 text-[#D4AF37]" />
          </div>
          <div>
            <h3 className="font-sans text-xs font-bold tracking-widest text-white uppercase">
              Elite Coach Consultation
            </h3>
            <p className="text-[10px] text-[#8E8E93] uppercase tracking-wider">
              Lead Scientific Specialist Active
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-[#D4AF37] font-mono font-medium">
          <Trophy className="h-3 w-3" />
          <span>PHYSIQUE CO-PILOT</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[350px] max-h-[500px]">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center py-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#2C2C2E] bg-[#0A0A0A]">
              <Compass className="h-5 w-5 text-[#8E8E93]" />
            </div>
            <h4 className="font-sans text-xs font-bold tracking-widest text-white uppercase">
              Somatic System Calibrated
            </h4>
            <p className="mt-2 max-w-sm text-xs leading-relaxed text-[#8E8E93]">
              The Iron &amp; Aesthetic specialist is ready. Click the "Generate Customized Roadmap" button or ask a specific biomechanical query below to initiate high-end clinical profiling.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[85%] rounded p-4 border transition-all duration-300 ${
                  msg.role === "user"
                    ? "ml-auto border-[#2C2C2E] bg-[#0A0A0A] text-white"
                    : "mr-auto border-[#D4AF37]/20 bg-[#161614] text-[#E5E5EA]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-mono text-[9px] font-bold uppercase tracking-widest ${msg.role === "user" ? "text-[#8E8E93]" : "text-[#D4AF37]"}`}>
                    {msg.role === "user" ? "Client" : "Lead Specialist Coach"}
                  </span>
                  <span className="font-mono text-[8px] text-[#8E8E93]">
                    {msg.timestamp}
                  </span>
                </div>
                <div className="font-sans text-xs leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="mr-auto max-w-[85%] rounded p-4 border border-[#2C2C2E] bg-[#0A0A0A] text-white">
                <div className="flex items-center gap-3">
                  <div className="flex space-x-1">
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#D4AF37]" style={{ animationDelay: "0ms" }} />
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#D4AF37]" style={{ animationDelay: "150ms" }} />
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#D4AF37]" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="font-mono text-[9px] font-bold text-[#8E8E93] uppercase tracking-widest">
                    Synthesizing Biomechanical Matrix...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Suggestion Prompts */}
      <div className="border-t border-[#2C2C2E]/60 bg-[#0A0A0A]/40 px-6 py-3">
        <span className="mb-2 block font-sans text-[9px] font-bold text-[#8E8E93] uppercase tracking-wider">
          Suggested Consultation Queries:
        </span>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((sug, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                if (!loading) {
                  onSendMessage(sug.prompt);
                }
              }}
              disabled={loading}
              className="rounded border border-[#2C2C2E] bg-[#0A0A0A] px-2.5 py-1 text-left font-sans text-[10px] text-white transition hover:border-[#D4AF37] hover:text-[#D4AF37] disabled:opacity-40 disabled:hover:text-white"
            >
              {sug.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat input form */}
      <form onSubmit={handleSubmit} className="border-t border-[#2C2C2E] bg-[#0A0A0A] p-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={loading}
            placeholder="Type your biomechanical or nutrition query (e.g., 'How to pair incomplete plant proteins for lysine/leucine ratio?')..."
            className="flex-1 rounded border border-[#2C2C2E] bg-[#121212] py-2.5 px-4 font-sans text-xs text-white placeholder-[#8E8E93]/60 focus:border-[#D4AF37] focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !inputValue.trim()}
            className="flex h-9 w-9 items-center justify-center rounded bg-[#D4AF37] text-black transition hover:bg-[#AA8000] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

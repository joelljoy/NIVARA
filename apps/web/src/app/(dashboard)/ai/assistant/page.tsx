"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Brain, Send, User, Loader2, Trash2, Volume2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getInitials, cn } from "@/lib/utils";
import api from "@/lib/api";
import type { ChatMessage } from "@/types";
import Link from "next/link";

const STARTER_PROMPTS = [
  "What does a high HbA1c level mean?",
  "Explain my blood pressure reading of 140/90",
  "How should I take Metformin safely?",
  "What are the symptoms of vitamin D deficiency?",
];

const SYSTEM_GREETING: ChatMessage = {
  id: "0",
  role: "assistant",
  content: "Hello! I'm NIVARA's AI Health Assistant 👋\n\nI can help you understand your medical reports, medications, health conditions, and general health questions. I'm not a replacement for your doctor — always consult a healthcare professional for medical decisions.\n\nWhat would you like to know today?",
  timestamp: new Date().toISOString(),
};

export default function AIAssistantPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([SYSTEM_GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: text, timestamp: new Date().toISOString() };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await api.post("/ai/chat", {
        message: text,
        history: messages.map((m) => ({ role: m.role, content: m.content })),
      });
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.data.message,
        timestamp: new Date().toISOString(),
      };
      setMessages((p) => [...p, aiMsg]);
    } catch {
      // Demo response
      await new Promise((r) => setTimeout(r, 1200));
      const demos: Record<string, string> = {
        "hba1c": "HbA1c (Glycated Hemoglobin) measures your average blood sugar over 2–3 months. A high HbA1c (above 6.5%) indicates diabetes. Values between 5.7–6.4% suggest pre-diabetes. Your doctor uses this to assess diabetes management effectiveness.",
        "blood pressure": "A reading of 140/90 mmHg is classified as Stage 2 Hypertension. The first number (systolic) is the pressure when your heart beats; the second (diastolic) is when it rests. Values above 130/80 are concerning and should be discussed with your doctor.",
        "default": "That's a great health question! Based on general medical knowledge, I recommend consulting your doctor for personalized advice. I can help explain medical terminology, report values, or general wellness information. What specific aspect would you like me to clarify?",
      };
      const lower = text.toLowerCase();
      const response = lower.includes("hba1c") ? demos.hba1c : lower.includes("blood pressure") || lower.includes("140") ? demos["blood pressure"] : demos.default;
      setMessages((p) => [...p, { id: (Date.now() + 1).toString(), role: "assistant", content: response, timestamp: new Date().toISOString() }]);
    } finally {
      setLoading(false);
    }
  };

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-IN";
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-var(--topbar-height)-4rem)] animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link href="/dashboard"><Button variant="ghost" size="icon-sm"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
          <Brain className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-base font-bold text-foreground">AI Health Assistant</h1>
          <p className="text-xs text-muted-foreground">Powered by NIVARA AI · Medical NLP</p>
        </div>
        <Badge variant="success" dot>Online</Badge>
        <Button variant="ghost" size="icon-sm" onClick={() => setMessages([SYSTEM_GREETING])} title="Clear chat">
          <Trash2 className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>

      {/* Starter prompts (only shown at start) */}
      {messages.length === 1 && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {STARTER_PROMPTS.map((p) => (
            <button key={p} onClick={() => sendMessage(p)}
              className="text-left px-3 py-2.5 bg-surface border border-border rounded-xl text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-white transition-all">
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "")}>
            {/* Avatar */}
            <div className={cn(
              "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1",
              msg.role === "user" ? "bg-primary/10 text-primary" : "bg-primary text-white"
            )}>
              {msg.role === "user"
                ? getInitials(`${user?.firstName ?? "U"} ${user?.lastName ?? ""}`)
                : <Brain className="h-3.5 w-3.5" />}
            </div>

            {/* Bubble */}
            <div className={cn(
              "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
              msg.role === "user"
                ? "bg-primary text-white rounded-tr-sm"
                : "bg-white border border-border text-foreground rounded-tl-sm shadow-card"
            )}>
              <p className="whitespace-pre-line">{msg.content}</p>
              {msg.role === "assistant" && (
                <button onClick={() => speak(msg.content)} className="mt-2 text-muted-foreground hover:text-primary transition-colors">
                  <Volume2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
              <Brain className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="bg-white border border-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-card">
              <div className="flex gap-1 items-center">
                <span className="h-2 w-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-2">
        <input
          id="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
          placeholder="Ask about your health, reports, medications…"
          className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
          disabled={loading}
        />
        <Button onClick={() => sendMessage(input)} disabled={!input.trim() || loading} size="icon" id="chat-send-btn">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
      <p className="text-center text-[10px] text-muted-foreground mt-2">
        AI responses are for informational purposes only. Always consult a licensed doctor.
      </p>
    </div>
  );
}

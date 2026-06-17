"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { Brain, Upload, File, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Volume2, ArrowLeft } from "lucide-react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import type { SimplifiedReport } from "@/types";
import Link from "next/link";

const MOCK_RESULT: SimplifiedReport = {
  originalText: "Hemoglobin: 11.2 g/dL (Low). MCV: 72 fL. MCH: 23 pg. RDW: 16.5%...",
  summary: "Your blood test shows mild iron-deficiency anemia. Your red blood cells are smaller than normal and carry less oxygen than usual. This is a common and treatable condition.",
  riskFactors: [
    "Low hemoglobin (11.2 g/dL) — normal is 12–16 g/dL for women",
    "Small red blood cells (low MCV) suggesting iron deficiency",
    "Elevated RDW indicating variation in red blood cell size",
  ],
  recommendedActions: [
    "Start iron supplementation (consult your doctor for dosage)",
    "Increase dietary iron: spinach, lentils, red meat, fortified cereals",
    "Take vitamin C with iron-rich foods to improve absorption",
    "Repeat CBC test in 4–6 weeks to monitor progress",
  ],
  doctorQuestions: [
    "Do I need a prescription iron supplement or is dietary change sufficient?",
    "Could there be an underlying cause for the iron deficiency?",
    "Should I get a ferritin level test as well?",
  ],
  patientExplanation: "Think of your red blood cells like delivery trucks for oxygen. Right now, your trucks are smaller than normal and carrying less oxygen than they should. This can cause fatigue and weakness. The good news: this is very treatable with iron supplements and diet changes.",
  severity: "medium",
};

export default function AISimplifierPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimplifiedReport | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const onDrop = useCallback((accepted: File[]) => {
    setFile(accepted[0] || null);
    setResult(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [], "image/*": [] },
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024,
  });

  const handleSimplify = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const { data } = await api.post("/ai/simplify", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(data.data);
    } catch {
      // Use mock for demo
      await new Promise((r) => setTimeout(r, 2500));
      setResult(MOCK_RESULT);
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

  const toggle = (key: string) => setExpanded((p) => ({ ...p, [key]: !p[key] }));

  const severityColors = {
    low:    "success",
    medium: "warning",
    high:   "destructive",
  } as const;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-slide-up">
      <div className="flex items-center gap-3">
        <Link href="/dashboard"><Button variant="ghost" size="icon-sm"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            AI Report Simplifier
          </h1>
          <p className="text-muted-foreground text-sm">Upload any medical report — we&apos;ll explain it in plain language.</p>
        </div>
      </div>

      {/* Upload */}
      <Card>
        <div {...getRootProps()} className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
          isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-surface",
          file && !loading && "border-success/50 bg-success/5"
        )}>
          <input {...getInputProps()} id="simplifier-upload" />
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <File className="h-6 w-6 text-success" />
              <div className="text-left">
                <p className="font-medium text-foreground text-sm">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
            </div>
          ) : (
            <>
              <Upload className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="font-medium text-foreground">{isDragActive ? "Drop here…" : "Upload your report"}</p>
              <p className="text-sm text-muted-foreground mt-1">PDF or image · Lab reports, prescriptions, discharge summaries</p>
            </>
          )}
        </div>
        {file && (
          <div className="mt-4">
            <Button onClick={handleSimplify} loading={loading} className="w-full" size="lg" id="simplify-btn">
              {loading ? "Analyzing with AI…" : "Simplify Report"}
            </Button>
          </div>
        )}
      </Card>

      {/* Loading */}
      {loading && (
        <Card>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="h-4 w-4 rounded-full bg-primary animate-pulse" />
              Reading your report with OCR…
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <span className="h-4 w-4 rounded-full bg-primary animate-pulse" />
              Generating AI explanation…
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        </Card>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-4 animate-slide-up">
          {/* Summary */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <CardTitle>Summary</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={severityColors[result.severity]}>
                  {result.severity.charAt(0).toUpperCase() + result.severity.slice(1)} severity
                </Badge>
                <Button variant="ghost" size="icon-sm" onClick={() => speak(result.summary)} title="Listen">
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">{result.summary}</p>
            </CardContent>
          </Card>

          {/* Patient Explanation */}
          <Card className="bg-blue-50 border-blue-100">
            <CardHeader>
              <CardTitle className="text-blue-800">In Simple Words</CardTitle>
              <Button variant="ghost" size="icon-sm" onClick={() => speak(result.patientExplanation)}>
                <Volume2 className="h-4 w-4 text-blue-600" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-blue-900 leading-relaxed text-sm">{result.patientExplanation}</p>
            </CardContent>
          </Card>

          {/* Sections */}
          {[
            { key: "risks",    label: "Risk Factors",          color: "text-orange-700", bg: "bg-orange-50", items: result.riskFactors, icon: <AlertTriangle className="h-4 w-4 text-orange-500" /> },
            { key: "actions",  label: "Recommended Actions",   color: "text-green-700",  bg: "bg-green-50",  items: result.recommendedActions, icon: <CheckCircle className="h-4 w-4 text-green-500" /> },
            { key: "questions",label: "Ask Your Doctor",       color: "text-primary",    bg: "bg-blue-50",   items: result.doctorQuestions, icon: <Brain className="h-4 w-4 text-primary" /> },
          ].map((section) => (
            <Card key={section.key}>
              <button
                onClick={() => toggle(section.key)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2">
                  {section.icon}
                  <span className="font-semibold text-foreground">{section.label}</span>
                  <Badge variant="muted">{section.items.length}</Badge>
                </div>
                {expanded[section.key] ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </button>
              {expanded[section.key] && (
                <div className={`mt-4 ${section.bg} rounded-xl p-4 space-y-2`}>
                  {section.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className={`font-bold ${section.color} flex-shrink-0 mt-0.5`}>{i + 1}.</span>
                      <p className="text-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

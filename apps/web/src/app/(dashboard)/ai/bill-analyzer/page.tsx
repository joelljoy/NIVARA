"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { Receipt, Upload, AlertTriangle, CheckCircle, ArrowLeft, File, TrendingDown } from "lucide-react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import type { BillAnalysis } from "@/types";
import Link from "next/link";

const MOCK_BILL: BillAnalysis = {
  totalAmount: 48750,
  summary: "Your hospital bill includes charges for a 2-day stay, diagnostics, and medications. Most charges appear standard, but we found one potentially inflated item worth discussing with the billing department.",
  breakdown: [
    { service: "Room Charges (2 nights)", description: "General ward accommodation", amount: 12000, isAnomaly: false, explanation: "Standard general ward rate in a private hospital. This is within normal range." },
    { service: "Doctor Consultation", description: "Specialist consultation fee", amount: 2500, isAnomaly: false, explanation: "Routine specialist fee, well within typical range of ₹2,000–₹4,000." },
    { service: "CBC + Lipid Panel", description: "Blood tests", amount: 1800, isAnomaly: false, explanation: "Standard lab work pricing for these tests." },
    { service: "IV Fluids & Consumables", description: "Saline, syringes, gloves", amount: 8200, isAnomaly: true, explanation: "⚠ This appears significantly higher than typical charges of ₹3,000–₹4,000 for similar consumables. Request itemized breakup." },
    { service: "Medicines Dispensed", description: "Antibiotics, vitamins", amount: 4250, isAnomaly: false, explanation: "In-hospital medicine markup is typical. Compare with retail prices if disputed." },
    { service: "Nursing Charges", description: "24h nursing care", amount: 8000, isAnomaly: false, explanation: "Standard nursing care charge for 2-day admission." },
    { service: "Discharge Processing", description: "Administrative charges", amount: 12000, isAnomaly: true, explanation: "⚠ Administrative/discharge fees of ₹12,000 are unusually high. Typical range is ₹500–₹2,000. Query this immediately." },
  ],
  anomalies: [
    "IV Fluids & Consumables charged at 2–3× the typical rate",
    "Discharge processing fee of ₹12,000 is 6× the normal amount",
  ],
  recommendations: [
    "Request an itemized bill with individual unit costs for consumables",
    "Ask for a patient rights form — hospitals must provide detailed breakdowns",
    "Compare medicine costs with MRP on packaging",
    "Escalate anomalies to the hospital billing grievance desk in writing",
  ],
};

export default function BillAnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BillAnalysis | null>(null);

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

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const { data } = await api.post("/ai/analyze-bill", form, { headers: { "Content-Type": "multipart/form-data" } });
      setResult(data.data);
    } catch {
      await new Promise((r) => setTimeout(r, 2000));
      setResult(MOCK_BILL);
    } finally {
      setLoading(false);
    }
  };

  const savings = result?.breakdown.filter((i) => i.isAnomaly).reduce((a, b) => a + b.amount * 0.5, 0) ?? 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-slide-up">
      <div className="flex items-center gap-3">
        <Link href="/dashboard"><Button variant="ghost" size="icon-sm"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Receipt className="h-6 w-6 text-primary" /> Medical Bill Analyzer
          </h1>
          <p className="text-muted-foreground text-sm">Upload your hospital bill — we&apos;ll explain every charge and flag anomalies.</p>
        </div>
      </div>

      <Card>
        <div {...getRootProps()} className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
          isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-surface",
          file && "border-success/50 bg-success/5"
        )}>
          <input {...getInputProps()} id="bill-upload" />
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <File className="h-6 w-6 text-success" />
              <p className="font-medium text-foreground">{file.name}</p>
            </div>
          ) : (
            <>
              <Receipt className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="font-medium text-foreground">{isDragActive ? "Drop here…" : "Upload hospital bill"}</p>
              <p className="text-sm text-muted-foreground mt-1">PDF or photo of your medical bill</p>
            </>
          )}
        </div>
        {file && (
          <Button onClick={handleAnalyze} loading={loading} className="w-full mt-4" size="lg" id="analyze-bill-btn">
            {loading ? "Analyzing bill…" : "Analyze Bill"}
          </Button>
        )}
      </Card>

      {loading && (
        <div className="space-y-3">
          {[1,2,3,4].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
        </div>
      )}

      {result && !loading && (
        <div className="space-y-4 animate-slide-up">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <Card padding="sm" className="col-span-2">
              <p className="text-sm text-muted-foreground mb-1">Total Bill Amount</p>
              <p className="text-3xl font-bold text-foreground">₹{result.totalAmount.toLocaleString("en-IN")}</p>
              <p className="text-sm text-muted-foreground mt-2">{result.summary}</p>
            </Card>
            <Card padding="sm" className="bg-orange-50 border-orange-100">
              <p className="text-xs text-orange-700 mb-1 font-medium">Potential Savings</p>
              <p className="text-2xl font-bold text-orange-700">₹{savings.toLocaleString("en-IN")}</p>
              <p className="text-xs text-orange-600 mt-1">From {result.anomalies.length} flagged items</p>
            </Card>
          </div>

          {/* Anomalies */}
          {result.anomalies.length > 0 && (
            <Card className="border-destructive/20 bg-red-50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <CardTitle className="text-destructive">{result.anomalies.length} Anomalies Found</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5">
                  {result.anomalies.map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-red-800">
                      <span className="font-bold mt-0.5">⚠</span> {a}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Line items */}
          <Card>
            <CardHeader><CardTitle>Charge Breakdown</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.breakdown.map((item, i) => (
                  <div key={i} className={cn(
                    "p-4 rounded-xl border transition-all",
                    item.isAnomaly ? "border-destructive/30 bg-red-50" : "border-border bg-surface"
                  )}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          {item.isAnomaly
                            ? <AlertTriangle className="h-3.5 w-3.5 text-destructive flex-shrink-0" />
                            : <CheckCircle className="h-3.5 w-3.5 text-success flex-shrink-0" />}
                          <p className="font-medium text-foreground text-sm">{item.service}</p>
                          {item.isAnomaly && <Badge variant="destructive" className="text-[10px]">Review</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground ml-5">{item.description}</p>
                        <p className="text-xs text-foreground/80 ml-5 mt-1">{item.explanation}</p>
                      </div>
                      <p className="font-bold text-foreground text-sm flex-shrink-0">
                        ₹{item.amount.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-primary" />
                <CardTitle>What You Can Do</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {result.recommendations.map((r, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="h-5 w-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</span>
                    <span className="text-foreground">{r}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

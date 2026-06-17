"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Upload, File, X, CheckCircle, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { formatFileSize, cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toaster";

const CATEGORIES = [
  { value: "lab_report",       label: "Lab Report" },
  { value: "prescription",     label: "Prescription" },
  { value: "imaging",          label: "Imaging / Scan" },
  { value: "discharge_summary",label: "Discharge Summary" },
  { value: "vaccination",      label: "Vaccination" },
  { value: "insurance",        label: "Insurance Document" },
  { value: "other",            label: "Other" },
];

type UploadStatus = "idle" | "uploading" | "extracting" | "done" | "error";

export default function UploadRecordPage() {
  const router = useRouter();
  const toast = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("lab_report");
  const [doctorName, setDoctorName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [recordDate, setRecordDate] = useState("");
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [ocrText, setOcrText] = useState("");

  const onDrop = useCallback((accepted: File[]) => {
    const f = accepted[0];
    if (f) {
      setFile(f);
      if (!title) setTitle(f.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
    }
  }, [title]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"], "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024,
  });

  const handleUpload = async () => {
    if (!file) return;
    setStatus("uploading");
    setProgress(10);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title || file.name);
      formData.append("category", category);
      if (doctorName) formData.append("doctorName", doctorName);
      if (hospitalName) formData.append("hospitalName", hospitalName);
      if (recordDate) formData.append("recordDate", recordDate);

      setProgress(30);
      setStatus("extracting");

      const { data } = await api.post("/records/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => setProgress(30 + Math.round((e.progress ?? 0) * 40)),
      });

      setOcrText(data.data.ocrText || "");
      setProgress(100);
      setStatus("done");
      toast.success("Record uploaded", "Your medical record has been saved and OCR-extracted.");
      setTimeout(() => router.push("/records"), 2000);
    } catch {
      setStatus("error");
      toast.error("Upload failed", "Please try again or check your connection.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
      <div className="flex items-center gap-3">
        <Link href="/records">
          <Button variant="ghost" size="icon-sm"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Upload Medical Record</h1>
          <p className="text-muted-foreground text-sm">PDF or image · Max 20MB · AES-256 encrypted</p>
        </div>
      </div>

      {/* Drop zone */}
      <Card>
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200",
            isDragActive ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-primary/50 hover:bg-surface",
            file && "border-success bg-success/5"
          )}
        >
          <input {...getInputProps()} id="record-file-input" />
          {file ? (
            <div className="flex flex-col items-center gap-3">
              <div className="h-12 w-12 bg-success/10 rounded-2xl flex items-center justify-center">
                <File className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{file.name}</p>
                <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setFile(null); }}
                leftIcon={<X className="h-3.5 w-3.5" />} className="text-destructive hover:bg-destructive/10">
                Remove
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="h-12 w-12 bg-primary/8 rounded-2xl flex items-center justify-center">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  {isDragActive ? "Drop it here…" : "Drag & drop your file"}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">or <span className="text-primary">browse</span> · PDF, JPG, PNG up to 20MB</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Metadata */}
      <Card>
        <CardHeader><CardTitle>Record Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input label="Title" placeholder="e.g. CBC Blood Test Report" value={title}
            onChange={(e) => setTitle(e.target.value)} required />
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">
              Category <span className="text-destructive">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button key={cat.value} onClick={() => setCategory(cat.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-medium transition-all border",
                    category === cat.value
                      ? "border-primary bg-primary/8 text-primary"
                      : "border-border bg-white text-muted-foreground hover:border-primary/30"
                  )}>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Doctor name" placeholder="Dr. Priya Mehta" value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)} />
            <Input label="Hospital / Clinic" placeholder="Apollo Hospitals" value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)} />
          </div>
          <Input label="Record date" type="date" value={recordDate}
            onChange={(e) => setRecordDate(e.target.value)} />
        </CardContent>
      </Card>

      {/* Upload progress */}
      {status !== "idle" && (
        <Card>
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              {status === "done"  && <CheckCircle className="h-6 w-6 text-success" />}
              {status === "error" && <AlertCircle className="h-6 w-6 text-destructive" />}
              {(status === "uploading" || status === "extracting") && (
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                {status === "uploading"  && "Uploading securely…"}
                {status === "extracting" && "Extracting text with OCR…"}
                {status === "done"       && "Upload complete!"}
                {status === "error"      && "Upload failed"}
              </p>
              <div className="h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }} />
              </div>
            </div>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
        </Card>
      )}

      <Button
        size="lg"
        className="w-full"
        disabled={!file || !title || status === "uploading" || status === "extracting" || status === "done"}
        loading={status === "uploading" || status === "extracting"}
        onClick={handleUpload}
        id="upload-record-btn"
      >
        {status === "done" ? "Uploaded ✓" : "Upload & Extract"}
      </Button>
    </div>
  );
}

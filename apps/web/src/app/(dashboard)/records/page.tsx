"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { formatDate, formatFileSize, getRecordCategoryLabel } from "@/lib/utils";
import { FileText, Search, Upload, Filter, Download, Eye, MoreVertical, Image } from "lucide-react";
import Link from "next/link";
import type { MedicalRecord } from "@/types";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Metadata } from "next";

const CATEGORIES = ["all", "lab_report", "prescription", "imaging", "discharge_summary", "vaccination", "insurance", "other"];
const CATEGORY_COLORS: Record<string, string> = {
  lab_report:       "blue",
  prescription:     "purple",
  imaging:          "teal",
  discharge_summary:"warning",
  vaccination:      "success",
  insurance:        "default",
  other:            "muted",
};

const MOCK_RECORDS: MedicalRecord[] = [
  { id: "1", patientId: "p1", title: "Complete Blood Count (CBC)", category: "lab_report", fileUrl: "#", fileType: "pdf", fileSize: 245000, recordDate: "2026-06-10", doctorName: "Dr. Priya Mehta", hospitalName: "Apollo Hospitals", isEncrypted: true, version: 1, uploadedAt: "2026-06-10T09:00:00Z", updatedAt: "2026-06-10T09:00:00Z" },
  { id: "2", patientId: "p1", title: "Metformin 500mg Prescription", category: "prescription", fileUrl: "#", fileType: "pdf", fileSize: 102000, recordDate: "2026-06-01", doctorName: "Dr. Anil Kumar", hospitalName: "City Clinic", isEncrypted: true, version: 1, uploadedAt: "2026-06-01T11:00:00Z", updatedAt: "2026-06-01T11:00:00Z" },
  { id: "3", patientId: "p1", title: "Chest X-Ray", category: "imaging", fileUrl: "#", fileType: "image", fileSize: 1200000, recordDate: "2026-05-20", doctorName: "Dr. Sunita Rao", hospitalName: "Manipal Hospital", isEncrypted: true, version: 1, uploadedAt: "2026-05-20T14:00:00Z", updatedAt: "2026-05-20T14:00:00Z" },
  { id: "4", patientId: "p1", title: "HbA1c Test Report", category: "lab_report", fileUrl: "#", fileType: "pdf", fileSize: 180000, recordDate: "2026-05-05", doctorName: "Dr. Priya Mehta", hospitalName: "Apollo Hospitals", isEncrypted: true, version: 2, uploadedAt: "2026-05-05T10:00:00Z", updatedAt: "2026-05-10T10:00:00Z" },
  { id: "5", patientId: "p1", title: "Discharge Summary – May 2026", category: "discharge_summary", fileUrl: "#", fileType: "pdf", fileSize: 380000, recordDate: "2026-04-15", doctorName: "Dr. Rajan Pillai", hospitalName: "Fortis Hospital", isEncrypted: true, version: 1, uploadedAt: "2026-04-15T16:00:00Z", updatedAt: "2026-04-15T16:00:00Z" },
  { id: "6", patientId: "p1", title: "COVID-19 Vaccination Certificate", category: "vaccination", fileUrl: "#", fileType: "pdf", fileSize: 95000, recordDate: "2023-08-10", isEncrypted: true, version: 1, uploadedAt: "2023-08-10T09:00:00Z", updatedAt: "2023-08-10T09:00:00Z" },
];

export default function RecordsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [view, setView] = useState<"grid" | "list">("grid");

  const { data: records, isLoading } = useQuery<MedicalRecord[]>({
    queryKey: ["records", category, search],
    queryFn: async () => {
      try {
        const r = await api.get("/records", { params: { category: category !== "all" ? category : undefined, search } });
        return r.data.data;
      } catch { return MOCK_RECORDS; }
    },
  });

  const filtered = records?.filter((r) => {
    const matchCat = category === "all" || r.category === category;
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.doctorName?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  }) ?? [];

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Medical Records</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{records?.length ?? 0} records stored securely</p>
        </div>
        <Link href="/records/upload">
          <Button leftIcon={<Upload className="h-4 w-4" />}>Upload Record</Button>
        </Link>
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Search records, doctors, hospitals…"
            leftIcon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            wrapperClassName="flex-1"
          />
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  category === cat ? "bg-primary text-white" : "bg-surface text-muted-foreground hover:bg-muted"
                }`}
              >
                {cat === "all" ? "All" : getRecordCategoryLabel(cat)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Records Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map((i) => <Skeleton key={i} className="h-44 w-full" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-foreground font-medium">No records found</p>
          <p className="text-muted-foreground text-sm mt-1 mb-4">Upload your first medical record to get started</p>
          <Link href="/records/upload"><Button>Upload Record</Button></Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {filtered.map((rec) => (
            <Card key={rec.id} hover className="animate-slide-up group">
              <div className="flex items-start justify-between mb-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  rec.fileType === "image" ? "bg-teal-50" : "bg-primary/8"
                }`}>
                  {rec.fileType === "image"
                    ? <Image className="h-5 w-5 text-teal-600" />
                    : <FileText className="h-5 w-5 text-primary" />
                  }
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant={CATEGORY_COLORS[rec.category] as any ?? "default"}>
                    {getRecordCategoryLabel(rec.category)}
                  </Badge>
                  {rec.isEncrypted && (
                    <Badge variant="muted" className="text-[10px]">🔒</Badge>
                  )}
                </div>
              </div>

              <h3 className="font-semibold text-foreground text-sm mb-1 leading-snug">{rec.title}</h3>
              {rec.doctorName && (
                <p className="text-xs text-muted-foreground">{rec.doctorName}</p>
              )}
              {rec.hospitalName && (
                <p className="text-xs text-muted-foreground">{rec.hospitalName}</p>
              )}

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">{formatDate(rec.recordDate || rec.uploadedAt)}</p>
                  <p className="text-[10px] text-muted-foreground">{formatFileSize(rec.fileSize)} · v{rec.version}</p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/records/${rec.id}`}>
                    <Button variant="ghost" size="icon-sm" title="View">
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon-sm" title="Download">
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

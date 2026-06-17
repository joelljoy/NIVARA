"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BarChart2, TrendingUp, TrendingDown, Activity, Pill, Calendar, FileText } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Legend,
} from "recharts";

const bpData = [
  { date: "May 1",  systolic: 128, diastolic: 82 },
  { date: "May 8",  systolic: 132, diastolic: 85 },
  { date: "May 15", systolic: 126, diastolic: 80 },
  { date: "May 22", systolic: 122, diastolic: 78 },
  { date: "May 29", systolic: 120, diastolic: 77 },
  { date: "Jun 5",  systolic: 118, diastolic: 76 },
  { date: "Jun 12", systolic: 116, diastolic: 75 },
  { date: "Jun 17", systolic: 115, diastolic: 74 },
];

const sugarData = [
  { date: "May 1",  fasting: 110, postMeal: 148 },
  { date: "May 8",  fasting: 108, postMeal: 145 },
  { date: "May 15", fasting: 112, postMeal: 152 },
  { date: "May 22", fasting: 106, postMeal: 141 },
  { date: "May 29", fasting: 104, postMeal: 138 },
  { date: "Jun 5",  fasting: 102, postMeal: 135 },
  { date: "Jun 12", fasting: 100, postMeal: 132 },
  { date: "Jun 17", fasting: 98,  postMeal: 128 },
];

const weightData = [
  { date: "Apr", weight: 78.2 },
  { date: "May", weight: 77.5 },
  { date: "Jun", weight: 76.8 },
];

const complianceData = [
  { name: "Metformin 500mg",  compliance: 95 },
  { name: "Amlodipine 5mg",   compliance: 88 },
  { name: "Vitamin D",        compliance: 72 },
];

const recordsData = [
  { month: "Jan", count: 2 }, { month: "Feb", count: 1 }, { month: "Mar", count: 3 },
  { month: "Apr", count: 2 }, { month: "May", count: 4 }, { month: "Jun", count: 3 },
];

const TOOLTIP_STYLE = {
  contentStyle: { background: "white", border: "1px solid #E2E8F0", borderRadius: 10, fontSize: 12 },
};

function StatCard({ label, value, unit, trend, trendValue, color }: {
  label: string; value: string | number; unit?: string;
  trend?: "up" | "down"; trendValue?: string; color?: string;
}) {
  const isGoodDown = label.toLowerCase().includes("blood sugar") || label.toLowerCase().includes("blood pressure") || label.toLowerCase().includes("weight");
  const isPositive = trend === "down" ? isGoodDown : !isGoodDown;

  return (
    <Card>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div className="flex items-end gap-1.5">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {unit && <p className="text-sm text-muted-foreground mb-0.5">{unit}</p>}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${isPositive ? "text-success" : "text-destructive"}`}>
          {trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {trendValue}
        </div>
      )}
    </Card>
  );
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <BarChart2 className="h-6 w-6 text-primary" /> Health Analytics
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">Your health trends over the last 30 days.</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Blood Pressure" value="115/74" unit="mmHg" trend="down" trendValue="5% improved" />
        <StatCard label="Blood Sugar (Fasting)" value="98" unit="mg/dL" trend="down" trendValue="11% improved" />
        <StatCard label="Weight" value="76.8" unit="kg" trend="down" trendValue="−1.4 kg this month" />
        <StatCard label="Med Compliance" value="85" unit="%" trend="up" trendValue="Up from 78%" />
      </div>

      {/* BP Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <CardTitle>Blood Pressure Trend</CardTitle>
          </div>
          <Badge variant="success" dot>Improving</Badge>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={bpData} {...TOOLTIP_STYLE}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 160]} tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} />
              <ReferenceLine y={130} stroke="#F59E0B" strokeDasharray="4 4" label={{ value: "High", fontSize: 10, fill: "#F59E0B" }} />
              <ReferenceLine y={120} stroke="#22C55E" strokeDasharray="4 4" label={{ value: "Normal", fontSize: 10, fill: "#22C55E" }} />
              <Legend iconType="circle" iconSize={8} />
              <Line type="monotone" dataKey="systolic"  stroke="#4A90E2" strokeWidth={2.5} dot={{ r: 4, fill: "#4A90E2" }} name="Systolic" />
              <Line type="monotone" dataKey="diastolic" stroke="#93C5FD" strokeWidth={2}   dot={{ r: 3, fill: "#93C5FD" }} name="Diastolic" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Blood Sugar */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-warning" />
            <CardTitle>Blood Sugar Trend</CardTitle>
          </div>
          <Badge variant="success" dot>Improving</Badge>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={sugarData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <YAxis domain={[80, 180]} tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} />
              <ReferenceLine y={126} stroke="#EF4444" strokeDasharray="4 4" />
              <Legend iconType="circle" iconSize={8} />
              <Line type="monotone" dataKey="fasting"  stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 4 }} name="Fasting" />
              <Line type="monotone" dataKey="postMeal" stroke="#EF4444" strokeWidth={2}   dot={{ r: 3 }} name="Post Meal" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Medication compliance */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Pill className="h-4 w-4 text-purple-600" />
              <CardTitle>Medication Compliance</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {complianceData.map((m) => (
                <div key={m.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-foreground font-medium">{m.name}</span>
                    <span className={`font-bold ${m.compliance >= 90 ? "text-success" : m.compliance >= 75 ? "text-warning" : "text-destructive"}`}>
                      {m.compliance}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${m.compliance >= 90 ? "bg-success" : m.compliance >= 75 ? "bg-warning" : "bg-destructive"}`}
                      style={{ width: `${m.compliance}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Records history */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <CardTitle>Records Uploaded</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={recordsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                <Tooltip {...TOOLTIP_STYLE} />
                <Bar dataKey="count" fill="#4A90E2" radius={[6, 6, 0, 0]} name="Records" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

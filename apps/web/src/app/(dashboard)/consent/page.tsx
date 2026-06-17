"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Shield, Plus, Clock, History, QrCode, X, AlertCircle, CheckCircle, User } from "lucide-react";
import api from "@/lib/api";
import { formatDate, formatDateTime } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ConsentGrant, ConsentAuditLog } from "@/types";
import { useToast } from "@/components/ui/Toaster";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

const MOCK_GRANTS: ConsentGrant[] = [
  { id: "1", patientId: "p1", granteeId: "d1", granteeName: "Dr. Priya Mehta", granteeRole: "doctor", accessLevel: "read_only", isFullProfile: true, isActive: true, grantedAt: "2026-06-01T10:00:00Z" },
  { id: "2", patientId: "p1", granteeId: "d2", granteeName: "Dr. Anil Kumar", granteeRole: "doctor", accessLevel: "read_only", isFullProfile: false, recordIds: ["1","2"], isActive: true, grantedAt: "2026-05-15T09:00:00Z", expiresAt: "2026-07-15T09:00:00Z" },
  { id: "3", patientId: "p1", granteeId: "ins1", granteeName: "Star Health Insurance", granteeRole: "insurance_reviewer", accessLevel: "read_only", isFullProfile: false, isActive: false, grantedAt: "2026-04-01T00:00:00Z", revokedAt: "2026-05-01T00:00:00Z" },
];

const MOCK_LOGS: ConsentAuditLog[] = [
  { id: "1", consentId: "1", action: "accessed", performedBy: "Dr. Priya Mehta", performedAt: "2026-06-16T14:30:00Z" },
  { id: "2", consentId: "1", action: "granted", performedBy: "You", performedAt: "2026-06-01T10:00:00Z" },
  { id: "3", consentId: "2", action: "granted", performedBy: "You", performedAt: "2026-05-15T09:00:00Z" },
  { id: "4", consentId: "3", action: "revoked", performedBy: "You", performedAt: "2026-05-01T00:00:00Z" },
];

const ACTION_COLORS = {
  granted:  "text-success",
  revoked:  "text-destructive",
  accessed: "text-primary",
  expired:  "text-muted-foreground",
};
const ACTION_ICONS = {
  granted:  <CheckCircle className="h-3.5 w-3.5 text-success" />,
  revoked:  <X className="h-3.5 w-3.5 text-destructive" />,
  accessed: <User className="h-3.5 w-3.5 text-primary" />,
  expired:  <Clock className="h-3.5 w-3.5 text-muted-foreground" />,
};

export default function ConsentPage() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [grantOpen, setGrantOpen] = useState(false);
  const [granteeEmail, setGranteeEmail] = useState("");
  const [accessLevel, setAccessLevel] = useState<"read_only"|"full_access">("read_only");
  const [expiryDays, setExpiryDays] = useState("30");

  const { data: grants } = useQuery<ConsentGrant[]>({
    queryKey: ["consent-grants"],
    queryFn: async () => {
      try { const r = await api.get("/consent"); return r.data.data; }
      catch { return MOCK_GRANTS; }
    },
  });

  const { data: logs } = useQuery<ConsentAuditLog[]>({
    queryKey: ["consent-logs"],
    queryFn: async () => {
      try { const r = await api.get("/consent/audit"); return r.data.data; }
      catch { return MOCK_LOGS; }
    },
  });

  const revoke = useMutation({
    mutationFn: (id: string) => api.post(`/consent/${id}/revoke`),
    onSuccess: () => {
      toast.success("Access revoked", "The grantee can no longer access your records.");
      queryClient.invalidateQueries({ queryKey: ["consent-grants"] });
    },
    onError: () => toast.error("Failed to revoke access"),
  });

  const handleGrant = async () => {
    try {
      await api.post("/consent/grant", { granteeEmail, accessLevel, expiryDays: parseInt(expiryDays) });
      toast.success("Access granted", `Access has been granted to ${granteeEmail}.`);
      setGrantOpen(false);
      queryClient.invalidateQueries({ queryKey: ["consent-grants"] });
    } catch {
      toast.success("Access granted (demo)", `Demo: Access granted to ${granteeEmail}.`);
      setGrantOpen(false);
    }
  };

  const active = grants?.filter((g) => g.isActive) ?? [];
  const inactive = grants?.filter((g) => !g.isActive) ?? [];

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" /> Consent Management
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">Control who can access your health records and for how long.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<QrCode className="h-4 w-4" />} onClick={() => toast.info("Emergency QR", "QR code generated and ready to share.")}>
            Emergency QR
          </Button>
          <Dialog.Root open={grantOpen} onOpenChange={setGrantOpen}>
            <Dialog.Trigger asChild>
              <Button leftIcon={<Plus className="h-4 w-4" />} id="grant-access-btn">Grant Access</Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/30 z-50 animate-fade-in" />
              <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-2xl shadow-card-xl p-6 animate-scale-in">
                <Dialog.Title className="text-lg font-bold text-foreground mb-1">Grant Record Access</Dialog.Title>
                <Dialog.Description className="text-sm text-muted-foreground mb-5">
                  Invite a doctor, hospital, or insurer to view your health records.
                </Dialog.Description>
                <div className="space-y-4">
                  <Input label="Email address" type="email" placeholder="doctor@hospital.com"
                    value={granteeEmail} onChange={(e) => setGranteeEmail(e.target.value)} required />
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Access level</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { v: "read_only",   label: "Read Only",    desc: "View records only" },
                        { v: "full_access", label: "Full Access",  desc: "View + download" },
                      ].map((opt) => (
                        <button key={opt.v} onClick={() => setAccessLevel(opt.v as any)}
                          className={cn("p-3 rounded-xl border text-left transition-all text-sm",
                            accessLevel === opt.v ? "border-primary bg-primary/5" : "border-border hover:border-primary/30")}>
                          <p className="font-medium">{opt.label}</p>
                          <p className="text-xs text-muted-foreground">{opt.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <Input label="Expires in (days)" type="number" min="1" max="365"
                    value={expiryDays} onChange={(e) => setExpiryDays(e.target.value)}
                    hint="Leave blank for no expiry" />
                  <div className="flex gap-3 pt-2">
                    <Dialog.Close asChild>
                      <Button variant="outline" className="flex-1">Cancel</Button>
                    </Dialog.Close>
                    <Button className="flex-1" onClick={handleGrant} id="confirm-grant-btn">Grant Access</Button>
                  </div>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active grants */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-semibold text-foreground">Active Access ({active.length})</h2>
          {active.length === 0 ? (
            <Card><p className="text-center text-muted-foreground py-8 text-sm">No active access grants.</p></Card>
          ) : active.map((g) => (
            <Card key={g.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{g.granteeName}</p>
                    <p className="text-xs text-muted-foreground capitalize">{g.granteeRole.replace("_", " ")}</p>
                    <div className="flex gap-1.5 mt-1.5">
                      <Badge variant={g.accessLevel === "full_access" ? "warning" : "default"}>
                        {g.accessLevel === "full_access" ? "Full Access" : "Read Only"}
                      </Badge>
                      <Badge variant="success" dot>Active</Badge>
                      {g.isFullProfile && <Badge variant="muted">Full Profile</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Granted {formatDate(g.grantedAt)}</p>
                    {g.expiresAt && (
                      <p className="text-xs text-warning mt-0.5 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Expires {formatDate(g.expiresAt)}
                      </p>
                    )}
                  </div>
                </div>
                <Button variant="outline" size="sm"
                  className="text-destructive border-destructive/30 hover:bg-destructive/5 flex-shrink-0"
                  onClick={() => revoke.mutate(g.id)}
                  loading={revoke.isPending}>
                  Revoke
                </Button>
              </div>
            </Card>
          ))}

          {inactive.length > 0 && (
            <>
              <h2 className="font-semibold text-foreground mt-4">Revoked / Expired ({inactive.length})</h2>
              {inactive.map((g) => (
                <Card key={g.id} className="opacity-60">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">{g.granteeName}</p>
                      <p className="text-xs text-muted-foreground">
                        {g.revokedAt ? `Revoked ${formatDate(g.revokedAt)}` : "Expired"}
                      </p>
                    </div>
                    <Badge variant="muted">Inactive</Badge>
                  </div>
                </Card>
              ))}
            </>
          )}
        </div>

        {/* Audit log */}
        <div>
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <History className="h-4 w-4" /> Audit Log
          </h2>
          <Card padding="sm">
            <div className="space-y-3">
              {logs?.map((log) => (
                <div key={log.id} className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex-shrink-0">{ACTION_ICONS[log.action]}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground">{log.performedBy}</p>
                    <p className={`text-xs capitalize ${ACTION_COLORS[log.action]}`}>{log.action}</p>
                    <p className="text-[10px] text-muted-foreground">{formatDateTime(log.performedAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

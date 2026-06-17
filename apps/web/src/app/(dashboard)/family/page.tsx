"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Users, Plus, Heart, Phone, ChevronRight, Edit, Trash2, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { getInitials, formatDate } from "@/lib/utils";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import Link from "next/link";

const RELATIONSHIP_COLORS: Record<string, string> = {
  spouse:      "text-pink-600 bg-pink-50",
  parent:      "text-blue-600 bg-blue-50",
  child:       "text-green-600 bg-green-50",
  sibling:     "text-purple-600 bg-purple-50",
  grandparent: "text-orange-600 bg-orange-50",
  other:       "text-muted-foreground bg-muted",
};

const MOCK_FAMILY = [
  { id: "1", name: "Kamala Iyer",    relationship: "parent",  dateOfBirth: "1948-03-15", phone: "+91 98400 12345", isEmergencyContact: true,  accessLevel: "full" },
  { id: "2", name: "Suresh Iyer",    relationship: "parent",  dateOfBirth: "1945-09-20", phone: "+91 98400 54321", isEmergencyContact: true,  accessLevel: "full" },
  { id: "3", name: "Anitha Iyer",    relationship: "spouse",  dateOfBirth: "1977-06-10", phone: "+91 99400 77777", isEmergencyContact: true,  accessLevel: "manage" },
  { id: "4", name: "Karthik Iyer",   relationship: "child",   dateOfBirth: "2005-12-01", phone: null,              isEmergencyContact: false, accessLevel: "view" },
];

export default function FamilyPage() {
  const [members, setMembers] = useState(MOCK_FAMILY);
  const [addOpen, setAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("parent");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");

  const handleAdd = () => {
    const newMember = { id: Date.now().toString(), name, relationship, dateOfBirth: dob, phone: phone || null, isEmergencyContact: false, accessLevel: "view" };
    setMembers((p) => [...p, newMember]);
    setAddOpen(false);
    setName(""); setPhone(""); setDob(""); setRelationship("parent");
  };

  const removeMember = (id: string) => setMembers((p) => p.filter((m) => m.id !== id));

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" /> Family Management
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">Manage health records for your family members.</p>
        </div>
        <Dialog.Root open={addOpen} onOpenChange={setAddOpen}>
          <Dialog.Trigger asChild>
            <Button leftIcon={<Plus className="h-4 w-4" />} id="add-family-member-btn">Add Member</Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/30 z-50 animate-fade-in" />
            <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-2xl shadow-card-xl p-6 animate-scale-in">
              <Dialog.Title className="text-lg font-bold text-foreground mb-4">Add Family Member</Dialog.Title>
              <div className="space-y-3">
                <Input label="Full name" placeholder="Kamala Iyer" value={name} onChange={(e) => setName(e.target.value)} required />
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Relationship</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["parent","spouse","child","sibling","grandparent","other"].map((r) => (
                      <button key={r} onClick={() => setRelationship(r)}
                        className={cn("px-2 py-1.5 rounded-lg text-xs font-medium capitalize border transition-all",
                          relationship === r ? "border-primary bg-primary/8 text-primary" : "border-border text-muted-foreground hover:border-primary/30")}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <Input label="Date of birth" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                <Input label="Phone number" type="tel" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} leftIcon={<Phone className="h-4 w-4" />} />
                <div className="flex gap-3 pt-2">
                  <Dialog.Close asChild>
                    <Button variant="outline" className="flex-1">Cancel</Button>
                  </Dialog.Close>
                  <Button className="flex-1" onClick={handleAdd} disabled={!name}>Add Member</Button>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      {/* Emergency contacts callout */}
      <Card className="bg-red-50 border-red-100">
        <div className="flex items-center gap-3">
          <Heart className="h-5 w-5 text-destructive flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-800">Emergency Contacts</p>
            <p className="text-xs text-red-700">{members.filter((m) => m.isEmergencyContact).length} members marked as emergency contacts — accessible via Emergency QR.</p>
          </div>
        </div>
      </Card>

      {/* Family grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {members.map((member) => (
          <Card key={member.id} className="group">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">
                {getInitials(member.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-semibold text-foreground">{member.name}</p>
                  {member.isEmergencyContact && (
                    <Heart className="h-3.5 w-3.5 text-destructive flex-shrink-0" title="Emergency contact" />
                  )}
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  <Badge className={cn("capitalize", RELATIONSHIP_COLORS[member.relationship])}>
                    {member.relationship}
                  </Badge>
                  <Badge variant="muted" className="capitalize">{member.accessLevel} access</Badge>
                </div>
                {member.dateOfBirth && (
                  <p className="text-xs text-muted-foreground mt-1">DOB: {formatDate(member.dateOfBirth)}</p>
                )}
                {member.phone && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Phone className="h-3 w-3" /> {member.phone}
                  </p>
                )}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon-sm"><Edit className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon-sm" onClick={() => removeMember(member.id)} className="hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {members.length === 0 && (
        <div className="text-center py-16">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium text-foreground mb-1">No family members added yet</p>
          <p className="text-sm text-muted-foreground mb-4">Add family members to manage their health records.</p>
          <Button onClick={() => setAddOpen(true)}>Add First Member</Button>
        </div>
      )}
    </div>
  );
}

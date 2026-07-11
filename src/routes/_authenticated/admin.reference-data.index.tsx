import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { MasterListPage, EmptyState } from "@/components/admin/MasterListPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { BookOpen, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useT } from "@/prototype/i18n";
import { usePrototypeStore } from "@/prototype/store";

export const Route = createFileRoute("/_authenticated/admin/reference-data/")({
  component: ReferenceDataIndex,
});

type ReferenceSource = {
  id: string;
  code: string;
  name_en: string;
  name_ar: string;
  description: string | null;
  is_hierarchical: boolean;
  is_system: boolean;
  status: string;
};

function ReferenceDataIndex() {
  const t = useT();
  const lang = usePrototypeStore((s) => s.language);
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const { data: sources = [], isLoading } = useQuery({
    queryKey: ["reference_sources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reference_sources")
        .select("*")
        .order("code");
      if (error) throw error;
      return data as ReferenceSource[];
    },
  });

  const filtered = sources.filter((s) => {
    const q = search.toLowerCase();
    return !q || s.code.toLowerCase().includes(q) || s.name_en.toLowerCase().includes(q) || s.name_ar.includes(q);
  });

  return (
    <>
      <MasterListPage
        title={t("admin.nav.referenceData")}
        subtitle={t("admin.desc.referenceData")}
        search={search}
        onSearchChange={setSearch}
        onCreate={() => setOpen(true)}
      >
        {isLoading ? (
          <div className="py-8 text-center text-sm text-muted-foreground">{t("common.loading") || "Loading..."}</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={BookOpen} title={t("admin.ref.empty.title")} body={t("admin.ref.empty.body")} />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("admin.ref.col.code")}</TableHead>
                  <TableHead>{t("admin.ref.col.name")}</TableHead>
                  <TableHead>{t("admin.ref.col.type")}</TableHead>
                  <TableHead>{t("admin.ref.col.system")}</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => (
                  <TableRow key={s.id} className="cursor-pointer">
                    <TableCell className="font-mono text-xs">{s.code}</TableCell>
                    <TableCell className="font-medium">
                      <Link to="/admin/reference-data/$sourceId" params={{ sourceId: s.id }} className="hover:underline">
                        {lang === "ar" ? s.name_ar : s.name_en}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {s.is_hierarchical ? t("admin.ref.type.tree") : t("admin.ref.type.flat")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {s.is_system && <Badge variant="secondary">{t("admin.ref.system")}</Badge>}
                    </TableCell>
                    <TableCell>
                      <Link to="/admin/reference-data/$sourceId" params={{ sourceId: s.id }}>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </MasterListPage>

      <SourceDialog open={open} onOpenChange={setOpen} onCreated={() => qc.invalidateQueries({ queryKey: ["reference_sources"] })} />
    </>
  );
}

function SourceDialog({ open, onOpenChange, onCreated }: { open: boolean; onOpenChange: (v: boolean) => void; onCreated: () => void }) {
  const t = useT();
  const [code, setCode] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [description, setDescription] = useState("");
  const [isHierarchical, setIsHierarchical] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("reference_sources").insert({
        code: code.trim().toUpperCase(),
        name_en: nameEn.trim(),
        name_ar: nameAr.trim(),
        description: description.trim() || null,
        is_hierarchical: isHierarchical,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(t("admin.ref.created"));
      setCode(""); setNameEn(""); setNameAr(""); setDescription(""); setIsHierarchical(false);
      onOpenChange(false);
      onCreated();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("admin.ref.new.title")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>{t("admin.ref.col.code")} *</Label>
            <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="MY_SOURCE" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>{t("admin.ref.name.en")} *</Label>
              <Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>{t("admin.ref.name.ar")} *</Label>
              <Input value={nameAr} onChange={(e) => setNameAr(e.target.value)} dir="rtl" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>{t("admin.ref.description")}</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <div className="space-y-0.5">
              <Label>{t("admin.ref.hierarchical")}</Label>
              <p className="text-xs text-muted-foreground">{t("admin.ref.hierarchical.hint")}</p>
            </div>
            <Switch checked={isHierarchical} onCheckedChange={setIsHierarchical} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t("common.back")}</Button>
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || !code.trim() || !nameEn.trim() || !nameAr.trim()}
          >
            {mutation.isPending ? t("admin.ref.saving") : t("admin.actions.create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ArrowLeft, Plus, Search, Trash2, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useT } from "@/prototype/i18n";
import { usePrototypeStore } from "@/prototype/store";
import { ConfirmationDialog } from "@/components/admin/ConfirmationDialog";

export const Route = createFileRoute("/_authenticated/admin/reference-data/$sourceId")({
  component: SourceValues,
});

type Value = {
  id: string;
  source_id: string;
  parent_id: string | null;
  code: string;
  name_en: string;
  name_ar: string;
  description: string | null;
  sort_order: number;
  status: string;
};

function SourceValues() {
  const t = useT();
  const lang = usePrototypeStore((s) => s.language);
  const { sourceId } = Route.useParams();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Value | null>(null);
  const [deleting, setDeleting] = useState<Value | null>(null);

  const { data: source } = useQuery({
    queryKey: ["reference_source", sourceId],
    queryFn: async () => {
      const { data, error } = await supabase.from("reference_sources").select("*").eq("id", sourceId).single();
      if (error) throw error;
      return data;
    },
  });

  const { data: values = [], isLoading } = useQuery({
    queryKey: ["reference_values", sourceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reference_values")
        .select("*")
        .eq("source_id", sourceId)
        .order("sort_order")
        .order("code");
      if (error) throw error;
      return data as Value[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("reference_values").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(t("admin.ref.deleted"));
      qc.invalidateQueries({ queryKey: ["reference_values", sourceId] });
      setDeleting(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = values.filter((v) => {
    const q = search.toLowerCase();
    return !q || v.code.toLowerCase().includes(q) || v.name_en.toLowerCase().includes(q) || v.name_ar.includes(q);
  });

  const title = source ? (lang === "ar" ? source.name_ar : source.name_en) : "";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link to="/admin/reference-data">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 me-1.5" />
            {t("admin.nav.referenceData")}
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-xl sm:text-2xl font-bold tracking-tight">{title}</h1>
            {source?.is_system && <Badge variant="secondary">{t("admin.ref.system")}</Badge>}
          </div>
          {source?.description && <p className="text-sm text-muted-foreground mt-0.5">{source.description}</p>}
        </div>
        <Button size="sm" onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 me-1.5" />
          {t("admin.ref.value.new")}
        </Button>
      </div>

      <Card>
        <CardContent className="p-3 sm:p-4 space-y-3">
          <div className="relative max-w-sm">
            <Search className="absolute start-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("admin.actions.search")}
              className="ps-8"
            />
          </div>

          {isLoading ? (
            <div className="py-8 text-center text-sm text-muted-foreground">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">{t("admin.ref.value.empty")}</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("admin.ref.col.code")}</TableHead>
                    <TableHead>{t("admin.ref.name.en")}</TableHead>
                    <TableHead>{t("admin.ref.name.ar")}</TableHead>
                    <TableHead>{t("admin.ref.col.sort")}</TableHead>
                    <TableHead className="w-24" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell className="font-mono text-xs">{v.code}</TableCell>
                      <TableCell>{v.name_en}</TableCell>
                      <TableCell dir="rtl">{v.name_ar}</TableCell>
                      <TableCell>{v.sort_order}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => { setEditing(v); setDialogOpen(true); }}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setDeleting(v)}>
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ValueDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        sourceId={sourceId}
        initial={editing}
        onSaved={() => qc.invalidateQueries({ queryKey: ["reference_values", sourceId] })}
      />

      <ConfirmationDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        title={t("admin.ref.delete.title")}
        body={t("admin.ref.delete.body")}
        confirmLabel={t("admin.actions.delete")}
        destructive
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
      />
    </div>
  );
}

function ValueDialog({
  open, onOpenChange, sourceId, initial, onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  sourceId: string;
  initial: Value | null;
  onSaved: () => void;
}) {
  const t = useT();
  const [code, setCode] = useState(initial?.code ?? "");
  const [nameEn, setNameEn] = useState(initial?.name_en ?? "");
  const [nameAr, setNameAr] = useState(initial?.name_ar ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? 0);

  // reset form when dialog opens with new data
  useState(() => {
    setCode(initial?.code ?? "");
    setNameEn(initial?.name_en ?? "");
    setNameAr(initial?.name_ar ?? "");
    setDescription(initial?.description ?? "");
    setSortOrder(initial?.sort_order ?? 0);
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        source_id: sourceId,
        code: code.trim(),
        name_en: nameEn.trim(),
        name_ar: nameAr.trim(),
        description: description.trim() || null,
        sort_order: sortOrder,
      };
      if (initial) {
        const { error } = await supabase.from("reference_values").update(payload).eq("id", initial.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("reference_values").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(initial ? t("admin.ref.updated") : t("admin.ref.created"));
      onOpenChange(false);
      onSaved();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (v) {
          setCode(initial?.code ?? "");
          setNameEn(initial?.name_en ?? "");
          setNameAr(initial?.name_ar ?? "");
          setDescription(initial?.description ?? "");
          setSortOrder(initial?.sort_order ?? 0);
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? t("admin.ref.value.edit") : t("admin.ref.value.new")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>{t("admin.ref.col.code")} *</Label>
            <Input value={code} onChange={(e) => setCode(e.target.value)} />
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
          <div className="space-y-1.5">
            <Label>{t("admin.ref.col.sort")}</Label>
            <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value) || 0)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t("common.back")}</Button>
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || !code.trim() || !nameEn.trim() || !nameAr.trim()}
          >
            {mutation.isPending ? t("admin.ref.saving") : t("common.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

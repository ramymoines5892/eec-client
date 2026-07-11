import { useState, useEffect, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { useT } from "@/prototype/i18n";
import { ConfirmationDialog } from "@/components/admin/ConfirmationDialog";

// A tiny generic CRUD table used by simple admin lists.
// tableName MUST match the actual public.<table> and columns must exist.

export type Column<T> = {
  key: keyof T & string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
};

export interface SimpleCrudProps<T extends { id: string }> {
  tableName: string;
  title: string;
  subtitle?: string;
  columns: Column<T>[];
  orderBy?: string;
  searchFields?: (keyof T & string)[];
  renderForm: (state: {
    values: Partial<T>;
    setValue: <K extends keyof T & string>(k: K, v: T[K] | null) => void;
  }) => ReactNode;
  emptyValues: Partial<T>;
  validate?: (v: Partial<T>) => string | null;
  headerActions?: ReactNode;
}

export function SimpleCrud<T extends { id: string }>({
  tableName, title, subtitle, columns, orderBy = "created_at",
  searchFields = [], renderForm, emptyValues, validate, headerActions,
}: SimpleCrudProps<T>) {
  const t = useT();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [deleting, setDeleting] = useState<T | null>(null);
  const [values, setValues] = useState<Partial<T>>(emptyValues);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: [tableName],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from(tableName).select("*").order(orderBy);
      if (error) throw error;
      return data as T[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const err = validate?.(values);
      if (err) throw new Error(err);
      if (editing) {
        const { id, ...rest } = values as any;
        const { error } = await (supabase as any).from(tableName).update(rest).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any).from(tableName).insert(values as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing ? t("admin.ref.updated") : t("admin.ref.created"));
      qc.invalidateQueries({ queryKey: [tableName] });
      setDialogOpen(false);
      setEditing(null);
      setValues(emptyValues);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from(tableName).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(t("admin.ref.deleted"));
      qc.invalidateQueries({ queryKey: [tableName] });
      setDeleting(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  useEffect(() => {
    if (dialogOpen) setValues(editing ? { ...editing } : { ...emptyValues });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen, editing]);

  const filtered = rows.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return searchFields.some((f) => String((r as any)[f] ?? "").toLowerCase().includes(q));
  });

  const setValue = <K extends keyof T & string>(k: K, v: T[K] | null) =>
    setValues((prev) => ({ ...prev, [k]: v as any }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-xl sm:text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {headerActions}
          <Button size="sm" onClick={() => { setEditing(null); setDialogOpen(true); }}>
            <Plus className="h-4 w-4 me-1.5" />
            {t("admin.actions.create")}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-3 sm:p-4 space-y-3">
          {searchFields.length > 0 && (
            <div className="relative max-w-sm">
              <Search className="absolute start-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("admin.actions.search")} className="ps-8" />
            </div>
          )}

          {isLoading ? (
            <div className="py-8 text-center text-sm text-muted-foreground">{t("common.loading")}</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">{t("admin.ref.value.empty")}</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((c) => (
                      <TableHead key={c.key} className={c.className}>{c.header}</TableHead>
                    ))}
                    <TableHead className="w-24" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((row) => (
                    <TableRow key={row.id}>
                      {columns.map((c) => (
                        <TableCell key={c.key} className={c.className}>
                          {c.render ? c.render(row) : String((row as any)[c.key] ?? "")}
                        </TableCell>
                      ))}
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => { setEditing(row); setDialogOpen(true); }}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setDeleting(row)}>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? t("admin.actions.edit") : t("admin.actions.create")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {renderForm({ values, setValue })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>{t("common.back")}</Button>
            <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? t("admin.ref.saving") : t("common.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={!!deleting}
        onOpenChange={(v) => { if (!v) setDeleting(null); }}
        title={t("admin.ref.delete.title")}
        description={t("admin.ref.delete.body")}
        confirmLabel={t("admin.actions.delete")}
        destructive
        onConfirm={() => { if (deleting) deleteMutation.mutate(deleting.id); }}
      />
    </div>
  );
}

export function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}

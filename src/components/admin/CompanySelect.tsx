import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useT } from "@/prototype/i18n";

export function useCompanies() {
  return useQuery({
    queryKey: ["companies-lite"],
    queryFn: async () => {
      const { data, error } = await supabase.from("companies").select("id,name").order("name");
      if (error) throw error;
      return data as { id: string; name: string }[];
    },
  });
}

export function CompanySelect({
  value, onChange,
}: { value: string | null | undefined; onChange: (v: string) => void }) {
  const t = useT();
  const { data = [] } = useCompanies();
  return (
    <Select value={value ?? undefined} onValueChange={onChange}>
      <SelectTrigger><SelectValue placeholder={t("admin.org.selectCompany")} /></SelectTrigger>
      <SelectContent>
        {data.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

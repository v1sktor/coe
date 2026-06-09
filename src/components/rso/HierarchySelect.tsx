import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Membro {
  id: string;
  membro_nome: string;
  cargo_nome?: string;
}

interface HierarchySelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  membros: Membro[];
  required?: boolean;
}

const HierarchySelect = ({ label, value, onChange, membros, required }: HierarchySelectProps) => (
  <div className="space-y-2">
    <Label className="text-xs uppercase tracking-wider text-muted-foreground">
      {label} {required && "*"}
    </Label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="bg-secondary border-border">
        <SelectValue placeholder="Selecionar..." />
      </SelectTrigger>
      <SelectContent>
        {membros.map((m) => (
          <SelectItem key={m.id} value={m.id}>
            {m.membro_nome} {m.cargo_nome ? `(${m.cargo_nome})` : ""}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export default HierarchySelect;

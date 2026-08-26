import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, Calculator } from "lucide-react";

interface AmmoFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const AmmoField = ({ label, value, onChange }: AmmoFieldProps) => {
  const [entradas, setEntradas] = useState<string[]>([value ? String(value) : ""]);

  const total = entradas.reduce((acc, e) => acc + (parseInt(e, 10) || 0), 0);

  useEffect(() => {
    if (total !== value) onChange(total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  const setEntrada = (i: number, v: string) =>
    setEntradas((prev) => prev.map((e, idx) => (idx === i ? v.replace(/\D/g, "") : e)));

  const addEntrada = () => setEntradas((prev) => [...prev, ""]);
  const removeEntrada = (i: number) =>
    setEntradas((prev) => (prev.length === 1 ? [""] : prev.filter((_, idx) => idx !== i)));

  return (
    <div className="rounded-md border border-border bg-secondary/40 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
        <span className="flex items-center gap-1 font-mono text-sm font-bold text-primary">
          <Calculator className="h-3 w-3" />
          {total}
        </span>
      </div>

      <div className="space-y-2">
        {entradas.map((e, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              inputMode="numeric"
              value={e}
              onChange={(ev) => setEntrada(i, ev.target.value)}
              placeholder="Ex: 60"
              className="bg-background border-border font-mono h-9"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0"
              onClick={() => removeEntrada(i)}
              aria-label="Remover valor"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>

      <Button type="button" variant="outline" size="sm" className="w-full h-8 text-xs" onClick={addEntrada}>
        <Plus className="mr-1 h-3 w-3" /> Adicionar valor
      </Button>
    </div>
  );
};

export default AmmoField;

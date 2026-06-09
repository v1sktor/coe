import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Minus, Plus } from "lucide-react";

interface CounterFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const CounterField = ({ label, value, onChange }: CounterFieldProps) => (
  <div className="flex items-center justify-between py-2 border-b border-border/50">
    <Label className="text-sm text-foreground">{label}</Label>
    <div className="flex items-center gap-2">
      <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => onChange(Math.max(0, value - 1))}>
        <Minus className="h-3 w-3" />
      </Button>
      <span className="font-mono text-lg w-8 text-center font-bold text-foreground">{value}</span>
      <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => onChange(value + 1)}>
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  </div>
);

export default CounterField;

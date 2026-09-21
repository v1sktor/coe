import { useLocation, useNavigate } from "react-router-dom";
import { Gavel, Scale, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const MODULOS = [
  { key: "admin", label: "Administração", url: "/dashboard", icon: Settings },
  { key: "corregedoria", label: "SJD", url: "/corregedoria", icon: Gavel },
  { key: "juridico", label: "JMU", url: "/juridico", icon: Scale },
];

export function ModuleSwitcher({ variant = "default" }: { variant?: "default" | "light" }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const atual =
    MODULOS.find((m) => m.key !== "admin" && pathname.startsWith(m.url)) ?? MODULOS[0];
  const Icon = atual.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={
            variant === "light"
              ? "border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
              : ""
          }
        >
          <Icon className="mr-2 h-4 w-4" />
          {atual.label}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 bg-popover">
        <DropdownMenuLabel className="text-[11px] uppercase tracking-widest text-muted-foreground">
          Trocar de área
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {MODULOS.map((m) => (
          <DropdownMenuItem key={m.key} onClick={() => navigate(m.url)}>
            <m.icon className="mr-2 h-4 w-4" />
            {m.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

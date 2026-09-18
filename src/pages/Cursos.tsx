import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, HardHat } from "lucide-react";
import { BackButton } from "@/components/BackButton";
const logoUrl = "/__l5e/assets-v1/1672f8a9-23e8-4b79-a040-30bfeca818fb/logo-coe-bpchq.png";
// logo asset replaced by CDN pointer

export default function Cursos() {
  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      <div className="absolute inset-0 bg-tactical-grid opacity-[0.05] pointer-events-none" />

      <header className="relative z-10 bg-sidebar text-sidebar-foreground border-b-2 border-primary">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoUrl} alt="Emblema do 4º BPChq COE" width={1024} height={1024} className="h-11 w-11 object-contain" />
            <span className="flex flex-col leading-tight">
              <span className="font-display text-base font-semibold tracking-wide">
                4º BPChq COE · PMESP
              </span>
              <span className="text-[11px] text-primary-foreground/70">
                Polícia Militar do Estado de São Paulo
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <BackButton variant="light" />
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 px-6 lg:px-10 py-16 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-2 text-primary mb-2">
          <GraduationCap className="h-4 w-4" />
          <span className="font-mono text-[11px] uppercase tracking-[0.3em]">Cursos</span>
        </div>
        <h1 className="font-display text-3xl md:text-5xl uppercase tracking-tight">
          Cursos e capacitação
        </h1>

        <Card className="mt-8 bg-card/60 backdrop-blur-md border-border/60">
          <CardContent className="p-10 text-center space-y-4">
            <HardHat className="h-12 w-12 mx-auto text-muted-foreground/40" strokeWidth={1.5} />
            <p className="font-display text-xl uppercase tracking-wider text-foreground">
              Em construção
            </p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Esta área abrigará os cursos, treinamentos e capacitações da 4º BPChq COE.
              O conteúdo será disponibilizado em breve.
            </p>
          </CardContent>
        </Card>
      </main>

      <footer className="relative z-10 border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        4º BPChq COE · Polícia Militar do Estado de São Paulo
      </footer>
    </div>
  );
}

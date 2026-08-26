import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Building2 } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { INSTITUCIONAL } from "@/lib/institucional";
import logoPcsp from "@/assets/logo-pcsp.png";

export default function Institucional() {
  const [ativa, setAtiva] = useState(INSTITUCIONAL[0].sigla);
  const unidade = INSTITUCIONAL.find((u) => u.sigla === ativa) ?? INSTITUCIONAL[0];

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      <div className="absolute inset-0 bg-tactical-grid opacity-[0.05] pointer-events-none" />

      <header className="relative z-10 bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoPcsp} alt="Brasão da Polícia Civil do Estado de São Paulo" className="h-9 w-9 object-contain" />
            <span className="flex flex-col leading-tight">
              <span className="font-display text-base font-semibold tracking-wide">
                Polícia Civil do Estado de São Paulo
              </span>
              <span className="text-[11px] text-primary-foreground/70">
                Secretaria da Segurança Pública
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <BackButton variant="light" />
            <Button asChild size="sm" variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 px-6 lg:px-10 py-10 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2 text-primary mb-2">
          <Building2 className="h-4 w-4" />
          <span className="font-mono text-[11px] uppercase tracking-[0.3em]">Institucional</span>
        </div>
        <h1 className="font-display text-3xl md:text-5xl uppercase tracking-tight">
          Conheça a Polícia Civil
        </h1>
        <p className="mt-2 text-muted-foreground text-sm">
          Missão, história e contato dos departamentos e unidades especializadas.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]">
          <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2">
            {INSTITUCIONAL.map((u) => (
              <button
                key={u.sigla}
                onClick={() => setAtiva(u.sigla)}
                className={`shrink-0 text-left px-3 py-2 rounded-md border font-mono text-xs uppercase tracking-widest transition-colors ${
                  u.sigla === ativa
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card/60 border-border/60 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {u.sigla}
              </button>
            ))}
          </nav>

          <Card className="bg-card/60 backdrop-blur-md border-border/60">
            <CardContent className="p-6 md:p-8 space-y-6">
              <div>
                <h2 className="font-display text-2xl md:text-3xl uppercase tracking-wide text-foreground">
                  {unidade.nome}
                </h2>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {unidade.subtitulo}
                </p>
              </div>

              <section>
                <h3 className="font-display text-lg uppercase tracking-wider text-primary">Missão</h3>
                <p className="mt-2 text-foreground/90 leading-relaxed">{unidade.missao}</p>
              </section>

              <section>
                <h3 className="font-display text-lg uppercase tracking-wider text-primary">História</h3>
                <p className="mt-2 text-foreground/90 leading-relaxed">{unidade.historia}</p>
              </section>

              <section>
                <h3 className="font-display text-lg uppercase tracking-wider text-primary">Contato</h3>
                <p className="mt-2 text-foreground/90 leading-relaxed">{unidade.contato}</p>
              </section>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="relative z-10 border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        Polícia Civil do Estado de São Paulo
      </footer>
    </div>
  );
}

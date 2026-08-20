import { Outlet, Link } from "react-router-dom";
import { Shield } from "lucide-react";
import logo from "@/assets/logo-pcsp.png";

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      <div className="absolute inset-0 bg-tactical-grid opacity-[0.05] pointer-events-none" />

      <header className="relative z-10 border-b border-border/60 backdrop-blur-md bg-background/60">
        <div className="px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Brasão do GARRA - Polícia Civil SP" className="h-9 w-9 object-contain" />
            <div className="flex flex-col leading-none">
              <span className="font-display text-base font-bold uppercase tracking-[0.22em] text-foreground">
                GARRA
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-0.5">
                Polícia Civil SP
              </span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <Shield className="h-3 w-3 text-primary" /> Sistema Operacional
          </div>
        </div>
        <div className="h-px gold-divider" />
      </header>

      <main className="relative z-10 flex-1 p-6 lg:p-10 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

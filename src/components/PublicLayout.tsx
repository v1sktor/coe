import { Outlet, Link } from "react-router-dom";
import { Shield } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import logo from "@/assets/logo-pcsp.png";

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      <div className="absolute inset-0 bg-tactical-grid opacity-[0.05] pointer-events-none" />

      <header className="relative z-10 bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Brasão da Polícia Civil do Estado de São Paulo" className="h-9 w-9 object-contain" />
            <span className="flex flex-col leading-tight">
              <span className="font-display text-base font-semibold tracking-wide">
                Polícia Civil do Estado de São Paulo
              </span>
              <span className="text-[11px] text-primary-foreground/70">
                Secretaria da Segurança Pública
              </span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-2 text-[11px] text-primary-foreground/70">
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-[11px] text-primary-foreground/70">
              <Shield className="h-3.5 w-3.5" /> Portal institucional
            </div>
            <BackButton variant="light" />
          </div>
        </div>
      </header>


      <main className="relative z-10 flex-1 p-6 lg:p-10 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

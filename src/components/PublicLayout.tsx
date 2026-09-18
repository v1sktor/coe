import { Outlet, Link } from "react-router-dom";
import { BackButton } from "@/components/BackButton";
const logoUrl = "/__l5e/assets-v1/1672f8a9-23e8-4b79-a040-30bfeca818fb/logo-coe-bpchq.png";
// logo asset replaced by CDN pointer

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      <div className="absolute inset-0 bg-tactical-grid opacity-[0.05] pointer-events-none" />

      <header className="relative z-10 bg-primary text-primary-foreground">
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
          <div className="flex items-center gap-3">
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

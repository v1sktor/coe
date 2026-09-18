import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { BackButton } from "@/components/BackButton";
import { ModuleSwitcher } from "@/components/ModuleSwitcher";
const logoUrl = "/__l5e/assets-v1/9be673cc-c46a-43d3-8043-abca159df6fa/logo-forca-tatica.png";
// logo asset replaced by CDN pointer

export function AppLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-secondary/40">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center gap-4 px-4 bg-gradient-blue text-primary-foreground shadow-tactical border-b-2 border-primary">
            <SidebarTrigger className="text-primary-foreground hover:bg-primary-foreground/10" />
            <Link to="/" className="flex items-center gap-3 min-w-0">
              <img src={logoUrl} alt="Emblema do 4º BPChq COE" width={1024} height={1024} className="h-11 w-11 object-contain" />
              <div className="leading-tight min-w-0">
                <span className="block font-display text-sm md:text-base font-semibold uppercase tracking-wider truncate">
                  4º BPChq COE · PMESP
                </span>
                <span className="block text-[11px] uppercase tracking-[0.2em] text-primary-foreground/70">
                  Comando operacional
                </span>
              </div>
            </Link>
            <div className="ml-auto flex items-center gap-2">
              <ModuleSwitcher variant="light" />
              <BackButton variant="light" />
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <div className="mx-auto w-full max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

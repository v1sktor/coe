import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import logoPcsp from "@/assets/logo-pcsp.png";

export function AppLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-secondary/40">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center gap-4 px-4 bg-gradient-blue text-primary-foreground shadow-tactical">
            <SidebarTrigger className="text-primary-foreground hover:bg-primary-foreground/10" />
            <Link to="/" className="flex items-center gap-3 min-w-0">
              <img src={logoPcsp} alt="Brasão da Polícia Civil do Estado de São Paulo" className="h-9 w-9 object-contain" />
              <div className="leading-tight min-w-0">
                <span className="block font-display text-sm md:text-base font-semibold uppercase tracking-wider truncate">
                  Polícia Civil · Estado de São Paulo
                </span>
                <span className="block text-[11px] uppercase tracking-[0.2em] text-primary-foreground/70">
                  Área administrativa
                </span>
              </div>
            </Link>
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

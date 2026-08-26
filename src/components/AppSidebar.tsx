import { Shield, ShieldCheck, Network, Clock, FileText, LayoutDashboard, LogOut, Settings, Users, ScrollText, Star, Megaphone, MapPin, BookOpen, ClipboardList, KeyRound } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Timings", url: "/timings", icon: Clock },
  { title: "Relatórios / RSO", url: "/relatorios", icon: FileText },
  { title: "Estáticas", url: "/estaticas", icon: MapPin },
];

const docItems = [
  { title: "APCS", url: "/ccomsoc", icon: Megaphone },
  { title: "Diretrizes", url: "/diretrizes", icon: ScrollText },
  { title: "Institucional", url: "/institucional", icon: BookOpen },
  { title: "Cursos", url: "/cursos", icon: BookOpen },
];

const adminItems = [
  { title: "Hierarquia", url: "/admin/hierarquia", icon: Network },
  { title: "Cargos e Permissões", url: "/admin/cargos", icon: ShieldCheck },
  { title: "Patentes", url: "/admin/patentes", icon: Star },
  { title: "Usuários", url: "/admin/usuarios", icon: Users },
  { title: "Logs de Atividade", url: "/admin/logs", icon: ScrollText },
  { title: "Provas / Seletivo", url: "/admin/provas", icon: ClipboardList },
  { title: "Códigos de Acesso", url: "/admin/acessos", icon: KeyRound },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-display uppercase tracking-widest text-primary text-xs">
            {!collapsed && (
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                {"\n"}
              </span>
            )}
            {collapsed && <Shield className="h-4 w-4 text-primary" />}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-sidebar-accent/80 transition-colors"
                      activeClassName="bg-sidebar-accent text-primary font-medium border-l-2 border-primary"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="font-display uppercase tracking-widest text-primary text-xs">
            {!collapsed && (
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                DOCUMENTAÇÃO
              </span>
            )}
            {collapsed && <BookOpen className="h-4 w-4 text-primary" />}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {docItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-sidebar-accent/80 transition-colors"
                      activeClassName="bg-sidebar-accent text-primary font-medium border-l-2 border-primary"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>


        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="font-display uppercase tracking-widest text-accent text-xs">
              {!collapsed && (
                <span className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  ADMIN
                </span>
              )}
              {collapsed && <Settings className="h-4 w-4 text-accent" />}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className="hover:bg-sidebar-accent/80 transition-colors"
                        activeClassName="bg-sidebar-accent text-accent font-medium border-l-2 border-accent"
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        {!collapsed && (
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute, AdminRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/AppLayout";
import { PublicLayout } from "@/components/PublicLayout";
import { AccessGate } from "@/components/AccessGate";
import { JuridicoGate } from "@/components/JuridicoGate";
import { CorregedoriaGate } from "@/components/CorregedoriaGate";
import { BarcaPanel } from "@/components/barca/BarcaPanel";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";
import { lazyWithRetry } from "@/lib/lazyWithRetry";
import Index from "./pages/Index";

const Login = lazyWithRetry(() => import("./pages/Login"), "login");
const Dashboard = lazyWithRetry(() => import("./pages/Dashboard"), "dashboard");
const Hierarquia = lazyWithRetry(() => import("./pages/Hierarquia"), "hierarquia");
const CTB = lazyWithRetry(() => import("./pages/CTB"), "ctb");
const BOPC = lazyWithRetry(() => import("./pages/BOPC"), "bopc");
const Timings = lazyWithRetry(() => import("./pages/Timings"), "timings");
const Relatorios = lazyWithRetry(() => import("./pages/Relatorios"), "relatorios");
const RsoNovo = lazyWithRetry(() => import("./pages/RsoNovo"), "rso-novo");
const CCOMSOC = lazyWithRetry(() => import("./pages/CCOMSOC"), "ccomsoc");
const Estaticas = lazyWithRetry(() => import("./pages/Estaticas"), "estaticas");
const Diretrizes = lazyWithRetry(() => import("./pages/Diretrizes"), "diretrizes");
const Juridico = lazyWithRetry(() => import("./pages/Juridico"), "juridico");
const Corregedoria = lazyWithRetry(() => import("./pages/Corregedoria"), "corregedoria");
const Cursos = lazyWithRetry(() => import("./pages/Cursos"), "cursos");
const Institucional = lazyWithRetry(() => import("./pages/Institucional"), "institucional");
const Edital = lazyWithRetry(() => import("./pages/Edital"), "edital");
const Denuncia = lazyWithRetry(() => import("./pages/Denuncia"), "denuncia");
const Prova = lazyWithRetry(() => import("./pages/Prova"), "prova");
const AdminCargos = lazyWithRetry(() => import("./pages/admin/AdminCargos"), "admin-cargos");
const AdminPatentes = lazyWithRetry(() => import("./pages/admin/AdminPatentes"), "admin-patentes");
const AdminUsuarios = lazyWithRetry(() => import("./pages/admin/AdminUsuarios"), "admin-usuarios");
const AdminLogs = lazyWithRetry(() => import("./pages/admin/AdminLogs"), "admin-logs");
const AdminProvas = lazyWithRetry(() => import("./pages/admin/AdminProvas"), "admin-provas");
const AdminAcessos = lazyWithRetry(() => import("./pages/admin/AdminAcessos"), "admin-acessos");
const NotFound = lazyWithRetry(() => import("./pages/NotFound"), "not-found");

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RouteErrorBoundary>
          <Suspense fallback={<PageLoader />}>

          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Index />} />

            {/* Rotas públicas */}
            <Route path="/apresentacao" element={<Cursos />} />
            <Route path="/cursos" element={<Cursos />} />
            <Route path="/institucional" element={<Institucional />} />
            <Route path="/edital" element={<Edital />} />
            <Route path="/prova" element={<Prova />} />
            <Route element={<PublicLayout />}>
              <Route path="/hierarquia" element={<Hierarquia />} />
              <Route
                path="/rso/novo"
                element={
                  <AccessGate chave="diligencias" titulo="Relatório de Diligências">
                    <RsoNovo />
                  </AccessGate>
                }
              />
              <Route path="/ccomsoc" element={<CCOMSOC />} />
              <Route path="/denuncia" element={<Denuncia />} />
            </Route>


            {/* Rotas públicas (full page custom) */}
            <Route path="/ctb" element={<CTB />} />
            <Route
              path="/bopc"
              element={
                <AccessGate chave="bopc" titulo="BOPC / BIC">
                  <BOPC />
                </AccessGate>
              }
            />
            <Route
              path="/juridico"
              element={
                <JuridicoGate>
                  <div className="min-h-screen bg-background p-6">
                    <Juridico />
                  </div>
                </JuridicoGate>
              }
            />
            <Route
              path="/corregedoria"
              element={
                <CorregedoriaGate>
                  <div className="min-h-screen bg-background p-6">
                    <Corregedoria />
                  </div>
                </CorregedoriaGate>
              }
            />

            {/* Rotas autenticadas */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/timings" element={<Timings />} />
                <Route
                  path="/relatorios"
                  element={
                    <AccessGate chave="diligencias" titulo="Relatório de Diligências">
                      <Relatorios />
                    </AccessGate>
                  }
                />
                <Route path="/estaticas" element={<Estaticas />} />
                <Route path="/diretrizes" element={<Diretrizes />} />
                

              </Route>
            </Route>

            {/* Rotas admin */}
            <Route element={<AdminRoute />}>
              <Route element={<AppLayout />}>
              <Route path="/admin/hierarquia" element={<Hierarquia showAdmin />} />
                <Route path="/admin/cargos" element={<AdminCargos />} />
                <Route path="/admin/patentes" element={<AdminPatentes />} />
                <Route path="/admin/usuarios" element={<AdminUsuarios />} />
                <Route path="/admin/logs" element={<AdminLogs />} />
                <Route path="/admin/provas" element={<AdminProvas />} />
                <Route path="/admin/acessos" element={<AdminAcessos />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
          </RouteErrorBoundary>

          <BarcaPanel />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

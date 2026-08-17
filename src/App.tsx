import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute, AdminRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/AppLayout";
import { PublicLayout } from "@/components/PublicLayout";
import Index from "./pages/Index";

const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Hierarquia = lazy(() => import("./pages/Hierarquia"));
const CTB = lazy(() => import("./pages/CTB"));
const Timings = lazy(() => import("./pages/Timings"));
const Relatorios = lazy(() => import("./pages/Relatorios"));
const RsoNovo = lazy(() => import("./pages/RsoNovo"));
const CCOMSOC = lazy(() => import("./pages/CCOMSOC"));
const Estaticas = lazy(() => import("./pages/Estaticas"));
const Diretrizes = lazy(() => import("./pages/Diretrizes"));
const Apresentacao = lazy(() => import("./pages/Apresentacao"));
const AdminCargos = lazy(() => import("./pages/admin/AdminCargos"));
const AdminPatentes = lazy(() => import("./pages/admin/AdminPatentes"));
const AdminUsuarios = lazy(() => import("./pages/admin/AdminUsuarios"));
const AdminLogs = lazy(() => import("./pages/admin/AdminLogs"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={null}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Index />} />

            {/* Rotas públicas */}
            <Route path="/apresentacao" element={<Apresentacao />} />
            <Route element={<PublicLayout />}>
              <Route path="/hierarquia" element={<Hierarquia />} />
              <Route path="/rso/novo" element={<RsoNovo />} />
              <Route path="/ccomsoc" element={<CCOMSOC />} />
            </Route>


            {/* Rotas públicas (full page custom) */}
            <Route path="/ctb" element={<CTB />} />

            {/* Rotas autenticadas */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/timings" element={<Timings />} />
                <Route path="/relatorios" element={<Relatorios />} />
                <Route path="/ccomsoc" element={<CCOMSOC />} />
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
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

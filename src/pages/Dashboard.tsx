import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network, Clock, FileText, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type RsoRow = Tables<"rsos">;

const Dashboard = () => {
  const [hierCount, setHierCount] = useState(0);
  const [rsosPendentes, setRsosPendentes] = useState<RsoRow[]>([]);
  const [totalRsos, setTotalRsos] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      const { count: hc } = await supabase.from("hierarquia").select("*", { count: "exact", head: true });
      setHierCount(hc ?? 0);

      const { data: rsos, count: rc } = await supabase.from("rsos").select("*", { count: "exact" }).order("created_at", { ascending: false });
      setTotalRsos(rc ?? 0);
      setRsosPendentes((rsos ?? []).filter((r) => r.status === "pendente").slice(0, 5));
    };
    fetch();
  }, []);

  const stats = [
    { label: "Efetivo (Hierarquia)", value: String(hierCount), icon: Network, color: "text-primary" },
    { label: "RSOs Pendentes", value: String(rsosPendentes.length), icon: FileText, color: "text-accent" },
    { label: "Total RSOs", value: String(totalRsos), icon: AlertTriangle, color: "text-muted-foreground" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Visão geral do sistema</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-card border-border hover:border-primary/30 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-display font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="font-display uppercase tracking-wide text-sm">RSOs Pendentes de Aprovação</CardTitle>
        </CardHeader>
        <CardContent>
          {rsosPendentes.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Nenhum RSO pendente.</p>
          ) : (
            <div className="space-y-3">
              {rsosPendentes.map((rso) => (
                <div key={rso.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-primary">{new Date(rso.data_ocorrencia).toLocaleDateString("pt-BR")}</span>
                    <span className="text-muted-foreground truncate max-w-[300px]">{rso.descricao}</span>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-secondary text-accent font-medium">Pendente</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

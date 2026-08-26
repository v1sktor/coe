import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { CheckCircle2, XCircle, ScrollText, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  QUESTOES_OBJETIVAS,
  QUESTOES_DISSERTATIVAS,
} from "@/lib/prova";

interface Inscricao {
  id: string;
  nome_id: string;
  discord_id: string;
  idade_real: string;
  periodo: string;
  respostas: Record<string, string>;
  acertos: number;
  total_objetivas: number;
  status: string;
  observacoes: string | null;
  created_at: string;
}

const STATUS = [
  { key: "pendente", label: "Pendentes" },
  { key: "aprovado", label: "Aprovados" },
  { key: "reprovado", label: "Reprovados" },
  { key: "todos", label: "Todos" },
];

export default function AdminProvas() {
  const { user } = useAuth();
  const [itens, setItens] = useState<Inscricao[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("pendente");
  const [aberto, setAberto] = useState<string | null>(null);
  const [obs, setObs] = useState<Record<string, string>>({});

  const carregar = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("prova_inscricoes")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error("Erro ao carregar provas.");
    setItens((data as unknown as Inscricao[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    carregar();
  }, []);

  const avaliar = async (id: string, status: string) => {
    const { error } = await supabase
      .from("prova_inscricoes")
      .update({
        status,
        observacoes: obs[id] ?? null,
        avaliado_por: user?.id ?? null,
        avaliado_em: new Date().toISOString(),
      })
      .eq("id", id);
    if (error) {
      toast.error("Erro ao salvar avaliação.");
      return;
    }
    toast.success(status === "aprovado" ? "Candidato aprovado." : "Candidato reprovado.");
    carregar();
  };

  const filtrados = tab === "todos" ? itens : itens.filter((i) => i.status === tab);
  const count = (k: string) => (k === "todos" ? itens.length : itens.filter((i) => i.status === k).length);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-primary">
          <ScrollText className="h-4 w-4" />
          <span className="font-mono text-[11px] uppercase tracking-[0.3em]">Processo Seletivo</span>
        </div>
        <h1 className="font-display text-2xl md:text-3xl uppercase tracking-tight">
          Provas dos candidatos
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Correção automática das objetivas. Avalie manualmente as questões de justificativa.
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          {STATUS.map((s) => (
            <TabsTrigger key={s.key} value={s.key}>
              {s.label} ({count(s.key)})
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {loading && <p className="text-sm text-muted-foreground">Carregando...</p>}
      {!loading && filtrados.length === 0 && (
        <p className="text-sm text-muted-foreground">Nenhuma prova nesta categoria.</p>
      )}

      <div className="space-y-4">
        {filtrados.map((i) => {
          const open = aberto === i.id;
          return (
            <Card key={i.id} className="border-border/60">
              <CardContent className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-display text-lg">{i.nome_id}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      Discord: {i.discord_id} · Idade: {i.idade_real} · Período: {i.periodo}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Enviado em {new Date(i.created_at).toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">
                      {i.acertos}/{i.total_objetivas} objetivas
                    </Badge>
                    <Badge
                      variant={
                        i.status === "aprovado"
                          ? "default"
                          : i.status === "reprovado"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {i.status}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => setAberto(open ? null : i.id)}>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
                      />
                    </Button>
                  </div>
                </div>

                {open && (
                  <div className="mt-5 space-y-4 border-t border-border/60 pt-5">
                    <div className="space-y-3">
                      {QUESTOES_OBJETIVAS.map((q) => {
                        const resp = i.respostas?.[`q${q.n}`];
                        const certa = resp === q.opcoes[q.correta];
                        return (
                          <div key={q.n} className="text-sm">
                            <p className="font-medium">
                              {q.n}. {q.enunciado}
                            </p>
                            <p
                              className={`flex items-center gap-1.5 ${certa ? "text-primary" : "text-destructive"}`}
                            >
                              {certa ? (
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              ) : (
                                <XCircle className="h-3.5 w-3.5" />
                              )}
                              {resp ?? "—"}
                            </p>
                            {!certa && (
                              <p className="text-xs text-muted-foreground">
                                Correta: {q.opcoes[q.correta]}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="space-y-3 border-t border-border/60 pt-4">
                      <p className="font-mono text-[11px] uppercase tracking-widest text-primary">
                        Questões de justificativa (correção manual)
                      </p>
                      {QUESTOES_DISSERTATIVAS.map((q) => (
                        <div key={q.n} className="text-sm">
                          <p className="font-medium">
                            {q.n}. {q.enunciado}
                          </p>
                          <p className="text-muted-foreground whitespace-pre-wrap mt-1">
                            {i.respostas?.[`q${q.n}`] ?? "—"}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 border-t border-border/60 pt-4">
                      <Textarea
                        placeholder="Observações da banca (opcional)"
                        rows={3}
                        value={obs[i.id] ?? i.observacoes ?? ""}
                        onChange={(e) => setObs((p) => ({ ...p, [i.id]: e.target.value }))}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => avaliar(i.id, "aprovado")}>
                          <CheckCircle2 className="mr-1 h-4 w-4" /> Aprovar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => avaliar(i.id, "reprovado")}
                        >
                          <XCircle className="mr-1 h-4 w-4" /> Reprovar
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText, Check, X, Eye, ChevronDown, ChevronUp, FileDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { generateRsoPdf } from "@/lib/rso-pdf";


interface RsoRow {
  id: string;
  autor_nome: string;
  descricao: string;
  local: string;
  data_ocorrencia: string;
  status: string;
  created_at: string;
  prefixo_viatura?: string;
  prefixo_unidade?: string;
  patrulha_inicio?: string;
  patrulha_fim?: string;
  ilicito_cocaina?: number;
  ilicito_ecstasy?: number;
  ilicito_cigarros?: number;
  ilicito_pistolas?: number;
  ilicito_fuzis?: number;
  ilicito_submetralhadoras?: number;
  ilicito_mun_pistola?: number;
  ilicito_mun_fuzil?: number;
  ilicito_mun_sub?: number;
  ilicito_lockpicks?: number;
  ilicito_bombas?: number;
  ilicito_dinheiro_marcado?: number;
  outros_ilicitos?: string;
  roubo_caixa_registradora?: number;
  roubos_residencias?: number;
  caixa_eletronico?: number;
  roubo_veiculo?: number;
  pinote_apoio?: number;
  o11_disparo?: number;
  acoes_setada?: number;
  trafico_drogas?: number;
  chamados_190?: number;
  prisoes_bopm?: string;
  multas_descricao?: string;
  outras_ocorrencias?: string;
  motivo_rejeicao?: string;
  anexos_links?: string;
  responsavel_id?: string;
  encarregado_id?: string;
  motorista_id?: string;
  homem3_id?: string;
  homem4_id?: string;
  homem5_id?: string;
}

const statusMap: Record<string, { label: string; color: string }> = {
  pendente: { label: "Pendente", color: "bg-warning/20 text-warning" },
  aprovado: { label: "Aprovado", color: "bg-success/20 text-success" },
  reprovado: { label: "Reprovado", color: "bg-danger/20 text-danger" },
};

const Relatorios = () => {
  const { toast } = useToast();
  const [rsos, setRsos] = useState<RsoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewRso, setViewRso] = useState<RsoRow | null>(null);
  const [rejectRso, setRejectRso] = useState<RsoRow | null>(null);
  const [motivo, setMotivo] = useState("");
  const [membrosMap, setMembrosMap] = useState<Record<string, string>>({});
  const [anexosUrls, setAnexosUrls] = useState<string[]>([]);
  const [aba, setAba] = useState<"todos" | "pendente" | "aprovado" | "reprovado">("pendente");

  const fetchRsos = async () => {
    const { data } = await supabase.from("rsos").select("*").order("created_at", { ascending: false });
    if (data) setRsos(data as any);
    setLoading(false);
  };

  const fetchMembros = async () => {
    const { data } = await supabase.from("hierarquia").select("id, membro_nome, cargos(nome)");
    if (data) {
      const map: Record<string, string> = {};
      data.forEach((m: any) => { map[m.id] = `${m.membro_nome}${m.cargos?.nome ? ` (${m.cargos.nome})` : ""}`; });
      setMembrosMap(map);
    }
  };

  useEffect(() => { fetchRsos(); fetchMembros(); }, []);

  useEffect(() => {
    const loadAnexos = async () => {
      setAnexosUrls([]);
      const paths = (viewRso?.anexos_links || "").split("\n").map((p) => p.trim()).filter(Boolean);
      if (!paths.length) return;
      const { data } = await supabase.storage.from("rso-anexos").createSignedUrls(paths, 3600);
      if (data) setAnexosUrls(data.map((d) => d.signedUrl).filter(Boolean) as string[]);
    };
    loadAnexos();
  }, [viewRso]);

  const handleAprovar = async (rso: RsoRow) => {
    const { error } = await supabase.from("rsos").update({ status: "aprovado" } as any).eq("id", rso.id);
    if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    toast({ title: "RSO Aprovado" });
    fetchRsos();
  };

  const handleRejeitar = async () => {
    if (!rejectRso || !motivo.trim()) {
      toast({ title: "Erro", description: "Informe o motivo da reprovação.", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("rsos").update({ status: "reprovado", motivo_rejeicao: motivo } as any).eq("id", rejectRso.id);
    if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    toast({ title: "RSO Reprovado" });
    setRejectRso(null);
    setMotivo("");
    fetchRsos();
  };

  const formatDuration = (start?: string, end?: string) => {
    if (!start || !end) return "—";
    const diff = Math.floor((new Date(end).getTime() - new Date(start).getTime()) / 1000);
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    return `${h}h ${m}min`;
  };

  const handlePdf = async (rso: RsoRow) => {
    try {
      toast({ title: "Gerando PDF..." });
      let urls: string[] = [];
      const paths = (rso.anexos_links || "").split("\n").map((p) => p.trim()).filter(Boolean);
      if (paths.length) {
        const { data } = await supabase.storage.from("rso-anexos").createSignedUrls(paths, 3600);
        if (data) urls = data.map((d) => d.signedUrl).filter(Boolean) as string[];
      }
      await generateRsoPdf({
        rso: rso as any,
        membrosMap,
        anexosUrls: urls,
        duracao: formatDuration(rso.patrulha_inicio, rso.patrulha_fim),
      });
    } catch (e: any) {
      toast({ title: "Erro ao gerar PDF", description: e?.message, variant: "destructive" });
    }
  };


  const rsosFiltrados = aba === "todos" ? rsos : rsos.filter((r) => r.status === aba);
  const countBy = (st: string) => rsos.filter((r) => r.status === st).length;

  const getMemberName = (id?: string) => id ? (membrosMap[id] || "—") : "—";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide">Relatórios / RSO</h1>
        <p className="text-muted-foreground mt-1">Relatórios de Serviço e Ocorrência</p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="space-y-4">
          <CardTitle className="font-display uppercase tracking-wide text-sm">Relatórios recebidos</CardTitle>
          <div className="flex flex-wrap gap-2">
            {([
              { key: "pendente", label: `Pendentes (${countBy("pendente")})` },
              { key: "aprovado", label: `Aprovados (${countBy("aprovado")})` },
              { key: "reprovado", label: `Recusados (${countBy("reprovado")})` },
              { key: "todos", label: `Todos (${rsos.length})` },
            ] as const).map((t) => (
              <Button
                key={t.key}
                size="sm"
                variant={aba === t.key ? "default" : "outline"}
                className="font-display uppercase text-xs tracking-wider"
                onClick={() => setAba(t.key)}
              >
                {t.label}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-sm">Carregando...</p>
          ) : rsosFiltrados.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nenhum RSO nesta aba.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left py-3 px-2 font-medium">Data</th>
                    <th className="text-left py-3 px-2 font-medium">Autor</th>
                    <th className="text-left py-3 px-2 font-medium">Viatura</th>
                    <th className="text-left py-3 px-2 font-medium">Duração</th>
                    <th className="text-left py-3 px-2 font-medium">Status</th>
                    <th className="text-left py-3 px-2 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {rsosFiltrados.map((rso) => {
                    const cfg = statusMap[rso.status] || statusMap.pendente;
                    return (
                      <tr key={rso.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="py-3 px-2 font-mono text-xs text-muted-foreground">
                          {format(new Date(rso.created_at), "dd/MM/yyyy")}
                        </td>
                        <td className="py-3 px-2">{rso.autor_nome}</td>
                        <td className="py-3 px-2 text-muted-foreground">{rso.prefixo_viatura || "—"}</td>
                        <td className="py-3 px-2 font-mono text-xs">{formatDuration(rso.patrulha_inicio, rso.patrulha_fim)}</td>
                        <td className="py-3 px-2">
                          <Badge variant="secondary" className={cfg.color}>{cfg.label}</Badge>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setViewRso(rso)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {rso.status === "pendente" && (
                              <>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-success hover:text-success hover:bg-success/10" onClick={() => handleAprovar(rso)}>
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => { setRejectRso(rso); setMotivo(""); }}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {rso.status === "aprovado" && (
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10" title="Baixar PDF" onClick={() => handlePdf(rso)}>
                                <FileDown className="h-4 w-4" />
                              </Button>
                            )}

                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View RSO Dialog */}
      <Dialog open={!!viewRso} onOpenChange={() => setViewRso(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display uppercase">Detalhes do RSO</DialogTitle>
          </DialogHeader>
          {viewRso && (
            <div className="space-y-4 text-sm">
              {viewRso.status === "aprovado" && (
                <Button size="sm" className="font-display uppercase text-xs tracking-wider" onClick={() => handlePdf(viewRso)}>
                  <FileDown className="mr-2 h-4 w-4" /> Baixar PDF
                </Button>
              )}

              {viewRso.motivo_rejeicao && viewRso.status === "reprovado" && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-md p-3">
                  <p className="text-xs uppercase text-destructive font-bold mb-1">Motivo da Reprovação</p>
                  <p className="text-foreground">{viewRso.motivo_rejeicao}</p>
                </div>
              )}

              <Section title="Informações Gerais">
                <Info label="Responsável" value={viewRso.autor_nome} />
                <Info label="Viatura" value={viewRso.prefixo_viatura} />
                <Info label="Unidade" value={viewRso.prefixo_unidade} />
                <Info label="Duração" value={formatDuration(viewRso.patrulha_inicio, viewRso.patrulha_fim)} />
              </Section>

              <Section title="Guarnição">
                <Info label="Encarregado" value={getMemberName(viewRso.encarregado_id)} />
                <Info label="Motorista" value={getMemberName(viewRso.motorista_id)} />
                <Info label="3° Homem" value={getMemberName(viewRso.homem3_id)} />
                <Info label="4° Homem" value={getMemberName(viewRso.homem4_id)} />
                <Info label="5° Homem" value={getMemberName(viewRso.homem5_id)} />
              </Section>

              <Section title="Apreendidos">
                <Info label="Cocaína" value={viewRso.ilicito_cocaina} />
                <Info label="Ecstasy" value={viewRso.ilicito_ecstasy} />
                <Info label="Cigarros" value={viewRso.ilicito_cigarros} />
                <Info label="Pistolas" value={viewRso.ilicito_pistolas} />
                <Info label="Fuzis" value={viewRso.ilicito_fuzis} />
                <Info label="Submetralhadoras" value={viewRso.ilicito_submetralhadoras} />
                <Info label="Mun. Pistola" value={viewRso.ilicito_mun_pistola} />
                <Info label="Mun. Fuzil" value={viewRso.ilicito_mun_fuzil} />
                <Info label="Mun. Sub" value={viewRso.ilicito_mun_sub} />
                <Info label="Lockpicks" value={viewRso.ilicito_lockpicks} />
                <Info label="Bombas Caseiras" value={viewRso.ilicito_bombas} />
                <Info label="Dinheiro Marcado" value={viewRso.ilicito_dinheiro_marcado} />
                <Info label="Outros Ilícitos" value={viewRso.outros_ilicitos} />
              </Section>

              <Section title="Ocorrências">
                <Info label="Roubos à Residências" value={viewRso.roubos_residencias} />
                <Info label="Caixa Eletrônico" value={viewRso.caixa_eletronico} />
                <Info label="Roubo Cx. Registradora" value={viewRso.roubo_caixa_registradora} />
                <Info label="Roubo de Veículo" value={viewRso.roubo_veiculo} />
                <Info label="Pinote/Apoio" value={viewRso.pinote_apoio} />
                <Info label="O11 (Disparo)" value={viewRso.o11_disparo} />
                <Info label="Ações Setada" value={viewRso.acoes_setada} />
                <Info label="Tráfico de Drogas" value={viewRso.trafico_drogas} />
                <Info label="190" value={viewRso.chamados_190} />
                <Info label="Prisões (BON)" value={viewRso.prisoes_bopm} />
                <Info label="Multas" value={viewRso.multas_descricao} />
                <Info label="Outras Ocorrências" value={viewRso.outras_ocorrencias} />
              </Section>

              <div>
                <p className="font-display text-xs uppercase tracking-widest text-primary mb-2">Anexos</p>
                {anexosUrls.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum anexo enviado.</p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {anexosUrls.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noreferrer" className="rounded-md border border-border overflow-hidden block">
                        <img src={url} alt={`Anexo ${i + 1}`} className="h-24 w-full object-cover" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject RSO Dialog */}
      <Dialog open={!!rejectRso} onOpenChange={() => setRejectRso(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display uppercase">Reprovar RSO</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Motivo da Reprovação *</Label>
              <Textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Informe o motivo..." className="bg-secondary border-border min-h-[100px]" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectRso(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleRejeitar}>Confirmar Reprovação</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h4 className="font-display text-xs uppercase tracking-wider text-primary mb-2 border-b border-border pb-1">{title}</h4>
    <div className="grid grid-cols-2 gap-x-4 gap-y-1">{children}</div>
  </div>
);

const Info = ({ label, value }: { label: string; value?: any }) => (
  <div className="flex justify-between py-0.5">
    <span className="text-muted-foreground">{label}:</span>
    <span className="text-foreground font-medium">{value || "—"}</span>
  </div>
);

export default Relatorios;

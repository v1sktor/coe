import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { ChevronLeft, ChevronRight, Send, CheckCircle, Shield, Car, Users, Timer, Package, AlertTriangle, Square, ArrowLeft, Paperclip } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UNIDADES } from "@/lib/unidades";
import HierarchySelect from "@/components/rso/HierarchySelect";
import CounterField from "@/components/rso/CounterField";
import { Checkbox } from "@/components/ui/checkbox";
import AmmoField from "@/components/rso/AmmoField";
import PatrolTimer, { usePatrolTimer, formatTime } from "@/components/rso/PatrolTimer";

interface Membro {
  id: string;
  membro_nome: string;
  cargo_nome?: string;
  unidade?: string | null;
}

const STEPS = [
  { title: "Responsável", icon: Shield },
  { title: "Unidade", icon: Car },
  { title: "Bate Ponto", icon: Timer },
  { title: "Apreendidos", icon: Package },
  { title: "Ocorrências", icon: AlertTriangle },
  { title: "Anexos", icon: Paperclip },
];

const RsoNovo = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [membros, setMembros] = useState<Membro[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const patrol = usePatrolTimer();
  const [anexos, setAnexos] = useState<{ path: string; name: string; preview: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dejec, setDejec] = useState(false);
  const [patrolSession, setPatrolSession] = useState<{ start: string | null; end: string | null }>(() => ({
    start: localStorage.getItem("patrol_timer_submitted_start"),
    end: localStorage.getItem("patrol_timer_submitted_end"),
  }));

  const recordedDurationSeconds = patrolSession.start && patrolSession.end
    ? Math.max(0, Math.floor((new Date(patrolSession.end).getTime() - new Date(patrolSession.start).getTime()) / 1000))
    : 0;

  const [form, setForm] = useState({
    unidade: "",
    responsavel_id: "",
    prefixo_viatura: "",
        encarregado_id: "",
    motorista_id: "",
    homem3_id: "",
    homem4_id: "",
    homem5_id: "",
    ilicito_cocaina: 0,
    ilicito_ecstasy: 0,
    ilicito_cigarros: 0,
    ilicito_pistolas: 0,
    ilicito_fuzis: 0,
    ilicito_submetralhadoras: 0,
    ilicito_mun_pistola: 0,
    ilicito_mun_fuzil: 0,
    ilicito_mun_sub: 0,
    ilicito_lockpicks: 0,
    ilicito_bombas: 0,
    ilicito_dinheiro_marcado: 0,
    outros_ilicitos: "",
    roubos_residencias: 0,
    caixa_eletronico: 0,
    roubo_caixa_registradora: 0,
    roubo_veiculo: 0,
    pinote_apoio: 0,
    o11_disparo: 0,
    acoes_setada: 0,
    trafico_drogas: 0,
    chamados_190: 0,
    prisoes_bopm: "",
    multas_descricao: "",
    outras_ocorrencias: "",
  });

  useEffect(() => {
    const fetchMembros = async () => {
      const { data } = await (supabase.rpc as any)("get_hierarquia_publica");
      if (data) setMembros((data as any[]).map((h: any) => ({ id: h.id, membro_nome: h.membro_nome, cargo_nome: h.cargo_nome, unidade: h.batalhao })));
    };
    fetchMembros();
  }, []);

  const membrosUnidade = !form.unidade
    ? []
    : form.unidade === "DEJEC"
      ? membros
      : membros.filter((m) => m.unidade === form.unidade);

  // DEJEC: operação conjunta — todas as posições podem receber qualquer policial
  const membrosGuarnicao = dejec ? membros : membrosUnidade;

  const setUnidade = (unidade: string) =>
    setForm((p) => ({ ...p, unidade, responsavel_id: "", encarregado_id: "", motorista_id: "", homem3_id: "", homem4_id: "", homem5_id: "" }));

  const set = (field: string, value: any) => setForm((p) => ({ ...p, [field]: value }));

  const patrolStarted = patrol.isRunning || !!localStorage.getItem("patrol_timer_submitted_start");

  const canNext = () => {
    if (step === 0) return !!form.unidade && !!form.responsavel_id;
    if (step === 1) return !!form.prefixo_viatura && !!form.encarregado_id && !!form.motorista_id;
    // Step 2 (Bate Ponto): basta a patrulha ter sido iniciada — pode avançar com cronômetro rodando.
    // O cronômetro continua visível como widget flutuante até ser finalizado.
    if (step === 2) return patrolStarted;
    return true;
  };

  const handleSubmit = async () => {
    if (patrol.isRunning) {
      toast({ title: "Atenção", description: "Finalize o cronômetro de patrulha antes de enviar.", variant: "destructive" });
      return;
    }

    const patrolStart = localStorage.getItem("patrol_timer_submitted_start");
    const patrolEnd = localStorage.getItem("patrol_timer_submitted_end");

    if (!patrolStart || !patrolEnd) {
      toast({ title: "Atenção", description: "Você precisa iniciar e finalizar a patrulha antes de enviar.", variant: "destructive" });
      return;
    }

    const responsavel = membros.find((m) => m.id === form.responsavel_id);

    setSubmitting(true);
    const rsoPayload = {
      autor_nome: responsavel?.membro_nome || "Desconhecido",
      descricao: `RSO - Viatura ${form.prefixo_viatura} - Unidade ${form.unidade}`,
      local: form.unidade,
      data_ocorrencia: new Date().toISOString().split("T")[0],
      responsavel_id: form.responsavel_id,
      prefixo_viatura: form.prefixo_viatura,
      prefixo_unidade: form.unidade,
      guarnicao: form.unidade,
      encarregado_id: form.encarregado_id,
      motorista_id: form.motorista_id,
      homem3_id: form.homem3_id || null,
      homem4_id: form.homem4_id || null,
      homem5_id: form.homem5_id || null,
      patrulha_inicio: patrolStart,
      patrulha_fim: patrolEnd,
      ilicito_cocaina: form.ilicito_cocaina,
      ilicito_ecstasy: form.ilicito_ecstasy,
      ilicito_cigarros: form.ilicito_cigarros,
      ilicito_pistolas: form.ilicito_pistolas,
      ilicito_fuzis: form.ilicito_fuzis,
      ilicito_submetralhadoras: form.ilicito_submetralhadoras,
      ilicito_mun_pistola: form.ilicito_mun_pistola,
      ilicito_mun_fuzil: form.ilicito_mun_fuzil,
      ilicito_mun_sub: form.ilicito_mun_sub,
      ilicito_lockpicks: form.ilicito_lockpicks,
      ilicito_bombas: form.ilicito_bombas,
      ilicito_dinheiro_marcado: form.ilicito_dinheiro_marcado,
      outros_ilicitos: form.outros_ilicitos || null,
      roubos_residencias: form.roubos_residencias,
      caixa_eletronico: form.caixa_eletronico,
      roubo_caixa_registradora: form.roubo_caixa_registradora,
      roubo_veiculo: form.roubo_veiculo,
      pinote_apoio: form.pinote_apoio,
      o11_disparo: form.o11_disparo,
      acoes_setada: form.acoes_setada,
      trafico_drogas: form.trafico_drogas,
      chamados_190: form.chamados_190,
      prisoes_bopm: form.prisoes_bopm || null,
      multas_descricao: form.multas_descricao || null,
      outras_ocorrencias: form.outras_ocorrencias || null,
      anexos_links: anexos.length ? anexos.map((a) => a.path).join("\n") : null,
    };


    const { error } = await supabase.rpc("submit_rso" as any, {
      _rso: rsoPayload,
      _aits: [],
    });

    setSubmitting(false);

    if (error) {
      toast({ title: "Erro ao enviar", description: error.message, variant: "destructive" });
      return;
    }

    localStorage.removeItem("patrol_timer_submitted_start");
    localStorage.removeItem("patrol_timer_submitted_end");
    setPatrolSession({ start: null, end: null });
    setSubmitted(true);
    toast({ title: "RSO Enviado", description: "Seu relatório foi registrado com sucesso." });
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const uploaded: { path: string; name: string; preview: string }[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("rso-anexos").upload(path, file, {
        contentType: file.type || undefined,
      });
      if (error) {
        toast({ title: "Erro no upload", description: `${file.name}: ${error.message}`, variant: "destructive" });
        continue;
      }
      uploaded.push({ path, name: file.name, preview: URL.createObjectURL(file) });
    }
    setAnexos((prev) => [...prev, ...uploaded]);
    setUploading(false);
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto mt-12 text-center space-y-4">
        <CheckCircle className="h-16 w-16 text-primary mx-auto" />
        <h2 className="font-display text-2xl font-bold uppercase">RSO Registrado</h2>
        <p className="text-muted-foreground">Seu relatório foi enviado e será analisado pelo comando.</p>
        <Button variant="outline" onClick={() => navigate("/")}>
          Voltar ao Início
        </Button>
      </div>
    );
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-1 mb-6">
      {STEPS.map((s, i) => {
        const Icon = s.icon;
        return (
          <div key={i} className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-display uppercase tracking-wider transition-colors ${i === step ? "bg-primary text-primary-foreground" : i < step ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>
            <Icon className="h-3 w-3" />
            <span className="hidden sm:inline">{s.title}</span>
          </div>
        );
      })}
    </div>
  );

  const renderStep0 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Unidade *</Label>
        <Select value={form.unidade} onValueChange={setUnidade}>
          <SelectTrigger className="bg-secondary border-border">
            <SelectValue placeholder="Selecione a unidade" />
          </SelectTrigger>
          <SelectContent>
            {UNIDADES.map((u) => (
              <SelectItem key={u.sigla} value={u.sigla}>
                {u.sigla} — {u.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {form.unidade ? (
        <>
          <HierarchySelect label="Responsável pelo RSO" value={form.responsavel_id} onChange={(v) => set("responsavel_id", v)} membros={membrosUnidade} required />
          {membrosUnidade.length === 0 && (
            <p className="text-xs text-muted-foreground">Nenhum efetivo cadastrado nesta unidade.</p>
          )}
        </>
      ) : (
        <p className="text-sm text-muted-foreground">Selecione a unidade para listar o efetivo disponível.</p>
      )}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">MODELO DA VIATURA *</Label>
          <Input value={form.prefixo_viatura} onChange={(e) => set("prefixo_viatura", e.target.value)} placeholder="Ex: Trail 21" className="bg-secondary border-border" />
        </div>
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Unidade</Label>
          <Input value={form.unidade} readOnly className="bg-secondary border-border opacity-80" />
        </div>
      </div>

      <div className="pt-4">
        <h3 className="font-display text-sm uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" /> Composição da Guarnição
        </h3>

        <label className="flex items-start gap-3 rounded-md border border-border bg-secondary/40 p-3 mb-4 cursor-pointer">
          <Checkbox checked={dejec} onCheckedChange={(c) => setDejec(c === true)} className="mt-0.5" />
          <span>
            <span className="block text-sm font-medium text-foreground">DEJEC</span>
            <span className="block text-xs text-muted-foreground">
              Operação conjunta — libera todos os policiais, de todas as unidades e hierarquias, nas posições abaixo.
            </span>
          </span>
        </label>

        <div className="space-y-3">
          <HierarchySelect label="Encarregado" value={form.encarregado_id} onChange={(v) => set("encarregado_id", v)} membros={membrosGuarnicao} required />
          <HierarchySelect label="Motorista" value={form.motorista_id} onChange={(v) => set("motorista_id", v)} membros={membrosGuarnicao} required />
          <HierarchySelect label="3° Homem" value={form.homem3_id} onChange={(v) => set("homem3_id", v)} membros={membrosGuarnicao} />
          <HierarchySelect label="4° Homem" value={form.homem4_id} onChange={(v) => set("homem4_id", v)} membros={membrosGuarnicao} />
          <HierarchySelect label="5° Homem" value={form.homem5_id} onChange={(v) => set("homem5_id", v)} membros={membrosGuarnicao} />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <PatrolTimer
        onStart={() => {}}
        onStop={(startTime, endTime) => {
          localStorage.setItem("patrol_timer_submitted_start", startTime);
          localStorage.setItem("patrol_timer_submitted_end", endTime);
          setPatrolSession({ start: startTime, end: endTime });
          toast({ title: "Patrulha finalizada", description: "Tempo registrado. Continue preenchendo o RSO." });
        }}
      />
      {!patrol.isRunning && localStorage.getItem("patrol_timer_submitted_start") && (
        <p className="text-center text-sm text-primary font-medium">✓ Tempo de patrulha registrado</p>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <p className="font-display text-xs uppercase tracking-widest text-primary mb-3">Entorpecentes</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CounterField label="Cocaína" value={form.ilicito_cocaina} onChange={(v) => set("ilicito_cocaina", v)} />
          <CounterField label="Ecstasy" value={form.ilicito_ecstasy} onChange={(v) => set("ilicito_ecstasy", v)} />
          <CounterField label="Cigarros" value={form.ilicito_cigarros} onChange={(v) => set("ilicito_cigarros", v)} />
        </div>
      </div>
      <div>
        <p className="font-display text-xs uppercase tracking-widest text-primary mb-3">Armamento</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CounterField label="Pistolas" value={form.ilicito_pistolas} onChange={(v) => set("ilicito_pistolas", v)} />
          <CounterField label="Fuzis" value={form.ilicito_fuzis} onChange={(v) => set("ilicito_fuzis", v)} />
          <CounterField label="Submetralhadoras" value={form.ilicito_submetralhadoras} onChange={(v) => set("ilicito_submetralhadoras", v)} />
        </div>
      </div>
      <div>
        <p className="font-display text-xs uppercase tracking-widest text-primary mb-3">Munições</p>
        <p className="text-xs text-muted-foreground mb-3">Digite as quantidades (ex: 60) e adicione linhas — o total é somado automaticamente.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AmmoField label="Mun. Pistola" value={form.ilicito_mun_pistola} onChange={(v) => set("ilicito_mun_pistola", v)} />
          <AmmoField label="Mun. Fuzil" value={form.ilicito_mun_fuzil} onChange={(v) => set("ilicito_mun_fuzil", v)} />
          <AmmoField label="Mun. Sub" value={form.ilicito_mun_sub} onChange={(v) => set("ilicito_mun_sub", v)} />
        </div>
      </div>
      <div>
        <p className="font-display text-xs uppercase tracking-widest text-primary mb-3">Equipamentos & Valores</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CounterField label="Lockpicks" value={form.ilicito_lockpicks} onChange={(v) => set("ilicito_lockpicks", v)} />
          <CounterField label="Bombas Caseiras" value={form.ilicito_bombas} onChange={(v) => set("ilicito_bombas", v)} />
          <CounterField label="Dinheiro Marcado" value={form.ilicito_dinheiro_marcado} onChange={(v) => set("ilicito_dinheiro_marcado", v)} />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Outros Ilícitos</Label>
        <Textarea value={form.outros_ilicitos} onChange={(e) => set("outros_ilicitos", e.target.value)} placeholder="Descreva outros itens apreendidos..." className="bg-secondary border-border min-h-[80px]" />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <CounterField label="Roubos à Residências" value={form.roubos_residencias} onChange={(v) => set("roubos_residencias", v)} />
      <CounterField label="Caixa Eletrônico" value={form.caixa_eletronico} onChange={(v) => set("caixa_eletronico", v)} />
      <CounterField label="Roubo Cx. Registradora" value={form.roubo_caixa_registradora} onChange={(v) => set("roubo_caixa_registradora", v)} />
      <CounterField label="Roubo de Veículo" value={form.roubo_veiculo} onChange={(v) => set("roubo_veiculo", v)} />
      <CounterField label="Pinote/Apoio" value={form.pinote_apoio} onChange={(v) => set("pinote_apoio", v)} />
      <CounterField label="O11 (Disparo)" value={form.o11_disparo} onChange={(v) => set("o11_disparo", v)} />
      <CounterField label="Ações Setada" value={form.acoes_setada} onChange={(v) => set("acoes_setada", v)} />
      <CounterField label="Tráfico de Drogas" value={form.trafico_drogas} onChange={(v) => set("trafico_drogas", v)} />
      <CounterField label="190" value={form.chamados_190} onChange={(v) => set("chamados_190", v)} />

      <div className="pt-4 space-y-4">
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Prisões (BOPM)</Label>
          <Textarea value={form.prisoes_bopm} onChange={(e) => set("prisoes_bopm", e.target.value)} placeholder="Descreva as prisões com BOPM..." className="bg-secondary border-border min-h-[60px]" />
        </div>
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Multas</Label>
          <Textarea value={form.multas_descricao} onChange={(e) => set("multas_descricao", e.target.value)} placeholder="Descreva as multas aplicadas..." className="bg-secondary border-border min-h-[60px]" />
        </div>
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Outras Ocorrências</Label>
          <Textarea value={form.outras_ocorrencias} onChange={(e) => set("outras_ocorrencias", e.target.value)} placeholder="Descreva outras ocorrências..." className="bg-secondary border-border min-h-[60px]" />
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Anexe as fotos obrigatórias dos ilícitos apreendidos (armas, munições, entorpecentes, dinheiro
        marcado, etc.). Selecione as imagens direto do seu computador.
      </p>
      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Fotos dos ilícitos *</Label>
        <Input
          type="file"
          accept="image/*"
          multiple
          disabled={uploading}
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
          className="bg-secondary border-border file:text-foreground file:mr-3 cursor-pointer"
        />
        {uploading && <p className="text-xs text-muted-foreground">Enviando arquivos...</p>}
      </div>
      {anexos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {anexos.map((a, i) => (
            <div key={a.path} className="rounded-md border border-border bg-secondary/50 overflow-hidden">
              <a href={a.preview} target="_blank" rel="noreferrer">
                <img src={a.preview} alt={a.name} className="h-24 w-full object-cover" />
              </a>
              <div className="p-2 space-y-1">
                <p className="text-[11px] truncate flex items-center gap-1">
                  <Paperclip className="h-3 w-3 text-primary shrink-0" />
                  <span className="truncate">{a.name}</span>
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-full text-[11px]"
                  onClick={() => setAnexos((prev) => prev.filter((_, idx) => idx !== i))}
                >
                  Remover
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const stepRenderers = [renderStep0, renderStep1, renderStep2, renderStep3, renderStep4, renderStep5];
  const StepIcon = STEPS[step].icon;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link to="/">
          <ArrowLeft className="mr-1 h-4 w-4" /> Voltar ao início
        </Link>
      </Button>
      <div>
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide">Novo RSO</h1>
        <p className="text-muted-foreground mt-1">Relatório de Serviço / Ocorrência</p>
      </div>

      {renderStepIndicator()}

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="font-display uppercase tracking-wide text-sm flex items-center gap-2">
            <StepIcon className="h-4 w-4 text-primary" />
            {STEPS[step].title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stepRenderers[step]()}

          <div className="flex justify-between mt-6 pt-4 border-t border-border">
            {step > 0 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                <ChevronLeft className="mr-1 h-4 w-4" /> Voltar
              </Button>
            ) : <div />}

            {step < STEPS.length - 1 ? (
              <Button onClick={() => setStep(step + 1)} disabled={!canNext()}>
                Próximo <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={submitting || patrol.isRunning} className="font-display uppercase tracking-widest">
                <Send className="mr-2 h-4 w-4" /> Finalizar e Enviar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Timer widget - appears on all steps when running or after finished */}
      {step !== 2 && (
        <>
          {patrol.isRunning ? (
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-card border border-border rounded-xl shadow-2xl px-6 py-3 flex items-center gap-4">
              <Timer className="h-5 w-5 text-primary animate-pulse" />
              <span className="font-mono text-lg font-bold text-foreground">{formatTime(patrol.elapsed)}</span>
              <Button size="sm" variant="destructive" onClick={() => {
                const result = patrol.stop();
                localStorage.setItem("patrol_timer_submitted_start", result.startTime);
                localStorage.setItem("patrol_timer_submitted_end", result.endTime);
                setPatrolSession({ start: result.startTime, end: result.endTime });
                toast({ title: "Patrulha finalizada", description: "Tempo registrado." });
              }} className="font-display uppercase tracking-wider text-xs">
                <Square className="mr-1 h-3 w-3" /> Finalizar
              </Button>
            </div>
          ) : patrolSession.start && patrolSession.end ? (
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-card border border-primary/30 rounded-xl shadow-2xl px-6 py-3 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-primary">
                <Timer className="h-5 w-5" />
                <span className="font-mono text-lg font-bold">{formatTime(recordedDurationSeconds)}</span>
              </div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Patrulha finalizada — tempo registrado</span>
              <Button size="sm" variant="outline" onClick={() => {
                localStorage.removeItem("patrol_timer_submitted_start");
                localStorage.removeItem("patrol_timer_submitted_end");
                setPatrolSession({ start: null, end: null });
                patrol.start();
                toast({ title: "Patrulha retomada", description: "A contagem foi reiniciada." });
              }} className="font-display uppercase tracking-wider text-xs">
                <Play className="mr-1 h-3 w-3" /> Retornar Patrulha
              </Button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

export default RsoNovo;

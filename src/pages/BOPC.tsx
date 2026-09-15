import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Copy, Check, X, IdCard, Car, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import logo from "@/assets/logo-forca-tatica.png";
import { MULTAS_CTB, SEV_META, type Severity } from "@/lib/ctb-multas";

type Membro = { nome: string; rg: string };
const membroVazio: Membro = { nome: "", rg: "" };

const D = "—";
const val = (v: string) => (v.trim() ? v.trim() : D);
const membroLinha = (m: Membro) => `${val(m.nome)} | ${val(m.rg)}`;

export default function BOPC() {
  const hoje = new Date();
  const [numero, setNumero] = useState("");
  const [data, setData] = useState(hoje.toISOString().slice(0, 10));
  const [hora, setHora] = useState(hoje.toTimeString().slice(0, 5));
  const [prefixo, setPrefixo] = useState("");
  const [motorista, setMotorista] = useState<Membro>(membroVazio);
  const [chefe, setChefe] = useState<Membro>(membroVazio);
  const [terceiro, setTerceiro] = useState<Membro>(membroVazio);
  const [quarto, setQuarto] = useState<Membro>(membroVazio);
  const [individuo, setIndividuo] = useState("");
  const [rgIndividuo, setRgIndividuo] = useState("");
  const [telIndividuo, setTelIndividuo] = useState("");
  const [busca, setBusca] = useState("");
  const [naturezas, setNaturezas] = useState<string[]>([]);
  const [local, setLocal] = useState("");
  const [descricao, setDescricao] = useState("");
  const [veiculo, setVeiculo] = useState("");
  const [materiais, setMateriais] = useState("");
  const [copiado, setCopiado] = useState(false);

  const grupos = useMemo(() => {
    const q = busca.trim().toLowerCase();
    const map = new Map<Severity, { key: string; label: string }[]>();
    MULTAS_CTB.forEach((m) => {
      const key = `${m.artigo} – ${m.titulo}`;
      if (q && !key.toLowerCase().includes(q) && !m.descricao.toLowerCase().includes(q)) return;
      const arr = map.get(m.severity) ?? [];
      if (!arr.some((i) => i.key === key)) arr.push({ key, label: key });
      map.set(m.severity, arr);
    });
    return Array.from(map.entries());
  }, [busca]);

  const toggle = (key: string) =>
    setNaturezas((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  const dataBR = data ? data.split("-").reverse().join("/") : D;

  const boletim = useMemo(
    () =>
      [
        `# BOPC Nº ${val(numero)}`,
        `BOLETIM DE OCORRÊNCIA — FORÇA TÁTICA PMESP`,
        ``,
        `DATA: ${dataBR}  HORA: ${hora || D}`,
        `PREFIXO: ${val(prefixo)}`,
        ``,
        `EQUIPE:`,
        `Motorista: ${membroLinha(motorista)}`,
        `Chefe: ${membroLinha(chefe)}`,
        `Terceiro: ${membroLinha(terceiro)}`,
        `Quarto: ${membroLinha(quarto)}`,
        ``,
        `INDIVÍDUO:`,
        `${val(individuo)}${rgIndividuo.trim() ? ` | RG: ${rgIndividuo.trim()}` : ""}${
          telIndividuo.trim() ? ` | TEL: ${telIndividuo.trim()}` : ""
        }`,
        ``,
        `NATUREZA DOS FATOS:`,
        naturezas.length ? naturezas.map((n) => `- ${n}`).join("\n") : D,
        ``,
        `LOCAL:`,
        val(local),
        ``,
        `DESCRIÇÃO:`,
        val(descricao),
        ``,
        `VEÍCULO:`,
        val(veiculo),
        ``,
        `MATERIAIS:`,
        val(materiais),
      ].join("\n"),
    [numero, dataBR, hora, prefixo, motorista, chefe, terceiro, quarto, individuo, rgIndividuo, telIndividuo, naturezas, local, descricao, veiculo, materiais]
  );

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(boletim);
      setCopiado(true);
      toast.success("Boletim copiado para o MDT");
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      toast.error("Não foi possível copiar");
    }
  };

  const MembroInputs = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: Membro;
    onChange: (m: Membro) => void;
  }) => (
    <div className="space-y-1.5">
      <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</Label>
      <div className="grid grid-cols-[1fr_100px] gap-2">
        <Input
          placeholder="Nome"
          value={value.nome}
          onChange={(e) => onChange({ ...value, nome: e.target.value })}
        />
        <Input
          placeholder="RG"
          value={value.rg}
          onChange={(e) => onChange({ ...value, rg: e.target.value })}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-sidebar text-sidebar-foreground border-b-2 border-primary">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Emblema da Força Tática" width={1024} height={1024} className="h-11 w-11 object-contain" />
            <span className="flex flex-col leading-tight">
              <span className="font-display text-base font-semibold tracking-wide">
                Força Tática · PMESP
              </span>
              <span className="text-[11px] text-sidebar-foreground/65">Polícia Militar do Estado de São Paulo</span>
            </span>
          </Link>
          <Button variant="ghost" size="sm" asChild className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
            <Link to="/"><ArrowLeft className="mr-1 h-4 w-4" />Voltar ao início</Link>
          </Button>
        </div>
      </header>

      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="font-display text-3xl uppercase text-primary">Boletim de Ocorrência</h1>
          <p className="text-sm text-muted-foreground mt-1">Preencha os campos e copie o boletim pronto para o MDT.</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-10 grid gap-6 lg:grid-cols-2 items-start">
        {/* Formulário */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <IdCard className="h-4 w-4 text-primary" /> Identificação
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Nº BOPC</Label>
                <Input value={numero} onChange={(e) => setNumero(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Data</Label>
                <Input type="date" value={data} onChange={(e) => setData(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Horário</Label>
                <Input type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Car className="h-4 w-4 text-primary" /> Unidade &amp; Equipe
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Prefixo da Viatura</Label>
                <Input value={prefixo} onChange={(e) => setPrefixo(e.target.value)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <MembroInputs label="Motorista" value={motorista} onChange={setMotorista} />
                <MembroInputs label="Chefe da Equipe" value={chefe} onChange={setChefe} />
                <MembroInputs label="Terceiro Homem" value={terceiro} onChange={setTerceiro} />
                <MembroInputs label="Quarto Homem" value={quarto} onChange={setQuarto} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-primary" /> Ocorrência
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Indivíduo</Label>
                <Input placeholder="Nome completo" value={individuo} onChange={(e) => setIndividuo(e.target.value)} />
                <div className="grid gap-2 sm:grid-cols-2">
                  <Input placeholder="RG" value={rgIndividuo} onChange={(e) => setRgIndividuo(e.target.value)} />
                  <Input placeholder="Telefone" value={telIndividuo} onChange={(e) => setTelIndividuo(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Natureza dos Fatos</Label>
                {naturezas.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {naturezas.map((n) => (
                      <Badge key={n} variant="secondary" className="gap-1">
                        {n}
                        <button type="button" onClick={() => toggle(n)} aria-label={`Remover ${n}`}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <Input placeholder="Buscar artigo" value={busca} onChange={(e) => setBusca(e.target.value)} />
                <div className="max-h-64 overflow-y-auto rounded-md border bg-muted/30 p-2 space-y-3">
                  {grupos.map(([sev, itens]) => (
                    <div key={sev}>
                      <p className="px-1 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {SEV_META[sev].label}
                      </p>
                      <div className="space-y-0.5">
                        {itens.map((i) => {
                          const ativo = naturezas.includes(i.key);
                          return (
                            <button
                              key={i.key}
                              type="button"
                              onClick={() => toggle(i.key)}
                              className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm transition-colors ${
                                ativo ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                              }`}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full ${SEV_META[sev].dot}`} />
                              {i.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  {grupos.length === 0 && (
                    <p className="px-2 py-4 text-center text-sm text-muted-foreground">Nenhum artigo encontrado.</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Local</Label>
                <Input value={local} onChange={(e) => setLocal(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Descrição</Label>
                <Textarea rows={5} value={descricao} onChange={(e) => setDescricao(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Veículo</Label>
                <Input placeholder="Modelo / cor / placa" value={veiculo} onChange={(e) => setVeiculo(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Materiais Ilícitos</Label>
                <Textarea rows={3} value={materiais} onChange={(e) => setMateriais(e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Prévia */}
        <div className="lg:sticky lg:top-6">
          <div className="relative rounded-xl bg-primary p-6 text-primary-foreground shadow-elevated">
            <Button size="sm" onClick={copiar} className="absolute right-4 top-4 bg-emerald-600 text-white hover:bg-emerald-700">
              {copiado ? <Check className="mr-1 h-4 w-4" /> : <Copy className="mr-1 h-4 w-4" />}
              Copiar MDT
            </Button>
            <pre className="whitespace-pre-wrap font-mono text-[13px] leading-6 pr-28">{boletim}</pre>
          </div>
        </div>
      </main>
    </div>
  );
}

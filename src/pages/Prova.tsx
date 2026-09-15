import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollText, ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import logoForcaTatica from "@/assets/logo-forca-tatica.png";
import {
  QUESTOES_PARTE_1,
  QUESTOES_PARTE_2,
  QUESTOES_DISSERTATIVAS,
  QUESTOES_OBJETIVAS,
  PERIODOS,
  corrigirObjetivas,
  type ProvaQuestao,
} from "@/lib/prova";

const STEPS = ["Identificação", "Prova Objetiva I", "Prova Objetiva II"];

function Questao({
  q,
  value,
  onChange,
}: {
  q: ProvaQuestao;
  value?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="border-t border-border/60 pt-5">
      <p className="font-medium text-[15px]">
        {q.n}. {q.enunciado} <span className="text-destructive">*</span>
      </p>
      <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mt-1">
        1 ponto
      </p>
      <RadioGroup value={value ?? ""} onValueChange={onChange} className="mt-3 space-y-2">
        {q.opcoes.map((op) => (
          <label
            key={op}
            className="flex items-start gap-3 rounded-md border border-border/60 px-3 py-2 cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <RadioGroupItem value={op} className="mt-0.5" />
            <span className="text-sm text-muted-foreground">{op}</span>
          </label>
        ))}
      </RadioGroup>
    </div>
  );
}

export default function Prova() {
  const [step, setStep] = useState(0);
  const [enviado, setEnviado] = useState(false);
  const [saving, setSaving] = useState(false);

  const [nomeId, setNomeId] = useState("");
  const [discordId, setDiscordId] = useState("");
  const [idade, setIdade] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [respostas, setRespostas] = useState<Record<string, string>>({});

  const set = (k: string, v: string) => setRespostas((p) => ({ ...p, [k]: v }));

  const validarStep = () => {
    if (step === 0) {
      if (!nomeId.trim() || !discordId.trim() || !idade.trim() || !periodo) {
        toast.error("Preencha todos os campos obrigatórios.");
        return false;
      }
      return true;
    }
    if (step === 1) {
      const faltando = QUESTOES_PARTE_1.filter((q) => !respostas[`q${q.n}`]);
      if (faltando.length) {
        toast.error(`Responda todas as questões (faltam ${faltando.length}).`);
        return false;
      }
      return true;
    }
    const faltandoObj = QUESTOES_PARTE_2.filter((q) => !respostas[`q${q.n}`]);
    const faltandoDis = QUESTOES_DISSERTATIVAS.filter((q) => !respostas[`q${q.n}`]?.trim());
    if (faltandoObj.length || faltandoDis.length) {
      toast.error("Responda todas as questões desta aba.");
      return false;
    }
    return true;
  };

  const avancar = () => {
    if (!validarStep()) return;
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const voltar = () => {
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const enviar = async () => {
    if (!validarStep()) return;
    setSaving(true);
    const acertos = corrigirObjetivas(respostas);
    const { error } = await supabase.from("prova_inscricoes").insert({
      nome_id: nomeId.trim(),
      discord_id: discordId.trim(),
      idade_real: idade.trim(),
      periodo,
      respostas,
      acertos,
      total_objetivas: QUESTOES_OBJETIVAS.length,
      status: "pendente",
    });
    setSaving(false);
    if (error) {
      toast.error("Erro ao enviar a prova. Tente novamente.");
      return;
    }
    setEnviado(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      <div className="absolute inset-0 bg-tactical-grid opacity-[0.05] pointer-events-none" />

      <header className="relative z-10 bg-sidebar text-sidebar-foreground border-b-2 border-primary">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logoForcaTatica}
              alt="Emblema da Força Tática"
              width={1024}
              height={1024}
              className="h-11 w-11 object-contain"
            />
            <span className="flex flex-col leading-tight">
              <span className="font-display text-base font-semibold tracking-wide">
                Força Tática · PMESP
              </span>
              <span className="text-[11px] text-primary-foreground/70">
                Processo Seletivo — ACADEPOL
              </span>
            </span>
          </Link>
          <BackButton variant="light" />
        </div>
      </header>

      <main className="relative z-10 flex-1 px-6 lg:px-10 py-12 max-w-3xl mx-auto w-full">
        {enviado ? (
          <Card className="bg-card/70 backdrop-blur-md border-border/60">
            <CardContent className="p-10 text-center space-y-4">
              <CheckCircle2 className="h-12 w-12 mx-auto text-primary" />
              <h1 className="font-display text-2xl uppercase tracking-tight">
                Prova enviada com sucesso
              </h1>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                 Sua prova foi encaminhada ao setor administrativo da Força Tática para correção e
                análise. O resultado será divulgado pelos canais oficiais.
              </p>
              <Button asChild variant="outline">
                <Link to="/">Voltar ao início</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center gap-2 text-primary mb-2">
              <ScrollText className="h-4 w-4" />
              <span className="font-mono text-[11px] uppercase tracking-[0.3em]">
                 Processo Seletivo PMESP
              </span>
            </div>
            <h1 className="font-display text-3xl uppercase tracking-tight">Prova Objetiva</h1>

            <div className="mt-6 flex gap-2">
              {STEPS.map((s, i) => (
                <div
                  key={s}
                  className={`flex-1 rounded-md border px-3 py-2 text-center text-[11px] font-mono uppercase tracking-wider ${
                    i === step
                      ? "border-primary bg-primary/10 text-primary"
                      : i < step
                        ? "border-border/60 text-muted-foreground"
                        : "border-border/40 text-muted-foreground/60"
                  }`}
                >
                  {s}
                </div>
              ))}
            </div>

            <Card className="mt-6 bg-card/70 backdrop-blur-md border-border/60">
              <CardContent className="p-8 space-y-6">
                {step === 0 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>
                        NOME E ID NA CIDADE <span className="text-destructive">*</span>
                      </Label>
                      <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                        1 ponto
                      </p>
                      <Input value={nomeId} onChange={(e) => setNomeId(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>
                        ID DO DISCORD <span className="text-destructive">*</span>
                      </Label>
                      <Input value={discordId} onChange={(e) => setDiscordId(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>
                        IDADE REAL <span className="text-destructive">*</span>
                      </Label>
                      <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                        1 ponto
                      </p>
                      <Input value={idade} onChange={(e) => setIdade(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>
                        QUAL PERÍODO CONSEGUE ENTRAR COM MAIS FREQUÊNCIA?{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                        1 ponto
                      </p>
                      <RadioGroup value={periodo} onValueChange={setPeriodo} className="space-y-2">
                        {PERIODOS.map((p) => (
                          <label
                            key={p}
                            className="flex items-center gap-3 rounded-md border border-border/60 px-3 py-2 cursor-pointer hover:bg-muted/50 transition-colors"
                          >
                            <RadioGroupItem value={p} />
                            <span className="text-sm text-muted-foreground">{p}</span>
                          </label>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-5">
                    <h2 className="font-display text-lg uppercase tracking-wide text-primary">
                       Prova Objetiva - PMESP
                    </h2>
                    {QUESTOES_PARTE_1.map((q) => (
                      <Questao
                        key={q.n}
                        q={q}
                        value={respostas[`q${q.n}`]}
                        onChange={(v) => set(`q${q.n}`, v)}
                      />
                    ))}
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-5">
                    <h2 className="font-display text-lg uppercase tracking-wide text-primary">
                       Prova Objetiva - PMESP
                    </h2>
                    {QUESTOES_PARTE_2.map((q) => (
                      <Questao
                        key={q.n}
                        q={q}
                        value={respostas[`q${q.n}`]}
                        onChange={(v) => set(`q${q.n}`, v)}
                      />
                    ))}
                    {QUESTOES_DISSERTATIVAS.map((q) => (
                      <div key={q.n} className="border-t border-border/60 pt-5 space-y-2">
                        <p className="font-medium text-[15px]">
                          {q.n}. {q.enunciado} <span className="text-destructive">*</span>
                        </p>
                        <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                          1 ponto
                        </p>
                        <Textarea
                          rows={4}
                          value={respostas[`q${q.n}`] ?? ""}
                          onChange={(e) => set(`q${q.n}`, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between border-t border-border/60 pt-6">
                  <Button variant="outline" onClick={voltar} disabled={step === 0}>
                    <ChevronLeft className="mr-1 h-4 w-4" /> Voltar
                  </Button>
                  {step < 2 ? (
                    <Button onClick={avancar}>
                      Próxima <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button onClick={enviar} disabled={saving}>
                      {saving ? "Enviando..." : "Finalizar prova"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>

      <footer className="relative z-10 border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
         Força Tática · Polícia Militar do Estado de São Paulo
      </footer>
    </div>
  );
}

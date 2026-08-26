import { useState } from "react";
import { z } from "zod";
import { ShieldAlert, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const CATEGORIAS = [
  "Abuso de autoridade",
  "Corrupção / propina",
  "Conduta inadequada de servidor",
  "Uso indevido de recursos públicos",
  "Prevaricação / omissão",
  "Outros",
];

const schema = z.object({
  anonima: z.boolean(),
  nome: z.string().trim().max(120, "Nome muito longo").optional(),
  contato: z.string().trim().max(160, "Contato muito longo").optional(),
  discord: z.string().trim().max(100, "Discord muito longo").optional(),
  telefone: z.string().trim().max(40, "Telefone muito longo").optional(),
  categoria: z.string().trim().min(1, "Selecione a categoria"),
  unidade_envolvida: z.string().trim().max(120).optional(),
  local_fato: z.string().trim().max(200).optional(),
  data_fato: z.string().optional(),
  descricao: z
    .string()
    .trim()
    .min(20, "Descreva os fatos com pelo menos 20 caracteres")
    .max(4000, "Máximo de 4000 caracteres"),
});

const Denuncia = () => {
  const [anonima, setAnonima] = useState(true);
  const [form, setForm] = useState({
    nome: "",
    contato: "",
    categoria: "",
    unidade_envolvida: "",
    local_fato: "",
    data_fato: "",
    descricao: "",
  });
  const [loading, setLoading] = useState(false);
  const [protocolo, setProtocolo] = useState<string | null>(null);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ ...form, anonima });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const d = parsed.data;
    const { data, error } = await supabase
      .from("denuncias")
      .insert({
        anonima,
        nome: anonima ? null : d.nome || null,
        contato: anonima ? null : d.contato || null,
        categoria: d.categoria,
        unidade_envolvida: d.unidade_envolvida || null,
        local_fato: d.local_fato || null,
        data_fato: d.data_fato || null,
        descricao: d.descricao,
      })
      .select("protocolo")
      .single();
    setLoading(false);

    if (error) {
      toast.error("Não foi possível registrar a denúncia. Tente novamente.");
      return;
    }
    setProtocolo(data?.protocolo ?? null);
  };

  return (
    <>
      <main className="max-w-4xl mx-auto px-6 py-12 w-full">
        <div className="flex items-start gap-4">
          <span className="rounded-lg bg-primary/10 p-3 text-primary">
            <ShieldAlert className="h-7 w-7" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold text-primary">
              Faça uma denúncia — Corregedoria da Polícia Civil
            </h1>
            <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
              Canal direto com a CORREGEPOL para comunicar desvios de conduta, abuso de autoridade
              ou irregularidades praticadas por servidores. A denúncia pode ser anônima e será
              apurada com sigilo.
            </p>
          </div>
        </div>

        {protocolo ? (
          <div className="mt-10 rounded-lg border border-border bg-card p-8 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
            <h2 className="mt-4 font-display text-xl font-bold text-primary">
              Denúncia registrada
            </h2>
            <p className="mt-2 text-[14px] text-muted-foreground">
              Guarde o número de protocolo para acompanhamento junto à Corregedoria.
            </p>
            <p className="mt-4 font-mono text-2xl font-bold tracking-widest text-primary">
              {protocolo}
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-10 space-y-6 rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between rounded-md border border-border bg-secondary p-4">
              <div>
                <Label className="text-[14px]">Denúncia anônima</Label>
                <p className="text-[12px] text-muted-foreground">
                  Se desativado, seus dados serão vistos apenas pela Corregedoria.
                </p>
              </div>
              <Switch checked={anonima} onCheckedChange={setAnonima} />
            </div>

            {!anonima && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input id="nome" maxLength={120} value={form.nome} onChange={(e) => set("nome", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contato">E-mail ou telefone</Label>
                  <Input id="contato" maxLength={160} value={form.contato} onChange={(e) => set("contato", e.target.value)} />
                </div>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Categoria *</Label>
                <Select value={form.categoria} onValueChange={(v) => set("categoria", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIAS.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="unidade">Unidade / departamento envolvido</Label>
                <Input
                  id="unidade"
                  maxLength={120}
                  placeholder="Ex: DOPE / GARRA"
                  value={form.unidade_envolvida}
                  onChange={(e) => set("unidade_envolvida", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="local">Local do fato</Label>
                <Input id="local" maxLength={200} value={form.local_fato} onChange={(e) => set("local_fato", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data">Data do fato</Label>
                <Input id="data" type="date" value={form.data_fato} onChange={(e) => set("data_fato", e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição dos fatos *</Label>
              <Textarea
                id="descricao"
                rows={7}
                maxLength={4000}
                placeholder="Relate o que aconteceu, com o máximo de detalhes possível."
                value={form.descricao}
                onChange={(e) => set("descricao", e.target.value)}
              />
              <p className="text-[12px] text-muted-foreground">{form.descricao.length}/4000</p>
            </div>

            <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto">
              <Send className="mr-2 h-4 w-4" />
              {loading ? "Enviando..." : "Enviar denúncia"}
            </Button>
          </form>
        )}
      </main>
    </>
  );
};

export default Denuncia;

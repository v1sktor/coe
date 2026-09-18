import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Shirt, Car, Image as ImageIcon } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import logo from "@/assets/logo-4bpchq.png";

interface FrotaItem {
  id: string;
  categoria: string;
  nome: string;
  descricao: string | null;
  imagem_url: string | null;
  ordem: number;
}

function Grid({ itens }: { itens: FrotaItem[] }) {
  if (itens.length === 0) {
    return <p className="text-muted-foreground text-sm py-8 text-center">Nenhum item cadastrado ainda.</p>;
  }
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {itens.map((item) => (
        <Card key={item.id} className="bg-card/70 backdrop-blur-md border-border/60 overflow-hidden">
          <div className="aspect-[4/3] bg-secondary flex items-center justify-center overflow-hidden">
            {item.imagem_url ? (
              <img src={item.imagem_url} alt={item.nome} className="h-full w-full object-cover" />
            ) : (
              <ImageIcon className="h-10 w-10 text-muted-foreground" />
            )}
          </div>
          <CardContent className="p-5">
            <h3 className="font-display text-base uppercase tracking-wide">{item.nome}</h3>
            {item.descricao && (
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.descricao}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function FardamentosViaturas() {
  const [itens, setItens] = useState<FrotaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("frota_itens")
      .select("*")
      .order("ordem", { ascending: true })
      .order("nome", { ascending: true })
      .then(({ data }) => {
        setItens(data ?? []);
        setLoading(false);
      });
  }, []);

  const fardamentos = itens.filter((i) => i.categoria === "fardamento");
  const viaturas = itens.filter((i) => i.categoria === "viatura");

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      <div className="absolute inset-0 bg-tactical-grid opacity-[0.05] pointer-events-none" />

      <header className="relative z-10 bg-sidebar text-sidebar-foreground border-b-2 border-primary">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Emblema do 4º BPChq COE/GATE" width={1024} height={1024} className="h-11 w-11 object-contain" />
            <span className="flex flex-col leading-tight">
              <span className="font-display text-base font-semibold tracking-wide">
                4º BPChq COE/GATE
              </span>
              <span className="text-[11px] text-primary-foreground/70">
                Polícia Militar do Estado de São Paulo
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <BackButton variant="light" />
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 px-6 lg:px-10 py-10 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2 text-primary mb-2">
          <Shirt className="h-4 w-4" />
          <span className="font-mono text-[11px] uppercase tracking-[0.3em]">Equipamento</span>
        </div>
        <h1 className="font-display text-3xl md:text-5xl uppercase tracking-tight">
          Fardamentos e Viaturas
        </h1>
        <p className="mt-2 text-muted-foreground text-sm">
          Uniformes, equipamentos e viaturas em uso pelo 4º BPChq COE/GATE.
        </p>

        <Tabs defaultValue="fardamentos" className="mt-8">
          <TabsList>
            <TabsTrigger value="fardamentos" className="gap-2">
              <Shirt className="h-4 w-4" /> Fardamentos ({fardamentos.length})
            </TabsTrigger>
            <TabsTrigger value="viaturas" className="gap-2">
              <Car className="h-4 w-4" /> Viaturas ({viaturas.length})
            </TabsTrigger>
          </TabsList>

          {loading ? (
            <p className="text-muted-foreground text-sm py-8 text-center">Carregando...</p>
          ) : (
            <>
              <TabsContent value="fardamentos" className="mt-6">
                <Grid itens={fardamentos} />
              </TabsContent>
              <TabsContent value="viaturas" className="mt-6">
                <Grid itens={viaturas} />
              </TabsContent>
            </>
          )}
        </Tabs>
      </main>

      <footer className="relative z-10 border-t border-border/60 py-6 text-center text-xs text-muted-foreground space-y-1">
        <p>4º BPChq COE/GATE · Polícia Militar do Estado de São Paulo</p>
        <p className="text-muted-foreground/60">
          Conteúdo fictício destinado ao uso exclusivo no servidor de FiveM RP.
        </p>
      </footer>
    </div>
  );
}

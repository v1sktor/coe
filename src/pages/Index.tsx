import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Lock, Network, ScrollText, Settings, Megaphone, FileText, ChevronRight, ShieldAlert } from "lucide-react";
import logo from "@/assets/logo-pcsp.png";
import heroBanner from "@/assets/ger-hero.jpg";
import { supabase } from "@/integrations/supabase/client";
import { UNIDADES } from "@/lib/unidades";

const Index = () => {
  const now = new Date();
  const [ind, setInd] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    (supabase.rpc as any)("get_rso_indicadores").then(({ data }: { data: Record<string, number> | null }) => {
      if (data) setInd(data);
    });
  }, []);

  const fmt = (key: string) => {
    const v = ind?.[key];
    return typeof v === "number" && v > 0 ? v.toLocaleString("pt-BR") : "—";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Barra superior institucional */}
      <header className="bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="Brasão da Polícia Civil do Estado de São Paulo"
              className="h-9 w-9 object-contain"
            />
            <span className="flex flex-col leading-tight">
              <span className="font-display text-base font-semibold tracking-wide">
                Polícia Civil do Estado de São Paulo
              </span>
              <span className="text-[11px] text-primary-foreground/70">
                Secretaria da Segurança Pública
              </span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium">
            <TopLink to="/" label="Início" />
            <TopLink to="/hierarquia" label="Efetivo" />
            <TopLink to="/ccomsoc" label="Comunicação" />
            <TopLink to="/ctb" label="Código Penal" />
            <TopLink to="/institucional" label="Institucional" />
            <TopLink to="/cursos" label="Cursos" />
            <TopLink to="/edital" label="Edital PCESP" />
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-background">
        <div className="max-w-6xl mx-auto px-6 py-16 grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary leading-tight">
              Portal da Polícia Civil
            </h1>
            <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground max-w-xl">
              Portal oficial da Polícia Civil do Estado de São Paulo, destinado à divulgação de
              informações institucionais, comunicados, relatórios operacionais e serviços das
              unidades especializadas.
            </p>
            <div className="mt-8 grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
              <Button asChild size="lg" className="w-full font-medium">
                <Link to="/ctb">
                  BOPC/BIC <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full font-medium">
                <Link to="/rso/novo">Relatório de Diligências</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full font-medium sm:col-span-2">
                <Link to="/edital">Edital PCESP</Link>
              </Button>
            </div>

          </div>

          <div className="overflow-hidden rounded-xl shadow-elevated">
            <img
              src={heroBanner}
              alt="Viaturas e equipes da Polícia Civil do Estado de São Paulo"
              width={1200}
              height={800}
              className="w-full h-[320px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Denúncia - Corregepol */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <span className="rounded-lg bg-primary-foreground/10 p-3">
              <ShieldAlert className="h-7 w-7" />
            </span>
            <div>
              <h2 className="font-display text-xl font-bold">Faça uma denúncia</h2>
              <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-primary-foreground/75">
                Canal direto com a Corregedoria da Polícia Civil (CORREGEPOL) para comunicar
                desvios de conduta e irregularidades. Pode ser anônima e é tratada com sigilo.
              </p>
            </div>
          </div>
          <Button asChild size="lg" variant="secondary" className="font-medium shrink-0">
            <Link to="/denuncia">
              Registrar denúncia <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Departamentos */}
      <section className="bg-secondary border-y border-border">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <img src={logo} alt="" aria-hidden className="h-16 w-16 object-contain mx-auto" />
          <h2 className="mt-6 font-display text-xl font-bold text-primary">
            Departamentos, Divisões e Delegacias
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-left">
            {UNIDADES.map((u) => (
              <div
                key={u.sigla}
                className="rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-tactical"
              >
                <span className="font-display text-lg font-bold text-primary">{u.sigla}</span>
                <p className="mt-1 text-[12px] font-medium text-primary-glow">{u.nome}</p>
                <p className="mt-2 text-[13px] leading-snug text-muted-foreground">{u.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section className="max-w-6xl mx-auto px-6 py-16 w-full">
        <h2 className="font-display text-xl font-bold text-primary text-center">Serviços institucionais</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ServiceCard to="/hierarquia" icon={Network} title="Hierarquia" desc="Estrutura de comando e efetivo das unidades." />
          <ServiceCard to="/rso/novo" icon={FileText} title="RSO" desc="Registro de resultado de serviço operacional." />
          <ServiceCard to="/ccomsoc" icon={Megaphone} title="Comunicação" desc="Notícias, comunicados e releases oficiais." />
          <ServiceCard to="/diretrizes" icon={ScrollText} title="Diretrizes" desc="Manuais internos, normas e procedimentos." />
        </div>
      </section>

      {/* Indicadores */}
      <section className="bg-secondary border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="font-display text-xl font-bold text-primary text-center">
            Indicadores operacionais consolidados
          </h2>
          <p className="mt-2 text-center text-[13px] text-muted-foreground">
            Totais apurados a partir dos relatórios de serviço operacional aprovados.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-primary">
                Ilícitos apreendidos
              </h3>
              <div className="mt-3 grid grid-cols-2 gap-x-8">
                <IndItem label="Cocaína" value={fmt("cocaina")} />
                <IndItem label="Ecstasy" value={fmt("ecstasy")} />
                <IndItem label="Cigarros" value={fmt("cigarros")} />
                <IndItem label="Pistolas" value={fmt("pistolas")} />
                <IndItem label="Fuzis" value={fmt("fuzis")} />
                <IndItem label="Submetralhadoras" value={fmt("submetralhadoras")} />
                <IndItem label="Mun. Pistola" value={fmt("mun_pistola")} />
                <IndItem label="Mun. Fuzil" value={fmt("mun_fuzil")} />
                <IndItem label="Mun. Sub" value={fmt("mun_sub")} />
                <IndItem label="Lockpicks" value={fmt("lockpicks")} />
                <IndItem label="Bombas Caseiras" value={fmt("bombas_caseiras")} />
                <IndItem label="Dinheiro Marcado" value={fmt("dinheiro_marcado")} />
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-primary">
                Ocorrências
              </h3>
              <div className="mt-3 grid grid-cols-2 gap-x-8">
                <IndItem label="Chamados" value={fmt("chamados_190")} />
                <IndItem label="Roubo Cx. Eletrônico" value={fmt("roubo_caixa_eletronico")} />
                <IndItem label="Roubo Cx. Registr." value={fmt("roubo_caixa_registradora")} />
                <IndItem label="Roubo Residência" value={fmt("roubo_residencia")} />
                <IndItem label="Roubo Veículos" value={fmt("roubo_veiculos")} />
                <IndItem label="Apoios" value={fmt("apoios")} />
                <IndItem label="Tráfico" value={fmt("trafico")} />
                <IndItem label="Ações" value={fmt("acoes")} />
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link to="/admin/usuarios">
                <Settings className="mr-2 h-4 w-4" /> Administração
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="bg-primary text-primary-foreground mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[12px]">
          <span>© Polícia Civil do Estado de São Paulo — {now.getFullYear()}</span>
          <span className="text-primary-foreground/70">Portal institucional · Acesso restrito a servidores</span>
        </div>
      </footer>
    </div>
  );
};

const TopLink = ({ to, label }: { to: string; label: string }) => (
  <Link to={to} className="text-primary-foreground/85 hover:text-primary-foreground transition-colors">
    {label}
  </Link>
);

const IndItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between gap-2 border-b border-border py-1.5 font-mono text-[11px]">
    <span className="text-muted-foreground truncate">{label}</span>
    <span className={value === "—" ? "text-muted-foreground/60" : "text-primary font-semibold"}>{value}</span>
  </div>
);

const ServiceCard = ({ to, icon: Icon, title, desc }: { to: string; icon: any; title: string; desc: string }) => (
  <Link
    to={to}
    className="group rounded-lg border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-tactical"
  >
    <Icon className="h-5 w-5 text-primary-glow" />
    <span className="mt-3 block font-display text-[15px] font-semibold text-primary">{title}</span>
    <span className="mt-1 block text-[13px] leading-snug text-muted-foreground">{desc}</span>
  </Link>
);

export default Index;

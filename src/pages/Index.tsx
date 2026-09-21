import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Anchor, Network, ScrollText, Settings, Megaphone, FileText, ChevronRight, ShieldAlert, Siren, LogIn, Shirt } from "lucide-react";
import heroBanner from "@/assets/forca-tatica-hero.jpg";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo-4bpchq.png";

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
      <header className="sticky top-0 z-30 bg-sidebar/95 backdrop-blur-md text-sidebar-foreground border-b border-sidebar-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 min-h-20 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="Emblema da Marinha do Brasil"
              width={1024}
              height={1024}
              className="h-14 w-14 object-contain"
            />
            <span className="flex flex-col leading-tight">
              <span className="font-display text-lg uppercase">
                Vida Carioca
              </span>
              <span className="text-[11px] uppercase tracking-[0.15em] text-sidebar-foreground/60">
                Marinha do Brasil
              </span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-[13px] font-semibold uppercase tracking-wide">
            <TopLink to="/" label="Início" />
            <TopLink to="/ccomsoc" label="Comunicação" />
            <TopLink to="/ctb" label="Código Penal" />
            <TopLink to="/institucional" label="Institucional" />
            <TopLink to="/cursos" label="Cursos" />
            <TopLink to="/edital" label="Edital" />
            <Button asChild size="sm" variant="secondary" className="font-semibold uppercase">
              <Link to="/login"><LogIn className="mr-2 h-4 w-4" />Acesso</Link>
            </Button>
          </nav>
        </div>
        <div className="gold-divider h-[2px] w-full" />
      </header>

      <main>
      {/* Hero em tela cheia */}
      <section className="relative min-h-[640px] flex items-end overflow-hidden bg-sidebar">
        <img
          src={heroBanner}
          alt="Navios da Marinha do Brasil em operação"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sidebar via-sidebar/75 to-sidebar/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-sidebar/80 via-sidebar/10 to-transparent" />
        <Anchor className="absolute -right-10 -top-10 h-[420px] w-[420px] text-primary/[0.06] rotate-[8deg] pointer-events-none" strokeWidth={0.6} />

        <div className="absolute top-6 right-6 flex items-center gap-2 rounded-full bg-sidebar/80 backdrop-blur-sm px-4 py-2 text-xs font-semibold uppercase tracking-wide text-sidebar-foreground border border-primary/30">
          <Siren className="h-4 w-4 text-primary" /> Operacional
        </div>

        <div className="relative z-10 max-w-6xl mx-auto w-full px-6 sm:px-10 pb-14 pt-32">
          <div className="max-w-2xl">
            <div className="mb-5 flex items-center gap-3 text-primary">
              <span className="h-px w-12 bg-primary" />
              <span className="font-semibold text-xs uppercase tracking-[0.25em]">Marinha do Brasil</span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl uppercase leading-[0.95] text-sidebar-foreground text-glow-gold">
              Vida Carioca
            </h1>
            <p className="mt-4 font-display text-lg sm:text-xl uppercase tracking-[0.15em] text-primary">
              Marinha do Brasil
            </p>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-sidebar-foreground/70">
              Portal operacional para registros, comunicações institucionais e serviços de apoio ao efetivo.
            </p>
            <div className="mt-9 grid w-full max-w-lg grid-cols-1 gap-3 sm:grid-cols-2">
              <Button asChild size="lg" className="w-full font-semibold uppercase shadow-gold">
                <Link to="/bopc">
                  BON <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full font-semibold uppercase border-sidebar-border bg-sidebar-accent/80 backdrop-blur-sm text-sidebar-accent-foreground hover:bg-secondary hover:text-secondary-foreground">
                <Link to="/rso/novo">RSO</Link>
              </Button>
              <Button asChild size="lg" className="w-full font-semibold uppercase bg-white text-black hover:bg-white/90 sm:col-span-2">
                <Link to="/edital">Edital Marinha do Brasil</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <svg className="wave-divider -mt-px" viewBox="0 0 1200 48" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 24c60 0 60-16 120-16s60 16 120 16 60-16 120-16 60 16 120 16 60-16 120-16 60 16 120 16 60-16 120-16 60 16 120 16 60-16 120-16 60 16 120 16v24H0z" fill="hsl(var(--background))" />
      </svg>

      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 py-14 w-full">
        <div className="grid gap-5 md:grid-cols-3">
          <QuickCard
            icon={ShieldAlert}
            title="Canal de denúncia"
            desc="Comunique desvios de conduta e irregularidades com sigilo."
            to="/denuncia"
            cta="Registrar denúncia"
            tone="accent"
          />
          <QuickCard
            icon={Shirt}
            title="Fardamentos e viaturas"
            desc="Uniformes, equipamentos e viaturas em uso pela tropa."
            to="/frota"
            cta="Ver catálogo"
          />
          <QuickCard
            icon={Settings}
            title="Administração"
            desc="Área restrita para gestão operacional do portal."
            to="/login"
            cta="Acessar sistema"
          />
        </div>

        <div className="mt-14 flex items-center gap-4">
          <Anchor className="h-4 w-4 text-primary" />
          <h2 className="font-display text-lg uppercase tracking-wide text-foreground">Serviços operacionais</h2>
          <div className="h-px flex-1 gold-divider" />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ServiceCard to="/hierarquia" icon={Network} title="Hierarquia" desc="Estrutura de comando e efetivo das unidades." />
          <ServiceCard to="/rso/novo" icon={FileText} title="RSO" desc="Relatório de Serviço Operacional." />
          <ServiceCard to="/ccomsoc" icon={Megaphone} title="Comunicação" desc="Notícias, comunicados e releases oficiais." />
          <ServiceCard to="/diretrizes" icon={ScrollText} title="Diretrizes" desc="Manuais internos, normas e procedimentos." />
        </div>
      </section>

      {/* Indicadores */}
      <section className="relative bg-secondary border-y border-border bg-wave-pattern">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="font-display text-xl font-bold text-primary text-center">
            Indicadores operacionais
          </h2>
          <p className="mt-2 text-center text-[13px] text-muted-foreground">
            Totais apurados a partir dos relatórios de serviço operacional aprovados.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-6 shadow-tactical">
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

            <div className="rounded-xl border border-border bg-card p-6 shadow-tactical">
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
      </main>

      {/* Rodapé */}
      <footer className="bg-sidebar text-sidebar-foreground mt-auto">
        <div className="gold-divider h-[2px] w-full" />
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[12px] text-center">
          <span className="flex items-center gap-2"><Anchor className="h-3.5 w-3.5 text-primary" /> © Vida Carioca — {now.getFullYear()}</span>
          <span className="text-sidebar-foreground/50">
            Conteúdo fictício destinado ao uso exclusivo no servidor de FiveM Vida Carioca.
          </span>
          <span className="text-sidebar-foreground/65">Portal operacional · Acesso restrito</span>
        </div>
      </footer>
    </div>
  );
};

const TopLink = ({ to, label }: { to: string; label: string }) => (
  <Link to={to} className="text-sidebar-foreground/75 hover:text-sidebar-foreground transition-colors">
    {label}
  </Link>
);

const IndItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between gap-2 border-b border-border py-1.5 font-mono text-[11px]">
    <span className="text-muted-foreground truncate">{label}</span>
    <span className={value === "—" ? "text-muted-foreground/60" : "text-primary font-semibold"}>{value}</span>
  </div>
);

const QuickCard = ({
  icon: Icon,
  title,
  desc,
  to,
  cta,
  tone = "card",
}: {
  icon: any;
  title: string;
  desc: string;
  to: string;
  cta: string;
  tone?: "card" | "accent";
}) => (
  <div
    className={`group relative overflow-hidden rounded-xl border p-6 shadow-tactical transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated ${
      tone === "accent"
        ? "bg-accent text-accent-foreground border-primary/30"
        : "bg-card border-border"
    }`}
  >
    <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <h2 className="mt-4 font-display text-base uppercase">{title}</h2>
    <p className={`mt-2 text-sm ${tone === "accent" ? "text-accent-foreground/65" : "text-muted-foreground"}`}>{desc}</p>
    <Button asChild variant="link" className={`mt-3 h-auto p-0 font-semibold uppercase ${tone === "accent" ? "text-primary" : "text-foreground"}`}>
      <Link to={to}>{cta} <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
    </Button>
  </div>
);

const ServiceCard = ({ to, icon: Icon, title, desc }: { to: string; icon: any; title: string; desc: string }) => (
  <Link
    to={to}
    className="group rounded-xl border border-border bg-card p-5 shadow-tactical transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated hover:border-primary/40"
  >
    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <span className="mt-3 block font-display text-[14px] uppercase">{title}</span>
    <span className="mt-1 block text-[13px] leading-snug text-muted-foreground">{desc}</span>
  </Link>
);

export default Index;

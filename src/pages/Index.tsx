import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Network, ScrollText, Settings, Megaphone, FileText, ChevronRight, ShieldAlert, Siren, LogIn } from "lucide-react";
import heroBanner from "@/assets/forca-tatica-hero.jpg";
import { supabase } from "@/integrations/supabase/client";
const logoUrl = "/__l5e/assets-v1/9be673cc-c46a-43d3-8043-abca159df6fa/logo-forca-tatica.png";
// logo asset replaced by CDN pointer

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
      <header className="bg-sidebar text-sidebar-foreground border-b-2 border-primary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 min-h-20 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logoUrl}
              alt="Emblema do 4º BPChq COE"
              width={1024}
              height={1024}
              className="h-14 w-14 object-contain"
            />
            <span className="flex flex-col leading-tight">
              <span className="font-display text-lg uppercase">
                4º BPChq COE
              </span>
              <span className="text-[11px] uppercase text-sidebar-foreground/65">
                Polícia Militar do Estado de São Paulo
              </span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-[13px] font-semibold uppercase">
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
      </header>

      <main>
      <section className="bg-sidebar">
        <div className="max-w-6xl mx-auto min-h-[520px] grid lg:grid-cols-[0.88fr_1.12fr] border-b-4 border-primary shadow-elevated">
          <div className="relative z-10 flex flex-col justify-center px-6 py-12 sm:px-10 lg:py-16 bg-sidebar text-sidebar-foreground">
            <div className="mb-5 flex items-center gap-3 text-primary">
              <span className="h-px w-12 bg-primary" />
              <span className="font-semibold text-xs uppercase">Patrulhamento tático</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl uppercase leading-tight text-sidebar-foreground">
              4º BPChq COE
            </h1>
            <p className="mt-3 font-display text-lg uppercase text-sidebar-foreground/75">
              Polícia Militar do Estado de São Paulo
            </p>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-sidebar-foreground/65">
              Portal operacional para registros, comunicações institucionais e serviços de apoio ao efetivo.
            </p>
            <div className="mt-8 grid w-full max-w-lg grid-cols-1 gap-3 sm:grid-cols-2">
              <Button asChild size="lg" className="w-full font-semibold uppercase">
                <Link to="/bopc">
                  BOPC/BIC <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full font-semibold uppercase border-sidebar-border bg-sidebar-accent text-sidebar-accent-foreground hover:bg-secondary hover:text-secondary-foreground">
                <Link to="/rso/novo">Relatório de Diligências</Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="w-full font-semibold uppercase text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground sm:col-span-2">
                <Link to="/edital">Edital 4º BPChq COE</Link>
              </Button>
            </div>
          </div>
          <div className="relative min-h-[340px] lg:min-h-full overflow-hidden">
            <img
              src={heroBanner}
              alt="Equipe e viaturas da 4º BPChq COE em prontidão"
              width={1600}
              height={900}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-sidebar/50 via-transparent to-transparent" />
            <div className="absolute bottom-5 right-5 flex items-center gap-2 bg-sidebar/90 px-4 py-2 text-xs font-semibold uppercase text-sidebar-foreground border-l-4 border-primary">
              <Siren className="h-4 w-4 text-primary" /> Operacional
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 w-full">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="bg-accent text-accent-foreground border-l-4 border-primary p-6 shadow-tactical">
            <ShieldAlert className="h-7 w-7 text-primary" />
            <h2 className="mt-4 font-display text-base uppercase">Canal de denúncia</h2>
            <p className="mt-2 text-sm text-accent-foreground/65">Comunique desvios de conduta e irregularidades com sigilo.</p>
            <Button asChild variant="link" className="mt-3 h-auto p-0 font-semibold uppercase text-primary">
              <Link to="/denuncia">Registrar denúncia <ChevronRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="bg-card border-l-4 border-foreground p-6 shadow-tactical">
            <h2 className="font-display text-base uppercase">Acesso rápido</h2>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button asChild variant="secondary" size="sm"><Link to="/edital">Editais</Link></Button>
              <Button asChild variant="secondary" size="sm"><Link to="/ccomsoc">Comunicados</Link></Button>
            </div>
          </div>
          <div className="bg-card border-l-4 border-foreground p-6 shadow-tactical">
            <h2 className="font-display text-base uppercase">Administração</h2>
            <p className="mt-2 text-sm text-muted-foreground">Área restrita para gestão operacional do portal.</p>
            <Button asChild variant="link" className="mt-3 h-auto p-0 font-semibold uppercase text-foreground">
              <Link to="/login">Acessar sistema <ChevronRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>

        <div className="mt-12 flex items-center gap-4">
          <h2 className="font-display text-lg uppercase text-foreground">Serviços operacionais</h2>
          <div className="h-1 flex-1 bg-border" />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ServiceCard to="/hierarquia" icon={Network} title="Hierarquia" desc="Estrutura de comando e efetivo das unidades." />
          <ServiceCard to="/rso/novo" icon={FileText} title="RSO" desc="Registro de serviço e diligências operacionais." />
          <ServiceCard to="/ccomsoc" icon={Megaphone} title="Comunicação" desc="Notícias, comunicados e releases oficiais." />
          <ServiceCard to="/diretrizes" icon={ScrollText} title="Diretrizes" desc="Manuais internos, normas e procedimentos." />
        </div>
      </section>

      {/* Indicadores */}
      <section className="bg-secondary border-y border-border">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="font-display text-xl font-bold text-primary text-center">
            Indicadores operacionais
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
      </main>

      {/* Rodapé */}
      <footer className="bg-sidebar text-sidebar-foreground mt-auto border-t-2 border-primary">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[12px]">
          <span>© 4º BPChq COE — PMESP — {now.getFullYear()}</span>
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

const ServiceCard = ({ to, icon: Icon, title, desc }: { to: string; icon: any; title: string; desc: string }) => (
  <Link
    to={to}
    className="group border border-border border-t-4 border-t-foreground bg-card p-5 transition-colors hover:bg-accent hover:text-accent-foreground"
  >
    <Icon className="h-5 w-5 text-primary" />
    <span className="mt-3 block font-display text-[14px] uppercase">{title}</span>
    <span className="mt-1 block text-[13px] leading-snug text-muted-foreground group-hover:text-accent-foreground/65">{desc}</span>
  </Link>
);

export default Index;

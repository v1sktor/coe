import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollText, ChevronRight } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import logoForcaTatica from "@/assets/logo-forca-tatica.png";

function Bloco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border/60 pt-6">
      <h2 className="font-display text-lg md:text-xl uppercase tracking-wide text-primary">
        {titulo}
      </h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

export default function Edital() {
  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      <div className="absolute inset-0 bg-tactical-grid opacity-[0.05] pointer-events-none" />

      <header className="relative z-10 bg-sidebar text-sidebar-foreground border-b-2 border-primary">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoForcaTatica} alt="Emblema da Força Tática" width={1024} height={1024} className="h-11 w-11 object-contain" />
            <span className="flex flex-col leading-tight">
              <span className="font-display text-base font-semibold tracking-wide">
                Força Tática · PMESP
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

      <main className="relative z-10 flex-1 px-6 lg:px-10 py-14 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-2 text-primary mb-2">
          <ScrollText className="h-4 w-4" />
          <span className="font-mono text-[11px] uppercase tracking-[0.3em]">Edital PMESP</span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl uppercase tracking-tight">
          Força Tática · Polícia Militar do Estado de São Paulo
        </h1>
        <p className="mt-2 text-sm font-mono uppercase tracking-widest text-muted-foreground">
          Processo seletivo operacional
        </p>

        <Card className="mt-8 bg-card/70 backdrop-blur-md border-border/60">
          <CardContent className="p-8 space-y-8">
            <section>
              <h2 className="font-display text-lg md:text-xl uppercase tracking-wide text-primary">
                Comunicado oficial – Abertura de processo seletivo
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                A Polícia Militar do Estado de São Paulo torna público que se encontram oficialmente
                abertas as inscrições para o Processo Seletivo destinado ao provimento de cargos
                operacionais no âmbito da corporação. O certame tem por finalidade a seleção de
                candidatos aptos ao exercício das funções relacionadas à investigação criminal,
                combate ao crime organizado, operações especiais e preservação da ordem pública no
                município de Brasilândia.
              </p>
            </section>

            <Bloco titulo="Etapas do processo seletivo">
              <p>O processo seletivo será composto pelas seguintes fases:</p>
              <ul className="list-none space-y-1.5">
                <li>I – Inscrição e análise cadastral;</li>
                <li>II – Prova objetiva de conhecimentos teóricos;</li>
                <li>III – Teste de Aptidão Física (TAF);</li>
                <li>IV – Avaliação psicológica e comportamental;</li>
                <li>V – Investigação social e análise documental.</li>
              </ul>
            </Bloco>

            <Bloco titulo="Curso de formação">
              <p>
                Os candidatos aprovados em todas as etapas serão convocados para o Curso de Formação
                 Técnico-Profissional da Polícia Militar do Estado de São Paulo. Durante o período de formação, os alunos receberão instruções
                técnicas e operacionais nas seguintes áreas:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Procedimentos operacionais policiais;</li>
                <li>Técnicas de abordagem;</li>
                <li>Investigação criminal;</li>
                <li>Legislação penal e processual;</li>
                <li>Direção operacional;</li>
                <li>Uso progressivo da força;</li>
                <li>Operações táticas urbanas.</li>
              </ul>
            </Bloco>

            <Bloco titulo="Requisitos para investidura">
              <p>
                Para participação no processo seletivo, o candidato deverá atender aos seguintes
                requisitos:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Ser cidadão residente no Estado de São Paulo;</li>
                <li>Possuir idade mínima de 18 (dezoito) anos completos;</li>
                <li>Apresentar conduta ilibada e idoneidade moral;</li>
                <li>Não possuir antecedentes criminais incompatíveis com a função pública;</li>
                <li>Demonstrar boa comunicação e postura profissional;</li>
                <li>Possuir disponibilidade para atuação operacional;</li>
                <li>
                  Apresentar aptidão física e psicológica compatível com as atribuições do cargo;
                </li>
                <li>
                  Possuir conhecimentos básicos sobre legislação municipal e normas institucionais.
                </li>
              </ul>
            </Bloco>

            <Bloco titulo="Disposições gerais">
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  A prática de corrupção, favorecimento ilícito, fraude ou violação das normas
                  disciplinares implicará eliminação imediata do certame;
                </li>
                <li>O candidato deverá observar integralmente o regulamento interno da corporação;</li>
                <li>
                  A ocorrência de faltas graves durante o Curso de Formação poderá acarretar
                  desligamento automático.
                </li>
              </ul>
              <p>
                Informações complementares, cronograma oficial e demais orientações serão divulgados
                 oportunamente por meio dos canais oficiais da Polícia Militar do Estado de São Paulo e
                do setor responsável pelo recrutamento institucional.
              </p>
            </Bloco>

            <div className="border-t border-border/60 pt-6">
              <Button asChild size="lg" className="font-medium">
                <Link to="/prova">
                  Iniciar processo seletivo <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="relative z-10 border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        Força Tática · Polícia Militar do Estado de São Paulo
      </footer>
    </div>
  );
}

export interface Unidade {
  sigla: string;
  nome: string;
  descricao: string;
}

/** Unidades da Marinha do Brasil atendidas pelo portal. */
export const UNIDADES: Unidade[] = [
  { sigla: "DEnsM", nome: "Diretoria de Ensino da Marinha", descricao: "Formação e aperfeiçoamento de oficiais e praças." },
  { sigla: "JMU", nome: "Justiça Militar da União", descricao: "Processo e julgamento de crimes militares." },
  { sigla: "ComForS", nome: "Comando da Força de Submarinos", descricao: "Operação e adestramento da esquadrilha de submarinos." },
  { sigla: "ComForSup", nome: "Comando da Força de Superfície", descricao: "Operação dos navios de superfície da Esquadra." },
  { sigla: "VF-1", nome: "Esquadrão VF-1", descricao: "Caça e interceptação aérea embarcada." },
  { sigla: "HS-1", nome: "Esquadrão HS-1", descricao: "Helicópteros antissubmarino." },
  { sigla: "HA-1", nome: "Esquadrão HA-1", descricao: "Helicópteros de ataque." },
  { sigla: "HU-1", nome: "Esquadrão HU-1", descricao: "Helicópteros de emprego geral — transporte e resgate." },
  { sigla: "HU-2", nome: "Esquadrão HU-2", descricao: "Helicópteros de emprego geral — transporte e resgate." },
  { sigla: "GRUMEC", nome: "Grupamento de Mergulhadores de Combate", descricao: "Operações especiais em ambiente aquático e ribeirinho." },
  { sigla: "GERR", nome: "Grupo Especial de Retomada e Resgate", descricao: "Contraterrorismo e resgate de reféns em ambiente marítimo." },
  { sigla: "1ºBPN", nome: "1º Batalhão de Polícia Naval", descricao: "Policiamento e segurança orgânica das instalações navais." },
  { sigla: "3ºBBld", nome: "3º Batalhão de Blindados", descricao: "Poder de fogo blindado do Corpo de Fuzileiros Navais." },
  { sigla: "5ºBArt", nome: "5º Batalhão de Artilharia", descricao: "Apoio de fogo indireto às tropas anfíbias." },
  { sigla: "1ºBOE", nome: "1º Batalhão de Operações Especiais", descricao: "Reconhecimento, ações de comando, contraterrorismo e apoio." },
];

export const UNIDADE_SIGLAS = UNIDADES.map((u) => u.sigla);

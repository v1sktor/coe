export interface Unidade {
  sigla: string;
  nome: string;
  descricao: string;
}

/** Unidades da Polícia Civil do Estado de São Paulo atendidas pelo portal. */
export const UNIDADES: Unidade[] = [
  { sigla: "GOE", nome: "Grupo de Operações Especiais", descricao: "Operações táticas de altíssimo risco e resgate." },
  { sigla: "GARRA", nome: "Grupo Armado de Repressão a Roubos e Assaltos", descricao: "Repressão a roubos, assaltos e sequestros." },
  { sigla: "GER", nome: "Grupo Especial de Reação", descricao: "Reação imediata e apoio tático às unidades." },
  { sigla: "DEIC", nome: "Depto. de Investigações sobre Crime Organizado", descricao: "Investigação e combate ao crime organizado." },
  { sigla: "SAP", nome: "Serviço Aerotático Policial", descricao: "Apoio aéreo, patrulhamento e transporte tático." },
  { sigla: "DHPP", nome: "Depto. de Homicídios e Proteção à Pessoa", descricao: "Homicídios, desaparecidos e proteção à pessoa." },
  { sigla: "DENARC", nome: "Depto. de Investigações sobre Narcóticos", descricao: "Repressão ao tráfico e entorpecentes." },
  { sigla: "CORE", nome: "Coordenadoria de Operações de Recursos Especiais", descricao: "Recursos especiais e suporte operacional." },
];

export const UNIDADE_SIGLAS = UNIDADES.map((u) => u.sigla);

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
  { sigla: "SAT", nome: "Serviço Aerotático Policial", descricao: "Apoio aéreo, patrulhamento e transporte tático." },
  { sigla: "DHPP", nome: "Depto. de Homicídios e Proteção à Pessoa", descricao: "Homicídios, desaparecidos e proteção à pessoa." },
  { sigla: "DENARC", nome: "Depto. de Investigações sobre Narcóticos", descricao: "Repressão ao tráfico e entorpecentes." },
  { sigla: "DECAP", nome: "Depto. de Polícia Judiciária da Capital", descricao: "Coordenação das delegacias da capital." },
  { sigla: "CORREGEPOL", nome: "Corregedoria Geral da Polícia Civil", descricao: "Fiscalização e apuração disciplinar." },
  { sigla: "CERCO", nome: "Serviço de Cerco e Bloqueio", descricao: "Cerco, bloqueio e contenção em ocorrências." },
  { sigla: "IML", nome: "Instituto Médico Legal", descricao: "Perícias médico-legais e necroscópicas." },
  { sigla: "DGP", nome: "Delegacia Geral de Polícia", descricao: "Direção geral e comando da Polícia Civil." },
  { sigla: "DEJEC", nome: "Operação Conjunta (Todas as Unidades)", descricao: "Ação conjunta — exibe o efetivo de todas as unidades." },
];

export const UNIDADE_SIGLAS = UNIDADES.map((u) => u.sigla);

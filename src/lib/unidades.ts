export interface Unidade {
  sigla: string;
  nome: string;
  descricao: string;
}

/** Unidade atendida pelo portal. */
export const UNIDADES: Unidade[] = [
  { sigla: "COE", nome: "4º BPChq — Operações Especiais", descricao: "Operações táticas especiais do 4º Batalhão de Polícia de Choque." },
];

export const UNIDADE_SIGLAS = UNIDADES.map((u) => u.sigla);

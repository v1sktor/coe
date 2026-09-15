export interface Unidade {
  sigla: string;
  nome: string;
  descricao: string;
}

/** Unidade atendida pelo portal. */
export const UNIDADES: Unidade[] = [
  { sigla: "FT", nome: "Força Tática", descricao: "Patrulhamento tático reforçado e apoio a ocorrências de alto risco." },
];

export const UNIDADE_SIGLAS = UNIDADES.map((u) => u.sigla);

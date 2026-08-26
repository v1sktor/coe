// Sincronização entre o formulário de RSO e o painel flutuante de Remodulação de Barca.

export const BARCA_SYNC_KEY = "barca_rso_sync_v1";
export const BARCA_SYNC_EVENT = "barca:rso-sync"; // RSO -> Painel
export const BARCA_APPLY_EVENT = "barca:apply"; // Painel -> RSO

export const BARCA_FIELDS = [
  "encarregado_id",
  "motorista_id",
  "homem3_id",
  "homem4_id",
  "homem5_id",
] as const;

export type BarcaField = (typeof BARCA_FIELDS)[number];

export const BARCA_LABELS: Record<BarcaField, string> = {
  encarregado_id: "Encarregado",
  motorista_id: "Motorista",
  homem3_id: "Homem 3",
  homem4_id: "Homem 4",
  homem5_id: "Homem 5",
};

export interface BarcaSyncPayload {
  ativo: boolean;
  prefixo: string;
  unidade: string;
  /** ids da hierarquia por posição, na ordem de BARCA_FIELDS */
  membros: (string | null)[];
  atualizadoEm: string;
}

export function publishBarcaRso(payload: BarcaSyncPayload) {
  localStorage.setItem(BARCA_SYNC_KEY, JSON.stringify(payload));
  window.dispatchEvent(new CustomEvent(BARCA_SYNC_EVENT, { detail: payload }));
}

export function readBarcaRso(): BarcaSyncPayload | null {
  try {
    const raw = localStorage.getItem(BARCA_SYNC_KEY);
    return raw ? (JSON.parse(raw) as BarcaSyncPayload) : null;
  } catch {
    return null;
  }
}

export function clearBarcaRso() {
  localStorage.removeItem(BARCA_SYNC_KEY);
  window.dispatchEvent(new CustomEvent(BARCA_SYNC_EVENT, { detail: null }));
}

export function subscribeBarcaRso(cb: (p: BarcaSyncPayload | null) => void) {
  const handler = (e: Event) => cb((e as CustomEvent).detail ?? readBarcaRso());
  window.addEventListener(BARCA_SYNC_EVENT, handler);
  window.addEventListener("storage", () => cb(readBarcaRso()));
  return () => window.removeEventListener(BARCA_SYNC_EVENT, handler);
}

/** Painel envia a nova composição de volta para o formulário de RSO. */
export function applyBarcaToRso(membros: (string | null)[]) {
  window.dispatchEvent(new CustomEvent(BARCA_APPLY_EVENT, { detail: { membros } }));
}

export function subscribeBarcaApply(cb: (membros: (string | null)[]) => void) {
  const handler = (e: Event) => cb((e as CustomEvent).detail.membros);
  window.addEventListener(BARCA_APPLY_EVENT, handler);
  return () => window.removeEventListener(BARCA_APPLY_EVENT, handler);
}

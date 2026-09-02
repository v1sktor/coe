import { lazy, type ComponentType } from "react";

/**
 * React.lazy com retry automático.
 * Se o chunk falhar ao carregar (deploy novo, rede instável), tenta de novo
 * e, em último caso, recarrega a página uma única vez — evitando a tela branca
 * que só era resolvida com F5.
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  key: string,
) {
  return lazy(async () => {
    const storageKey = `chunk-reload:${key}`;
    try {
      const mod = await factory();
      sessionStorage.removeItem(storageKey);
      return mod;
    } catch (err) {
      // segunda tentativa (cache-bust natural do browser)
      try {
        await new Promise((r) => setTimeout(r, 400));
        const mod = await factory();
        sessionStorage.removeItem(storageKey);
        return mod;
      } catch (err2) {
        if (!sessionStorage.getItem(storageKey)) {
          sessionStorage.setItem(storageKey, "1");
          window.location.reload();
          // devolve um componente vazio enquanto a página recarrega
          return { default: (() => null) as unknown as T };
        }
        throw err2;
      }
    }
  });
}

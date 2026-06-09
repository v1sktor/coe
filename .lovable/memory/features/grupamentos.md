---
name: Grupamentos especiais
description: TOR e ROCAM como grupamentos com hierarquia filtrada via campo grupamento
type: feature
---
Hierarquia tem campo `grupamento` (enum: GERAL, TOR, ROCAM, default GERAL).
- Páginas públicas: /tor e /rocam (componente Grupamento.tsx) — institucional + listagem do efetivo filtrado.
- Painel admin: /admin/tor e /admin/rocam — Hierarquia.tsx com prop filterGrupamento.
- Form admin de hierarquia inclui select de grupamento.

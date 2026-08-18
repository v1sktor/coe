# Project Memory

## Core
GER — Grupo Especial de Reação, Polícia Civil do Estado de São Paulo. Lema: "Reação imediata, resultado certo."
Tema: preto #0d0d0d fundo, grafite #1a1a1a cards, dourado #c9a84c primary, dourado claro #f0d78c glow. Oswald headings, JetBrains Mono data. Sem animações exageradas.
Nomenclatura da Polícia Civil (não usar patentes militares, PMESP, BPChq, COE).
Supabase backend (Auth, DB, Storage).
No public user registration. Admins create accounts (auto-confirmed via Edge Functions).

## Memories
- [Aesthetic & Theme](mem://style/aesthetic) — Tema tático preto & dourado do GER, hero full-screen
- [Hierarchy System](mem://features/hierarchy) — Hierarchy fields, public view vs admin CRUD
- [Timings System](mem://features/timings) — Timesheet for members based on approved RSO patrol hours
- [Project Identity](mem://project/identity) — Logo oficial na landing page
- [Registration Policy](mem://auth/registration-policy) — Registration is strictly admin-only via Edge Functions
- [Activity Audit](mem://features/activity-audit) — Tracking and auditing user actions in the admin panel
- [Rank Management](mem://features/rank-management) — Rank hierarchy and insignia images
- [RSO Workflow](mem://features/rso-workflow) — 5-step patrol report creation, admin approval/rejection logic
- [RSO Timer Logic](mem://features/rso-timer-logic) — Persistent floating patrol timer widget logic
- [Permissions Management](mem://auth/permissions-management) — Admin user access control via specific granular permissions

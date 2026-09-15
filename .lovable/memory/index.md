# Project Memory

## Core
Força Tática — Polícia Militar do Estado de São Paulo (PMESP).
Tema institucional tático: preto #111111, grafite #2B2B2B, vermelho #A6192E e branco #F2F2F2. Archivo Black em títulos, Hind no corpo e JetBrains Mono em dados. Sem animações exageradas.
Usar nomenclatura da PMESP e identidade da Força Tática. Não reintroduzir a grade pública de unidades na página inicial.
Supabase backend (Auth, DB, Storage).
No public user registration. Admins create accounts (auto-confirmed via Edge Functions).

## Memories
- [Aesthetic & Theme](mem://style/aesthetic) — Tema institucional da Força Tática em preto, grafite e vermelho
- [Hierarchy System](mem://features/hierarchy) — Hierarchy fields, public view vs admin CRUD
- [Timings System](mem://features/timings) — Timesheet for members based on approved RSO patrol hours
- [Project Identity](mem://project/identity) — Logo oficial na landing page
- [Registration Policy](mem://auth/registration-policy) — Registration is strictly admin-only via Edge Functions
- [Activity Audit](mem://features/activity-audit) — Tracking and auditing user actions in the admin panel
- [Rank Management](mem://features/rank-management) — Rank hierarchy and insignia images
- [RSO Workflow](mem://features/rso-workflow) — 5-step patrol report creation, admin approval/rejection logic
- [RSO Timer Logic](mem://features/rso-timer-logic) — Persistent floating patrol timer widget logic
- [Permissions Management](mem://auth/permissions-management) — Admin user access control via specific granular permissions

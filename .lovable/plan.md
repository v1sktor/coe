
# Adaptação para 4º BPChq

Adapta este remix (atualmente ROTA/PMESP) para o **4º Batalhão de Polícia de Choque**, mantendo RSO, Hierarquia, Timings e o sistema de permissões granulares, e adicionando 4 novas áreas pedidas pelo Cmt do COE.

## 1. Rebranding 4º BPChq

- Nome do sistema, títulos, meta tags → "4º BPChq".
- Substituir referências a ROTA / batalhões PMESP nas telas e no seed da hierarquia.
- Paleta institucional do Choque (preto + dourado/amarelo Choque, mantendo a base dark já existente). Mantém Oswald nos títulos.
- Trocar logo/watermark da landing pelo brasão do 4º BPChq (você me envia depois — deixo placeholder).
- Atualizar lista de "guarnições/companhias" do RSO para a realidade do batalhão (ex.: 1ª Cia, 2ª Cia, 3ª Cia, Cmdo, etc. — confirma comigo a lista exata antes de aplicar).

## 2. Novas abas (CRUD completo via admin)

Cada uma vira uma seção tipo biblioteca/feed, com listagem pública para usuários autenticados e painel admin para criar/editar/excluir. Estrutura idêntica entre elas para reaproveitar componentes.

- **CCOMSOC** — comunicação social: posts com título, corpo (editor rico), capa, anexos, data, autor.
- **Estáticas** — escalas/postos estáticos: cada item tem local, período, efetivo previsto, observações, anexos.
- **Diretriz do COE** — documentos oficiais: título, número/ano, vigência, corpo, PDF anexo, tags.
- **Apresentação 4º BPChq**:
  - **Landing pública** (sem login) com história, missão, organograma, fotos e CTA.
  - Seção de **documentos baixáveis** (apresentação institucional, folders) gerenciada pelo admin via mesma mecânica das outras abas.

Cada aba entra no sistema de **permissões granulares** existente (chaves `ccomsoc.manage`, `estaticas.manage`, `diretrizes.manage`, `apresentacao.manage`), além de uma chave `*.view` quando fizer sentido restringir leitura.

## 3. Backend (Lovable Cloud)

Tabelas novas em `public`, todas com RLS + GRANT + trigger `updated_at`:

- `ccomsoc_posts`
- `estaticas`
- `diretrizes_coe`
- `apresentacao_docs` (documentos/arquivos da apresentação)
- `apresentacao_content` (blocos da landing pública: hero, história, missão, etc. — editável pelo admin)

Bucket de Storage novo: `documentos` (privado por padrão para diretrizes/CCOMSOC; `apresentacao` público para arquivos da landing).

Políticas:
- Leitura: usuários autenticados (exceto `apresentacao_content` e `apresentacao_docs` públicos, que liberam `anon`).
- Escrita/edição/remoção: somente quem tem a permissão granular correspondente (via `has_permission` / `has_role('admin')`).

## 4. Permissões e admin

- Adiciono as 4 novas permissões ao seed de `permissoes`.
- Tela de gestão de permissões já existente passa a listá-las automaticamente.
- Admin continua tendo acesso total (super-permissão já implementada).

## 5. Navegação

- Sidebar/menu ganha grupo **"Operacional"** (RSO, Hierarquia, Timings, Estáticas) e **"Documentação"** (CCOMSOC, Diretriz COE, Apresentação).
- Rota pública `/4bpchq` (ou `/apresentacao`) para a landing institucional, acessível sem login.

## Detalhes técnicos

- Stack mantida: React + Vite + Tailwind + shadcn + Supabase.
- Editor rico: `@tiptap/react` (leve, já compatível) para corpo dos posts/diretrizes.
- Uploads via Storage com signed URLs para buckets privados.
- Componentes reaproveitáveis: `<DocumentList>`, `<DocumentForm>`, `<DocumentViewer>` parametrizados por tipo (ccomsoc | estatica | diretriz | apresentacao).
- Migrations separadas por tabela para facilitar revisão.
- Seed da hierarquia / cargos será ajustado em uma migration de DATA depois que você confirmar a estrutura de companhias do batalhão.

## Ordem de execução sugerida

1. Rebranding visual + textos (rápido, sem backend).
2. Migrations das 4 tabelas + buckets + permissões.
3. Componentes genéricos de CRUD documental.
4. Telas das 4 abas + rotas + menu.
5. Landing pública `/4bpchq`.
6. Ajuste do seed de hierarquia/guarnições (após você confirmar a lista).

## O que preciso de você antes de codar

- Brasão/logo do 4º BPChq (PNG transparente) — posso usar placeholder enquanto isso.
- Lista oficial de companhias/guarnições do batalhão para o RSO.
- Se já tiver o doc de apresentação institucional em PDF, me envia que eu já deixo no Storage.

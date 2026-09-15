# DOCUMENTATION.md (SSOT - Fonte Única de Verdade)

> **START ADS ENGINE** — Plataforma de Tráfego Pago & IA (Meta Ads API v20+ & Google Gemini Flash)
> Desenvolvido por: Start Agência Digital
> Ambiente: Node.js 24 + Express + TailwindCSS + Vercel Serverless Ready

---

## 1. Visão Geral da Arquitetura
O **START ADS ENGINE** é uma plataforma concebida para potencializar a gestão de tráfego pago em agências digitais, combinando:
1. **Meta Marketing API (v20+)**: Automação ponta a ponta de campanhas, conjuntos de anúncio, criativos, orçamentos e leitura granular de métricas de vídeo.
2. **Google Gemini 1.5 Flash**: Auditoria pré-voo de copies e orçamentos, co-piloto preditivo de fadiga e geração de relatórios executivos em linguagem natural.
3. **Analytics Engine Proprietário**: Algoritmos de cálculo de Hook Rate (3s), Hold Rate (ThruPlay) e alerta de fadiga de criativos.
4. **Design Moderno Dark/Slate**: Glassmorphism, animações e paleta profissional orientada a conversão.

---

## 2. Mapa de Rotas e Endpoints

### Rotas de Interface Web (Frontend)
- `/` (`public/index.html`): Hub Multiplataforma com seleção entre Meta Ads (ativo), Google Ads (em desenvolvimento) e TikTok Ads (em desenvolvimento).
- `/criar` (`public/criar.html`): Wizard universal em 4 etapas (Objetivo, Orçamento/Pacing, Público/Geolocalização, Criativo Duplo) com auditoria Pré-Voo IA e trava de segurança (`PAUSED`/`ACTIVE`).
- `/gestor` (`public/gestor.html`): Dashboard do gestor com seletor multi-conta, curva de leilão de CPM (Chart.js), tabela de criativos com Hook/Hold Rate e Co-Piloto de 1 clique.
- `/cliente` (`public/cliente.html`): Portal executivo para empresários (`?conta=...`), 4 KPIs comerciais transparentes, resumo em português da IA e ranking de vídeos.

### Endpoints da API REST (`api/`)
- `GET /api/contas`: Lista de contas de anúncio com saldos, moeda e status.
- `GET /api/posts-instagram/:pageId`: Publicações orgânicas do feed/reels com miniatura e métricas de engajamento.
- `POST /api/criar-campanha`: Criação completa de campanha, adset e ad na Meta API com suporte a upload de mídia local (`multer`).
- `POST /api/pre-voo-ia`: Auditoria do rascunho da campanha pelo Gemini Flash antes da publicação.
- `GET /api/metricas/:contaId`: Métricas consolidadas, histórico de CPM e criativos enriquecidos com índice de fadiga.
- `GET/POST /api/analise-ia/:contaId`: Diagnóstico do Co-Piloto (tipo `COPILOTO`) ou Resumo Executivo para cliente (tipo `CLIENTE`).
- `POST /api/executar-acao`: Aplicação em 1 clique de ações recomendadas pela IA (`PAUSE_AD`, `ACTIVATE_AD`, `ADJUST_BUDGET`).
- `POST /api/auth-pin`: Validação do PIN de 4 a 6 dígitos do cliente com geração de sessão segura de 24h.
- `GET /api/gestao-pin/:contaId`: Consulta do PIN ativo da conta pelo gestor.
- `POST /api/gestao-pin`: Atualização do PIN da conta no Supabase pelo gestor.

---

## 3. Serviços de Backend (`services/`)
- `services/metaService.js`: Gerenciamento das chamadas à Graph API v20+ com tratamento resiliente e dados mock ricos para teste imediato.
- `services/geminiService.js`: Chamadas estruturadas ao Google Gemini Flash para diagnósticos e geração de textos de alta persuasão e clareza.
- `services/analyticsEngine.js`: Regras matemáticas para cálculo de Hook Rate, Hold Rate, detecção de fadiga e curvas de leilão.
- `services/authService.js`: Conexão com Supabase (`public.client_access_pins`) para validação, armazenamento e rotação de PINs com RLS e fallback seguro.

---

## 4. Protocolos e Governança de Código
Todos os protocolos corporativos estão documentados em `[documentation]/protocolos/`:
- `PROTOCOLO_START.md`: Checklist de inicialização de sessão e sincronia de repositório.
- `PROTOCOLO_DEPLOY.md`: Trava de segurança para deploy na Vercel e produção.
- `PROTOCOLO_DE_REFATORACAO_DE_MONOLITOS.md`: Diretrizes anti-monolito e trava absoluta.
- `PROTOCOLO_DEV_UX_UI.md`: Normas de interface, dark mode e acessibilidade.
- `PROTOCOLO_GIT_POINT.md`: Criação de tags de restauração pré-alterações.
- `VARREDURA_PRE_GIT_PUSH.md`: Auditoria rigorosa antes de envios remotos.
- `PROTOCOLO_SEGURANCA.md`: Isolamento de credenciais e proteção contra vazamentos.

---

## 5. Scripts no `package.json`
- `npm start`: Inicia o servidor Express em produção.
- `npm run dev`: Inicia o servidor localmente em `http://localhost:3000`.
- `npm run monitor`: Inicia o Anti-Monolith Watcher (`scripts/monolith-watcher.js`).
- `npm run audit:ui`: Executa a auditoria de UX/UI nas telas do projeto.

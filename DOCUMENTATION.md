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
- `/` (`public/index.html`): Hub Multiplataforma com seleção entre Meta Ads (ativo), Google Ads e TikTok Ads.
- `/criar` (`public/criar.html`): Wizard universal em 4 etapas com auditoria Pré-Voo IA e trava de segurança.
- `/gestor` (`public/gestor.html`): Dashboard executivo de performance no padrão Pulse BI com 4 abas (Visão geral, Campanhas, Conjuntos, Criativos), grid de 8 KPIs, Funil de Tráfego vertical com taxas de conversão (drop %), Destaques Inteligentes de IA e gráfico diário.
- `/cliente` (`public/cliente.html`): Portal executivo com barreira de PIN, 4 KPIs comerciais e ranking de criativos.
- `/conexoes` (`public/conexoes.html`): Central de Conexões & Gerenciamento de Tokens com teste em tempo real na Graph API v20.0, persistência no `.env`, diagnóstico de permissões e guia rápido para tokens permanentes de Usuário do Sistema.
- **Navegação Global (`public/js/sidebar.js`, `public/css/sidebar.css`):** Barra lateral unificada e responsiva com modo compacto persistente (`localStorage`), gaveta mobile, detecção automática de rota ativa, grupo de Configurações e card interativo de diagnóstico das APIs (`200 OK`).

### Endpoints da API REST (`api/`)
- `GET /api/conexoes/status`: Status das conexões Meta, Gemini e Supabase com credenciais mascaradas.
- `POST /api/conexoes/testar-meta`: Validação instantânea de Token e Conta na Meta Graph API v20.0.
- `POST /api/conexoes/salvar`: Persistência das credenciais no `.env` e sincronização a quente em `process.env`.
- `GET /api/contas`: Lista de contas de anúncio com saldos, moeda e status.
- `GET /api/posts-instagram/:pageId`: Publicações orgânicas do feed/reels com miniatura e métricas de engajamento.
- `POST /api/criar-campanha`: Criação completa de campanha, adset e ad na Meta API com suporte a upload de mídia local (`multer`).
- `POST /api/pre-voo-ia`: Auditoria do rascunho da campanha pelo Gemini Flash antes da publicação.
- `GET /api/metricas/:contaId`: Métricas consolidadas, histórico de CPM, funil de conversão, destaques e criativos enriquecidos com índice de fadiga. Aceita `?periodo=last_30d|last_7d|today|maximum`. Retorna campanhas completas com insights reais para a tela estilo Pulse BI.
- `GET/POST /api/analise-ia/:contaId`: Diagnóstico do Co-Piloto (tipo `COPILOTO`) ou Resumo Executivo para cliente (tipo `CLIENTE`).
- `POST /api/executar-acao`: Aplicação em 1 clique de ações recomendadas pela IA (`PAUSE_AD`, `ACTIVATE_AD`, `ADJUST_BUDGET`).
- `POST /api/auth-pin`: Validação do PIN de 4 a 6 dígitos do cliente com geração de sessão segura de 24h.
- `GET /api/gestao-pin/:contaId`: Consulta do PIN ativo da conta pelo gestor.
- `POST /api/gestao-pin`: Atualização do PIN da conta no Supabase pelo gestor.

---

## 2.1 Módulos de Interface Frontend (`public/`)
- `/`: Hub Central de monitoramento e atalhos rápidos.
- `/gestor`: Dashboard analítico de performance estilo Pulse BI estruturado em 4 abas executivas:
  - **Visão Geral:** Funil vertical com badges de drop rate (-70% a -90%), 8 cards de KPIs de tráfego/engajamento, diagnósticos de IA com pílulas semânticas e gráfico de gasto diário x impressões.
  - **Campanhas:** Visão executiva por campanha com trilho de investimento e bullet dot proporcional, status pills (`Ativos`, `Inativos`, `Todos`), 5 colunas de métricas alinhadas (`CONVERSAS`, `LEADS`, `QUALIF. ≥ 70`, `VENDAS`, `RECEITA`) e rodapé consolidado com totais.
  - **Conjuntos:** Visão no nível de segmentação de público com tag vinculada da campanha pai, trilho de investimento proporcional, 5 colunas de métricas e rodapé somatório.
  - **Criativos:** Grade de 3 colunas com miniaturas verticais (Reels 9:13) reais da Meta CDN, badge dinâmico de hook rate/fadiga (`📉 -21%`), ROAS, receita, gasto/leads/vendas, pílulas de CTR e custo por conversa, e snippet da cópia do anúncio com link externo para o Gerenciador de Anúncios.
  - **Suporte Dual-Theme:** Alternância fluida entre "Modo Pulse" (fundo `#f0f5fa` e cards brancos idênticos à referência) e "Modo Dark" (`#090d16` / `#0f172a`), com persistência em `localStorage`.
- `/conexoes`: Painel dedicado para testar e salvar o Token Permanente da Meta e Chave Gemini.
- `/criar`: Assistente de criação de campanhas com auditoria pré-voo por IA.
- `/cliente`: Portal do cliente protegido por autenticação via PIN.

---

## 3. Serviços de Backend (`services/`)
- `services/metaService.js`: Gerenciamento das chamadas à Graph API v20+ com tratamento resiliente e dados mock ricos para teste imediato.
- `services/funnelService.js`: Modelagem do Funil de Conversão (impressões -> plays -> engajamento -> cliques -> alta intenção) e geração de Destaques de Performance tipo Pulse BI.
- `services/geminiService.js`: Chamadas estruturadas ao Google Gemini Flash para diagnósticos e geração de textos de alta persuasão e clareza.
- `services/analyticsEngine.js`: Regras matemáticas para cálculo de Hook Rate, Hold Rate, detecção de fadiga e curvas de leilão.
- `services/authService.js`: Conexão com Supabase (`public.client_access_pins`) para validação, armazenamento e rotação de PINs com RLS e fallback seguro.

---

## 4. Protocolos e Governança de Código
Todos os protocolos corporativos e tutoriais operacionais estão documentados em `[documentation]/`:
- `[documentation]/TUTORIAL_TOKEN_PERMANENTE_META.md`: Passo a passo para criação de token que nunca expira via System User.
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

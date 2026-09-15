# PROMPT DE CONTINUIDADE COMPLETO — START ADS ENGINE

> **Instruções de Uso:**
> Copie e cole este prompt na íntegra ao abrir a sessão em um novo computador ou em uma nova janela de IA. Ele contém todo o contexto do projeto, credenciais necessárias, regras de arquitetura, estado atual e comandos para inicialização imediata.

---

## 1. 📌 Identificação do Projeto & Repositório
- **Nome:** START ADS ENGINE
- **Repositório GitHub:** `https://github.com/startagenciadigital/start-ads-engine.git`
- **Branch Principal:** `main`
- **Deploy Produção:** `https://start-ads-engine.vercel.app`
- **Documentação Central (SSOT):** [DOCUMENTATION.md](file:///DOCUMENTATION.md) e [CONTINUIDADE.md](file:///CONTINUIDADE.md)

---

## 2. 🏗️ Stack Tecnológica & Arquitetura
- **Backend:** Node.js, Express.js (Modular, sem monolito: rotas em `routes/`, regras de negócio em `services/`).
- **Frontend:** HTML5 semântico, JavaScript Vanilla modular (`public/js/`), Tailwind CSS via CDN.
- **Design System:**
  - Tema: Dark Mode profissional (`bg-[#090d16]`, cartões `bg-[#0f172a]`, bordas `border-slate-800/80`).
  - Formas: Cantos modernos (`rounded-2xl` para containers, `rounded-xl` para botões e inputs). NUNCA usar `rounded-none`.
  - Tipografia: Inter / Outfit, textos com alto contraste (`text-slate-100` / `text-slate-400`).
- **Banco de Dados & Autenticação:** Supabase (armazenamento de clientes, PIN de acesso com hash, Row Level Security ativo).
- **Provedores de IA & Mídia:** Google Gemini API (`gemini-1.5-flash`), Meta Ads Graph API v20.0+.

---

## 3. 🚨 Regras Obrigatórias do Repositório (AGENTS.md)
1. **Regra de Padding para Menus Dropdown (`<select>`):**
   - Todo `<select>` estilizado deve usar `appearance-none` e padding direito assimétrico (`pr-8` ou `pr-10`) com ícone SVG posicionado, evitando sobreposição de setas nativas do sistema operacional.
2. **Protocolo Start Mandatório:**
   - Ao iniciar qualquer sessão, verificar `git status`, testar servidor local na porta `3000` e checar `CONTINUIDADE.md`.
3. **Auditoria Anti-Monolito:**
   - Nenhum arquivo deve ultrapassar 350-500 linhas. Funções de cálculo e integração devem residir em `services/` (`metaService.js`, `analyticsEngine.js`, `supabaseService.js`).
4. **Segurança de Credenciais:**
   - NUNCA commitar tokens ou API keys. Todas as variáveis sensíveis devem residir exclusivamente no `.env`.
5. **Auditoria Visual:**
   - Manter 0 infrações no script `npm run audit:ui`.

---

## 4. 🔍 Estado Atual da Aplicação (Última Sessão)
- **Cliente Real Configurado:**
  - Nome: **Alex Voltagem / Banda A Voltagem**
  - Conta Meta Ads: `act_1717085079153654`
  - Campanhas Ativas Mapeadas:
    1. `[ ENSAIO NA RUA - SP ]` (ID: `120245840457990557` | R$ 46,66/dia | Lookalike 1% e 2% SP)
    2. `[ ENSAIO NA RUA - PR ]` (ID: `120245840458180557` | R$ 20,00/dia | Lookalike 2% e Remarketing Curitiba)
  - Resiliência Meta: Fallback automático com métricas reais ativado caso o token Meta expire (`OAuthException 190, code 463`).
- **Segurança de Acesso (Área do Cliente):**
  - Autenticação via PIN de 4 dígitos integrada ao Supabase.
  - Token JWT/Sessão de 24 horas gerado no login e validado em endpoints protegidos.
  - Testes de segurança 100% aprovados (PIN incorreto rejeitado, PIN vazio bloqueado, expiração validada e isolamento entre contas).
- **UX/UI:**
  - Formulários de criação e gestão com seletores assimétricos e modais responsivos.
  - 0 erros na auditoria automatizada.
- **Deploy:**
  - Vercel em sincronia e respondendo 200 OK.

---

## 5. ⚙️ Variáveis de Ambiente Necessárias (`.env`)
No novo computador, crie o arquivo `.env` na raiz do projeto com a seguinte estrutura:

```env
PORT=3000
META_ADS_ACCESS_TOKEN=seu_meta_access_token_aqui
META_ADS_AD_ACCOUNT_ID=act_1717085079153654
GEMINI_API_KEY=sua_chave_google_ai_studio_aqui
GEMINI_MODEL=gemini-1.5-flash
SUPABASE_URL=https://seu_projeto.supabase.co
SUPABASE_KEY=sua_chave_supabase_anon_ou_service
NEXT_PUBLIC_SUPABASE_URL=https://seu_projeto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua_chave_supabase_anon_ou_service
```

---

## 6. 🚀 Como Subir o Projeto no Novo Computador (Passo a Passo)

```bash
# 1. Clonar ou atualizar o repositório
git clone https://github.com/startagenciadigital/start-ads-engine.git
cd start-ads-engine
git pull origin main

# 2. Instalar dependências
npm install

# 3. Criar arquivo de configuração (.env)
cp .env.example .env
# (Edite o .env com suas chaves)

# 4. Validar sintaxe e integridade
node --check server.js
npm run audit:ui

# 5. Iniciar o servidor local
npm start
# O sistema responderá em: http://localhost:3000
```

---

## 7. 🎯 Próximos Passos Imediatos da Fila
1. **Renovação de Token Meta Ads:** Se necessário, gerar novo User/System Token no Meta Graph API Explorer com permissões `ads_read`, `ads_management` e atualizar no `.env`.
2. **Gemini Insights ao Vivo:** Testar o gerador de diagnósticos e recomendações de tráfego com `gemini-1.5-flash`.
3. **Módulo Multi-Plataforma:** Expandir o Hub para suporte planejado a Google Ads e TikTok Ads.
4. **Relatórios Automáticos em PDF:** Integração do gerador de PACC / relatórios de performance periódicos.

---

*Fim do documento de continuidade. Quando iniciar, leia este arquivo e execute o **Protocolo Start**.*

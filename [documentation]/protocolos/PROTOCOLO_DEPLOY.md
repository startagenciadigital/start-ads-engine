# 🚀 Protocolo de Deploy e Lançamento Seguro (Vercel & Produção)

Este documento estabelece as regras para publicação segura do **START ADS ENGINE** em ambiente de produção na **Vercel**.

**Gatilhos de Execução:** Acionado quando o usuário solicitar "deploy", "protocolo deploy", "vamos colocar no ar", ou "subir para produção".

---

## 🛡️ Trava de Segurança Pré-Lançamento

Nenhum deploy para produção é autorizado sem executar a checklist abaixo:

### 1. Auditoria de Dependências
```bash
npm audit
```
*Critério de Aprovação:* Nenhuma vulnerabilidade crítica aberta nas dependências em uso.

### 2. Validação das Variáveis de Ambiente em Produção (Vercel)
Confirmar no painel da Vercel (`Project Settings > Environment Variables`):
- `PORT=3000`
- `META_ADS_ACCESS_TOKEN` (Token oficial do Gerenciador de Negócios)
- `META_ADS_AD_ACCOUNT_ID` (ex: `act_1717085079153654`)
- `GEMINI_API_KEY` (Chave Google AI Studio)
- `GEMINI_MODEL=gemini-1.5-flash`

### 3. Validação de Rotas e Build Local
Executar validação sintática e teste local:
```bash
node --check server.js
```
Confirmar que todos os 12 endpoints da API respondem com código 200 OK.

### 4. Publicação e Git Push
```bash
git add .
git commit -m "feat/deploy: versão de produção aprovada"
git push origin main
```
A Vercel fará o build serverless automaticamente conforme as regras em `vercel.json`.

# 📋 Protocolo de Varredura Pré-Git Push

Checklist obrigatória a ser executada antes de enviar commits para o repositório remoto:

1. **Validação de Sintaxe:** `node --check server.js` e checagem de todos os serviços em `services/` e rotas em `api/`.
2. **Segurança de Segredos:** Confirmar que tokens da Meta e chaves do Gemini NÃO foram colocados diretamente no código-fonte.
3. **Validação UX/UI:** Executar `node .agents/skills/ux_ui_auditor/scripts/audit_ux_ui.js`.
4. **Atualização SSOT:** Atualizar o arquivo `DOCUMENTATION.md` com as novas capacidades entregues.
5. **Commit & Push:** Executar `git add .`, `git commit -m "..."` e `git push`.

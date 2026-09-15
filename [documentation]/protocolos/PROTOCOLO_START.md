# 🟢 Protocolo Start (START ADS ENGINE)

Este documento define as diretrizes obrigatórias que o agente de IA e a equipe devem executar sempre que uma nova sessão for iniciada ou ao solicitar o comando **"protocolo start"**.

---

## 🛠️ Fluxo de Execução Obrigatório

### 01. Iniciar ou Validar o Servidor Local de Desenvolvimento
Antes de qualquer outra verificação, assegure que o servidor web da plataforma esteja rodando localmente.
- **Ação**: Executar `npm run dev` ou `node server.js` (ou `npm run dev:monitored`).
- **Verificação**: Confirmar que o serviço está respondendo em `http://localhost:3000`.
- **Link de Acesso Local**: [http://localhost:3000](http://localhost:3000)

### 02. Verificar Sincronização Git (Local vs. Remoto)
Garantir que a branch atual esteja alinhada com o repositório remoto para evitar conflitos ou perdas:
1. Rodar `git fetch` e `git status`.
2. Se houver commits locais pendentes: informar e perguntar se deseja fazer `git push`.
3. Se houver commits remotos pendentes: informar e sugerir `git pull`.
4. Se estiver sincronizado: confirmar ao usuário que o código está íntegro.

### 03. Análise de Continuidade da Sessão Anterior
1. Consultar `CONTINUIDADE.md` e `DOCUMENTATION.md` para resgatar o contexto de negócio e as últimas funcionalidades implementadas.
2. Apresentar um resumo claro de onde o projeto parou e sugerir os 2 a 3 próximos passos lógicos.

---

## 📝 Como Acionar este Protocolo
Envie a mensagem no chat:
> *"Executar o protocolo start"* ou *"protocolo start"*

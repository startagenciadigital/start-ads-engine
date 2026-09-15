---
name: Auditoria UX/UI Proativa
description: Auditor automático de CSS, Tailwind e acessibilidade visual para garantir interfaces modernas Dark Mode, responsivas e de alto padrão. Acionado por palavras-chave (UX, UI, implementar) ou protocolo start.
---

# Auditoria UX/UI Proativa

Esta skill assegura a conformidade constante com o `PROTOCOLO_DEV_UX_UI.md` durante o desenvolvimento e evolução do **START ADS ENGINE**.

## Como Funciona?
Sempre que você receber instruções para criar ou modificar interfaces em `public/` (`index.html`, `criar.html`, `gestor.html`, `cliente.html`), ou o usuário usar palavras-chave como **implementar**, **adicionar botão**, **UX**, **UI**, ou acionar o **protocolo start**, execute as verificações abaixo:

---

## ⚡ PROTOCOLO START — Sequência de Verificação

Ao receber o comando "protocolo start":

### Etapa 1 — Verificação de Sincronicidade do Repositório
```bash
git fetch && git status
```
- Se houver commits locais pendentes: informar e sugerir envio.
- Se houver novidades remotas: sugerir sincronização.
- Se estiver sincronizado: confirmar status.

### Etapa 2 — Iniciar ou Confirmar o Servidor Local
Verificar se o servidor está ativo na porta 3000:
```bash
node server.js
```
Confirmar que o endereço `http://localhost:3000` está acessível.

### Etapa 3 — Auditoria UX/UI e Anti-Monolito
Executar o script de auditoria:
```bash
node .agents/skills/ux_ui_auditor/scripts/audit_ux_ui.js
```

---

## Critérios de Qualidade Visual Avaliados:
1. **Dark Mode Coerente**: Ausência de fundos brancos acidentais (`bg-white` solto) em telas do gestor ou hub.
2. **Arredondamento Moderno**: Uso de `rounded-2xl` para cards e painéis, `rounded-xl` para botões e inputs. Proibido `rounded-none`.
3. **Glassmorphism e Glows**: Uso de backdrop-blur suave e efeitos de destaque nos cards de IA e Co-Piloto.
4. **Feedback de Interação**: Botões clicáveis devem ter hover states e animações de loading durante operações assíncronas.

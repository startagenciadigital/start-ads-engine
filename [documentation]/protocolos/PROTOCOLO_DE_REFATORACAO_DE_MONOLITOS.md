# 🧩 Protocolo de Refatoração de Monolitos (PRM)

## 1. Objetivo
Garantir que processos de refatoração de arquivos grandes ("monolíticos") sejam executados de forma segura, sem gerar **nenhum retrabalho** na parte visual (UI), na experiência do usuário (UX) e nos fluxos de API da plataforma.

---

## 2. A Trava Absoluta (Recortar e Colar Cirúrgico)
Toda e qualquer extração de submódulos deve seguir a regra da **Trava Absoluta**:
- O código HTML, as classes CSS e as funções de lógica devem ser **EXATAMENTE RECORTADOS** do arquivo original e **COLADOS** no novo módulo.
- É **estritamente proibido** renomear IDs, classes Tailwind ou alterar estruturas de dados durante uma refatoração puramente mecânica.
- O novo módulo deve exportar suas funções com clareza, mantendo a compatibilidade transparente.

---

## 3. Monitoramento Ativo (Anti-Monolith Watcher)
- O script `scripts/monolith-watcher.js` monitora os arquivos do projeto.
- Caso qualquer arquivo ultrapasse **500 linhas**, um alerta no console é disparado instruindo a modularização.
- Módulos candidatos imediatos a separação:
  - Extrair helpers de cálculo para `services/analyticsEngine.js`.
  - Extrair chamadas de IA para `services/geminiService.js`.
  - Manter manipuladores de rota em `api/` focados apenas na recepção e resposta de requisições.

---

## 4. Passos para Execução Segura
1. Realizar varredura com `node --check` antes de iniciar.
2. Criar um checkpoint git (`git add .` e `git commit -m "chore: ponto de restauracao pre-refatoracao"`).
3. Extrair os blocos aplicando a Trava Absoluta.
4. Validar os endpoints e telas no navegador antes de dar o passo como concluído.

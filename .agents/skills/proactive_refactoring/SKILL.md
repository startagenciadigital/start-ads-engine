---
name: Refatoração Proativa e Anti-Monolito
description: ACIONAR SEMPRE que editar, modificar ou adicionar código em arquivos muito grandes (> 350 linhas), arquivos monolíticos ou controladores sobrecarregados.
---

# Instruções de Refatoração Proativa e Anti-Monolito

Você deve atuar ativamente no monitoramento e combate à formação de arquivos monolíticos, garantindo que a arquitetura do projeto se mantenha modular, testável e manutenível.

## 1. Gatilho de Ação (Pausa e Alerta)
- Se a sua tarefa exigir que você altere ou adicione código a um arquivo com **mais de 350 a 500 linhas**, você deve avaliar a divisão lógica do arquivo antes de prosseguir com novas adições.
- Alerte o usuário de que o arquivo está se aproximando do limite de complexidade e sugira a extração de funções auxiliares ou submódulos.
- Proponha um plano claro de separação (ex: mover cálculos matemáticos para `services/analyticsEngine.js`, utilitários para `services/utils.js` ou componentes de interface).

## 2. A Trava Absoluta de Refatoração
Durante qualquer refatoração estrutural de interface ou lógica já aprovada:
1. O código HTML, CSS (Tailwind) e assinaturas de funções devem ser **EXATAMENTE RECORTADOS** e **COLADOS** nos novos módulos menores.
2. É expressamente proibido alterar regras visuais, classes ou IDs de forma não solicitada durante uma refatoração mecânica.
3. Garanta que todas as dependências e imports estejam devidamente referenciados no novo arquivo.

## 3. Padrão de Execução Segura
1. **Checkpoint Git:** Sempre verifique o estado do git ou crie um commit temporário antes de refatorações de grande porte.
2. **Validação de Sintaxe:** Execute `node --check` nos arquivos divididos.
3. **Validação de Rotas:** Teste o carregamento dos endpoints afetados antes de dar a refatoração como concluída.

# 🎨 Protocolo de Desenvolvimento UX / UI (START ADS ENGINE)

Este documento estabelece as regras estritas de interface (UI) e experiência do usuário (UX) que devem ser seguidas ao criar ou modificar telas e componentes da plataforma.

---

## 01. Regras de Tema Dark / Slate Moderno
- O tema oficial do START ADS ENGINE é Dark/Slate Luxo (`#090d16` de fundo, `#0f172a` para cartões e painéis, `#334155` para divisões).
- **NUNCA** utilize fundos brancos acidentais (`bg-white`) soltos fora do contexto de impressão (`print:`).
- Mantenha sempre contraste alto entre textos (`text-slate-100`, `text-slate-300`) e planos de fundo escuros.

---

## 02. Feedback Visual & Micro-interações
- **Ações de Demora:** Todo botão que dispara requisições para a Meta API ou Gemini (ex: "Auditar Campanha com IA", "Publicar Campanha", "Aplicar Sugestão") DEVE obrigatoriamente desabilitar-se (`disabled=true`) e exibir spinner com animação (`animate-spin`).
- **Hover & Transições:** Todos os cartões interativos e botões devem possuir transições suaves (`transition-all duration-200`, `hover:border-indigo-500`).

---

## 03. Glassmorphism & Indicadores de Status
- Painéis principais utilizam a classe `.glass-panel` (definida em `styles.css`) com leve desfoque de fundo (`backdrop-filter: blur(16px)`).
- Badges dinâmicos utilizam cores semânticas:
  - Verde (`text-emerald-400`, fundo `bg-emerald-500/20`): Aprovado, Saudável, Excelente.
  - Ciano (`text-cyan-400`, fundo `bg-cyan-500/20`): Hook Rate, Métricas de IA.
  - Rosa/Vermelho (`text-rose-400`, fundo `bg-rose-500/20`): Fadiga Crítica, Alertas.

---

## 04. Padrão de Arredondamento de Cantos
- **Containers, Painéis e Modais:** `rounded-2xl`.
- **Botões, Inputs e Seletores:** `rounded-xl`.
- **Badges e Tags:** `rounded-full` ou `rounded-lg`.
- **Proibição:** Nunca use cantos retos (`rounded-none`).

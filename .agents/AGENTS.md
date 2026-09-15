# Regras de Customização e Diretrizes do Projeto (START ADS ENGINE)

## 01. Regra de Padding para Menus Dropdown (Selects)
Ao criar ou modificar elementos HTML `<select>` estilizados com Tailwind CSS:
- **NÃO FAÇA:** Usar paddings simétricos horizontais como `px-3` ou `px-4` sem considerar a seta nativa do sistema operacional/navegador.
- **FAÇA:** Garanta um padding maior à direita (`pr-8` ou `pr-10`) e `appearance-none` quando usar ícones SVG customizados, para evitar sobreposição de textos em resoluções menores.

---

## 02. Protocolo Start (Início de Sessão Obrigatório)
Ao receber o comando **"protocolo start"** ou ao iniciar uma nova sessão de trabalho:
1. **Verificar Git:** Executar `git status` e `git fetch` para validar sincronia entre local e remoto.
2. **Garantir Servidor Ativo:** Verificar se o servidor Node/Express está respondendo em `http://localhost:3000`. Se não estiver, iniciar e reportar o link de acesso.
3. **Análise de Continuidade:** Verificar `CONTINUIDADE.md` e `DOCUMENTATION.md` para entender as últimas alterações e os próximos passos imediatos.

---

## 03. Protocolo Deploy (Build, Validação, Commit & Push)
Sempre que o usuário requisitar o comando **"deploy"**, **"Protocolo Deploy"** ou preparar publicação:
1. **Validar Sintaxe:** Executar `node --check` em todos os arquivos alterados e rodar teste de integridade.
2. **Auditoria de Variáveis:** Confirmar que chaves confidenciais (`META_ADS_ACCESS_TOKEN`, `GEMINI_API_KEY`) estão no `.env` e NUNCA hardcoded no código público.
3. **Commit Limpo:** Realizar `git add .` e `git commit -m "feat/fix: descrição objetiva"`.
4. **Push Remoto:** Enviar as alterações para o repositório remoto (`git push`).

---

## 04. Protocolo de Lançamento em Produção / Go-Live Seguro (Vercel)
Sempre que o usuário utilizar frases de gatilho como **"Vamos colocar no ar"**, **"Deploy em produção"**, **"Subir projeto"**:
A IA está expressamente orientada a validar a seguinte checklist pré-lançamento:
1. **Auditoria de Dependências:** Rodar `npm audit` para checar pacotes vulneráveis.
2. **Validação de Variáveis de Produção na Vercel:** Confirmar se `PORT`, `META_ADS_ACCESS_TOKEN`, `GEMINI_API_KEY` e `GEMINI_MODEL` estão presentes.
3. **Validação de Arquivos Estáticos:** Garantir que o `vercel.json` roteie `/api/*` e sirva a pasta `public/` sem conflitos de rotas.
4. **Verificação de Endpoints:** Testar requisições locais em `GET /api/contas` e `GET /api/metricas` com retorno 200 OK antes do disparo.

---

## 05. Idioma de Comunicação (Planos e Relatórios)
Sempre escreva os Planos de Implementação (`implementation_plan.md`), Walkthroughs (`walkthrough.md`) e quaisquer artefatos em **Português do Brasil**, mantendo comunicação técnica clara e precisa.

---

## 06. Auditoria Anti-Monolito Contínua
Você está expressamente orientado a policiar o crescimento descontrolado de arquivos:
- Se estiver editando ou criando arquivos que ultrapassem **350 a 500 linhas**, acione a mentalidade e a Skill de `Refatoração Proativa e Anti-Monolito`.
- Separe rotas, serviços e componentes em módulos focados (Single Responsibility Principle).
- Scripts auxiliares e cálculos pesados devem residir em `services/` (ex: `analyticsEngine.js`, `metaService.js`, `geminiService.js`), deixando os controladores de rota enxutos.

---

## 07. Auditoria de UX/UI Constante (Protocolo UX/UI)
Policie todas as edições de interface HTML, CSS e JavaScript:
1. **Dark Mode Coerente:** Utilizar a paleta moderna Dark/Slate (`#090d16`, `#0f172a`, bordas `slate-800`). Evitar classes `bg-white` soltas ou textos com baixo contraste.
2. **Cantos Arredondados Modernos:** Usar cantos suaves (`rounded-2xl` para painéis e containers, `rounded-xl` para botões e inputs). NUNCA usar `rounded-none`.
3. **Feedback Visual:** Toda ação assíncrona (como submeter campanha ou auditar pré-voo) DEVE desabilitar o botão e exibir feedback de carregamento (`animate-spin`).
4. **Responsividade:** Garantir que formulários e tabelas empilhem de forma elegante em telas mobile (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`).

---

## 08. Documentação como Fonte Única de Verdade (SSOT)
O arquivo `DOCUMENTATION.md` é a fonte única de verdade do projeto. A cada nova funcionalidade, rota de API ou alteração de arquitetura, atualize a documentação para manter a continuidade do desenvolvimento.

/**
 * START ADS ENGINE - Criador Universal de Campanhas Meta JS
 * Lógica do Wizard em 4 etapas, alternância de modos, preview e auditoria Pré-Voo com IA.
 */

let etapaAtual = 1;
let postsCarregados = [];

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();

  carregarContasDisponiveis();
  carregarPostsInstagram();
  calcularPacing();

  // Define data de início padrão para agora
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const inputStart = document.getElementById('input-start-time');
  if (inputStart) inputStart.value = now.toISOString().slice(0, 16);
});

/**
 * Carrega a lista de contas de anúncio no seletor
 */
async function carregarContasDisponiveis() {
  try {
    const res = await fetch('/api/contas');
    const data = await res.json();
    if (data.sucesso && data.contas && data.contas.length > 0) {
      const select = document.getElementById('select-conta');
      if (select) {
        select.innerHTML = data.contas.map(c => `
          <option value="${c.id}" class="bg-slate-900 text-white">${c.name} (${c.id})</option>
        `).join('');
      }
    }
  } catch (err) {
    console.warn('Erro ao carregar contas de anúncio:', err);
  }
}

/**
 * Navegação entre as 4 etapas do Wizard
 */
function irParaEtapa(etapa) {
  if (etapa < 1 || etapa > 4) return;
  etapaAtual = etapa;

  // Atualiza visibilidade dos painéis
  for (let i = 1; i <= 4; i++) {
    const secao = document.getElementById(`secao-etapa-${i}`);
    const badge = document.getElementById(`step-badge-${i}`);
    const text = document.getElementById(`step-text-${i}`);

    if (secao) {
      if (i === etapa) {
        secao.classList.remove('hidden');
      } else {
        secao.classList.add('hidden');
      }
    }

    if (badge && text) {
      if (i < etapa) {
        // Concluído
        badge.className = 'w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center shadow-md border-2 border-emerald-400 text-sm';
        badge.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i>';
        text.className = 'text-xs font-semibold text-emerald-400 mt-2';
      } else if (i === etapa) {
        // Atual
        badge.className = 'w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center shadow-lg shadow-indigo-600/40 border-2 border-indigo-400 text-sm';
        badge.innerText = i;
        text.className = 'text-xs font-bold text-white mt-2';
      } else {
        // Futuro
        badge.className = 'w-10 h-10 rounded-xl bg-slate-800 text-slate-400 font-bold flex items-center justify-center border-2 border-slate-700 text-sm';
        badge.innerText = i;
        text.className = 'text-xs font-medium text-slate-400 mt-2';
      }
    }
  }

  // Barra de progresso visual
  const stepBar = document.getElementById('step-bar-active');
  if (stepBar) {
    const porcentagens = { 1: '25%', 2: '50%', 3: '75%', 4: '100%' };
    stepBar.style.width = porcentagens[etapa];
  }

  if (window.lucide) window.lucide.createIcons();
  window.scrollTo({ top: 120, behavior: 'smooth' });
}

/**
 * Etapa 1: Selecionar Objetivo da Meta Marketing API
 */
function selecionarObjetivo(objetivo, elemento) {
  document.querySelectorAll('#secao-etapa-1 .selectable-card').forEach(el => el.classList.remove('selected'));
  if (elemento) elemento.classList.add('selected');

  const inputObj = document.getElementById('input-objective');
  if (inputObj) inputObj.value = objetivo;

  // Adapta campos dinâmicos conforme o objetivo
  const painelDinamico = document.getElementById('campo-dinamico-objetivo');
  const labelTitulo = document.getElementById('label-dinamico-titulo');

  if (labelTitulo && painelDinamico) {
    if (objetivo === 'OUTCOME_SALES') {
      labelTitulo.innerText = 'Configuração de Pixel e Evento de Conversão (Vendas)';
      painelDinamico.classList.remove('hidden');
    } else if (objetivo === 'OUTCOME_LEADS') {
      labelTitulo.innerText = 'Destino do Cadastro: Formulário Instantâneo / WhatsApp';
      painelDinamico.classList.remove('hidden');
    } else if (objetivo === 'OUTCOME_ENGAGEMENT') {
      labelTitulo.innerText = 'Foco de Engajamento: Vídeo ThruPlay ou Mensagens no Direct';
      painelDinamico.classList.remove('hidden');
    } else if (objetivo === 'OUTCOME_TRAFFIC') {
      labelTitulo.innerText = 'Otimização de Tráfego: Cliques no Link / Visualizações da Página';
      painelDinamico.classList.remove('hidden');
    } else {
      labelTitulo.innerText = 'Otimização Padrão para Máximo Alcance e Frequência';
      painelDinamico.classList.remove('hidden');
    }
  }
}

/**
 * Etapa 2: Alternar Orçamento Diário vs CBO
 */
function selecionarTipoOrcamento(tipo, elemento) {
  document.querySelectorAll('.budget-card').forEach(el => {
    el.classList.remove('selected', 'border-indigo-500/60', 'bg-indigo-500/10');
    el.classList.add('border-slate-800', 'bg-slate-900/50');
  });

  if (elemento) {
    elemento.classList.add('selected', 'border-indigo-500/60', 'bg-indigo-500/10');
    elemento.classList.remove('border-slate-800', 'bg-slate-900/50');
  }

  const input = document.getElementById('input-budget-type');
  if (input) input.value = tipo;
  calcularPacing();
}

/**
 * Cálculo de Pacing e Entregas Estimadas
 */
function calcularPacing() {
  const budgetInput = document.getElementById('input-budget-amount');
  const gastoMesEl = document.getElementById('pacing-gasto-mes');
  const alcanceEl = document.getElementById('pacing-alcance');

  const diario = Number(budgetInput?.value || 50);
  const mensal = diario * 30;

  if (gastoMesEl) {
    gastoMesEl.innerText = `R$ ${mensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  }

  if (alcanceEl) {
    const minAlcance = Math.round((mensal / 25) * 450);
    const maxAlcance = Math.round((mensal / 18) * 650);
    alcanceEl.innerText = `~${(minAlcance / 1000).toFixed(0)}k a ${(maxAlcance / 1000).toFixed(0)}k pessoas`;
  }
}

/**
 * Etapa 3: Alternar Tipo de Geolocalização (Cidades vs Raio)
 */
function alternarTipoGeo(tipo) {
  const btnCidades = document.getElementById('btn-geo-cidades');
  const btnRaio = document.getElementById('btn-geo-raio');
  const painelCidades = document.getElementById('painel-geo-cidades');
  const painelRaio = document.getElementById('painel-geo-raio');

  if (tipo === 'CIDADES') {
    btnCidades.className = 'px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-all';
    btnRaio.className = 'px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all';
    painelCidades.classList.remove('hidden');
    painelRaio.classList.add('hidden');
  } else {
    btnRaio.className = 'px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-all';
    btnCidades.className = 'px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all';
    painelRaio.classList.remove('hidden');
    painelCidades.classList.add('hidden');
  }
  if (window.lucide) window.lucide.createIcons();
}

function adicionarInteresse(interesse) {
  const input = document.getElementById('input-interests');
  if (!input) return;
  if (input.value.includes(interesse)) return;
  input.value = input.value ? `${input.value}, ${interesse}` : interesse;
}

/**
 * Etapa 4: Alternar Modo Criativo (Post Existente vs Novo Anúncio)
 */
function alternarModoCriativo(modo) {
  const btnExistente = document.getElementById('btn-modo-existente');
  const btnNovo = document.getElementById('btn-modo-novo');
  const painelExistente = document.getElementById('painel-post-existente');
  const painelNovo = document.getElementById('painel-novo-anuncio');
  const inputModo = document.getElementById('input-creative-mode');

  if (inputModo) inputModo.value = modo;

  if (modo === 'EXISTING_POST') {
    btnExistente.className = 'p-4 rounded-xl border border-indigo-500/60 bg-indigo-500/10 text-left transition-all';
    btnNovo.className = 'p-4 rounded-xl border border-slate-800 bg-slate-900/50 text-left hover:border-slate-700 transition-all';
    painelExistente.classList.remove('hidden');
    painelNovo.classList.add('hidden');
  } else {
    btnNovo.className = 'p-4 rounded-xl border border-indigo-500/60 bg-indigo-500/10 text-left transition-all';
    btnExistente.className = 'p-4 rounded-xl border border-slate-800 bg-slate-900/50 text-left hover:border-slate-700 transition-all';
    painelNovo.classList.remove('hidden');
    painelExistente.classList.add('hidden');
  }
  if (window.lucide) window.lucide.createIcons();
}

/**
 * Busca Posts Recentes do Instagram para a Galeria
 */
async function carregarPostsInstagram() {
  const grid = document.getElementById('grid-posts-instagram');
  if (!grid) return;

  grid.innerHTML = `<div class="col-span-full py-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
    <i data-lucide="loader" class="w-4 h-4 animate-spin text-cyan-400"></i>
    <span>Buscando publicações do Instagram...</span>
  </div>`;
  if (window.lucide) window.lucide.createIcons();

  try {
    const res = await fetch('/api/posts-instagram/me');
    const data = await res.json();

    if (data.sucesso && data.posts && data.posts.length > 0) {
      postsCarregados = data.posts;
      renderizarPostsInstagram(postsCarregados);
    } else {
      grid.innerHTML = `<div class="col-span-full py-8 text-center text-slate-400 text-xs">Nenhuma publicação encontrada no feed conectado.</div>`;
    }
  } catch (err) {
    grid.innerHTML = `<div class="col-span-full py-8 text-center text-rose-400 text-xs">Falha ao carregar posts: ${err.message}</div>`;
  }
  if (window.lucide) window.lucide.createIcons();
}

function renderizarPostsInstagram(posts) {
  const grid = document.getElementById('grid-posts-instagram');
  if (!grid) return;

  grid.innerHTML = posts.map((post, idx) => `
    <div onclick="selecionarPost('${post.id}', '${post.thumbnail_url}', this)" class="post-card group relative rounded-xl overflow-hidden border border-slate-800 hover:border-indigo-500 cursor-pointer transition-all bg-slate-900 ${idx === 0 ? 'ring-2 ring-indigo-500' : ''}">
      <img src="${post.thumbnail_url}" alt="Post" class="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300">
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex flex-col justify-end p-2.5">
        <div class="flex items-center gap-2 text-[10px] text-slate-300">
          <span class="flex items-center gap-0.5"><i data-lucide="heart" class="w-3 h-3 text-rose-400"></i> ${post.like_count}</span>
          <span class="flex items-center gap-0.5"><i data-lucide="message-circle" class="w-3 h-3 text-cyan-400"></i> ${post.comments_count}</span>
        </div>
        <p class="text-[10px] text-white font-medium truncate mt-1">${post.caption}</p>
      </div>
      <div class="check-badge absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center ${idx === 0 ? '' : 'hidden'}">
        <i data-lucide="check" class="w-3 h-3"></i>
      </div>
    </div>
  `).join('');

  // Seleciona o primeiro por padrão
  if (posts.length > 0) {
    const inputId = document.getElementById('input-selected-post-id');
    const inputThumb = document.getElementById('input-selected-post-thumb');
    if (inputId) inputId.value = posts[0].id;
    if (inputThumb) inputThumb.value = posts[0].thumbnail_url;
  }
}

function selecionarPost(postId, thumbUrl, cardEl) {
  document.querySelectorAll('.post-card').forEach(c => {
    c.classList.remove('ring-2', 'ring-indigo-500');
    c.querySelector('.check-badge')?.classList.add('hidden');
  });

  if (cardEl) {
    cardEl.classList.add('ring-2', 'ring-indigo-500');
    cardEl.querySelector('.check-badge')?.classList.remove('hidden');
  }

  const inputId = document.getElementById('input-selected-post-id');
  const inputThumb = document.getElementById('input-selected-post-thumb');
  if (inputId) inputId.value = postId;
  if (inputThumb) inputThumb.value = thumbUrl;
}

/**
 * Preview ao Vivo de Criativo Novo
 */
function previewMidiaUpload(event) {
  const file = event.target.files?.[0];
  if (file) {
    const url = URL.createObjectURL(file);
    const imgEl = document.getElementById('preview-image');
    if (imgEl) imgEl.src = url;
  }
}

function atualizarPreview() {
  const headline = document.getElementById('input-headline')?.value || 'Título do Anúncio';
  const copy = document.getElementById('input-primary-text')?.value || 'Texto da copy...';
  const cta = document.getElementById('select-cta');
  const ctaText = cta ? cta.options[cta.selectedIndex].text : 'Saiba Mais';

  const previewHeadline = document.getElementById('preview-headline');
  const previewCopy = document.getElementById('preview-copy');
  const previewCtaBtn = document.getElementById('preview-cta-btn');

  if (previewHeadline) previewHeadline.innerText = headline;
  if (previewCopy) previewCopy.innerText = copy;
  if (previewCtaBtn) previewCtaBtn.innerText = ctaText;
}

/**
 * 5. Auditoria Pré-Voo com Google Gemini Flash
 */
async function executarAuditoriaPreVoo() {
  const btn = document.getElementById('btn-auditar-ia');
  const originalHtml = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<i data-lucide="loader" class="w-4 h-4 animate-spin text-white"></i><span>Auditando com Gemini...</span>`;
  if (window.lucide) window.lucide.createIcons();

  const rascunho = coletarDadosFormulario();

  try {
    const res = await fetch('/api/pre-voo-ia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rascunho)
    });
    const data = await res.json();

    if (data.sucesso && data.analise) {
      exibirModalPreVoo(data.analise);
    } else {
      alert('Não foi possível concluir a auditoria da IA. Verifique as configurações.');
    }
  } catch (err) {
    alert(`Erro na comunicação com a IA: ${err.message}`);
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalHtml;
    if (window.lucide) window.lucide.createIcons();
  }
}

function exibirModalPreVoo(analise) {
  const modal = document.getElementById('modal-pre-voo');
  if (!modal) return;

  document.getElementById('ai-score-geral').innerText = `${analise.score_geral || 85}/100`;
  document.getElementById('ai-nota-copy').innerText = `${analise.nota_copy || 80}/100`;
  document.getElementById('ai-parecer-copy').innerText = analise.parecer_copy || 'Copy bem estruturada.';
  document.getElementById('ai-status-orcamento').innerText = analise.analise_orcamento?.status || 'Ideal';

  // Pontos fortes
  const listaFortes = document.getElementById('ai-pontos-fortes');
  listaFortes.innerHTML = (analise.pontos_fortes || []).map(p => `
    <li class="flex items-start gap-1.5"><span class="text-emerald-400">•</span><span>${p}</span></li>
  `).join('');

  // Alertas
  const listaAlertas = document.getElementById('ai-alertas-risco');
  listaAlertas.innerHTML = (analise.alertas_risco || []).map(a => `
    <li class="flex items-start gap-1.5"><span class="text-rose-400">•</span><span>${a}</span></li>
  `).join('');

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function fecharModalPreVoo() {
  const modal = document.getElementById('modal-pre-voo');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

/**
 * Coleta os campos do formulário para envio ou auditoria
 */
function coletarDadosFormulario() {
  const form = document.getElementById('form-criar-campanha');
  const formData = new FormData(form);
  const dados = {};
  formData.forEach((value, key) => {
    dados[key] = value;
  });

  dados.ad_account_id = document.getElementById('select-conta')?.value;
  dados.advantage_audience = document.getElementById('check-advantage-audience')?.checked ?? true;
  dados.age_min = document.getElementById('input-age-min')?.value || 18;
  dados.age_max = document.getElementById('input-age-max')?.value || 65;
  dados.gender = document.getElementById('input-gender')?.value || 'ALL';
  dados.interests = document.getElementById('input-interests')?.value;

  const safetyRadio = document.querySelector('input[name="safety_status"]:checked');
  dados.safety_status = safetyRadio ? safetyRadio.value : 'PAUSED';

  return dados;
}

/**
 * Submissão final da campanha para a Meta Marketing API
 */
async function submeterCampanha() {
  const submitBtn = document.getElementById('btn-submit-campanha');
  const originalHtml = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<i data-lucide="loader" class="w-4 h-4 animate-spin text-white"></i><span>Criando na Meta API...</span>`;
  if (window.lucide) window.lucide.createIcons();

  const form = document.getElementById('form-criar-campanha');
  const formData = new FormData(form);

  // Garante dados extras no formData
  formData.append('ad_account_id', document.getElementById('select-conta')?.value || '');
  formData.append('advantage_audience', document.getElementById('check-advantage-audience')?.checked ? 'true' : 'false');
  formData.append('age_min', document.getElementById('input-age-min')?.value || '18');
  formData.append('age_max', document.getElementById('input-age-max')?.value || '65');
  formData.append('gender', document.getElementById('input-gender')?.value || 'ALL');
  formData.append('interests', document.getElementById('input-interests')?.value || '');

  try {
    const res = await fetch('/api/criar-campanha', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    if (data.sucesso) {
      alert(`🎉 Sucesso! Campanha criada com sucesso na Meta API em modo [${data.status}]!\nRedirecionando para o Dashboard do Gestor...`);
      window.location.href = '/gestor';
    } else {
      alert(`Falha na criação da campanha: ${data.erro || 'Erro desconhecido'}`);
    }
  } catch (err) {
    alert(`Erro ao enviar campanha: ${err.message}`);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalHtml;
    if (window.lucide) window.lucide.createIcons();
  }
}

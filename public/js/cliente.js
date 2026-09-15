/**
 * START ADS ENGINE - Portal do Cliente JS
 * Autenticação por PIN de 4-6 dígitos via Supabase, sessão 24h e renderização executiva.
 */

let contaClienteId = 'act_1717085079153654';

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();

  const urlParams = new URLSearchParams(window.location.search);
  const contaParam = urlParams.get('conta');
  if (contaParam) contaClienteId = contaParam;

  // Verifica se já possui sessão ativa por PIN
  verificarSessaoPin();
});

/**
 * Verifica se o cliente já possui um token de 24h salvo no localStorage
 */
function verificarSessaoPin() {
  const chaveStorage = `start_ads_pin_token_${contaClienteId}`;
  const tokenSalvo = localStorage.getItem(chaveStorage);

  if (tokenSalvo) {
    try {
      const decoded = atob(tokenSalvo);
      const [contaToken, expiraEm] = decoded.split(':');

      if (contaToken === contaClienteId && Number(expiraEm) > Date.now()) {
        desbloquearInterfaceCliente();
        carregarPortalCliente();
        return;
      } else {
        localStorage.removeItem(chaveStorage);
      }
    } catch (e) {
      localStorage.removeItem(chaveStorage);
    }
  }

  // Se não estiver autenticado, mantém o modal visível
  exibirModalBloqueio();
}

function exibirModalBloqueio() {
  const modal = document.getElementById('modal-bloqueio-pin');
  const conteudo = document.getElementById('conteudo-portal-cliente');
  const btnSair = document.getElementById('btn-sair-pin');

  if (modal) modal.classList.remove('hidden');
  if (conteudo) conteudo.classList.add('hidden');
  if (btnSair) btnSair.classList.add('hidden');

  const inputPin = document.getElementById('input-pin-cliente');
  if (inputPin) {
    inputPin.value = '';
    setTimeout(() => inputPin.focus(), 150);
  }
}

function desbloquearInterfaceCliente() {
  const modal = document.getElementById('modal-bloqueio-pin');
  const conteudo = document.getElementById('conteudo-portal-cliente');
  const btnSair = document.getElementById('btn-sair-pin');

  if (modal) modal.classList.add('hidden');
  if (conteudo) conteudo.classList.remove('hidden');
  if (btnSair) btnSair.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}

/**
 * Validação do PIN digitado contra o Supabase (/api/auth-pin)
 */
async function validarPinForm() {
  const inputPin = document.getElementById('input-pin-cliente');
  const pinValor = inputPin?.value?.trim();
  const erroBox = document.getElementById('pin-erro-mensagem');
  const erroTexto = document.getElementById('pin-erro-texto');
  const btn = document.getElementById('btn-desbloquear-pin');

  if (!pinValor || pinValor.length < 4) {
    erroBox?.classList.remove('hidden');
    if (erroTexto) erroTexto.innerText = 'Digite um PIN válido de no mínimo 4 dígitos.';
    return;
  }

  const originalHtml = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<i data-lucide="loader" class="w-4 h-4 animate-spin text-white"></i><span>Validando no Supabase...</span>`;
  if (window.lucide) window.lucide.createIcons();

  try {
    const res = await fetch('/api/auth-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conta_id: contaClienteId,
        pin: pinValor
      })
    });

    const data = await res.json();

    if (data.sucesso && data.token) {
      erroBox?.classList.add('hidden');
      localStorage.setItem(`start_ads_pin_token_${contaClienteId}`, data.token);
      desbloquearInterfaceCliente();
      carregarPortalCliente();
    } else {
      erroBox?.classList.remove('hidden');
      if (erroTexto) erroTexto.innerText = data.erro || 'PIN de segurança incorreto.';
      inputPin.value = '';
      inputPin.focus();
    }
  } catch (err) {
    erroBox?.classList.remove('hidden');
    if (erroTexto) erroTexto.innerText = `Erro de conexão: ${err.message}`;
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalHtml;
    if (window.lucide) window.lucide.createIcons();
  }
}

/**
 * Bloqueia a sessão e exige o PIN novamente
 */
function bloquearSessaoCliente() {
  localStorage.removeItem(`start_ads_pin_token_${contaClienteId}`);
  exibirModalBloqueio();
}

/**
 * Carrega dados executivos do cliente
 */
async function carregarPortalCliente() {
  try {
    const resMetricas = await fetch(`/api/metricas/${contaClienteId}`);
    const dataMetricas = await resMetricas.json();

    if (dataMetricas.sucesso && dataMetricas.dados) {
      const { conta, resumo, anuncios } = dataMetricas.dados;

      // Topo
      document.getElementById('nome-cliente-topo').innerText = conta.client_name || conta.name;
      document.getElementById('id-conta-topo').innerText = conta.id;

      // KPIs Comerciais
      document.getElementById('cliente-spend').innerText = `R$ ${Number(resumo.spend || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
      document.getElementById('cliente-reach').innerText = Number(resumo.reach || 0).toLocaleString('pt-BR');
      document.getElementById('cliente-clicks').innerText = Number(resumo.clicks || 0).toLocaleString('pt-BR');
      document.getElementById('cliente-cpc').innerText = `R$ ${Number(resumo.cpc || 0).toFixed(2)}`;

      // Ranking de vídeos
      renderizarVideosMaisAssistidos(anuncios || []);
    }

    // Busca resumo executivo da IA
    carregarResumoExecutivoIA();
  } catch (err) {
    console.error('Erro ao carregar portal do cliente:', err);
  }
}

function renderizarVideosMaisAssistidos(anuncios) {
  const grid = document.getElementById('grid-videos-destaque');
  if (!grid) return;

  const videos = anuncios
    .filter(a => a.impressions > 0)
    .sort((a, b) => (b.video_3s_views || b.impressions) - (a.video_3s_views || a.impressions))
    .slice(0, 3);

  if (videos.length === 0) {
    grid.innerHTML = `<div class="col-span-full py-8 text-center text-slate-500 text-xs">Aguardando veiculação dos primeiros criativos de vídeo.</div>`;
    return;
  }

  grid.innerHTML = videos.map((v, i) => `
    <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-3">
      <div class="relative rounded-lg overflow-hidden">
        <img src="${v.thumbnail_url || 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80'}" alt="${v.name}" class="w-full h-36 object-cover">
        <span class="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-white font-bold text-[10px]">
          #${i + 1} Mais Visto
        </span>
      </div>

      <div>
        <h4 class="text-xs font-bold text-white line-clamp-1">${v.name}</h4>
        <p class="text-[11px] text-slate-400 mt-1">${(v.impressions || 0).toLocaleString('pt-BR')} visualizações totais</p>
      </div>

      <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
        <span class="text-emerald-400 font-semibold">
          ${v.hook_rate ? `${v.hook_rate}% atenção inicial` : 'Alta retenção'}
        </span>
        <span class="text-slate-400">
          ${(v.clicks || 0)} cliques gerados
        </span>
      </div>
    </div>
  `).join('');

  if (window.lucide) window.lucide.createIcons();
}

async function carregarResumoExecutivoIA() {
  try {
    const res = await fetch(`/api/analise-ia/${contaClienteId}?tipo=CLIENTE`);
    const data = await res.json();

    if (data.sucesso && data.resumo) {
      const r = data.resumo;

      document.getElementById('ia-saudacao').innerText = r.saudacao || 'Relatório de Transparência da Conta';
      document.getElementById('ia-destaque').innerText = r.destaque_principal || 'Campanhas preparadas e ativas.';
      document.getElementById('ia-desempenho').innerText = r.paragrafo_desempenho || '';
      document.getElementById('ia-parecer-final').innerText = `"${r.parecer_final || 'Operação alinhada com o planejamento estratégico.'}"`;

      const listaPositivos = document.getElementById('ia-pontos-positivos');
      listaPositivos.innerHTML = (r.pontos_positivos || []).map(p => `
        <li class="flex items-start gap-2">
          <span class="text-emerald-400 font-bold">•</span>
          <span>${p}</span>
        </li>
      `).join('');

      const listaPassos = document.getElementById('ia-proximos-passos');
      listaPassos.innerHTML = (r.proximos_passos || []).map(p => `
        <li class="flex items-start gap-2">
          <span class="text-cyan-400 font-bold">•</span>
          <span>${p}</span>
        </li>
      `).join('');
    }
  } catch (err) {
    console.warn('Erro ao carregar resumo executivo da IA:', err);
  }
}

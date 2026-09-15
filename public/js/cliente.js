/**
 * START ADS ENGINE - Portal do Cliente JS
 * Renderização executiva, sem termos técnicos pesados, com Resumo Executivo em IA.
 */

let contaClienteId = 'act_1717085079153654';

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();

  const urlParams = new URLSearchParams(window.location.search);
  const contaParam = urlParams.get('conta');
  if (contaParam) contaClienteId = contaParam;

  carregarPortalCliente();
});

async function carregarPortalCliente() {
  try {
    // 1. Busca métricas gerais e lista de criativos
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

    // 2. Busca resumo executivo da IA (Google Gemini)
    carregarResumoExecutivoIA();
  } catch (err) {
    console.error('Erro ao carregar portal do cliente:', err);
  }
}

/**
 * Renderiza os 3 vídeos mais assistidos
 */
function renderizarVideosMaisAssistidos(anuncios) {
  const grid = document.getElementById('grid-videos-destaque');
  if (!grid) return;

  // Filtra criativos de vídeo ou com visualizações
  const videos = anuncios
    .filter(a => a.impressions > 0)
    .sort((a, b) => (b.video_3s_views || b.impressions) - (a.video_3s_views || a.impressions))
    .slice(0, 3);

  if (videos.length === 0) {
    grid.innerHTML = `<div class="col-span-full py-6 text-center text-slate-500 text-xs">Nenhum criativo em destaque neste ciclo.</div>`;
    return;
  }

  grid.innerHTML = videos.map((v, i) => `
    <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-3">
      <div class="relative rounded-lg overflow-hidden">
        <img src="${v.thumbnail_url}" alt="${v.name}" class="w-full h-36 object-cover">
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

/**
 * Busca e renderiza o Parecer da IA do Gemini
 */
async function carregarResumoExecutivoIA() {
  try {
    const res = await fetch(`/api/analise-ia/${contaClienteId}?tipo=CLIENTE`);
    const data = await res.json();

    if (data.sucesso && data.resumo) {
      const r = data.resumo;

      document.getElementById('ia-saudacao').innerText = r.saudacao || 'Relatório Mensal Consolidado';
      document.getElementById('ia-destaque').innerText = r.destaque_principal || 'Campanhas com excelente tração.';
      document.getElementById('ia-desempenho').innerText = r.paragrafo_desempenho || '';
      document.getElementById('ia-parecer-final').innerText = `"${r.parecer_final || 'Operação saudável e dentro do planejamento estratégico.'}"`;

      // Pontos Positivos
      const listaPositivos = document.getElementById('ia-pontos-positivos');
      listaPositivos.innerHTML = (r.pontos_positivos || []).map(p => `
        <li class="flex items-start gap-2">
          <span class="text-emerald-400 font-bold">•</span>
          <span>${p}</span>
        </li>
      `).join('');

      // Próximos Passos
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

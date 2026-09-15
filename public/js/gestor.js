/**
 * START ADS ENGINE - Dashboard do Gestor JS
 * Gráficos Chart.js, Métricas de Vídeo (Hook / Hold Rate), Fadiga e Co-Piloto 1-Click
 */

let contaAtualId = 'act_1717085079153654';
let chartCPMInstance = null;
let acaoCopilotoAtual = null;

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();

  // Verifica se há conta passada via query string
  const urlParams = new URLSearchParams(window.location.search);
  const contaParam = urlParams.get('conta');
  if (contaParam) contaAtualId = contaParam;

  carregarContasGestor();
  carregarDadosDashboard();
});

/**
 * Carrega a lista de contas no dropdown
 */
async function carregarContasGestor() {
  try {
    const res = await fetch('/api/contas');
    const data = await res.json();
    if (data.sucesso && data.contas && data.contas.length > 0) {
      const select = document.getElementById('select-conta-gestor');
      if (select) {
        select.innerHTML = data.contas.map(c => `
          <option value="${c.id}" ${c.id === contaAtualId ? 'selected' : ''} class="bg-slate-900 text-white">
            ${c.name} (${c.id})
          </option>
        `).join('');
      }
    }
  } catch (err) {
    console.warn('Erro ao listar contas no gestor:', err);
  }
}

/**
 * Troca de conta ativa
 */
function trocarConta(novaContaId) {
  contaAtualId = novaContaId;
  const linkCliente = document.getElementById('link-portal-cliente');
  if (linkCliente) linkCliente.href = `/cliente?conta=${novaContaId}`;
  carregarDadosDashboard();
}

/**
 * Carrega métricas consolidadas, gráfico e diagnóstico do Co-Piloto
 */
async function carregarDadosDashboard() {
  const linkCliente = document.getElementById('link-portal-cliente');
  if (linkCliente) linkCliente.href = `/cliente?conta=${contaAtualId}`;

  try {
    // 1. Busca métricas da conta
    const resMetricas = await fetch(`/api/metricas/${contaAtualId}`);
    const dataMetricas = await resMetricas.json();

    if (dataMetricas.sucesso && dataMetricas.dados) {
      atualizarKpisGerais(dataMetricas.dados.resumo);
      renderizarGraficoCPM(dataMetricas.dados.curva_cpm);
      renderizarTabelaCriativos(dataMetricas.dados.anuncios || []);
    }

    // 2. Busca diagnóstico do Co-Piloto IA
    carregarCopilotoIA();
  } catch (err) {
    console.error('Erro ao carregar dashboard:', err);
  }
}

/**
 * Atualiza os cards de KPI
 */
function atualizarKpisGerais(resumo) {
  if (!resumo) return;

  document.getElementById('kpi-spend').innerText = `R$ ${Number(resumo.spend || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  document.getElementById('kpi-impressions').innerText = Number(resumo.impressions || 0).toLocaleString('pt-BR');
  document.getElementById('kpi-reach').innerText = `${Number(resumo.reach || 0).toLocaleString('pt-BR')} alcance`;
  document.getElementById('kpi-clicks').innerHTML = `${Number(resumo.clicks || 0).toLocaleString('pt-BR')} <span class="text-xs font-normal text-cyan-400">(${resumo.ctr || 0}%)</span>`;
  document.getElementById('kpi-cpm').innerText = `R$ ${Number(resumo.cpm || 0).toFixed(2)}`;
  document.getElementById('cpm-media-chart').innerText = `R$ ${Number(resumo.cpm || 0).toFixed(2)}`;

  // Hook Rate (Taxa de Gancho 3s)
  const hookEl = document.getElementById('kpi-hook-rate');
  const hookStatusEl = document.getElementById('kpi-hook-status');
  const hook = Number(resumo.hook_rate_medio || 0);
  hookEl.innerText = `${hook.toFixed(1)}%`;
  if (hook >= 30) {
    hookStatusEl.innerText = 'Excelente (> 30%)';
    hookStatusEl.className = 'text-[10px] text-emerald-400 font-semibold';
  } else if (hook >= 20) {
    hookStatusEl.innerText = 'Bom (> 20%)';
    hookStatusEl.className = 'text-[10px] text-cyan-400 font-semibold';
  } else {
    hookStatusEl.innerText = 'Atenção (< 20%)';
    hookStatusEl.className = 'text-[10px] text-amber-400 font-semibold';
  }

  // Hold Rate
  document.getElementById('kpi-hold-rate').innerText = `${Number(resumo.hold_rate_medio || 0).toFixed(1)}%`;
}

/**
 * Renderiza o gráfico de curva de CPM com Chart.js
 */
function renderizarGraficoCPM(dadosCurva) {
  const canvas = document.getElementById('chart-cpm');
  if (!canvas) return;

  if (chartCPMInstance) {
    chartCPMInstance.destroy();
  }

  const ctx = canvas.getContext('2d');

  chartCPMInstance = new Chart(ctx, {
    type: 'line',
    data: dadosCurva,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 11 } }
        },
        tooltip: {
          backgroundColor: '#0f172a',
          titleColor: '#f8fafc',
          bodyColor: '#94a3b8',
          borderColor: '#334155',
          borderWidth: 1,
          padding: 10
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(51, 65, 85, 0.3)' },
          ticks: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans' } }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: { display: true, text: 'CPM (R$)', color: '#38bdf8' },
          grid: { color: 'rgba(51, 65, 85, 0.3)' },
          ticks: { color: '#38bdf8', callback: (v) => `R$ ${v}` }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: { display: true, text: 'Impressões (milhares)', color: '#a855f7' },
          grid: { drawOnChartArea: false },
          ticks: { color: '#a855f7' }
        }
      }
    }
  });
}

/**
 * Renderiza tabela de criativos com Hook Rate, Hold Rate e Fadiga
 */
function renderizarTabelaCriativos(anuncios) {
  const tbody = document.getElementById('tabela-criativos-body');
  if (!tbody) return;

  if (anuncios.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="py-6 text-center text-slate-500">Nenhum anúncio encontrado.</td></tr>`;
    return;
  }

  tbody.innerHTML = anuncios.map(ad => {
    const isFadigado = ad.analise_fadiga?.fadigado;
    const isAtencao = ad.analise_fadiga?.nivel === 'ATENCAO';
    const isAtivo = ad.status === 'ACTIVE';

    let badgeFadigaHtml = `<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">Saudável</span>`;
    if (isFadigado) {
      badgeFadigaHtml = `<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 border border-rose-500/40 text-rose-300 flex items-center gap-1 w-fit"><span class="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>Fadigado</span>`;
    } else if (isAtencao) {
      badgeFadigaHtml = `<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300">Atenção</span>`;
    }

    const hookBadgeClass = ad.hook_rate >= 30 ? 'text-emerald-400' : (ad.hook_rate >= 20 ? 'text-cyan-400' : 'text-slate-400');
    const holdBadgeClass = ad.hold_rate >= 25 ? 'text-emerald-400' : 'text-slate-400';

    return `
      <tr class="hover:bg-slate-900/50 transition-colors">
        <td class="py-3.5 px-4">
          <div class="flex items-center gap-3">
            <img src="${ad.thumbnail_url}" alt="${ad.name}" class="w-10 h-10 rounded-lg object-cover border border-slate-800 flex-shrink-0">
            <div class="max-w-[180px] sm:max-w-[240px]">
              <p class="font-semibold text-white truncate text-xs">${ad.name}</p>
              <p class="text-[10px] text-slate-500">${ad.creative_type || 'VÍDEO'}</p>
            </div>
          </div>
        </td>

        <td class="py-3.5 px-3">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold ${isAtivo ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'}">
            ${isAtivo ? 'ATIVO' : 'PAUSADO'}
          </span>
        </td>

        <td class="py-3.5 px-3">
          <span class="font-bold text-xs ${hookBadgeClass}">${ad.hook_rate || 0}%</span>
          <span class="text-[10px] text-slate-500 block">${ad.hook_classificacao || 'N/A'}</span>
        </td>

        <td class="py-3.5 px-3">
          <span class="font-bold text-xs ${holdBadgeClass}">${ad.hold_rate || 0}%</span>
          <span class="text-[10px] text-slate-500 block">${ad.hold_classificacao || 'N/A'}</span>
        </td>

        <td class="py-3.5 px-3 font-semibold ${ad.frequency >= 2.5 ? 'text-rose-400 font-bold' : 'text-slate-300'}">
          ${Number(ad.frequency || 1.0).toFixed(1)}x
        </td>

        <td class="py-3.5 px-3">
          <span class="text-slate-200 block">${ad.ctr || 0}% CTR</span>
          <span class="text-[10px] text-slate-500 block">R$ ${Number(ad.cpc || 0).toFixed(2)} CPC</span>
        </td>

        <td class="py-3.5 px-3">
          ${badgeFadigaHtml}
          <span class="text-[9px] text-slate-500 block mt-0.5 max-w-[160px] truncate" title="${ad.analise_fadiga?.motivo}">${ad.analise_fadiga?.motivo}</span>
        </td>

        <td class="py-3.5 px-4 text-right">
          <button onclick="alternarStatusCriativo('${ad.id}', '${isAtivo ? 'PAUSED' : 'ACTIVE'}')" class="px-2.5 py-1 rounded-lg ${isAtivo ? 'bg-rose-950/40 text-rose-300 border border-rose-800 hover:bg-rose-900/60' : 'bg-emerald-950/40 text-emerald-300 border border-emerald-800 hover:bg-emerald-900/60'} text-[11px] font-semibold transition-all">
            ${isAtivo ? 'Pausar' : 'Ativar'}
          </button>
        </td>
      </tr>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

/**
 * 3. Diagnóstico do Co-Piloto IA (Human-in-the-Loop)
 */
async function carregarCopilotoIA() {
  try {
    const res = await fetch(`/api/analise-ia/${contaAtualId}?tipo=COPILOTO`);
    const data = await res.json();

    if (data.sucesso && data.copiloto) {
      const cop = data.copiloto;
      acaoCopilotoAtual = cop.acao_proposta;

      document.getElementById('copiloto-titulo').innerText = cop.titulo || 'Monitoramento em Tempo Real';
      document.getElementById('copiloto-descricao').innerText = cop.diagnostico_detalhado || 'Sem anomalias críticas.';
      document.getElementById('copiloto-impacto').innerText = cop.acao_proposta?.descricao_impacto || 'Ação calibrada pela IA.';
      document.getElementById('copiloto-botao-texto').innerText = cop.acao_proposta?.rotulo_botao || 'Aplicar Otimização';

      const sevEl = document.getElementById('copiloto-severidade');
      if (cop.severidade === 'CRITICA') {
        sevEl.innerText = 'Alerta Crítico Detectado';
        sevEl.className = 'text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30';
      } else {
        sevEl.innerText = 'Otimização Sugerida';
        sevEl.className = 'text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30';
      }
    }
  } catch (err) {
    console.warn('Erro ao obter diagnóstico do co-piloto:', err);
  }
}

/**
 * Executa a ação do Co-Piloto com 1 clique (Human-in-the-Loop)
 */
async function executarAcaoCopiloto() {
  if (!acaoCopilotoAtual) return;

  const btn = document.getElementById('btn-aplicar-sugestao');
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<i data-lucide="loader" class="w-4 h-4 animate-spin"></i><span>Aplicando via Meta API...</span>`;
  if (window.lucide) window.lucide.createIcons();

  try {
    const res = await fetch('/api/executar-acao', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tipo: acaoCopilotoAtual.tipo,
        payload: acaoCopilotoAtual.payload
      })
    });

    const data = await res.json();
    if (data.sucesso) {
      alert(`⚡ Ação do Co-Piloto executada com sucesso!\n${data.resultado?.mensagem || 'Operação confirmada na Meta API.'}`);
      carregarDadosDashboard(); // Recarrega métricas imediatamente
    } else {
      alert(`Falha ao executar ação: ${data.erro || 'Erro desconhecido'}`);
    }
  } catch (err) {
    alert(`Erro na requisição: ${err.message}`);
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalText;
    if (window.lucide) window.lucide.createIcons();
  }
}

/**
 * Alterna status individual de um anúncio (Pausar / Ativar)
 */
async function alternarStatusCriativo(adId, novoStatus) {
  try {
    const res = await fetch('/api/executar-acao', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tipo: novoStatus === 'PAUSED' ? 'PAUSE_AD' : 'ACTIVATE_AD',
        payload: { ad_id: adId }
      })
    });

    const data = await res.json();
    if (data.sucesso) {
      carregarDadosDashboard();
    } else {
      alert(`Erro: ${data.erro}`);
    }
  } catch (err) {
    alert(`Erro de conexão: ${err.message}`);
  }
}

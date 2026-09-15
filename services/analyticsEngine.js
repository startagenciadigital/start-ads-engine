/**
 * START ADS ENGINE - Analytics Engine
 * Processamento e classificação de métricas de vídeo, criativos e leilão.
 */

function calcularHookRate(video3sViews, impressions) {
  if (!impressions || impressions <= 0) return 0;
  const rate = (video3sViews / impressions) * 100;
  return Number(rate.toFixed(2));
}

function calcularHoldRate(thruPlays, video3sViews) {
  if (!video3sViews || video3sViews <= 0) return 0;
  const rate = (thruPlays / video3sViews) * 100;
  return Number(rate.toFixed(2));
}

/**
 * Avalia se o criativo está fadigado com base em:
 * 1. Frequência >= 2.5
 * 2. Queda de CTR > 20% vs baseline
 * 3. Alta de CPC
 */
function avaliarFadigaCriativo(ad) {
  const frequencia = Number(ad.frequency || ad.frequencia || 1.0);
  const ctrAtual = Number(ad.ctr || 1.0);
  const ctrBaseline = Number(ad.ctr_baseline || ad.ctrHistorical || (ctrAtual * 1.25));
  const cpcAtual = Number(ad.cpc || 0.50);
  const cpcBaseline = Number(ad.cpc_baseline || (cpcAtual * 0.85));

  const quedaCTRPercent = ctrBaseline > 0 ? ((ctrBaseline - ctrAtual) / ctrBaseline) * 100 : 0;
  const altaCPCPercent = cpcBaseline > 0 ? ((cpcAtual - cpcBaseline) / cpcBaseline) * 100 : 0;

  const isFadigado = frequencia >= 2.5 && quedaCTRPercent >= 20;
  const isAtencao = frequencia >= 2.0 || quedaCTRPercent >= 15 || altaCPCPercent >= 25;

  let nivel = 'SAUDAVEL';
  let motivo = 'Métricas operando dentro do padrão ideal.';

  if (isFadigado) {
    nivel = 'FADIGADO';
    motivo = `Frequência alta (${frequencia.toFixed(1)}x) e queda de ${quedaCTRPercent.toFixed(0)}% no CTR. Recomenda-se pausar ou renovar o criativo.`;
  } else if (isAtencao) {
    nivel = 'ATENCAO';
    motivo = `Frequência de ${frequencia.toFixed(1)}x em ascensão com leve pressão no CPC (+${altaCPCPercent.toFixed(0)}%).`;
  }

  return {
    fadigado: isFadigado,
    nivel,
    motivo,
    frequencia,
    quedaCTRPercent: Number(quedaCTRPercent.toFixed(1)),
    altaCPCPercent: Number(altaCPCPercent.toFixed(1))
  };
}

/**
 * Processa a lista de anúncios e enriquece com métricas de vídeo e índice de fadiga
 */
function enriquecerMetricasCriativos(anuncios = []) {
  return anuncios.map((ad) => {
    const hookRate = calcularHookRate(ad.video_3s_views || 0, ad.impressions || 0);
    const holdRate = calcularHoldRate(ad.thruplays || 0, ad.video_3s_views || 0);
    const fadiga = avaliarFadigaCriativo(ad);

    // Classificação qualitativa do Hook Rate (Meta Benchmark)
    let hookClassificacao = 'Baixo';
    if (hookRate >= 35) hookClassificacao = 'Excelente';
    else if (hookRate >= 25) hookClassificacao = 'Bom';
    else if (hookRate >= 15) hookClassificacao = 'Médio';

    // Classificação qualitativa do Hold Rate
    let holdClassificacao = 'Baixo';
    if (holdRate >= 30) holdClassificacao = 'Excelente';
    else if (holdRate >= 20) holdClassificacao = 'Bom';
    else if (holdRate >= 10) holdClassificacao = 'Médio';

    return {
      ...ad,
      hook_rate: hookRate,
      hook_classificacao: hookClassificacao,
      hold_rate: holdRate,
      hold_classificacao: holdClassificacao,
      analise_fadiga: fadiga
    };
  });
}

/**
 * Monta os dados para o gráfico de curva de CPM e pressão de leilão
 */
function processarCurvaCPM(historicoDias = []) {
  const labels = historicoDias.map(d => d.data);
  const cpms = historicoDias.map(d => Number(d.cpm || 0));
  const impressoes = historicoDias.map(d => Number(d.impressions || 0));

  return {
    labels,
    datasets: [
      {
        label: 'CPM (R$)',
        data: cpms,
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        tension: 0.35,
        fill: true
      },
      {
        label: 'Impressões (k)',
        data: impressoes.map(v => Number((v / 1000).toFixed(1))),
        borderColor: '#a855f7',
        backgroundColor: 'rgba(168, 85, 247, 0.05)',
        tension: 0.35,
        yAxisID: 'y1'
      }
    ]
  };
}

module.exports = {
  calcularHookRate,
  calcularHoldRate,
  avaliarFadigaCriativo,
  enriquecerMetricasCriativos,
  processarCurvaCPM
};

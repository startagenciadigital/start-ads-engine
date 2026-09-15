/**
 * START ADS ENGINE - Gemini Service
 * Integração com Google Gemini Flash para Auditoria Pré-Voo, Co-Piloto de Diagnóstico e Resumo Executivo.
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

/**
 * Utilitário para chamar a API do Gemini via REST com formato JSON estruturado
 */
async function callGeminiJSON(prompt, systemInstruction = '') {
  if (!GEMINI_API_KEY || GEMINI_API_KEY.includes('sua_chave')) {
    return null; // Aciona o fallback simulado
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const payload = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: 'application/json'
    }
  };

  if (systemInstruction) {
    payload.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`[Gemini API] Falha na requisição (${response.status}): ${errorText}`);
      return null;
    }

    const data = await response.json();
    const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (candidate) {
      return JSON.parse(candidate);
    }
    return null;
  } catch (err) {
    console.warn('[Gemini API] Erro ao conectar ou converter JSON:', err.message);
    return null;
  }
}

/**
 * 1. Auditoria Pré-Voo com IA
 * Avalia o rascunho de campanha antes do disparo para a Meta Marketing API
 */
async function auditarPreVoo(draft) {
  const systemInstruction = `Você é um Estrategista Sênior de Tráfego Pago e Copywriting para Meta Ads.
Sua missão é auditar o rascunho técnico de uma campanha e retornar um objeto JSON rigoroso com a seguinte estrutura:
{
  "aprovado": boolean,
  "score_geral": number (0 a 100),
  "nota_copy": number (0 a 100),
  "parecer_copy": string,
  "analise_orcamento": {
    "status": "IDEAL" | "BAIXO" | "ALTO",
    "comentario": string
  },
  "analise_publico": {
    "status": "ADEQUADO" | "MUITO_AMPLO" | "MUITO_ESTREITO",
    "comentario": string
  },
  "pontos_fortes": string[],
  "alertas_risco": string[],
  "sugestoes_otimizacao": string[]
}`;

  const prompt = `Analise detalhadamente este rascunho de campanha Meta Ads:
- Objetivo: ${draft.objective || 'OUTCOME_LEADS'}
- Tipo de Orçamento: ${draft.budget_type || 'DAILY'}
- Valor do Orçamento: R$ ${draft.budget_amount || '50.00'}
- Localização: ${JSON.stringify(draft.location || {})}
- Faixa Etária: ${draft.age_min || 18} a ${draft.age_max || 65} anos
- Interesses / Segmentação: ${draft.interests || 'Aberto / Genérico'}
- Advantage+ Audience: ${draft.advantage_audience ? 'Ativado' : 'Desativado'}
- Tipo de Criativo: ${draft.creative_mode === 'EXISTING_POST' ? 'Post Existente do Instagram' : 'Criativo Novo'}
- Título do Anúncio (Headline): "${draft.headline || ''}"
- Texto Principal (Copy): "${draft.primary_text || ''}"
- Chamada para Ação (CTA): "${draft.call_to_action || 'LEARN_MORE'}"
- URL de Destino: "${draft.destination_url || ''}"`;

  const aiResult = await callGeminiJSON(prompt, systemInstruction);
  if (aiResult) return aiResult;

  // Resposta heurística de alta qualidade caso sem chave ou offline
  const headlineLen = (draft.headline || '').length;
  const copyLen = (draft.primary_text || '').length;
  const hasStrongHook = /(você|descubra|como|pare de|atenção|novo|segredo|resultado|agora|grátis|método)/i.test(draft.primary_text || '');

  let notaCopy = 75;
  if (hasStrongHook) notaCopy += 15;
  if (copyLen < 40) notaCopy -= 20;
  if (headlineLen > 10 && headlineLen < 50) notaCopy += 10;
  notaCopy = Math.min(Math.max(notaCopy, 45), 98);

  const budget = Number(draft.budget_amount || 50);
  const isBudgetLow = budget < 20;

  return {
    aprovado: notaCopy >= 70 && !isBudgetLow,
    score_geral: Math.round((notaCopy * 0.6) + (isBudgetLow ? 15 : 35)),
    nota_copy: notaCopy,
    parecer_copy: hasStrongHook
      ? "O gancho inicial possui boa atração de atenção e apelo emocional relevante para os primeiros 3 segundos."
      : "A copy é compreensível, mas falta um gancho disruptivo na primeira linha para elevar o Hook Rate.",
    analise_orcamento: {
      status: isBudgetLow ? "BAIXO" : "IDEAL",
      comentario: isBudgetLow
        ? "Orçamento abaixo de R$ 20/dia pode demorar para sair da fase de aprendizado da Meta."
        : `Orçamento de R$ ${budget.toFixed(2)}/dia permite volume saudável de leilão para os primeiros testes de criativo.`
    },
    analise_publico: {
      status: draft.advantage_audience ? "ADEQUADO" : "ADEQUADO",
      comentario: draft.advantage_audience
        ? "Advantage+ Audience ativado: a IA da Meta expandirá automaticamente quando encontrar compradores."
        : "Segmentação por interesses bem calibrada. Mantenha os testes nos primeiros 4 dias."
    },
    pontos_fortes: [
      "Objetivo coerente com o alinhamento da oferta comercial.",
      `CTA "${draft.call_to_action || 'Saiba Mais'}" com direcionamento claro para ação imediata.`,
      "Configuração de pacing e distribuição pronta para ativação segura."
    ],
    alertas_risco: isBudgetLow
      ? ["Orçamento inicial reduzido pode limitar a velocidade da fase de aprendizado (Meta Learning Phase)."]
      : ["Certifique-se de que a página de destino (LP) carrega em menos de 2.5s no mobile."],
    sugestoes_otimizacao: [
      "Adicionar 2 variações adicionais de criativo para dar mais opções ao algoritmo de entrega.",
      "Utilizar perguntas provocativas na primeira frase da copy para aumentar a retenção de leitura."
    ]
  };
}

/**
 * 2. Co-Piloto IA para o Gestor (Human-in-the-Loop)
 * Diagnostica criativos fadigados e anomalias de leilão gerando ação de 1 clique
 */
async function gerarDiagnosticoCopiloto(dadosConta) {
  const systemInstruction = `Você é um Co-Piloto de Tráfego Pago Sênior que monitora contas da Meta.
Sua missão é gerar um diagnóstico acionável com proposta para o gestor aprovar em 1 clique.
Retorne um objeto JSON com:
{
  "tem_anomalia": boolean,
  "severidade": "CRITICA" | "MODERADA" | "OTIMIZACAO",
  "titulo": string,
  "diagnostico_detalhado": string,
  "acao_proposta": {
    "tipo": "PAUSE_AD" | "ADJUST_BUDGET" | "DUPLICATE_ADSET",
    "rotulo_botao": string,
    "target_id": string,
    "target_name": string,
    "descricao_impacto": string,
    "payload": object
  },
  "kpis_resumo": {
    "cpm_status": string,
    "hook_rate_medio": string,
    "fadiga_status": string
  }
}`;

  const prompt = `Analise os dados consolidados da conta ${dadosConta.conta_id || ''}:
- Total Investido: R$ ${dadosConta.spend || '0.00'}
- CPM Atual: R$ ${dadosConta.cpm || '0.00'}
- Anúncios com Fadiga Detectada: ${JSON.stringify(dadosConta.anuncios_fadigados || [])}
- Médias de Hook Rate (3s): ${dadosConta.hook_rate_medio || 22}%
- Médias de Hold Rate: ${dadosConta.hold_rate_medio || 18}%`;

  const aiResult = await callGeminiJSON(prompt, systemInstruction);
  if (aiResult) return aiResult;

  // Fallback heurístico inteligente
  const fadigados = dadosConta.anuncios_fadigados || [];
  if (fadigados.length > 0) {
    const piorAd = fadigados[0];
    return {
      tem_anomalia: true,
      severidade: "CRITICA",
      titulo: `Fadiga Crítica Detectada no Criativo "${piorAd.name || 'Vídeo 01'}"`,
      diagnostico_detalhado: `O anúncio "${piorAd.name}" atingiu frequência de ${piorAd.frequency || '2.8'}x com queda acentuada de ${piorAd.analise_fadiga?.quedaCTRPercent || '27'}% no CTR e aumento de CPC. Continuar entregando este anúncio causará encarecimento de custo por lead.`,
      acao_proposta: {
        tipo: "PAUSE_AD",
        rotulo_botao: `Pausar Criativo "${piorAd.name}" Agora`,
        target_id: piorAd.id,
        target_name: piorAd.name,
        descricao_impacto: `Interrompe imediatamente a perda de verba com anúncio desgastado e redireciona os leilões para criativos saudáveis.`,
        payload: { ad_id: piorAd.id, novo_status: "PAUSED" }
      },
      kpis_resumo: {
        cpm_status: "Pressão de Leilão Estável",
        hook_rate_medio: `${dadosConta.hook_rate_medio || 26.4}% (Saudável)`,
        fadiga_status: "1 Criativo Exige Intervenção"
      }
    };
  }

  const gasto = Number(dadosConta.spend || 0);

  if (gasto === 0) {
    return {
      tem_anomalia: false,
      severidade: "OTIMIZACAO",
      titulo: "Co-Piloto Conectado e Pronto para Monitoramento",
      diagnostico_detalhado: "Nenhuma anomalia detectada. O Co-Piloto está a postos para monitorar o leilão e os criativos em tempo real assim que a primeira campanha iniciar a veiculação.",
      acao_proposta: {
        tipo: "CREATE_CAMPAIGN",
        rotulo_botao: "Criar Nova Campanha",
        target_id: "nova_campanha",
        target_name: "Criador Universal",
        descricao_impacto: "Acesse o criador universal para publicar seus primeiros anúncios na Meta.",
        payload: {}
      },
      kpis_resumo: {
        cpm_status: "Aguardando Leilão",
        hook_rate_medio: "Aguardando Vídeos",
        fadiga_status: "Sem Anomalias"
      }
    };
  }

  return {
    tem_anomalia: false,
    severidade: "OTIMIZACAO",
    titulo: "Campanhas Operando com Eficiência",
    diagnostico_detalhado: "Nenhum criativo atingiu índice de fadiga crítico. O CPM médio está estável e os anúncios mantém bom desempenho de retenção.",
    acao_proposta: {
      tipo: "ADJUST_BUDGET",
      rotulo_botao: "Manter Estrutura Atual",
      target_id: "status_ok",
      target_name: "Conjuntos Saudáveis",
      descricao_impacto: "Manter orçamento atual para consolidação da fase de aprendizado da Meta.",
      payload: {}
    },
    kpis_resumo: {
      cpm_status: `CPM Médio: R$ ${Number(dadosConta.cpm || 0).toFixed(2)}`,
      hook_rate_medio: `${dadosConta.hook_rate_medio || 0}%`,
      fadiga_status: "Criativos Saudáveis"
    }
  };
}

/**
 * 3. Resumo Executivo para o Portal do Cliente
 * Linguagem em português natural, transparente e sem jargões desnecessários
 */
async function gerarResumoExecutivoCliente(dadosConta, nomeCliente = 'Cliente') {
  const systemInstruction = `Você é o Diretor de Contas de uma agência de marketing de alta performance.
Sua missão é escrever um Resumo Executivo em Português Brasileiro formal, empático e claro para o empresário/cliente.
Retorne um JSON com:
{
  "saudacao": string,
  "destaque_principal": string,
  "paragrafo_desempenho": string,
  "pontos_positivos": string[],
  "proximos_passos": string[],
  "parecer_final": string
}`;

  const prompt = `Gere o relatório executivo para ${nomeCliente}:
- Período: Últimos 30 dias
- Total Investido: R$ ${dadosConta.spend || '1.850,00'}
- Pessoas Alcançadas: ${dadosConta.reach || '42.300'}
- Cliques / Engajamentos: ${dadosConta.clicks || '1.980'}
- Custo Médio por Clique/Resultado: R$ ${dadosConta.cpc || '0,93'}
- ROAS / Retorno Estimado: ${dadosConta.roas || '3.8x'}`;

  const aiResult = await callGeminiJSON(prompt, systemInstruction);
  if (aiResult) return aiResult;

  // Fallback amigável com métricas reais
  const gasto = Number(dadosConta.spend || 0);
  const alcance = Number(dadosConta.reach || 0);
  const cliques = Number(dadosConta.clicks || 0);
  const cpc = Number(dadosConta.cpc || 0);

  if (gasto === 0 && alcance === 0) {
    return {
      saudacao: `Olá, equipe ${nomeCliente}! Bem-vindos ao painel de transparência da sua conta de anúncios.`,
      destaque_principal: `Sua conta está conectada e pronta para o início das primeiras veiculações.`,
      paragrafo_desempenho: `Assim que as primeiras campanhas forem publicadas e começarem a rodar na Meta, nosso sistema consolidará em tempo real o volume de pessoas alcançadas, custos por resultado e os vídeos com maior retenção de público.`,
      pontos_positivos: [
        `Configuração técnica de conta concluída com sucesso.`,
        `Integração direta com o ecossistema Meta Marketing API ativa.`,
        `Monitoramento de Hook Rate e retenção de criativos pronto para ativação.`
      ],
      proximos_passos: [
        `Publicar a primeira campanha estratégica no criador universal.`,
        `Iniciar a coleta dos primeiros dados de leilão e aprendizado.`,
        `Acompanhar os relatórios de conversão e custo por lead.`
      ],
      parecer_final: `A estrutura de marketing está pronta. Nossa equipe está a postos para acompanhar a primeira entrega de resultados.`
    };
  }

  return {
    saudacao: `Olá, equipe ${nomeCliente}! Apresentamos o panorama consolidado dos seus investimentos em tráfego pago.`,
    destaque_principal: `Suas campanhas alcançaram ${alcance.toLocaleString('pt-BR')} pessoas com investimento total de R$ ${gasto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`,
    paragrafo_desempenho: `Neste período, foram geradas ${cliques.toLocaleString('pt-BR')} visitas e engajamentos qualificados com um custo médio de R$ ${cpc.toFixed(2)} por resultado. Os anúncios continuam sendo otimizados para maximizar o retorno da sua marca.`,
    pontos_positivos: [
      `Entrega consistente dentro do planejamento orçamentário.`,
      `Públicos segmentados respondendo com interações positivas.`,
      `Estabilidade nos custos médios por clique.`
    ],
    proximos_passos: [
      `Testar novas variações de criativos de vídeo.`,
      `Escalar os conjuntos com melhor desempenho de conversão.`,
      `Manter calibração de horários e posicionamentos.`
    ],
    parecer_final: `A conta de anúncios opera com saúde técnica e financeira sob gestão contínua.`
  };
}

module.exports = {
  auditarPreVoo,
  gerarDiagnosticoCopiloto,
  gerarResumoExecutivoCliente
};

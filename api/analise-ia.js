const express = require('express');
const router = express.Router();
const metaService = require('../services/metaService');
const geminiService = require('../services/geminiService');

// POST or GET /api/analise-ia/:contaId?
const handler = async (req, res) => {
  try {
    const contaId = req.params.contaId || req.query.contaId || req.body?.conta_id || metaService.DEFAULT_ACCOUNT_ID;
    const tipo = (req.query.tipo || req.body?.tipo || 'COPILOTO').toUpperCase();
    const nomeCliente = req.query.nome_cliente || req.body?.nome_cliente || 'Cliente';

    // Obtém métricas atuais da conta
    const dadosConta = await metaService.obterMetricasConta(contaId);

    if (tipo === 'CLIENTE') {
      const resumo = await geminiService.gerarResumoExecutivoCliente(dadosConta.resumo, dadosConta.conta.client_name || nomeCliente);
      return res.json({ sucesso: true, tipo: 'CLIENTE', resumo });
    } else {
      const copiloto = await geminiService.gerarDiagnosticoCopiloto({
        conta_id: contaId,
        ...dadosConta.resumo,
        anuncios_fadigados: dadosConta.anuncios_fadigados
      });
      return res.json({ sucesso: true, tipo: 'COPILOTO', copiloto });
    }
  } catch (err) {
    console.error('[API /api/analise-ia] Erro:', err);
    return res.status(500).json({ sucesso: false, erro: err.message });
  }
};

router.get('/:contaId?', handler);
router.post('/:contaId?', handler);

module.exports = router;

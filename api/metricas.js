const express = require('express');
const router = express.Router();
const metaService = require('../services/metaService');

// GET /api/metricas/:contaId?
router.get('/:contaId?', async (req, res) => {
  try {
    const contaId = req.params.contaId || req.query.contaId || metaService.DEFAULT_ACCOUNT_ID;
    const dados = await metaService.obterMetricasConta(contaId);
    return res.json({ sucesso: true, dados });
  } catch (err) {
    console.error('[API /api/metricas] Erro:', err);
    return res.status(500).json({ sucesso: false, erro: err.message });
  }
});

module.exports = router;

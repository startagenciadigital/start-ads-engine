const express = require('express');
const router = express.Router();
const metaService = require('../services/metaService');

// POST /api/executar-acao
router.post('/', async (req, res) => {
  try {
    const { tipo, payload } = req.body || {};

    if (!tipo) {
      return res.status(400).json({ sucesso: false, erro: 'Tipo de ação não especificado.' });
    }

    let resultado;

    switch (tipo) {
      case 'PAUSE_AD':
        resultado = await metaService.pausarAtivarAnuncio(payload.ad_id, 'PAUSED');
        break;

      case 'UNPAUSE_AD':
      case 'ACTIVATE_AD':
        resultado = await metaService.pausarAtivarAnuncio(payload.ad_id, 'ACTIVE');
        break;

      case 'ADJUST_BUDGET':
        resultado = await metaService.ajustarOrcamento(payload.adset_id || payload.target_id, payload.novo_valor || 100);
        break;

      default:
        return res.status(400).json({ sucesso: false, erro: `Ação desconhecida: ${tipo}` });
    }

    return res.json({ sucesso: true, resultado });
  } catch (err) {
    console.error('[API /api/executar-acao] Erro:', err);
    return res.status(500).json({ sucesso: false, erro: err.message });
  }
});

module.exports = router;

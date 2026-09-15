const express = require('express');
const router = express.Router();
const metaService = require('../services/metaService');

// GET /api/contas
router.get('/', async (req, res) => {
  try {
    const contas = await metaService.listarContas();
    return res.json({ sucesso: true, contas });
  } catch (err) {
    console.error('[API /api/contas] Erro:', err);
    return res.status(500).json({ sucesso: false, erro: err.message });
  }
});

module.exports = router;

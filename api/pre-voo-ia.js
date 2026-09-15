const express = require('express');
const router = express.Router();
const geminiService = require('../services/geminiService');

// POST /api/pre-voo-ia
router.post('/', async (req, res) => {
  try {
    const draft = req.body || {};
    const analise = await geminiService.auditarPreVoo(draft);
    return res.json({ sucesso: true, analise });
  } catch (err) {
    console.error('[API /api/pre-voo-ia] Erro:', err);
    return res.status(500).json({ sucesso: false, erro: err.message });
  }
});

module.exports = router;

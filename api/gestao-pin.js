const express = require('express');
const router = express.Router();
const authService = require('../services/authService');

// GET /api/gestao-pin/:contaId?
router.get('/:contaId?', async (req, res) => {
  try {
    const contaId = req.params.contaId || req.query.contaId;
    const dadosPin = await authService.obterPinConta(contaId);
    return res.json({ sucesso: true, dados: dadosPin });
  } catch (err) {
    console.error('[API /api/gestao-pin GET] Erro:', err);
    return res.status(500).json({ sucesso: false, erro: err.message });
  }
});

// POST /api/gestao-pin
router.post('/', async (req, res) => {
  try {
    const { conta_id, novo_pin, nome_cliente } = req.body || {};
    const resultado = await authService.atualizarPinConta(conta_id, novo_pin, nome_cliente);
    return res.json(resultado);
  } catch (err) {
    console.error('[API /api/gestao-pin POST] Erro:', err);
    return res.status(500).json({ sucesso: false, erro: err.message });
  }
});

module.exports = router;

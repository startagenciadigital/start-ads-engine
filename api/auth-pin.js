const express = require('express');
const router = express.Router();
const authService = require('../services/authService');

// POST /api/auth-pin
router.post('/', async (req, res) => {
  try {
    const { conta_id, pin } = req.body || {};
    const resultado = await authService.validarPinCliente(conta_id, pin);

    if (!resultado.sucesso) {
      return res.status(401).json(resultado);
    }

    return res.json(resultado);
  } catch (err) {
    console.error('[API /api/auth-pin] Erro:', err);
    return res.status(500).json({ sucesso: false, erro: err.message });
  }
});

module.exports = router;

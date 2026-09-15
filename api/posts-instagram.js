const express = require('express');
const router = express.Router();
const metaService = require('../services/metaService');

// GET /api/posts-instagram/:pageId?
router.get('/:pageId?', async (req, res) => {
  try {
    const pageId = req.params.pageId || req.query.pageId || 'me';
    const posts = await metaService.buscarPostsInstagram(pageId);
    return res.json({ sucesso: true, posts });
  } catch (err) {
    console.error('[API /api/posts-instagram] Erro:', err);
    return res.status(500).json({ sucesso: false, erro: err.message });
  }
});

module.exports = router;

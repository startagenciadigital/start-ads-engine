const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const metaService = require('../services/metaService');

// Garante que o diretório public/uploads existe
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'criativo-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// POST /api/criar-campanha
router.post('/', upload.single('media_file'), async (req, res) => {
  try {
    const dados = req.body || {};
    const arquivoMidia = req.file || null;

    // Se location ou outros campos vierem como string JSON, faz o parse
    if (typeof dados.location === 'string') {
      try { dados.location = JSON.parse(dados.location); } catch (e) {}
    }

    const resultado = await metaService.criarCampanhaCompleta(dados, arquivoMidia);
    return res.json(resultado);
  } catch (err) {
    console.error('[API /api/criar-campanha] Erro:', err);
    return res.status(500).json({ sucesso: false, erro: err.message });
  }
});

module.exports = router;

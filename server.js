require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (CSS, JS, Imagens, Uploads)
app.use(express.static(path.join(__dirname, 'public')));

// Rotas de API
app.use('/api/contas', require('./api/contas'));
app.use('/api/posts-instagram', require('./api/posts-instagram'));
app.use('/api/criar-campanha', require('./api/criar-campanha'));
app.use('/api/pre-voo-ia', require('./api/pre-voo-ia'));
app.use('/api/metricas', require('./api/metricas'));
app.use('/api/analise-ia', require('./api/analise-ia'));
app.use('/api/executar-acao', require('./api/executar-acao'));

// Rotas amigáveis para as páginas da aplicação
app.get('/criar', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'criar.html'));
});

app.get('/gestor', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'gestor.html'));
});

app.get('/cliente', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cliente.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Tratamento de 404 para rotas não mapeadas
app.use((req, res, next) => {
  if (req.accepts('html')) {
    return res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
  }
  res.status(404).json({ sucesso: false, erro: 'Rota não encontrada' });
});

// Inicia o servidor se não estiver sendo executado como módulo serverless
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 START ADS ENGINE rodando em http://localhost:${PORT}`);
    console.log(`📡 Hub:         http://localhost:${PORT}/`);
    console.log(`🛠️  Criar:       http://localhost:${PORT}/criar`);
    console.log(`📊 Gestor:      http://localhost:${PORT}/gestor`);
    console.log(`👤 Cliente:     http://localhost:${PORT}/cliente`);
    console.log(`====================================================`);
  });
}

module.exports = app;

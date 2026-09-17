const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const metaService = require('../services/metaService');

const ENV_PATH = path.join(__dirname, '..', '.env');

/**
 * Função utilitária para mascarar tokens de segurança
 */
function mascararToken(token) {
  if (!token || typeof token !== 'string') return '';
  const trimmed = token.trim();
  if (trimmed.length <= 10) return '••••••••';
  return `${trimmed.slice(0, 6)}••••••••${trimmed.slice(-4)}`;
}

/**
 * Utilitário para ler o .env em formato chave-valor
 */
function lerEnv() {
  if (!fs.existsSync(ENV_PATH)) return {};
  const content = fs.readFileSync(ENV_PATH, 'utf-8');
  const envObj = {};
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const value = trimmed.slice(idx + 1).trim();
        envObj[key] = value;
      }
    }
  });
  return envObj;
}

/**
 * Utilitário para salvar variáveis no .env sem apagar as demais
 */
function salvarVariaveisEnv(novasVariaveis) {
  const envAtual = lerEnv();
  const mesclado = { ...envAtual, ...novasVariaveis };

  const linhas = [];
  for (const [key, val] of Object.entries(mesclado)) {
    linhas.push(`${key}=${val}`);
  }

  fs.writeFileSync(ENV_PATH, linhas.join('\n') + '\n', 'utf-8');

  // Atualiza process.env em tempo de execução
  for (const [key, val] of Object.entries(novasVariaveis)) {
    process.env[key] = val;
  }
}

/**
 * GET /api/conexoes/status
 * Retorna o estado atual das integrações sem expor credenciais brutas
 */
router.get('/status', async (req, res) => {
  try {
    const metaToken = metaService.getAccessToken();
    const accountId = metaService.getDefaultAccountId();
    const geminiKey = process.env.GEMINI_API_KEY || '';
    const supabaseUrl = process.env.SUPABASE_URL || '';

    const temMetaToken = Boolean(metaToken && !metaToken.includes('seu_meta') && metaToken.trim() !== '');
    const temGemini = Boolean(geminiKey && geminiKey.trim() !== '');
    const temSupabase = Boolean(supabaseUrl && supabaseUrl.trim() !== '');

    let metaDiagnostico = null;
    if (temMetaToken) {
      metaDiagnostico = await metaService.testarConexaoMeta(metaToken, accountId);
    }

    return res.json({
      sucesso: true,
      conexoes: {
        meta: {
          configurado: temMetaToken,
          token_mascarado: mascararToken(metaToken),
          account_id: accountId,
          conta_padrao_nome: 'Alex Voltagem (Banda A Voltagem)',
          diagnostico: metaDiagnostico
        },
        gemini: {
          configurado: temGemini,
          chave_mascarada: mascararToken(geminiKey),
          modelo: process.env.GEMINI_MODEL || 'gemini-1.5-flash'
        },
        supabase: {
          configurado: temSupabase,
          url: supabaseUrl ? supabaseUrl.replace(/https?:\/\//, '').split('.')[0] + '...' : null
        }
      }
    });
  } catch (err) {
    console.error('[API Conexoes] Erro ao obter status:', err);
    return res.status(500).json({ sucesso: false, erro: err.message });
  }
});

/**
 * POST /api/conexoes/testar-meta
 * Valida o token e conta fornecidos diretamente na Graph API v20.0
 */
router.post('/testar-meta', async (req, res) => {
  try {
    const { token, account_id } = req.body;
    if (!token || token.trim() === '') {
      return res.status(400).json({
        sucesso: false,
        erro: 'Token de acesso não informado.'
      });
    }

    const resultado = await metaService.testarConexaoMeta(token, account_id);
    return res.json({
      sucesso: true,
      resultado
    });
  } catch (err) {
    console.error('[API Conexoes] Erro ao testar Meta token:', err);
    return res.status(500).json({
      sucesso: false,
      erro: err.message
    });
  }
});

/**
 * POST /api/conexoes/salvar
 * Persiste as credenciais no .env e sincroniza o ambiente da aplicação
 */
router.post('/salvar', async (req, res) => {
  try {
    const { meta_token, account_id, gemini_key, gemini_model } = req.body;
    const atualizacoes = {};

    if (meta_token !== undefined) {
      atualizacoes.META_ADS_ACCESS_TOKEN = meta_token.trim();
    }

    if (account_id !== undefined && account_id.trim() !== '') {
      const cleanAcc = account_id.trim();
      atualizacoes.META_ADS_AD_ACCOUNT_ID = cleanAcc.startsWith('act_') ? cleanAcc : `act_${cleanAcc}`;
    }

    if (gemini_key !== undefined) {
      atualizacoes.GEMINI_API_KEY = gemini_key.trim();
    }

    if (gemini_model !== undefined && gemini_model.trim() !== '') {
      atualizacoes.GEMINI_MODEL = gemini_model.trim();
    }

    salvarVariaveisEnv(atualizacoes);

    // Se informou token Meta, executa validação pós-salvamento
    let validacaoMeta = null;
    if (atualizacoes.META_ADS_ACCESS_TOKEN) {
      validacaoMeta = await metaService.testarConexaoMeta(
        atualizacoes.META_ADS_ACCESS_TOKEN,
        atualizacoes.META_ADS_AD_ACCOUNT_ID
      );
    }

    return res.json({
      sucesso: true,
      mensagem: 'Credenciais salvas e ativadas com sucesso no START ADS ENGINE!',
      validacaoMeta
    });
  } catch (err) {
    console.error('[API Conexoes] Erro ao salvar configurações:', err);
    return res.status(500).json({
      sucesso: false,
      erro: err.message
    });
  }
});

module.exports = router;

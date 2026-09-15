/**
 * START ADS ENGINE - Auth Service (Supabase)
 * Gerenciamento e validação de PINs de acesso para os clientes da agência.
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

let supabase = null;
if (SUPABASE_URL && SUPABASE_KEY) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  } catch (err) {
    console.warn('[Auth Service] Erro ao inicializar cliente Supabase:', err.message);
  }
}

// Fallback volátil local caso o Supabase não esteja disponível
const localPins = {
  'act_1717085079153654': {
    conta_id: 'act_1717085079153654',
    client_name: 'Start Agência Digital',
    pin_code: '1234',
    is_active: true
  }
};

/**
 * Valida se o PIN digitado pelo cliente confere com a conta
 */
async function validarPinCliente(contaId, pinDigitado) {
  if (!contaId || !pinDigitado) {
    return { sucesso: false, erro: 'Conta e PIN são obrigatórios.' };
  }

  const pinFormatado = String(pinDigitado).trim();

  // 1. Tenta validar no Supabase
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('client_access_pins')
        .select('*')
        .eq('conta_id', contaId)
        .eq('is_active', true)
        .single();

      if (error) {
        console.warn('[Auth Service] Erro ao buscar no Supabase:', error.message);
      } else if (data) {
        if (data.pin_code === pinFormatado) {
          const token = Buffer.from(`${contaId}:${Date.now() + (24 * 60 * 60 * 1000)}`).toString('base64');
          return {
            sucesso: true,
            token,
            client_name: data.client_name,
            expira_em: '24 horas'
          };
        } else {
          return { sucesso: false, erro: 'PIN de segurança incorreto. Tente novamente.' };
        }
      }
    } catch (e) {
      console.warn('[Auth Service] Falha na consulta Supabase:', e.message);
    }
  }

  // 2. Fallback local
  const registroLocal = localPins[contaId];
  if (registroLocal && registroLocal.pin_code === pinFormatado && registroLocal.is_active) {
    const token = Buffer.from(`${contaId}:${Date.now() + (24 * 60 * 60 * 1000)}`).toString('base64');
    return {
      sucesso: true,
      token,
      client_name: registroLocal.client_name,
      expira_em: '24 horas'
    };
  }

  return { sucesso: false, erro: 'PIN incorreto ou conta não encontrada.' };
}

/**
 * Obtém ou cria o PIN de uma conta (usado pelo Gestor)
 */
async function obterPinConta(contaId, nomeCliente = 'Cliente') {
  if (!contaId) return null;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('client_access_pins')
        .select('*')
        .eq('conta_id', contaId)
        .maybeSingle();

      if (!error && data) {
        return data;
      }

      // Se não existir, cria um PIN padrão '1234'
      const novoPin = '1234';
      const { data: created, error: createError } = await supabase
        .from('client_access_pins')
        .insert([{
          conta_id: contaId,
          client_name: nomeCliente,
          pin_code: novoPin,
          is_active: true
        }])
        .select()
        .single();

      if (!createError && created) {
        return created;
      }
    } catch (e) {
      console.warn('[Auth Service] Erro ao buscar/criar PIN:', e.message);
    }
  }

  if (!localPins[contaId]) {
    localPins[contaId] = {
      conta_id: contaId,
      client_name: nomeCliente,
      pin_code: '1234',
      is_active: true
    };
  }
  return localPins[contaId];
}

/**
 * Atualiza o PIN da conta (Gestor)
 */
async function atualizarPinConta(contaId, novoPin, nomeCliente = 'Cliente') {
  if (!contaId || !novoPin) {
    return { sucesso: false, erro: 'Conta e novo PIN são obrigatórios.' };
  }

  const pinFormatado = String(novoPin).trim();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('client_access_pins')
        .upsert({
          conta_id: contaId,
          client_name: nomeCliente,
          pin_code: pinFormatado,
          is_active: true,
          updated_at: new Date().toISOString()
        }, { onConflict: 'conta_id' })
        .select()
        .single();

      if (!error && data) {
        return { sucesso: true, pin_code: data.pin_code, mensagem: 'PIN atualizado no Supabase com sucesso!' };
      }
    } catch (e) {
      console.warn('[Auth Service] Erro ao atualizar no Supabase:', e.message);
    }
  }

  localPins[contaId] = {
    conta_id: contaId,
    client_name: nomeCliente,
    pin_code: pinFormatado,
    is_active: true
  };

  return { sucesso: true, pin_code: pinFormatado, mensagem: 'PIN atualizado com sucesso!' };
}

module.exports = {
  validarPinCliente,
  obterPinConta,
  atualizarPinConta
};

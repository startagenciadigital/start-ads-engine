/**
 * START ADS ENGINE — Central de Conexões & Tokens JS
 * Gerenciamento de credenciais, validação ao vivo na Graph API v20.0 e persistência no .env
 */

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();
  carregarStatusConexoes();
});

/**
 * Alterna visualização de senha/texto do Token
 */
function toggleVisibilidadeToken() {
  const input = document.getElementById('meta-access-token');
  const icon = document.getElementById('icon-eye-token');
  if (!input) return;

  if (input.type === 'password') {
    input.type = 'text';
    if (icon) icon.setAttribute('data-lucide', 'eye-off');
  } else {
    input.type = 'password';
    if (icon) icon.setAttribute('data-lucide', 'eye');
  }
  if (window.lucide) window.lucide.createIcons();
}

/**
 * Alterna accordion do Tutorial de Token Permanente
 */
function toggleTutorial() {
  const conteudo = document.getElementById('conteudo-tutorial');
  const icone = document.getElementById('icon-accordion-tutorial');
  if (!conteudo) return;

  const isHidden = conteudo.classList.contains('hidden');
  if (isHidden) {
    conteudo.classList.remove('hidden');
    if (icone) icone.classList.add('rotate-180');
  } else {
    conteudo.classList.add('hidden');
    if (icone) icone.classList.remove('rotate-180');
  }
}

/**
 * Exibe notificação Toast na tela
 */
function mostrarToast(mensagem, tipo = 'sucesso') {
  const toast = document.getElementById('toast-notificacao');
  const toastMsg = document.getElementById('toast-mensagem');
  const toastIcon = document.getElementById('toast-icone');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = mensagem;

  if (tipo === 'sucesso') {
    toast.className = 'fixed bottom-5 right-5 z-50 transform translate-y-0 opacity-100 transition-all duration-300 pointer-events-none';
    if (toastIcon) toastIcon.className = 'w-4 h-4 text-emerald-400';
  } else {
    toast.className = 'fixed bottom-5 right-5 z-50 transform translate-y-0 opacity-100 transition-all duration-300 pointer-events-none';
    if (toastIcon) toastIcon.className = 'w-4 h-4 text-rose-400';
  }

  setTimeout(() => {
    toast.className = 'fixed bottom-5 right-5 z-50 transform translate-y-20 opacity-0 transition-all duration-300 pointer-events-none';
  }, 4000);
}

/**
 * Carrega o status atual de todas as conexões
 */
async function carregarStatusConexoes() {
  const iconRecarregar = document.getElementById('icon-recarregar-status');
  if (iconRecarregar) iconRecarregar.classList.add('animate-spin');

  try {
    const res = await fetch('/api/conexoes/status');
    const data = await res.json();

    if (data.sucesso && data.conexoes) {
      renderizarStatusGeral(data.conexoes);
    }
  } catch (err) {
    console.error('Erro ao buscar status das conexões:', err);
    mostrarToast('Falha ao obter status das conexões.', 'erro');
  } finally {
    if (iconRecarregar) {
      setTimeout(() => iconRecarregar.classList.remove('animate-spin'), 400);
    }
  }
}

/**
 * Renderiza o banner e badges com base no status retornado
 */
function renderizarStatusGeral(conexoes) {
  const banner = document.getElementById('banner-meta-status');
  const bannerIcone = document.getElementById('banner-status-icone');
  const bannerTitulo = document.getElementById('banner-status-titulo');
  const bannerDesc = document.getElementById('banner-status-descricao');
  const bannerBadge = document.getElementById('banner-status-badge');
  const metaPill = document.getElementById('meta-status-pill');
  const tokenInput = document.getElementById('meta-access-token');
  const accountIdInput = document.getElementById('meta-account-id');
  const geminiBadge = document.getElementById('gemini-status-badge');

  const meta = conexoes.meta || {};
  const gemini = conexoes.gemini || {};

  if (accountIdInput && meta.account_id) {
    accountIdInput.value = meta.account_id;
  }

  // Se já há um token ativo e mascarado
  if (meta.configurado && meta.token_mascarado) {
    const diag = meta.diagnostico;
    const isValido = diag && diag.valido;

    if (isValido) {
      banner.className = 'p-4 rounded-2xl border transition-all flex items-start sm:items-center justify-between gap-4 bg-emerald-950/20 border-emerald-500/30';
      bannerIcone.className = 'w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0';
      bannerIcone.innerHTML = '<i data-lucide="check-circle" class="w-5 h-5"></i>';
      bannerTitulo.textContent = 'Meta Ads API Conectada ao Vivo (Graph v20.0)';
      bannerDesc.textContent = `Conta Ativa: ${diag.conta?.name || meta.conta_padrao_nome} (${meta.account_id}) • ${diag.tipo_token}`;
      bannerBadge.className = 'shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
      bannerBadge.textContent = '200 OK • Ao Vivo';

      metaPill.className = 'flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 self-start sm:self-auto';
      metaPill.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span><span>Conectado (Ao Vivo)</span>';
    } else {
      banner.className = 'p-4 rounded-2xl border transition-all flex items-start sm:items-center justify-between gap-4 bg-amber-950/20 border-amber-500/30';
      bannerIcone.className = 'w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0';
      bannerIcone.innerHTML = '<i data-lucide="alert-triangle" class="w-5 h-5"></i>';
      bannerTitulo.textContent = 'Token Configurado mas Inativo ou Expirado';
      bannerDesc.textContent = diag?.mensagem || 'Insira o novo token permanente de Usuário do Sistema abaixo.';
      bannerBadge.className = 'shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40';
      bannerBadge.textContent = 'Token Expirado';

      metaPill.className = 'flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 self-start sm:self-auto';
      metaPill.innerHTML = '<span class="w-2 h-2 rounded-full bg-amber-400"></span><span>Expirado</span>';
    }

    if (tokenInput && !tokenInput.value) {
      tokenInput.placeholder = `Token atual: ${meta.token_mascarado}`;
    }
  } else {
    // Sem token configurado (Fallback fiel ativo)
    banner.className = 'p-4 rounded-2xl border transition-all flex items-start sm:items-center justify-between gap-4 bg-slate-900/70 border-slate-800';
    bannerIcone.className = 'w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0';
    bannerIcone.innerHTML = '<i data-lucide="shield-check" class="w-5 h-5"></i>';
    bannerTitulo.textContent = 'Modo Fallback Seguro Ativo — Alex Voltagem';
    bannerDesc.textContent = 'Os dados das campanhas SP e PR estão operacionais. Conecte o Token Permanente abaixo para habilitar Graph API ao vivo.';
    bannerBadge.className = 'shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40';
    bannerBadge.textContent = 'Fallback Fiel Ativo';

    metaPill.className = 'flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-xl bg-slate-800 text-slate-400 border border-slate-700 self-start sm:self-auto';
    metaPill.innerHTML = '<span class="w-2 h-2 rounded-full bg-indigo-400"></span><span>Pendente de Conexão</span>';
  }

  // Gemini Badge
  if (geminiBadge) {
    if (gemini.configurado) {
      geminiBadge.className = 'px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30';
      geminiBadge.textContent = 'Chave Ativa';
    } else {
      geminiBadge.className = 'px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700';
      geminiBadge.textContent = 'Não configurado';
    }
  }

  if (window.lucide) window.lucide.createIcons();
}

/**
 * Dispara teste do Token fornecido no input
 */
async function testarConexaoMeta() {
  const tokenInput = document.getElementById('meta-access-token');
  const accountIdInput = document.getElementById('meta-account-id');
  const btnTestar = document.getElementById('btn-testar-meta');
  const iconBtn = document.getElementById('icon-btn-testar');
  const labelBtn = document.getElementById('label-btn-testar');
  const cardDiag = document.getElementById('card-diagnostico-meta');

  const token = tokenInput ? tokenInput.value.trim() : '';
  const accountId = accountIdInput ? accountIdInput.value.trim() : '';

  if (!token) {
    mostrarToast('Por favor, cole o token de acesso no campo antes de testar.', 'erro');
    if (tokenInput) tokenInput.focus();
    return;
  }

  // Estado de carregamento
  if (btnTestar) btnTestar.disabled = true;
  if (iconBtn) {
    iconBtn.setAttribute('data-lucide', 'loader-2');
    iconBtn.classList.add('animate-spin');
  }
  if (labelBtn) labelBtn.textContent = 'Validando na Graph API...';
  if (cardDiag) cardDiag.classList.add('hidden');
  if (window.lucide) window.lucide.createIcons();

  try {
    const res = await fetch('/api/conexoes/testar-meta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, account_id: accountId })
    });

    const data = await res.json();
    const r = data.resultado || {};

    if (cardDiag) {
      cardDiag.classList.remove('hidden');

      if (r.valido) {
        cardDiag.className = 'p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/20 text-xs space-y-3';
        cardDiag.innerHTML = `
          <div class="flex items-center justify-between border-b border-emerald-500/20 pb-2.5">
            <div class="flex items-center gap-2 text-emerald-300 font-bold">
              <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-400"></i>
              <span>${r.mensagem}</span>
            </div>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 font-mono">
              ${r.tipo_token}
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
            <div><span class="text-slate-400">Expiração:</span> <strong>${r.data_expiracao}</strong></div>
            <div><span class="text-slate-400">Aplicativo:</span> <strong>${r.application} (${r.app_id || 'N/A'})</strong></div>
            <div><span class="text-slate-400">Conta Detectada:</span> <strong>${r.conta ? r.conta.name : 'Não vinculada'}</strong></div>
            <div><span class="text-slate-400">Status da Conta:</span> <strong>${r.conta ? r.conta.account_status : 'N/A'}</strong></div>
          </div>

          ${r.scopes && r.scopes.length > 0 ? `
            <div class="pt-2 border-t border-emerald-500/20">
              <span class="text-[10px] uppercase font-bold text-slate-400 block mb-1">Permissões Autorizadas:</span>
              <div class="flex flex-wrap gap-1">
                ${r.scopes.map(s => `<span class="px-2 py-0.5 rounded bg-slate-900 border border-emerald-500/30 text-[10px] text-emerald-300 font-mono">${s}</span>`).join('')}
              </div>
            </div>
          ` : ''}

          ${r.alerta_permissoes ? `
            <div class="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] flex items-center gap-1.5">
              <i data-lucide="alert-circle" class="w-3.5 h-3.5 shrink-0"></i>
              <span>${r.alerta_permissoes}</span>
            </div>
          ` : ''}
        `;
        mostrarToast('Token validado com sucesso na Meta!', 'sucesso');
      } else {
        cardDiag.className = 'p-4 rounded-xl border border-rose-500/40 bg-rose-950/20 text-xs space-y-2';
        cardDiag.innerHTML = `
          <div class="flex items-center gap-2 text-rose-300 font-bold">
            <i data-lucide="x-circle" class="w-4 h-4 text-rose-400 shrink-0"></i>
            <span>Falha na Validação do Token</span>
          </div>
          <p class="text-slate-300 text-[11px]">${r.mensagem || 'A Meta rejeitou o token fornecido.'}</p>
          ${r.codigo_erro ? `<span class="text-[10px] font-mono text-slate-400 block">Código de Erro Meta: ${r.codigo_erro} ${r.subcodigo_erro ? `(Subcódigo: ${r.subcodigo_erro})` : ''}</span>` : ''}
        `;
        mostrarToast('Token rejeitado pela Meta Graph API.', 'erro');
      }
    }
  } catch (err) {
    console.error('Erro ao testar token:', err);
    if (cardDiag) {
      cardDiag.classList.remove('hidden');
      cardDiag.className = 'p-4 rounded-xl border border-rose-500/40 bg-rose-950/20 text-xs';
      cardDiag.innerHTML = `<span class="text-rose-300">Erro de conexão ao testar token: ${err.message}</span>`;
    }
    mostrarToast('Erro ao testar conexão.', 'erro');
  } finally {
    if (btnTestar) btnTestar.disabled = false;
    if (iconBtn) {
      iconBtn.setAttribute('data-lucide', 'zap');
      iconBtn.classList.remove('animate-spin');
    }
    if (labelBtn) labelBtn.textContent = 'Testar Conexão';
    if (window.lucide) window.lucide.createIcons();
  }
}

/**
 * Salva as credenciais no .env e atualiza a aplicação a quente
 */
async function salvarCredenciais() {
  const tokenInput = document.getElementById('meta-access-token');
  const accountIdInput = document.getElementById('meta-account-id');
  const geminiInput = document.getElementById('gemini-api-key');
  const geminiModelSelect = document.getElementById('gemini-model');

  const btnSalvar = document.getElementById('btn-salvar-conexoes');
  const iconSalvar = document.getElementById('icon-btn-salvar');
  const labelSalvar = document.getElementById('label-btn-salvar');

  const payload = {};

  if (tokenInput && tokenInput.value.trim() !== '') {
    payload.meta_token = tokenInput.value.trim();
  }
  if (accountIdInput && accountIdInput.value.trim() !== '') {
    payload.account_id = accountIdInput.value.trim();
  }
  if (geminiInput && geminiInput.value.trim() !== '') {
    payload.gemini_key = geminiInput.value.trim();
  }
  if (geminiModelSelect && geminiModelSelect.value) {
    payload.gemini_model = geminiModelSelect.value;
  }

  // Estado de carregamento
  if (btnSalvar) btnSalvar.disabled = true;
  if (iconSalvar) {
    iconSalvar.setAttribute('data-lucide', 'loader-2');
    iconSalvar.classList.add('animate-spin');
  }
  if (labelSalvar) labelSalvar.textContent = 'Salvando no Servidor...';
  if (window.lucide) window.lucide.createIcons();

  try {
    const res = await fetch('/api/conexoes/salvar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (data.sucesso) {
      mostrarToast('Credenciais salvas com sucesso no .env!', 'sucesso');
      if (tokenInput) tokenInput.value = ''; // Limpa o campo do token para manter máscara
      if (geminiInput) geminiInput.value = '';
      await carregarStatusConexoes();
    } else {
      mostrarToast(`Erro ao salvar: ${data.erro}`, 'erro');
    }
  } catch (err) {
    console.error('Erro ao salvar credenciais:', err);
    mostrarToast('Falha na comunicação ao salvar configurações.', 'erro');
  } finally {
    if (btnSalvar) btnSalvar.disabled = false;
    if (iconSalvar) {
      iconSalvar.setAttribute('data-lucide', 'save');
      iconSalvar.classList.remove('animate-spin');
    }
    if (labelSalvar) labelSalvar.textContent = 'Salvar & Ativar no Servidor';
    if (window.lucide) window.lucide.createIcons();
  }
}

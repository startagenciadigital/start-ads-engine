/**
 * START ADS ENGINE - Gestão de PIN do Cliente
 * Módulo para visualização, alteração e compartilhamento do link de acesso via WhatsApp
 */

let pinAtualConta = '1234';

document.addEventListener('DOMContentLoaded', () => {
  // Carrega o PIN da conta inicial
  if (typeof contaAtualId !== 'undefined') {
    carregarPinContaGestor(contaAtualId);
  }
});

/**
 * Carrega o PIN atual da conta selecionada
 */
async function carregarPinContaGestor(contaId) {
  const inputPin = document.getElementById('input-pin-gestor');
  const spanContaNome = document.getElementById('pin-conta-nome');
  const btnSalvar = document.getElementById('btn-salvar-pin');

  if (inputPin) {
    inputPin.value = '••••';
    inputPin.disabled = true;
  }

  try {
    const res = await fetch(`/api/gestao-pin/${contaId}`);
    const data = await res.json();

    if (data.sucesso && data.dados) {
      pinAtualConta = data.dados.pin_code || '1234';
      if (inputPin) {
        inputPin.value = pinAtualConta;
        inputPin.disabled = false;
      }
      if (spanContaNome) {
        spanContaNome.innerText = data.dados.client_name || 'Cliente';
      }
    }
  } catch (err) {
    console.warn('[PIN Gestor] Erro ao carregar PIN:', err);
    if (inputPin) {
      inputPin.value = pinAtualConta;
      inputPin.disabled = false;
    }
  }
}

/**
 * Salva um novo PIN digitado pelo Gestor
 */
async function salvarNovoPinGestor() {
  const inputPin = document.getElementById('input-pin-gestor');
  const btnSalvar = document.getElementById('btn-salvar-pin');
  const feedback = document.getElementById('feedback-pin-salvo');
  
  if (!inputPin) return;

  const novoPin = inputPin.value.trim();
  if (novoPin.length < 4 || novoPin.length > 6) {
    alert('O PIN deve conter entre 4 e 6 dígitos numéricos.');
    inputPin.focus();
    return;
  }

  const textoOriginal = btnSalvar ? btnSalvar.innerHTML : 'Salvar';
  if (btnSalvar) {
    btnSalvar.disabled = true;
    btnSalvar.innerHTML = `<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Salvando...`;
  }

  try {
    const res = await fetch('/api/gestao-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conta_id: typeof contaAtualId !== 'undefined' ? contaAtualId : 'act_1717085079153654',
        novo_pin: novoPin
      })
    });

    const data = await res.json();
    if (data.sucesso) {
      pinAtualConta = novoPin;
      if (feedback) {
        feedback.classList.remove('hidden');
        setTimeout(() => feedback.classList.add('hidden'), 3500);
      }
    } else {
      alert(`Erro ao salvar PIN: ${data.erro || 'Falha na requisição'}`);
    }
  } catch (err) {
    alert(`Erro de conexão ao salvar PIN: ${err.message}`);
  } finally {
    if (btnSalvar) {
      btnSalvar.disabled = false;
      btnSalvar.innerHTML = textoOriginal;
      if (window.lucide) window.lucide.createIcons();
    }
  }
}

/**
 * Alterna visualização do PIN (ocultar / mostrar dígitos)
 */
function alternarVisibilidadePin() {
  const inputPin = document.getElementById('input-pin-gestor');
  const icone = document.getElementById('icone-olho-pin');
  if (!inputPin) return;

  if (inputPin.type === 'password') {
    inputPin.type = 'text';
    if (icone) icone.setAttribute('data-lucide', 'eye-off');
  } else {
    inputPin.type = 'password';
    if (icone) icone.setAttribute('data-lucide', 'eye');
  }
  if (window.lucide) window.lucide.createIcons();
}

/**
 * Copia mensagem pronta para WhatsApp com o Link e o PIN do Cliente
 */
function copiarLinkComPinGestor() {
  const conta = typeof contaAtualId !== 'undefined' ? contaAtualId : 'act_1717085079153654';
  const urlPortal = `${window.location.origin}/cliente?conta=${conta}`;
  const textoWhatsApp = `Olá! Segue seu link de acesso exclusivo ao Painel Executivo de Tráfego Pago:\n\n🔗 ${urlPortal}\n🔐 Seu PIN de acesso seguro: ${pinAtualConta}\n\n*START Agência Digital*`;

  navigator.clipboard.writeText(textoWhatsApp).then(() => {
    const toast = document.getElementById('toast-copiado-pin');
    if (toast) {
      toast.classList.remove('opacity-0', 'translate-y-2');
      toast.classList.add('opacity-100', 'translate-y-0');
      setTimeout(() => {
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', 'translate-y-2');
      }, 3000);
    }
  }).catch(err => {
    prompt('Copie o texto para enviar ao cliente:', textoWhatsApp);
  });
}

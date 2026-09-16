/**
 * START ADS ENGINE — Sidebar Global Unificada e Responsiva
 * Injetada de forma modular em todas as páginas operacionais (/, /gestor, /criar)
 */

(function initStartAdsSidebar() {
  // 1. Recupera preferência de recolhimento do Desktop
  const isCollapsed = localStorage.getItem('start_ads_sidebar_collapsed') === 'true';
  if (isCollapsed) {
    document.body.classList.add('sidebar-collapsed');
  }

  // 2. Identifica a rota atual para destacar o menu ativo
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';

  // 3. Monta o markup HTML da Sidebar e Modal de Conectividade
  const sidebarHTML = `
    <!-- Barra Superior Mobile (visível apenas em telas menores que lg) -->
    <div id="mobile-topbar" class="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 z-40 px-4 flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-cyan-500 to-emerald-400 p-[1.5px] flex items-center justify-center shadow-md">
          <div class="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
            <i data-lucide="zap" class="w-4 h-4 text-cyan-400"></i>
          </div>
        </div>
        <span class="font-bold text-sm tracking-tight text-white">START ADS ENGINE</span>
      </div>
      <button id="btn-open-sidebar-mobile" class="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700" aria-label="Abrir Menu">
        <i data-lucide="menu" class="w-5 h-5"></i>
      </button>
    </div>

    <!-- Backdrop escuro para Mobile -->
    <div id="sidebar-backdrop" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 hidden lg:hidden transition-opacity"></div>

    <!-- Barra Lateral Principal (Desktop fixa / Mobile gaveta) -->
    <aside id="app-sidebar" class="fixed top-0 bottom-0 left-0 w-[17.5rem] bg-slate-950/95 backdrop-blur-xl border-r border-slate-800/80 z-50 flex flex-col justify-between -translate-x-full lg:translate-x-0 shadow-2xl">
      
      <!-- Topo: Logo & Botão de Recolher -->
      <div class="h-16 border-b border-slate-800/80 px-4 flex items-center justify-between shrink-0">
        <a href="/" class="flex items-center gap-3 overflow-hidden group">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-cyan-500 to-emerald-400 p-[2px] flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
            <div class="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <i data-lucide="zap" class="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform"></i>
            </div>
          </div>
          <div class="sidebar-text truncate">
            <span class="text-sm font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent block leading-tight">START ADS ENGINE</span>
            <span class="text-[10px] text-cyan-400 font-semibold tracking-wider uppercase">Plataforma de Tráfego</span>
          </div>
        </a>

        <!-- Botão recolher no Desktop -->
        <button id="btn-toggle-sidebar" class="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800 transition-all shrink-0" title="Recolher / Expandir Menu">
          <i data-lucide="chevrons-left" id="icon-toggle-sidebar" class="w-4 h-4"></i>
        </button>

        <!-- Botão fechar no Mobile -->
        <button id="btn-close-sidebar-mobile" class="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Navegação Central -->
      <div id="app-sidebar-nav" class="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        
        <!-- Grupo: Operação & Campanhas -->
        <div>
          <div class="sidebar-section-title px-3 mb-2 text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            Navegação Principal
          </div>
          <nav class="space-y-1">
            
            <!-- Hub -->
            <a href="/" data-tooltip="Hub Multiplataforma" class="sidebar-nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              currentPath === '/' 
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm shadow-indigo-500/10' 
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
            }">
              <i data-lucide="layout-grid" class="w-4 h-4 shrink-0 ${currentPath === '/' ? 'text-indigo-400' : 'text-slate-400'}"></i>
              <span class="sidebar-text truncate">Hub Multiplataforma</span>
            </a>

            <!-- Gestor -->
            <a href="/gestor" data-tooltip="Dashboard do Gestor" class="sidebar-nav-item flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              currentPath === '/gestor' 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10' 
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
            }">
              <div class="flex items-center gap-3 truncate">
                <i data-lucide="bar-chart-3" class="w-4 h-4 shrink-0 ${currentPath === '/gestor' ? 'text-cyan-400' : 'text-slate-400'}"></i>
                <span class="sidebar-text truncate">Dashboard Gestor</span>
              </div>
              <span class="sidebar-badge px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Co-Piloto</span>
            </a>

            <!-- Criar -->
            <a href="/criar" data-tooltip="Nova Campanha" class="sidebar-nav-item flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              currentPath === '/criar' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                : 'text-slate-300 hover:text-white hover:bg-slate-900/80 border border-slate-800/80'
            }">
              <div class="flex items-center gap-3 truncate">
                <i data-lucide="plus-circle" class="w-4 h-4 shrink-0 ${currentPath === '/criar' ? 'text-white' : 'text-indigo-400'}"></i>
                <span class="sidebar-text truncate">Criar Campanha</span>
              </div>
              <span class="sidebar-badge px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white">IA Wizard</span>
            </a>

          </nav>
        </div>

        <!-- Grupo: Portais Externos -->
        <div>
          <div class="sidebar-section-title px-3 mb-2 text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            Visão Externa
          </div>
          <nav class="space-y-1">
            <a href="/cliente" target="_blank" data-tooltip="Portal Executivo do Cliente" class="sidebar-nav-item flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-emerald-300 hover:bg-emerald-950/20 border border-transparent hover:border-emerald-500/20 transition-all">
              <div class="flex items-center gap-3 truncate">
                <i data-lucide="shield-check" class="w-4 h-4 shrink-0 text-emerald-400"></i>
                <span class="sidebar-text truncate">Portal do Cliente</span>
              </div>
              <i data-lucide="external-link" class="sidebar-badge w-3.5 h-3.5 text-slate-400"></i>
            </a>
          </nav>
        </div>

      </div>

      <!-- Rodapé: Status do Sistema & Conectividade de APIs -->
      <div class="p-3 border-t border-slate-800/80 shrink-0">
        
        <!-- Visual Expandido -->
        <div class="sidebar-footer-expanded p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group" id="btn-abrir-status-api" title="Clique para ver o diagnóstico completo das APIs">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span class="text-[11px] font-bold text-slate-200">Status do Sistema</span>
            </div>
            <span class="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">200 OK</span>
          </div>

          <div class="space-y-1">
            <div class="flex items-center justify-between text-[11px] text-slate-400">
              <span>API Contas:</span>
              <span class="text-emerald-400 font-medium">Ativa</span>
            </div>
            <div class="flex items-center justify-between text-[11px] text-slate-400">
              <span>Meta Graph:</span>
              <span class="text-slate-300 font-medium">v20.0 (Pronta)</span>
            </div>
          </div>

          <div class="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400 group-hover:text-cyan-400 transition-colors">
            <span>Ver diagnóstico da API</span>
            <i data-lucide="arrow-up-right" class="w-3 h-3"></i>
          </div>
        </div>

        <!-- Visual Modo Recolhido (Ícone de Status Compacto) -->
        <div class="sidebar-footer-collapsed hidden items-center justify-center p-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer" id="btn-abrir-status-api-compacto" data-tooltip="Sistema Online (200 OK)">
          <span class="relative flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </div>

      </div>
    </aside>

    <!-- Modal de Diagnóstico de APIs (Acionado ao clicar no Status) -->
    <div id="modal-status-api" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 hidden">
      <div class="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
        <div class="flex items-center justify-between border-b border-slate-800 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <i data-lucide="activity" class="w-5 h-5 text-emerald-400"></i>
            </div>
            <div>
              <h3 class="text-base font-bold text-white">Diagnóstico de Conectividade</h3>
              <p class="text-xs text-slate-400">Monitoramento e endpoints da ENGINE</p>
            </div>
          </div>
          <button id="btn-fechar-status-api" class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <!-- Lista de Serviços -->
        <div class="space-y-3 text-xs">
          
          <!-- Endpoint /api/contas -->
          <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div class="space-y-0.5">
              <div class="font-semibold text-slate-200 flex items-center gap-2">
                <span>GET /api/contas</span>
                <span class="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-mono">200 OK</span>
              </div>
              <p class="text-[11px] text-slate-400">Retorno de contas ativas e saldos disponíveis</p>
            </div>
            <a href="/api/contas" target="_blank" class="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-700 font-medium text-[11px] flex items-center gap-1.5 transition-all">
              <span>Abrir JSON</span>
              <i data-lucide="external-link" class="w-3 h-3"></i>
            </a>
          </div>

          <!-- Meta Marketing API -->
          <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div class="space-y-0.5">
              <div class="font-semibold text-slate-200 flex items-center gap-2">
                <span>Meta Marketing API</span>
                <span class="px-1.5 py-0.2 rounded text-[10px] bg-cyan-500/20 text-cyan-400 font-mono">v20.0</span>
              </div>
              <p class="text-[11px] text-slate-400">Conta Ativa: act_1717085079153654 (Alex Voltagem)</p>
            </div>
            <span class="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              Operacional
            </span>
          </div>

          <!-- Google Gemini Flash -->
          <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div class="space-y-0.5">
              <div class="font-semibold text-slate-200 flex items-center gap-2">
                <span>Google Gemini IA</span>
                <span class="px-1.5 py-0.2 rounded text-[10px] bg-indigo-500/20 text-indigo-400 font-mono">1.5 Flash</span>
              </div>
              <p class="text-[11px] text-slate-400">Auditoria pré-voo e diagnósticos em tempo real</p>
            </div>
            <span class="text-xs font-semibold text-cyan-400 flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
              Pronto
            </span>
          </div>

        </div>

        <div class="pt-2 flex justify-end">
          <button id="btn-ok-status-api" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all">
            Fechar Diagnóstico
          </button>
        </div>
      </div>
    </div>
  `;

  // 4. Insere no início do body
  document.body.insertAdjacentHTML('afterbegin', sidebarHTML);

  // 5. Configura eventos interativos
  const btnToggle = document.getElementById('btn-toggle-sidebar');
  const iconToggle = document.getElementById('icon-toggle-sidebar');
  const btnMobileOpen = document.getElementById('btn-open-sidebar-mobile');
  const btnMobileClose = document.getElementById('btn-close-sidebar-mobile');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const sidebar = document.getElementById('app-sidebar');

  // Toggle Desktop (Recolher / Expandir)
  if (btnToggle) {
    btnToggle.addEventListener('click', () => {
      const nowCollapsed = document.body.classList.toggle('sidebar-collapsed');
      localStorage.setItem('start_ads_sidebar_collapsed', nowCollapsed ? 'true' : 'false');
      if (iconToggle) {
        iconToggle.setAttribute('data-lucide', nowCollapsed ? 'chevrons-right' : 'chevrons-left');
        if (window.lucide) window.lucide.createIcons();
      }
    });

    if (isCollapsed && iconToggle) {
      iconToggle.setAttribute('data-lucide', 'chevrons-right');
    }
  }

  // Mobile Drawer (Abrir / Fechar)
  function openMobileSidebar() {
    sidebar.classList.remove('-translate-x-full');
    sidebarBackdrop.classList.remove('hidden');
  }

  function closeMobileSidebar() {
    sidebar.classList.add('-translate-x-full');
    sidebarBackdrop.classList.add('hidden');
  }

  if (btnMobileOpen) btnMobileOpen.addEventListener('click', openMobileSidebar);
  if (btnMobileClose) btnMobileClose.addEventListener('click', closeMobileSidebar);
  if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeMobileSidebar);

  // Modal de Conectividade / Status da API
  const modalStatus = document.getElementById('modal-status-api');
  const btnAbrirStatus = document.getElementById('btn-abrir-status-api');
  const btnAbrirStatusCompacto = document.getElementById('btn-abrir-status-api-compacto');
  const btnFecharStatus = document.getElementById('btn-fechar-status-api');
  const btnOkStatus = document.getElementById('btn-ok-status-api');

  function openModal() {
    if (modalStatus) modalStatus.classList.remove('hidden');
  }

  function closeModal() {
    if (modalStatus) modalStatus.classList.add('hidden');
  }

  if (btnAbrirStatus) btnAbrirStatus.addEventListener('click', openModal);
  if (btnAbrirStatusCompacto) btnAbrirStatus.addEventListener('click', openModal);
  if (btnFecharStatus) btnFecharStatus.addEventListener('click', closeModal);
  if (btnOkStatus) btnOkStatus.addEventListener('click', closeModal);
  if (modalStatus) {
    modalStatus.addEventListener('click', (e) => {
      if (e.target === modalStatus) closeModal();
    });
  }

  // 7. Inicializa ícones Lucide da Sidebar
  if (window.lucide) {
    window.lucide.createIcons();
  }
})();

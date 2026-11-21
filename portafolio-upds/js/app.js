import { fetchPortfolioPayload } from './data.js';
import { PortfolioUIController } from './ui.js';

let deferredInstallPrompt = null;

function initThemePreference() {
  const savedTheme = localStorage.getItem('upds_theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
}

function monitorNetworkStatus() {
  const badge = document.getElementById('network-status');
  const updateState = () => {
    const online = navigator.onLine;
    badge.textContent = online ? 'En Linea' : 'Modo Offline';
    badge.classList.toggle('offline', !online);
  };
  window.addEventListener('online', updateState);
  window.addEventListener('offline', updateState);
  updateState();
}

function setupExternalInstallNotification() {
  const banner = document.getElementById('pwa-install-banner');
  const btnInstall = document.getElementById('btn-pwa-install');
  const btnDismiss = document.getElementById('btn-pwa-dismiss');

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    banner.hidden = false;
  });

  btnInstall.addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    banner.hidden = true;
  });

  btnDismiss.addEventListener('click', () => {
    banner.hidden = true;
  });
}

async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('./sw.js');
    } catch (error) {
      console.error('Error al registrar Service Worker:', error);
    }
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  initThemePreference();
  monitorNetworkStatus();
  setupExternalInstallNotification();
  await registerServiceWorker();

  const payload = await fetchPortfolioPayload();
  const uiController = new PortfolioUIController(payload);

  // Hidratacion automatica tras cargar datos y control manual desde el boton superior
  uiController.hydrateAllControls();
  document.getElementById('btn-hydrate').addEventListener('click', () => {
    uiController.hydrateAllControls();
  });
});
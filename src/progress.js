/* Toolbar "I miei progressi": tema, reset, backup export/import.
   localStorage sopravvive al refresh ma NON a "cancella dati", modalità
   privata, cambio device o eviction ITP su iOS: il backup su file è la
   rete di sicurezza. */

import { e } from './render/dom.js';
import {
  getState,
  setTheme,
  resetState,
  replaceState,
  exportStateJSON,
  isValidBackup,
  storageAvailable,
} from './state.js';

const THEMES = ['auto', 'light', 'dark'];

export function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'light' || theme === 'dark') {
    root.setAttribute('data-theme', theme);
  } else {
    root.removeAttribute('data-theme');
  }
}

function themeLabel(theme, ui) {
  const name =
    theme === 'light' ? ui.themeLight : theme === 'dark' ? ui.themeDark : ui.themeAuto;
  return `🌗 ${ui.themeLabel}: ${name}`;
}

function downloadBackup() {
  const blob = new Blob([exportStateJSON()], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'amsterdam-explorer-backup.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function initToolbar(mount, content) {
  if (!mount) return;
  const { ui } = content;

  mount.innerHTML = `
    <div class="toolbar-inner" role="group" aria-label="${e(ui.toolbarTitle)}">
      <button class="toolbar-btn" type="button" data-act="save">${e(ui.btnBackupSave)}</button>
      <button class="toolbar-btn" type="button" data-act="load">${e(ui.btnBackupLoad)}</button>
      <button class="toolbar-btn danger" type="button" data-act="reset">${e(ui.btnReset)}</button>
      <button class="toolbar-btn theme-toggle" type="button" data-act="theme"></button>
      <input type="file" accept="application/json,.json" hidden data-role="file">
      <p class="toolbar-status" role="status" aria-live="polite"></p>
    </div>`;

  const status = mount.querySelector('.toolbar-status');
  const fileInput = mount.querySelector('[data-role="file"]');
  const themeBtn = mount.querySelector('[data-act="theme"]');

  const setStatus = (msg, isWarn = false) => {
    status.textContent = msg;
    status.classList.toggle('warn', isWarn);
  };

  const refreshThemeBtn = () => {
    themeBtn.textContent = themeLabel(getState().theme, ui);
  };
  refreshThemeBtn();

  if (!storageAvailable()) setStatus(ui.storageWarning, true);

  mount.querySelector('[data-act="save"]').addEventListener('click', downloadBackup);

  mount.querySelector('[data-act="load"]').addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    fileInput.value = '';
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      if (!isValidBackup(parsed)) throw new Error('formato non valido');
      replaceState(parsed);
      setStatus(ui.backupLoaded);
      setTimeout(() => location.reload(), 400);
    } catch {
      setStatus(ui.backupLoadError, true);
    }
  });

  mount.querySelector('[data-act="reset"]').addEventListener('click', () => {
    if (!confirm(ui.resetConfirm)) return;
    resetState();
    location.reload();
  });

  themeBtn.addEventListener('click', () => {
    const current = getState().theme;
    const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
    setTheme(next);
    applyTheme(next);
    refreshThemeBtn();
  });
}

/* Wrapper su localStorage: chiave versionata, tutto in try/catch
   (modalità privata / storage disabilitato non devono rompere la pagina),
   scrittura con debounce. */

export const STORAGE_KEY = 'amsterdam-explorer:v1';

let cachedAvailable = null;

export function storageAvailable() {
  if (cachedAvailable !== null) return cachedAvailable;
  try {
    const probe = '__ae_probe__';
    localStorage.setItem(probe, probe);
    localStorage.removeItem(probe);
    cachedAvailable = true;
  } catch {
    cachedAvailable = false;
  }
  return cachedAvailable;
}

export function readState() {
  if (!storageAvailable()) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

let writeTimer = null;

export function writeState(value) {
  if (!storageAvailable()) return;
  clearTimeout(writeTimer);
  writeTimer = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
      /* quota superata o storage sparito: ignora */
    }
  }, 300);
}

export function clearState() {
  if (!storageAvailable()) return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignora */
  }
}

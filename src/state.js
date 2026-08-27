/* Unica fonte di verità dei progressi.
   Forma persistita (chiave `amsterdam-explorer:v1`):

   {
     "version": 1,
     "theme": "auto" | "light" | "dark",
     "missions": {
       "1": { "completed": true, "earned": 64, "checks": [true,false,...], "expanded": false }
     }
   }
*/

import { readState, writeState, clearState, storageAvailable } from './storage.js';

export const STATE_VERSION = 1;
export { storageAvailable };

function emptyState() {
  return { version: STATE_VERSION, theme: 'auto', missions: {} };
}

let state = emptyState();

export function getState() {
  return state;
}

/** Carica da localStorage; se assente o di versione diversa, riparte pulito. */
export function loadState() {
  const raw = readState();
  if (raw && typeof raw === 'object' && raw.version === STATE_VERSION) {
    state = {
      ...emptyState(),
      ...raw,
      missions: raw.missions && typeof raw.missions === 'object' ? raw.missions : {},
    };
  } else {
    state = emptyState();
  }
  return state;
}

function persist() {
  writeState(state);
}

/** Ritorna (creandolo se serve) il record di una missione. */
export function missionState(id) {
  const key = String(id);
  if (!state.missions[key]) {
    state.missions[key] = { completed: false, earned: 0, checks: [], expanded: false };
  }
  return state.missions[key];
}

export function setExpanded(id, open) {
  missionState(id).expanded = Boolean(open);
  persist();
}

export function setCheck(id, index, checked) {
  const record = missionState(id);
  record.checks[index] = Boolean(checked);
  persist();
}

export function setCompleted(id, { completed, earned = 0 }) {
  const record = missionState(id);
  record.completed = Boolean(completed);
  record.earned = completed ? earned : 0;
  persist();
}

export function setTheme(theme) {
  state.theme = theme;
  persist();
}

export function resetState() {
  state = emptyState();
  clearState();
}

/** Sostituisce lo stato con quello di un file di backup (già parsato). */
export function replaceState(next) {
  state = {
    ...emptyState(),
    theme: next && typeof next.theme === 'string' ? next.theme : 'auto',
    missions: next && next.missions && typeof next.missions === 'object' ? next.missions : {},
  };
  persist();
  return state;
}

export function exportStateJSON() {
  return JSON.stringify(state, null, 2);
}

/** Validazione minima di un oggetto backup. */
export function isValidBackup(value) {
  return Boolean(
    value &&
      typeof value === 'object' &&
      value.missions &&
      typeof value.missions === 'object',
  );
}

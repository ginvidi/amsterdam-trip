/* Caricamento contenuti per lingua.
   Aggiungere una lingua = aggiungere il file JSON e una riga qui sotto. */

const LOCALES = {
  it: () => import('./content/it.json'),
  // en: () => import('./content/en.json'),
};

export const DEFAULT_LOCALE = 'it';

/** Lingua scelta: ?lang= ha priorità, poi il default. */
export function pickLocale() {
  const requested = new URLSearchParams(location.search).get('lang');
  if (requested && LOCALES[requested]) return requested;
  return DEFAULT_LOCALE;
}

export async function loadContent(locale = pickLocale()) {
  const loader = LOCALES[locale] || LOCALES[DEFAULT_LOCALE];
  const module = await loader();
  return module.default;
}

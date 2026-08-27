/* Micro-helper di rendering. I contenuti arrivano tutti dal nostro JSON
   (non input utente), ma escapiamo comunque il testo: markup corretto e
   nessuna sorpresa con &, <, ". */

export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export const e = escapeHtml;

/** Rimpiazza i segnaposto {chiave} in una stringa. */
export function fmt(template, vars = {}) {
  return String(template).replace(/\{(\w+)\}/g, (_, key) =>
    key in vars ? String(vars[key]) : `{${key}}`,
  );
}

/** Svuota un nodo e ci mette dentro l'HTML passato. */
export function setHtml(node, html) {
  if (node) node.innerHTML = html;
}

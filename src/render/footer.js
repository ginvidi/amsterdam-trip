import { e } from './dom.js';

export function renderFooter(mount, content) {
  if (!mount) return;
  const { footer } = content;
  mount.innerHTML = `
    <span class="footer-title">${e(footer.title)}</span>
    ${e(footer.text)}`;
}

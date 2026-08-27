import { e } from './dom.js';

function tipCard(tip) {
  return `
    <div class="tip">
      <div class="tip-ico" aria-hidden="true">${e(tip.icon)}</div>
      <div class="tip-title">${e(tip.title)}</div>
      <div class="tip-text">${e(tip.text)}</div>
    </div>`;
}

export function renderTips(mount, content) {
  if (!mount) return;
  const { tips, ui } = content;
  mount.innerHTML = `
    <h2>${e(ui.sectionTips)}</h2>
    <div class="tips-grid">${tips.map(tipCard).join('')}</div>`;
}

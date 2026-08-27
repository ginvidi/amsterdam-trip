import { e } from './dom.js';

const COMPASS_SVG = `
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
    <g class="compass-outer">
      <circle cx="40" cy="40" r="37" stroke="rgba(245,170,26,.4)" stroke-width="1.5" stroke-dasharray="5 3"/>
      <circle cx="40" cy="40" r="32" stroke="rgba(245,170,26,.2)" stroke-width="1"/>
      <text x="40" y="11" text-anchor="middle" fill="#F5AA1A" font-size="8" font-family="Fredoka,'Fredoka One',cursive">N</text>
      <text x="40" y="74" text-anchor="middle" fill="#6890B8" font-size="7" font-family="Fredoka,'Fredoka One',cursive">S</text>
      <text x="9"  y="43" text-anchor="middle" fill="#6890B8" font-size="7" font-family="Fredoka,'Fredoka One',cursive">O</text>
      <text x="73" y="43" text-anchor="middle" fill="#6890B8" font-size="7" font-family="Fredoka,'Fredoka One',cursive">E</text>
    </g>
    <g class="compass-needle">
      <polygon points="40,14 43,40 40,46 37,40" fill="#E85C5C"/>
      <polygon points="40,66 43,40 40,46 37,40" fill="#6890B8" opacity=".6"/>
    </g>
    <circle cx="40" cy="40" r="5" fill="#F5AA1A"/>
    <circle cx="40" cy="40" r="2.5" fill="#07111F"/>
  </svg>`;

export function renderHero(mount, content) {
  if (!mount) return;
  const { hero } = content;
  mount.innerHTML = `
    <div class="compass-wrap">${COMPASS_SVG}</div>
    <h1>${e(hero.title)}</h1>
    <p class="tagline">${e(hero.tagline)}</p>
    <div class="star-bar" id="star-bar">
      <span style="font-size:1.3rem" aria-hidden="true">⭐</span>
      ${e(hero.starsLabel)}
      <span id="star-count">0</span> / <span id="star-max">0</span>
    </div>`;
}

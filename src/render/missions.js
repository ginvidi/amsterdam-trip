import { e, fmt } from './dom.js';

function gameItem(item, ui) {
  if (item && typeof item === 'object' && item.say) {
    // Frase da imparare (missione lingua): italiano → olandese + pronuncia + audio.
    const say = `<span class="phrase-say">“${e(item.say)}”</span>`;
    return `
    <li class="game-item game-phrase">
      <label>
        <input type="checkbox" class="game-check">
        <span class="game-text">
          <span class="phrase-it">${e(item.it)}</span>
          <span class="phrase-nl" lang="nl">${e(item.nl)}</span>
          ${say}
        </span>
      </label>
      <button type="button" class="phrase-audio" data-say="${e(item.nl)}" data-lang="nl-NL"
              aria-label="${e(fmt(ui.audioLabel, { word: item.nl }))}">🔊</button>
    </li>`;
  }
  if (item && typeof item === 'object') {
    // Cibo tipico da assaggiare (missione cibo): emoji + nome olandese + cos'è.
    const emoji = item.emoji
      ? `<span class="food-emoji" aria-hidden="true">${e(item.emoji)}</span>`
      : '';
    return `
    <li class="game-item game-food">
      <label>
        <input type="checkbox" class="game-check">
        <span class="game-text">
          ${emoji}
          <span class="food-nl" lang="nl">${e(item.nl)}</span>
          <span class="food-it">${e(item.it)}</span>
        </span>
      </label>
    </li>`;
  }
  return `
    <li class="game-item">
      <label>
        <input type="checkbox" class="game-check">
        <span class="game-text">${e(item)}</span>
      </label>
    </li>`;
}

function missionCard(mission, ui) {
  const { id, optional, stars, icon, iconBg, color, title, location, description, game, bonus } = mission;
  const items = game?.phrases ?? game?.foods ?? game?.items ?? [];
  return `
    <article class="mcard${optional ? ' optional' : ''}" data-mission="${id}" data-stars="${stars}">
      <h3 class="mcard-head-wrap">
        <button class="mcard-head" type="button" id="mbtn-${id}" aria-expanded="false" aria-controls="mpanel-${id}">
          <span class="mcard-icon" style="background:${e(iconBg)}" aria-hidden="true">${e(icon)}</span>
          <span class="mcard-info">
            <span class="mcard-title" style="color:${e(color)}">${e(title)}</span>
            <span class="mcard-stars">${e(fmt(ui.missionStars, { stars }))}</span>
            ${optional ? `<span class="mcard-optional-badge">${e(ui.optionalBadge)}</span>` : ''}
          </span>
          <span class="mcard-toggle" aria-hidden="true">▼</span>
        </button>
      </h3>
      <div class="mcard-body" id="mpanel-${id}" role="region" aria-labelledby="mbtn-${id}" hidden>
        <p class="mloc">${e(location)}</p>
        <p class="mdesc">${e(description)}</p>
        <div class="mgame">
          <div class="mgame-head">
            <strong id="game-title-${id}">${e(game?.title ?? '')}</strong>
            <span class="game-progress" aria-live="polite">${fmt(ui.gameProgress, { done: 0, total: items.length })}</span>
          </div>
          <ul class="game-list" role="list" aria-labelledby="game-title-${id}">
            ${items.map((item) => gameItem(item, ui)).join('')}
          </ul>
        </div>
        ${bonus ? `<p class="mbonus">${e(bonus)}</p>` : ''}
        <button class="mbtn pending" type="button">${e(ui.btnComplete)}</button>
      </div>
    </article>`;
}

export function renderMissions(mount, content) {
  if (!mount) return;
  const { missions, days, ui } = content;
  const optionalCount = missions.filter((m) => m.optional).length;

  const groups = days
    .map((day) => {
      const cards = missions.filter((m) => m.day === day.id).map((m) => missionCard(m, ui)).join('');
      if (!cards) return '';
      return `
        <div class="day-group-label ${day.id}">${e(day.label)}</div>
        <div class="mission-grid" id="grid-${day.id}">${cards}</div>`;
    })
    .join('');

  mount.innerHTML = `
    <h2>${e(fmt(ui.sectionMissions, { count: missions.length, optional: optionalCount }))}</h2>
    ${groups}`;
}

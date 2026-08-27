import { e } from './dom.js';

function stop(item) {
  return `
    <div class="ti">
      <div class="ti-time">${e(item.time)}</div>
      <div>
        <div class="ti-name">${e(item.name)}</div>
        <div class="ti-desc">${e(item.desc)}</div>
        ${item.tip ? `<div class="ti-tip">${e(item.tip)}</div>` : ''}
      </div>
    </div>`;
}

function dayBlock(block) {
  return `
    <div class="day-block">
      <div class="day-heading ${block.day}">${e(block.heading)}</div>
      <div class="timeline">${block.stops.map(stop).join('')}</div>
    </div>`;
}

export function renderItinerary(mount, content) {
  if (!mount) return;
  const { itinerary, ui } = content;
  mount.innerHTML = `
    <h2>${e(ui.sectionItinerary)}</h2>
    ${itinerary.map(dayBlock).join('')}`;
}

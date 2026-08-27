import { e } from './dom.js';

/* Sfondo mappa: decorativo, resta fisso. Pin e legenda sono generati dai dati. */
const BASE_MAP = `
  <rect width="540" height="330" fill="#081628"/>
  <rect x="0" y="0" width="540" height="68" fill="#0C2844"/>
  <path d="M0 68 C90 58,180 72,270 65 C360 58,450 72,540 65 L540 80 L0 80Z" fill="#081628"/>
  <line x1="18"  y1="22" x2="75"  y2="22" stroke="#0FC5BD" stroke-width=".7" opacity=".25"/>
  <line x1="110" y1="38" x2="190" y2="38" stroke="#0FC5BD" stroke-width=".7" opacity=".2"/>
  <line x1="310" y1="28" x2="420" y2="28" stroke="#0FC5BD" stroke-width=".7" opacity=".25"/>
  <line x1="445" y1="45" x2="520" y2="45" stroke="#0FC5BD" stroke-width=".7" opacity=".18"/>
  <text x="55" y="42" fill="#0FC5BD" font-size="9.5" opacity=".55" font-family="Nunito,sans-serif" font-weight="600">Fiume IJ</text>
  <rect x="188" y="65" width="164" height="22" rx="3" fill="#0F2A50"/>
  <rect x="188" y="65" width="164" height="4"  rx="2" fill="#0FC5BD" opacity=".4"/>
  <text x="270" y="80" text-anchor="middle" fill="#6890B8" font-size="9" font-family="Nunito,sans-serif" font-weight="700">Centraal Station</text>
  <rect x="0" y="87" width="540" height="243" fill="#091627"/>
  <path d="M 200 87 Q 270 198 340 87" stroke="#0FC5BD" stroke-width="3.5" fill="none" opacity=".7"/>
  <path d="M 175 87 Q 270 228 365 87" stroke="#0AA8A2" stroke-width="3"   fill="none" opacity=".58"/>
  <path d="M 150 87 Q 270 255 390 87" stroke="#089490" stroke-width="2.5" fill="none" opacity=".46"/>
  <path d="M 123 87 Q 270 279 417 87" stroke="#067F7B" stroke-width="2"   fill="none" opacity=".38"/>
  <line x1="108" y1="128" x2="432" y2="128" stroke="#0F2040" stroke-width="1.2"/>
  <line x1=" 95" y1="162" x2="445" y2="162" stroke="#0F2040" stroke-width="1.2"/>
  <line x1=" 88" y1="196" x2="452" y2="196" stroke="#0F2040" stroke-width="1.2"/>
  <rect x="45" y="105" width="28" height="16" rx="2" fill="#112240"/>
  <rect x="45" y="128" width="28" height="14" rx="2" fill="#112240"/>
  <rect x="45" y="150" width="28" height="20" rx="2" fill="#112240"/>
  <rect x="79" y="105" width="20" height="38" rx="2" fill="#112240"/>
  <rect x="435" y="105" width="28" height="16" rx="2" fill="#112240"/>
  <rect x="435" y="128" width="28" height="14" rx="2" fill="#112240"/>
  <rect x="469" y="105" width="35" height="38" rx="2" fill="#112240"/>
  <ellipse cx="70" cy="258" rx="58" ry="36" fill="#0A2E18"/>
  <ellipse cx="70" cy="258" rx="45" ry="26" fill="#0C3B1E" opacity=".8"/>
  <circle cx="42" cy="244" r="7" fill="#144D26" opacity=".8"/>
  <circle cx="60" cy="236" r="6" fill="#144D26" opacity=".7"/>
  <circle cx="90" cy="238" r="7" fill="#144D26" opacity=".8"/>
  <circle cx="75" cy="270" r="5" fill="#144D26" opacity=".6"/>
  <text x="70" y="263" text-anchor="middle" fill="#0FBF88" font-size="8.5" font-family="Nunito,sans-serif" font-weight="700">Vondelpark</text>
  <rect x="122" y="10" width="9" height="45" fill="#1E4A80" opacity=".9"/>
  <rect x="118" y="10" width="17" height="6" rx="1" fill="#2A60A0"/>
  <circle cx="127" cy="9" r="5" fill="#8B6FEF" opacity=".9"/>
  <line x1="118" y1="18" x2="108" y2="28" stroke="#8B6FEF" stroke-width="1" opacity=".6"/>
  <circle cx="510" cy="308" r="16" fill="#0C1B32" stroke="#112240" stroke-width="1.5"/>
  <text x="510" y="297" text-anchor="middle" fill="#F5AA1A" font-size="7" font-family="Fredoka,'Fredoka One',cursive">N</text>
  <text x="510" y="321" text-anchor="middle" fill="#6890B8" font-size="6.5" font-family="Fredoka,'Fredoka One',cursive">S</text>
  <text x="498" y="311" text-anchor="middle" fill="#6890B8" font-size="6.5" font-family="Fredoka,'Fredoka One',cursive">O</text>
  <text x="522" y="311" text-anchor="middle" fill="#6890B8" font-size="6.5" font-family="Fredoka,'Fredoka One',cursive">E</text>
  <polygon points="510,299 512,308 510,310 508,308" fill="#E85C5C"/>
  <polygon points="510,317 512,308 510,310 508,308" fill="#6890B8" opacity=".5"/>
`;

function pinMarkup(pin) {
  const numberFill = pin.filled ? '#07111F' : pin.color;
  const labelY = pin.labelPos === 'above' ? pin.y - 19 : pin.y + 26;
  const disc = pin.filled
    ? `<circle cx="${pin.x}" cy="${pin.y}" r="18" fill="${pin.color}" opacity=".18"/>
       <circle cx="${pin.x}" cy="${pin.y}" r="13" fill="${pin.color}"/>`
    : `<circle cx="${pin.x}" cy="${pin.y}" r="16" fill="${pin.color}" opacity=".18"/>
       <circle cx="${pin.x}" cy="${pin.y}" r="12" fill="none" stroke="${pin.color}" stroke-width="2" stroke-dasharray="3 2.5"/>`;
  const label = pin.label
    ? `<text x="${pin.x}" y="${labelY}" text-anchor="middle" fill="${pin.color}" font-size="8.5" font-family="Nunito,sans-serif" font-weight="700">${e(pin.label)}</text>`
    : '';
  return `
    <g class="mpin" data-mission="${pin.id}" role="button" tabindex="0"
       aria-label="Missione ${pin.id}${pin.label ? ' — ' + e(pin.label) : ''}">
      ${disc}
      <text x="${pin.x}" y="${pin.y + 4.5}" text-anchor="middle" fill="${numberFill}"
            font-size="11" font-weight="bold" font-family="Fredoka,'Fredoka One',cursive">${pin.id}</text>
      ${label}
    </g>`;
}

function legendMarkup(legend) {
  let x = 12;
  return legend
    .map((item) => {
      const swatch = item.filled
        ? `<rect x="${x}" y="304" width="10" height="10" rx="2" fill="${item.color}"/>`
        : `<rect x="${x}" y="304" width="10" height="10" rx="2" fill="none" stroke="${item.color}" stroke-width="1.5" stroke-dasharray="2 1.5"/>`;
      const textX = x + 14;
      const markup = `${swatch}<text x="${textX}" y="313" fill="#6890B8" font-size="8.5" font-family="Nunito,sans-serif">${e(item.label)}</text>`;
      x = textX + item.label.length * 4.7 + 12;
      return markup;
    })
    .join('');
}

export function renderMap(mount, content) {
  if (!mount) return;
  const { map, ui } = content;
  mount.innerHTML = `
    <h2>${e(ui.sectionMap)}</h2>
    <div class="map-wrap">
      <svg viewBox="0 0 540 330" xmlns="http://www.w3.org/2000/svg" role="img"
           aria-label="Mappa dell'avventura ad Amsterdam con le missioni">
        ${BASE_MAP}
        <g id="map-legend">${legendMarkup(map.legend)}</g>
        <g id="map-pins">${map.pins.map(pinMarkup).join('')}</g>
      </svg>
    </div>
    <p class="map-hint">${e(ui.mapHint)}</p>`;
}

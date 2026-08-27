import './styles/main.scss';

// Font self-hosted (Fontsource), solo subset latino: niente CDN, precache PWA => offline ok.
import '@fontsource/fredoka/latin-500.css';
import '@fontsource/fredoka/latin-600.css';
import '@fontsource/nunito/latin-400.css';
import '@fontsource/nunito/latin-600.css';
import '@fontsource/nunito/latin-700.css';
import '@fontsource/nunito/latin-800.css';
import '@fontsource/nunito/latin-900.css';

import { loadContent } from './i18n.js';
import { loadState, getState } from './state.js';
import { renderHero } from './render/hero.js';
import { renderMap } from './render/map.js';
import { renderMissions } from './render/missions.js';
import { renderItinerary } from './render/itinerary.js';
import { renderTips } from './render/tips.js';
import { renderFooter } from './render/footer.js';
import { initMissions } from './missions-behavior.js';
import { initToolbar, applyTheme } from './progress.js';

async function main() {
  loadState();
  applyTheme(getState().theme);

  const content = await loadContent();

  document.documentElement.lang = content.meta.htmlLang || 'it';
  document.documentElement.dir = content.meta.dir || 'ltr';
  document.title = content.meta.title;

  const $ = (id) => document.getElementById(id);

  renderHero($('hero'), content);
  initToolbar($('toolbar'), content);
  renderMap($('map'), content);
  renderMissions($('missions'), content);
  renderItinerary($('itinerary'), content);
  renderTips($('tips'), content);
  renderFooter($('footer'), content);

  // I nodi delle missioni ora esistono: aggancia il comportamento e ripristina.
  initMissions(content);
}

main();

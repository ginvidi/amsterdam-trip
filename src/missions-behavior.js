/* Comportamento delle missioni: accordion accessibile, checklist con
   soglia del 50%, completa/annulla. Ogni cambiamento viene anche
   salvato nello stato (state.js) e allo start lo stato viene ripristinato.
   Port da script/main.js dell'app originale. */

import { fmt } from './render/dom.js';
import { missionState, setExpanded, setCheck, setCompleted } from './state.js';

export function initMissions(content) {
  const { ui } = content;
  const cards = Array.from(document.querySelectorAll('.mcard'));
  const starCount = document.getElementById('star-count');
  const starMax = document.getElementById('star-max');
  const starBar = document.getElementById('star-bar');

  // Totale stelle disponibili = somma dei data-stars delle sole missioni
  // obbligatorie. Le facoltative sono bonus: completandole si può superare
  // il totale, ma non lo gonfiano.
  starMax.textContent = cards
    .filter((c) => !c.classList.contains('optional'))
    .reduce((sum, c) => sum + Number(c.dataset.stars || 0), 0);

  const idOf = (card) => card.dataset.mission;

  function openCard(card, open, { persist = true } = {}) {
    card.querySelector('.mcard-head').setAttribute('aria-expanded', String(open));
    card.querySelector('.mcard-body').hidden = !open;
    if (persist) setExpanded(idOf(card), open);
  }

  function refreshCoreState() {
    const coreDone = cards
      .filter((c) => !c.classList.contains('optional'))
      .every((c) => c.classList.contains('completed'));
    starBar.classList.toggle('done', coreDone);
    starCount.classList.toggle('done', coreDone);
  }

  function recalcTotals() {
    const total = cards.reduce(
      (sum, c) => sum + (c.classList.contains('completed') ? Number(c.dataset.earned || 0) : 0),
      0,
    );
    starCount.textContent = total;
    refreshCoreState();
  }

  function applyCompletedVisual(card, { stars, done, total }) {
    card.dataset.earned = String(stars);
    card.classList.add('completed');

    const btn = card.querySelector('.mbtn');
    btn.classList.replace('pending', 'done');
    btn.disabled = true;
    btn.textContent =
      total && done < total
        ? fmt(ui.btnDonePartial, { stars, max: card.dataset.stars, done, total })
        : fmt(ui.btnDoneFull, { stars });

    const head = card.querySelector('.mcard-head');
    if (!head.querySelector('.mcard-done-badge')) {
      const badge = document.createElement('span');
      badge.className = 'mcard-done-badge';
      badge.setAttribute('aria-hidden', 'true');
      badge.textContent = '✓';
      head.insertBefore(badge, head.querySelector('.mcard-toggle'));
    }

    if (!card.querySelector('.mbtn-undo')) {
      const undo = document.createElement('button');
      undo.type = 'button';
      undo.className = 'mbtn-undo';
      undo.textContent = ui.btnUndo;
      undo.addEventListener('click', () => uncompleteCard(card));
      btn.insertAdjacentElement('afterend', undo);
    }
  }

  function revertCompletedVisual(card) {
    delete card.dataset.earned;
    card.classList.remove('completed');

    const btn = card.querySelector('.mbtn');
    btn.classList.replace('done', 'pending');
    btn.disabled = false;
    btn.textContent = ui.btnComplete;

    card.querySelector('.mbtn-undo')?.remove();
    card.querySelector('.mcard-done-badge')?.remove();
  }

  function completeCard(card, checks, { persist = true } = {}) {
    // Stelle proporzionali alle caselle spuntate; senza checklist, punteggio pieno.
    const maxStars = Number(card.dataset.stars || 0);
    const done = checks.filter((c) => c.checked).length;
    const stars = checks.length ? Math.round((maxStars * done) / checks.length) : maxStars;

    applyCompletedVisual(card, { stars, done, total: checks.length });
    if (persist) setCompleted(idOf(card), { completed: true, earned: stars });
    recalcTotals();
  }

  function uncompleteCard(card) {
    revertCompletedVisual(card);
    setCompleted(idOf(card), { completed: false });
    recalcTotals();
  }

  cards.forEach((card) => {
    const id = idOf(card);
    const record = missionState(id);
    const head = card.querySelector('.mcard-head');
    const checks = Array.from(card.querySelectorAll('.game-check'));
    const progress = card.querySelector('.game-progress');
    const mbtn = card.querySelector('.mbtn');

    const checkedCount = () => checks.filter((c) => c.checked).length;
    const minChecks = checks.length ? Math.ceil(checks.length / 2) : 0;

    const syncProgress = () => {
      if (progress) {
        progress.textContent = fmt(ui.gameProgress, { done: checkedCount(), total: checks.length });
      }
    };

    let errMsg = null;
    const clearError = () => {
      if (errMsg) {
        errMsg.remove();
        errMsg = null;
      }
    };
    const showError = () => {
      if (!errMsg) {
        errMsg = document.createElement('p');
        errMsg.className = 'mgame-error';
        errMsg.setAttribute('role', 'alert');
        mbtn.insertAdjacentElement('beforebegin', errMsg);
      }
      errMsg.textContent = fmt(ui.thresholdError, {
        min: minChecks,
        total: checks.length,
        have: checkedCount(),
      });
    };

    // Ripristino + wiring delle caselle
    checks.forEach((chk, index) => {
      if (record.checks[index]) chk.checked = true;
      chk.addEventListener('change', () => {
        setCheck(id, index, chk.checked);
        syncProgress();
        if (errMsg && checkedCount() >= minChecks) clearError();
      });
    });
    syncProgress();

    head.addEventListener('click', () => openCard(card, card.querySelector('.mcard-body').hidden));

    mbtn.addEventListener('click', () => {
      if (minChecks && checkedCount() < minChecks) {
        showError();
        return;
      }
      clearError();
      completeCard(card, checks);
    });

    // Ripristino stato salvato
    if (record.expanded) openCard(card, true, { persist: false });
    if (record.completed) completeCard(card, checks, { persist: false });
  });

  // I pin sulla mappa aprono la missione e vi portano il focus
  document.querySelectorAll('.mpin').forEach((pin) => {
    const activate = () => {
      const card = document.querySelector(`.mcard[data-mission="${pin.dataset.mission}"]`);
      if (!card) return;
      openCard(card, true);
      card.querySelector('.mcard-head').focus({ preventScroll: true });
      setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80);
    };
    pin.addEventListener('click', activate);
    pin.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activate();
      }
    });
  });

  recalcTotals();
}

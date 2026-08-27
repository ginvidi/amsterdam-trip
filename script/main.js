/* Solo comportamento: i contenuti vivono nell'HTML, qui si cambia solo lo stato.
   Accordion accessibile: ogni card ha <h3><button aria-expanded aria-controls>
   e un pannello <div role="region" aria-labelledby hidden>. Il <button> gestisce
   focus e tastiera (Enter/Spazio) in modo nativo: qui basta sincronizzare
   aria-expanded e l'attributo hidden del pannello. */

document.addEventListener('DOMContentLoaded', () => {
  const cards      = Array.from(document.querySelectorAll('.mcard'));
  const starCount  = document.getElementById('star-count');
  const starMaxEl  = document.getElementById('star-max');
  const starBar    = document.getElementById('star-bar');

  let totalStars = 0;
  const completed = new Set();

  // Totale stelle disponibili = somma dei data-stars presenti nell'HTML
  starMaxEl.textContent = cards.reduce((sum, c) => sum + Number(c.dataset.stars || 0), 0);

  function openCard(card, open) {
    const head = card.querySelector('.mcard-head');
    const body = card.querySelector('.mcard-body');
    head.setAttribute('aria-expanded', String(open));
    body.hidden = !open;
  }

  function refreshCoreState() {
    const coreDone = cards
      .filter(c => !c.classList.contains('optional'))
      .every(c => completed.has(c));
    starBar.classList.toggle('done', coreDone);
    starCount.style.color = coreDone ? 'var(--green)' : '';
  }

  function completeCard(card) {
    if (completed.has(card)) return;
    completed.add(card);

    // Stelle proporzionali ai tick spuntati: chi finisce a metà prende metà.
    // Senza checklist (nessuna casella) si assegna il punteggio pieno.
    const maxStars = Number(card.dataset.stars || 0);
    const checks   = Array.from(card.querySelectorAll('.game-check'));
    const done     = checks.filter(c => c.checked).length;
    const stars    = checks.length
      ? Math.round(maxStars * done / checks.length)
      : maxStars;

    // Memorizzato sulla card: uncompleteCard deve togliere esattamente questo.
    card.dataset.earned = String(stars);
    totalStars += stars;
    starCount.textContent = totalStars;

    const btn = card.querySelector('.mbtn');
    btn.classList.replace('pending', 'done');
    btn.disabled    = true;
    btn.textContent = checks.length && done < checks.length
      ? `✅ Missione completata! +${stars}/${maxStars} stelle (${done}/${checks.length} caselle)`
      : `✅ Missione completata! +${stars} stelle!`;
    card.classList.add('completed');

    // Badge "completata" nell'intestazione: visibile anche ad accordion chiuso
    const head = card.querySelector('.mcard-head');
    if (!head.querySelector('.mcard-done-badge')) {
      const badge = document.createElement('span');
      badge.className = 'mcard-done-badge';
      badge.setAttribute('aria-hidden', 'true');
      badge.textContent = '✓';
      head.insertBefore(badge, head.querySelector('.mcard-toggle'));
    }

    // Tasto separato per annullare il completamento
    let undo = card.querySelector('.mbtn-undo');
    if (!undo) {
      undo = document.createElement('button');
      undo.type = 'button';
      undo.className = 'mbtn-undo';
      undo.textContent = '✖ Annulla missione completata';
      undo.addEventListener('click', () => uncompleteCard(card));
      btn.insertAdjacentElement('afterend', undo);
    }

    refreshCoreState();
  }

  function uncompleteCard(card) {
    if (!completed.has(card)) return;
    completed.delete(card);

    // Toglie esattamente quanto assegnato al completamento (fallback: punteggio pieno)
    const stars = Number(card.dataset.earned ?? card.dataset.stars ?? 0);
    delete card.dataset.earned;
    totalStars -= stars;
    starCount.textContent = totalStars;

    const btn = card.querySelector('.mbtn');
    btn.classList.replace('done', 'pending');
    btn.disabled    = false;
    btn.textContent = btn.dataset.label || '🏆 Completa la Missione!';
    card.classList.remove('completed');

    const undo = card.querySelector('.mbtn-undo');
    if (undo) undo.remove();

    const badge = card.querySelector('.mcard-done-badge');
    if (badge) badge.remove();

    refreshCoreState();
  }

  cards.forEach(card => {
    const head = card.querySelector('.mcard-head');
    const body = card.querySelector('.mcard-body');

    // Apri / chiudi la card (il <button> porta già focus + Enter/Spazio nativi)
    head.addEventListener('click', () => openCard(card, body.hidden));

    // Checklist del gioco: checkbox nativi <input type="checkbox"> dentro <label>.
    // Il browser gestisce da solo focus, tastiera (Spazio) e annuncio dello stato;
    // qui aggiorniamo solo il contatore "n/totale".
    const checks   = Array.from(card.querySelectorAll('.game-check'));
    const progress = card.querySelector('.game-progress');
    if (checks.length && progress) {
      const syncProgress = () => {
        const n = checks.filter(c => c.checked).length;
        progress.textContent = `${n}/${checks.length}`;
      };
      checks.forEach(c => c.addEventListener('change', syncProgress));
      syncProgress(); // stato iniziale (utile se il browser ripristina le spunte)
    }

    // Regola: per completare la missione serve almeno il 50% delle caselle
    // spuntate (arrotondato per eccesso). Sotto la soglia mostriamo un errore.
    const minChecks   = checks.length ? Math.ceil(checks.length / 2) : 0;
    const checkedCount = () => checks.filter(c => c.checked).length;

    let errMsg = null;
    function clearError() {
      if (errMsg) { errMsg.remove(); errMsg = null; }
    }
    function showError() {
      if (!errMsg) {
        errMsg = document.createElement('p');
        errMsg.className = 'mgame-error';
        errMsg.setAttribute('role', 'alert');
        mbtn.insertAdjacentElement('beforebegin', errMsg);
      }
      errMsg.textContent =
        `🚫 Ti serve spuntare almeno ${minChecks} caselle su ${checks.length} ` +
        `per completare la missione — ne hai ${checkedCount()}.`;
    }

    // L'errore sparisce da solo appena raggiungi la soglia
    checks.forEach(c => c.addEventListener('change', () => {
      if (errMsg && checkedCount() >= minChecks) clearError();
    }));

    // Completa la missione (solo se la soglia del 50% è rispettata)
    const mbtn = card.querySelector('.mbtn');
    mbtn.dataset.label = mbtn.textContent.trim();
    mbtn.addEventListener('click', () => {
      if (minChecks && checkedCount() < minChecks) {
        showError();
        return;
      }
      clearError();
      completeCard(card);
    });
  });

  // I pin sulla mappa aprono la missione corrispondente e vi spostano il focus
  document.querySelectorAll('.mpin').forEach(pin => {
    pin.addEventListener('click', () => {
      const card = document.querySelector(`.mcard[data-mission="${pin.dataset.mission}"]`);
      if (!card) return;
      openCard(card, true);
      const head = card.querySelector('.mcard-head');
      head.focus({ preventScroll: true });
      setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80);
    });
  });
});

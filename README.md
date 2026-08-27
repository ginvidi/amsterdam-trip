# 🧭 Amsterdam Explorer

Avventura interattiva per piccoli esploratori: 8 missioni ad Amsterdam, sistema di
stelle, mappa disegnata a mano, itinerario e consigli di viaggio.

È una **web-app installabile** (PWA): si apre dal telefono come un'app normale,
**funziona senza internet** e **i progressi restano salvati** sul dispositivo.

---

## 📱 Per il bambino — installare l'app sul telefono / tablet

1. Con una connessione internet, apri l'indirizzo del sito (quello di GitHub Pages —
   vedi sotto) nel browser.
2. Installa l'app sulla schermata Home:
   - **iPhone / iPad (Safari):** pulsante *Condividi* → **Aggiungi a Home**.
   - **Android (Chrome):** menù **⋮** → **Installa app** / **Aggiungi a schermata Home**.
3. Da adesso l'icona 🌷 è nella Home. L'app si apre a schermo intero **anche in aereo /
   senza rete**.

### I progressi si salvano da soli

Stelle, caselle spuntate e missioni completate vengono salvati sul dispositivo
(`localStorage`) e si ritrovano ad ogni riapertura, anche dopo un refresh.

### Backup (consigliato prima di un viaggio)

Il salvataggio automatico **non** sopravvive a: "Cancella dati sito", navigazione
in incognito, cambio di dispositivo, o (su iPhone) diverse settimane di inutilizzo.
Per sicurezza, nella barra **"I miei progressi"** in cima alla pagina:

- **💾 Salva i miei progressi** → scarica un file `amsterdam-explorer-backup.json`.
- **📂 Carica progressi** → ricarica quel file su qualsiasi dispositivo.
- **🔄 Ricomincia da capo** → azzera tutto (con conferma).
- **🌗 Tema** → auto / chiaro / scuro (anche questo viene ricordato).

---

## 👩‍💻 Sviluppo

Serve **Node.js 20+** (consigliato via [nvm](https://github.com/nvm-sh/nvm):
`nvm install --lts`).

```bash
npm install        # una volta
npm run dev        # server di sviluppo con hot reload → http://localhost:5173
npm run build      # build di produzione in dist/
npm run preview    # anteprima della build di produzione
```

### Struttura

```
index.html                 shell minima: header/main/footer vuoti + <script type=module>
vite.config.js             base path + configurazione PWA (manifest, precache, icone)
public/icon.svg            sorgente unica da cui vengono generate tutte le icone PWA
src/
  main.js                  entry: carica contenuti → render → comportamento → ripristino stato
  content/it.json          TUTTI i testi (missioni, mappa, itinerario, consigli…)
  i18n.js                  scelta lingua e caricamento del JSON (?lang= per forzare)
  storage.js               wrapper localStorage (try/catch, chiave versionata, debounce)
  state.js                 modello dei progressi + load/save/reset/export
  progress.js              barra "I miei progressi": tema, reset, backup export/import
  missions-behavior.js     accordion, checklist con soglia 50%, completa/annulla, ripristino
  render/                   hero, map, missions, itinerary, tips, footer (da JSON → DOM)
  styles/                   SCSS: main.scss + partial (_tokens, _base, _missions, …)
.github/workflows/deploy.yml  build e deploy automatici su GitHub Pages
```

### Cambiare i contenuti

Tutto il testo è in **[`src/content/it.json`](src/content/it.json)**. Modifica lì:
missioni, giochi, itinerario, consigli, etichette. Nessun ritocco a HTML/JS.

### Aggiungere una lingua

1. Copia `src/content/it.json` in `src/content/en.json` e traduci i valori.
2. In `src/i18n.js` aggiungi `en: () => import('./content/en.json')`.
3. Aprendo la pagina con `?lang=en` verrà usato il nuovo file.

### Colori / stile

Token colore in [`src/styles/_tokens.scss`](src/styles/_tokens.scss) (custom
properties, con tema chiaro/scuro). Gli hex dei pin mappa nel JSON vanno tenuti
allineati a questi token.

---

## 🌍 Hosting gratuito — GitHub Pages

Il workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) fa build e
deploy ad ogni push su `main`.

1. Crea un repository su GitHub e fai `git push`.
2. Repo → **Settings → Pages → Source = GitHub Actions**.
3. Al primo push l'Action pubblica il sito su
   `https://<utente>.github.io/<nome-repo>/`.

Il `base` path viene impostato in automatico dall'Action al nome del repo. Se usi un
repo `<utente>.github.io` o un dominio personalizzato, imposta la variabile
`VITE_BASE=/` nel workflow.

### Alternative equivalenti (tutte gratis, con HTTPS)

| Servizio          | Note                                                        |
|-------------------|------------------------------------------------------------|
| **GitHub Pages**  | Già configurato qui, nessun servizio esterno. Predefinito. |
| Cloudflare Pages  | Build cloud, CDN veloce, anteprime per branch. `VITE_BASE=/`. |
| Netlify           | Deploy da Git o drag-and-drop della cartella `dist/`.       |
| Vercel            | Simile a Netlify.                                           |

---

## 💡 Idee per il futuro

- Coriandoli + suono al completamento di una missione (rispettando `prefers-reduced-motion`).
- "Taccuino": nota o disegno per ogni missione.
- Card dei risultati condivisibile (immagine) e link con codice progressi.
- Itinerario che evidenzia automaticamente "oggi" in base alla data del viaggio.
- Sezione "adulti / cosa fare in città" (lo schema JSON è già estendibile).
- Traduzione inglese + selettore lingua nell'interfaccia.

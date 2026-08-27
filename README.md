# 🧭 Amsterdam Explorer — Mappa Avventura

Un'avventura interattiva per esplorare Amsterdam in 2 giorni, pensata per i piccoli avventurieri!

## Come aprire il progetto

### Metodo 1 — Apri direttamente nel browser (più semplice)

1. Apri la cartella `amsterdam-explorer-local`
2. Fai doppio clic su `index.html`
3. Si aprirà nel tuo browser predefinito

> **Nota:** Per caricare i font Google (Fredoka One e Nunito) serve una connessione internet.
> Senza internet il sito funziona comunque, ma con font di sistema standard.

---

### Metodo 2 — Server locale (consigliato per sviluppo)

Se hai Python installato (macOS e Linux ce l'hanno di default):

```bash
cd amsterdam-explorer-local
python3 -m http.server 8000
```

Poi apri il browser su: **http://localhost:8000**

Per Windows con Python:
```bash
cd amsterdam-explorer-local
python -m http.server 8000
```

---

### Metodo 3 — Con Node.js

Se hai Node.js installato:

```bash
npx serve amsterdam-explorer-local
```

---

## Struttura del progetto

```
amsterdam-explorer-local/
└── index.html      ← tutta l'app in un unico file (HTML + CSS + JS inline)
└── README.md       ← questo file
```

Il progetto è volutamente **single-file**: non ci sono dipendenze da installare,
nessun `npm install`, nessun build step. Basta un browser.

---

## Funzionalità

- 🗺️ **Mappa interattiva** di Amsterdam con 6 missioni cliccabili
- 📋 **Missioni** divise per Giorno 1 e Giorno 2
- ⭐ **Sistema di stelle** — completa ogni missione per guadagnare stelle
- 🌙 **Tema chiaro/scuro** — segue le preferenze del sistema
- 📱 **Responsive** — funziona su tablet e smartphone

## Le 6 missioni

| Missione | Luogo | Stelle |
|----------|-------|--------|
| 1 — Il Richiamo della Foresta | Vondelpark | 100 ⭐ |
| 2 — Laboratorio del Futuro | NEMO Science Museum | 200 ⭐ |
| 3 — Il Marinaio Fantasma | Museo Marittimo | 150 ⭐ |
| 4 — Caccia ai Tesori Nascosti | Mercatino Waterlooplein | 150 ⭐ |
| 5 — Il Guardiano della Natura | Artis Zoo | 250 ⭐ |
| 6 — Missione Finale: I Canali Segreti | Giro in barca | 200 ⭐ |

**Stelle totali collezionabili: 1050 ⭐**

---

## Personalizzare

Il file `index.html` è leggibile e modificabile con qualsiasi editor di testo
(VS Code, Notepad++, TextEdit, ecc.).

- **Missioni:** cerca `const MISSIONS = [` nel file JS
- **Colori:** cerca `/* === TOKENS === */` nella sezione CSS
- **Mappa SVG:** cerca `<svg id="map"` nel body HTML

---

*Buon viaggio ad Amsterdam! 🌷*

# Personal Dashboard

A personal dashboard landing page built with React and Tailwind CSS. Displays a live clock, 3-day weather forecast, and a Hacker News tech news feed — with 4 visual themes, each supporting light and dark mode.

**Live site:** https://douluvme.github.io/landing-page-20260421/

---

## Features

- **Live clock** — updates every second, shows time and full date
- **Weather forecast** — current conditions + 3-day forecast via WeatherAPI.com (auto-detects location by IP)
- **Tech news feed** — top 10 Hacker News stories, auto-refreshes every 5 minutes
- **4 visual themes** — Minimal, Terminal, Paper, Neon
- **Light / dark mode** — all 4 themes have both light and dark variants, preference saved to `localStorage`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI framework | React 19 (via Vite) |
| Styling | Tailwind CSS v4 |
| Weather data | [WeatherAPI.com](https://www.weatherapi.com/) |
| News data | [Hacker News Firebase API](https://github.com/HackerNews/API) |
| Deployment | GitHub Pages via `gh-pages` |

---

## Project Structure

```
src/
├── main.jsx              # React entry point
├── App.jsx               # Root component, theme state management
├── themes.js             # Theme definitions (id, label, dot color)
├── index.css             # CSS custom properties for all themes
└── components/
    ├── Clock.jsx         # Live clock + theme/dark switcher controls
    ├── Weather.jsx       # Weather forecast card
    └── NewsFeed.jsx      # Hacker News feed
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A free [WeatherAPI.com](https://www.weatherapi.com/) API key

### Installation

```bash
git clone https://github.com/douluvme/landing-page-20260421.git
cd landing-page-20260421
npm install
```

### Configuration

Create a `.env` file in the project root:

```
VITE_WEATHER_API_KEY=your_api_key_here
```

> The weather widget shows a prompt message if the key is missing. The Hacker News feed works without any key.

### Development

```bash
npm run dev
```

Opens at `http://localhost:5173/`.

### Production build

```bash
npm run build
```

Output goes to `dist/`.

### Deploy to GitHub Pages

```bash
npm run build && npm run deploy
```

Pushes `dist/` to the `gh-pages` branch. Make sure GitHub Pages is set to serve from that branch in your repo settings.

---

## Component Reference

### `App.jsx`

Root component. Owns the `useTheme` hook which manages:

- `theme` — active theme id (`minimal` | `terminal` | `paper` | `neon`)
- `dark` — boolean for light/dark mode

On every change it:
1. Removes all `theme-*` classes from `<html>`
2. Adds the new `theme-<id>` class (skipped for `minimal`)
3. Toggles the `dark` class
4. Persists both values to `localStorage`

```
localStorage keys:
  theme-preset  →  "minimal" | "terminal" | "paper" | "neon"
  theme-dark    →  "true" | "false"
```

---

### `themes.js`

Exports `THEMES` — the array of theme descriptors used by both `App.jsx` and `Clock.jsx`.

```js
{ id: 'minimal',  label: 'Minimal',  dot: '#64748b' }
{ id: 'terminal', label: 'Terminal', dot: '#00ff41' }
{ id: 'paper',    label: 'Paper',    dot: '#c8a870' }
{ id: 'neon',     label: 'Neon',     dot: '#bf00ff' }
```

---

### `index.css`

All colors are defined as CSS custom properties so every component can use `var(--token)` regardless of the active theme.

| Token | Purpose |
|-------|---------|
| `--bg` | Page background |
| `--bg-card` | Card / section background |
| `--bg-subtle` | Subtle backgrounds (forecast tiles, skeletons) |
| `--border` | Border color |
| `--text-primary` | Main text |
| `--text-secondary` | Labels, secondary text |
| `--text-muted` | Placeholders, numbering |
| `--accent` | Hover color for links |
| `--skeleton` | Skeleton loader fill |
| `--font` | Font family |
| `--radius` | Card border radius |

Each theme has a light (`.theme-<id>`) and dark (`.dark.theme-<id>`) block. Minimal uses `:root` for light and `.dark` for dark.

---

### `Clock.jsx`

Props: `dark`, `theme`, `onToggleTheme`, `onSetTheme`

Renders:
- A ticking clock (updated via `setInterval` every 1 s, cleaned up on unmount)
- Full date string below the time
- Top-right controls: 4 theme dot buttons + a moon/sun toggle

The active theme dot gets an outline ring. The clock text gets the `.glow` class, which applies a `text-shadow` in Terminal dark and Neon dark themes.

---

### `Weather.jsx`

Fetches on mount from:
```
https://api.weatherapi.com/v1/forecast.json
  ?key=<VITE_WEATHER_API_KEY>
  &q=auto:ip        ← location detected by IP
  &days=3
  &aqi=no
```

States: loading (skeleton) → data (forecast) → error (message).

Displays: condition icon, temperature, feels-like / humidity / wind, and 3 daily forecast tiles.

---

### `NewsFeed.jsx`

Two-step fetch on mount (and every 5 minutes via `setInterval`):

1. `GET /v0/topstories.json` — returns an array of story IDs
2. Parallel `GET /v0/item/<id>.json` for the first 10 IDs

Displays: rank, title (links to article), score, comment count, and source hostname.

---

## Themes

| Theme | Light | Dark |
|-------|-------|------|
| **Minimal** | Clean white, system font | Deep navy |
| **Terminal** | Cream bg, dark green monospace | Black bg, bright green + glow |
| **Paper** | Warm parchment, Georgia serif | Dark sepia / brown |
| **Neon** | White with purple accents | Deep dark with glowing violet |

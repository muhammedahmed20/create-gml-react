<br>

<div align="center">
  <p align="center">
    <img width="200" src="https://raw.githubusercontent.com/muhammedahmed20/gml-react-cli/main/template/logo.png" alt="gml-react logo" style="max-width: 100%;">
  </p>
  <br>
  <img src="https://img.shields.io/npm/v/create-gml-react?color=0ea5e9&label=version" />
  <img src="https://img.shields.io/npm/dt/create-gml-react?color=6366f1&label=downloads" />
  <img src="https://img.shields.io/bundlephobia/min/create-gml-react?color=ff69b4&label=bundle%20size" />
  <img src="https://img.shields.io/npm/l/create-gml-react?color=22c55e&label=license" />
  <img src="https://img.shields.io/github/stars/muhammedahmed20/gml-react-cli?style=social" />
</div>

<h1 align="center">gml-react CLI</h1>

<p align="center">
  <b>Stop writing boilerplate. Start doing magic ✨</b>
</p>

<p align="center">
  An interactive, zero-config CLI to scaffold a modern, production-ready <b>Vite + React</b> project in seconds.
</p>

---

> **Who is this for?** Frontend developers who want a clean, opinionated starting point for Vite + React projects — without spending time wiring up the same tools every time.

---

## ✨ Why gml-react?

**gml-react** is not just another Vite wrapper. It's an intelligent scaffolding tool that:

- ⚡ Sets up your full stack instantly
- 🏗️ Builds a clean, scalable folder structure
- 🎨 Injects a ready-to-use landing page UI
- 🧹 Removes all boilerplate automatically

---

## 👀 Preview

> _(Screenshot or GIF of the CLI in action goes here)_

```bash
$ npx create-gml-react@latest

✔ Project name: my-app
✔ Language: JavaScript
✔ Setup type: ⚡ Quick Mode

Installing dependencies...
✔ Done! Your project is ready.
```

---

## 🚀 Features

### ⚡ Quick Mode

Just hit Enter and get a full stack instantly:

| Tool         | Purpose           |
| ------------ | ----------------- |
| Vite + React | Build tooling     |
| Tailwind v4  | Styling           |
| React Router | Routing           |
| Zustand      | State management  |
| DaisyUI      | Component library |
| React Icons  | Icon set          |
| Axios        | HTTP client       |

---

### 🛠 Custom Mode

Pick exactly what you need:

| Option       | Choices                           |
| ------------ | --------------------------------- |
| **Language** | JavaScript / TypeScript           |
| **CSS**      | Tailwind v4 / Bootstrap / None    |
| **Icons**    | React Icons / Lucide / Huge Icons |
| **State**    | Zustand / Redux Toolkit           |
| **UI**       | DaisyUI / Shadcn UI               |
| **Routing**  | React Router                      |

---

### 🧠 Smart Automation

**Folder structure** — generated automatically:

```
src/
├── components/
├── pages/
├── layout/
├── hooks/
└── store/
```

**Cleanup** — runs on every scaffold:

- Removes `StrictMode` wrapper
- Deletes `App.css`
- Clears default `index.css` styles

**UI injection** — replaces the default Vite landing page with a modern, animated starter UI.

---

## 📦 Quick Start

### Prerequisites

- **Node.js** `>= 18.x`
- npm, pnpm

### Installation

```bash
# npx
npx create-gml-react@latest
```

```bash
# npm
npm create gml-react@latest
```

```bash
# pnpm
pnpm dlx create-gml-react@latest
```

---

## 📁 Project Structure

```
my-app/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   └── logo.png
│   ├── components/
│   ├── hooks/
│   ├── layout/
│   ├── pages/
│   ├── store/
│   ├── App.jsx          # or App.tsx
│   ├── index.css
│   └── main.jsx         # or main.tsx
├── vite.config.js       # or vite.config.ts
└── package.json
```

---

## ▶️ Run Your Project

```bash
cd my-app
npm run dev
```

---

## 🔧 Troubleshooting

**`npx` uses an old cached version**

```bash
npx create-gml-react@latest --force
```

**Dependencies fail to install**  
Make sure you're on Node.js `>= 18`. Run `node -v` to check.

**Shadcn UI setup prompts appear**  
This is expected — Shadcn requires a brief manual config step after scaffolding. Follow the on-screen instructions.

---

## 🤝 Contributing

Got ideas? Found a bug? Contributions are welcome.

1. Fork the repo
2. Create a branch: `git checkout -b feat/my-feature`
3. Push and open a pull request

---

## 📜 License

MIT License © 2026  
Built with ❤️ for developers who love clean code.

# Nayan Vishwakarma — Cyberpunk Developer Portfolio

A high-performance, futuristic cyberpunk-themed developer portfolio built with **React 18**, **TypeScript**, **Tailwind CSS**, and **Vite**.

Designed and customized for **Nayan Vishwakarma** — Frontend Developer & Computer Science Undergraduate at Medi-Caps University (8.44 CGPA).

![Portfolio Preview](/profile1.png)

---

## ⚡ Highlights & Features

- **Cinematic Cyberpunk Aesthetic**:
  - Deep crimson/obsidian color palette with neon accents and high-contrast typography.
  - Custom geometric branding and grid coordinate overlays.
  - Full-viewport responsive design (`100dvh`).

- **Interactive Visual Effects**:
  - **Dynamic Cursor Spotlight**: Mouse-tracking radial spotlight revealing alternate visual layers.
  - **Background & Content Separation on Scroll**: Multi-stage parallax where the hero background scales back and recedes while the foreground lifts and subsequent sections rise smoothly to cover the view.
  - **Circular Telemetry Arcs**: SVG progress indicators with pulsing glowing markers representing core metrics (8.44 CGPA, 10+ Projects, 100% Responsive, etc.).
  - **Ken Burns Animation**: Subtle ambient motion on the hero portrait with reduced-motion accessibility fallback.

- **Structured Portfolio Sections**:
  - **01 // About**: Bio, academic credentials, engineering philosophy, and quick stats.
  - **02 // Tech Stack**: Categorized skill chips (Frontend, Languages, Tools & Workflow) with proficiency levels and experience tags.
  - **03 // Featured Projects**: Interactive project cards with live demo links, GitHub source links, tech tags, and highlights.
  - **04 // Experience & Internships**: Timeline cards detailing real frontend development internships and undergraduate coursework.
  - **05 // Contact & Socials**: Direct email trigger, GitHub profile, LinkedIn, and copy-to-clipboard contact card.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Typography**: [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or later recommended)
- `npm` or `pnpm` or `yarn`

### 1. Clone or Extract the Repository

```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
```

*(If you downloaded the zip, extract it into a folder and open your terminal in that folder).*

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the URL shown in terminal) in your browser.

### 4. Build for Production

```bash
npm run build
```

The compiled production bundle will be generated in the `dist/` directory, ready to be deployed to **Vercel**, **Netlify**, **GitHub Pages**, or **Cloudflare Pages**.

---

## 📁 Project Structure

```
├── public/
│   └── profile.png          # Hero portrait and open-graph asset
├── src/
│   ├── App.tsx              # Complete portfolio application & layout
│   ├── index.css            # Tailwind CSS & typography declarations
│   └── main.tsx             # React DOM entry point
├── .env.example             # Environment template
├── .gitignore               # Git ignore rules
├── index.html               # HTML entry point with metadata
├── package.json             # NPM package scripts & dependencies
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite bundler configuration
```

---

## 🌐 Deploy to GitHub Pages / Vercel

### To Push to GitHub:

```bash
git init
git add .
git commit -m "Initial commit: Nayan Vishwakarma Cyberpunk Portfolio"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

### One-Click Deploy on Vercel:
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Framework preset: **Vite**
4. Click **Deploy**

---

## 👤 Author

**Nayan Vishwakarma**
- **Role**: Frontend Developer | Creative Web Developer
- **University**: Medi-Caps University (B.Tech CSE, 8.44 CGPA)
- **Email**: nayan9691jai@gmail.com
- **LinkedIn**: [linkedin.com/in/nayan-vishwakarma](https://linkedin.com)
- **GitHub**: [github.com/nayan-vishwakarma](https://github.com)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

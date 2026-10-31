# Trueself — A Personal Reflection Experience

> *"How well do you really know yourself? Six thoughtful questions. One honest look at your patterns, strengths, and the things you might be overlooking."*

Trueself is an editorial, humanist self-reflection platform designed to cut through generic personality tests, rigid four-letter archetypes, and algorithmic noise. It offers a calm, honest mirror to help you understand how you actually behave, make decisions, and evolve over time.

---

## Table of Contents

- [Overview](#overview)
- [The Philosophy](#the-philosophy)
- [How It Works](#how-it-works)
- [Key Features](#key-features)
- [Design System & Aesthetics](#design-system--aesthetics)
- [Tech Stack](#tech-stack)
- [Architecture & Folder Structure](#architecture--folder-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Credits & Author](#credits--author)

---

## Overview

Most self-assessments suffer from one of two extremes:
1. **Pseudoscience or generic stereotyping** (assigning arbitrary labels or rigid boxes).
2. **Clinical coldness** (exhausting 100-question surveys that feel like corporate compliance).

**Trueself takes a different path.** It asks six carefully crafted, realistic questions about everyday situations—moments of friction, intuition, social energy, and tough decisions. Instead of scoring you against a bell curve, Trueself treats your answers as one interconnected narrative, illuminating:
- **Your Core Portrait**: The authentic motivations driving your choices.
- **Constructive Blind Spots**: Subtle habits or patterns you might not notice yourself doing.
- **Tensions & Contradictions**: Where what you value clashes with what you actually prioritize.
- **An Actionable Way Forward**: Grounded 24-hour actions, 7-day resets, and 30-day experiments.

---

## The Philosophy

- **Honesty Over Flattery**: Trueself is not an ego booster. It reflects your real tendencies with warmth, dignity, and constructive directness.
- **Private by Default**: Your answers and reports belong solely to you. There is no mandatory account creation or tracking wall. You decide what stays local and what (if anything) you choose to share.
- **Tactile, Editorial Craft**: Designed to feel like a high-end physical journal or art book—warm cream paper, rich charcoal typography, fluid liquid glass navigation, and gentle, considered transitions.
- **No AI Sparkles or Gimmicks**: Avoids generic floating robot heads or magic wand clichés in favor of clean, grounded human-computer interaction.

---

## How It Works

```
  ┌───────────────┐       ┌─────────────────┐       ┌─────────────────┐
  │   01. REFLECT │  ───> │ 02. UNDERSTAND  │  ───> │ 03. MOVE AHEAD  │
  └───────────────┘       └─────────────────┘       └─────────────────┘
    6 Thoughtful            Connected Set            24h / 7d / 30d
    Questions               Pattern Analysis         Action Plan & Radar
```

1. **Reflect**: Answer six scenario-based questions with the option to add personal context or specific examples to each response.
2. **Understand**: Trueself analyzes the whole gestalt of your responses, spotting synergies, unspoken priorities, and hidden trade-offs.
3. **Move Forward**: Receive a tailored report featuring:
   - A descriptive title and summary of your decision-making style.
   - Specific blind spot callouts with tips on how to notice them in everyday life.
   - An interactive **Values Compass** radar chart mapping your top personal drivers.
   - A step-by-step 7-day progress tracker you can check off as you build clarity.

---

## Key Features

### 🪞 1. Inward Assessment Engine
- Personal name introduction before questions begin.
- Six multidimensional questions with real-life context notes.
- Automatic draft persistence (no lost progress if your tab closes).
- Seamless fallback handling for local offline execution.

### 🧭 2. Values Compass (Interactive Radar)
- 8-dimensional balance visualization: *Independence, Creativity, Stability, Connection, Achievement, Freedom, Contribution, Learning*.
- Interactive point weights with real-time SVG charting and balance scoring.

### 📋 3. Realistic Action Plan
- **24-Hour Experiment**: A quick, low-stakes immediate action.
- **7-Day Reset**: A daily structured rhythm (each day takes 5–15 minutes).
- **30-Day Horizon**: A durable behavioral shift to monitor over a month.

### 👥 4. Perspective Check-In (Friend Mirror)
- Generate a private, shareable reflection link for a trusted friend or mentor.
- Collect outside perspective on whether they see you the way you see yourself.
- Compare external feedback alongside your self-assessment.

### 📝 5. Personal Reflection Notes & Journaling
- Capture personal reflections, breakthrough moments, and decisions over time.
- Fully private, tagged to your journey, and easy to review anytime.

### 🎨 6. Bespoke Appearance Engine
- **Curated Palettes**:
  - **Paper (Default)**: Warm editorial linen, charcoal, and warm amber (`#ED6C30`).
  - **Ink**: Deep twilight slate, restrained and focused (`#8F93FF` accent).
  - **Terra**: Earthy terracotta warmth, organic and expressive (`#C1512D` accent).
  - **Moss**: Calming botanical green, natural and balanced (`#4C6B45` accent).
- **Font Pairing Variations**:
  - *Reflective Editorial*: Instrument Serif + Manrope (Default).
  - *Classic Literary*: Newsreader + Plus Jakarta Sans.
  - *Warm Modernist*: Fraunces + DM Sans.
  - *Pure Humanist*: Newsreader + Manrope.
- **Custom Accent Picker**: Live hex color wheel with automated WCAG contrast validation.
- **Liquid Glass Navigation**: Translucent glass pill with multi-angle specular sheen, optical distortion texture, and 32px depth blur.

### 🌐 7. Complete Social Open Graph Suite
- Native dynamic Open Graph (`/opengraph-image`) and Twitter Card (`/twitter-image`) generation via Next.js `ImageResponse`.
- Optimized and tested across **X / Twitter, Facebook, Discord, LinkedIn, WhatsApp, and Telegram**.
- Under 120 KB per image (well below WhatsApp's strict 300 KB limit).
- Discord embed theme color integration (`#ED6C30`).

---

## Design System & Aesthetics

Trueself follows strict, consistent design token architecture located in `src/styles/tokens.css` and `src/app/globals.css`:

| Token | Description |
| :--- | :--- |
| `--color-bg` | Page surface background (adapts per theme & dark mode) |
| `--color-surface` | Card and sheet backdrop |
| `--color-accent` | Primary brand accent (amber, iris, terra, moss, or custom) |
| `--color-nav-bg` | Liquid glass background layer |
| `--radius-full` | Fully rounded pill geometry used for active chips & primary CTAs |
| `--font-active-editorial` | Headline serif typeface (Instrument Serif / Newsreader / Fraunces) |
| `--font-active-interface` | UI sans typeface (Manrope / Plus Jakarta Sans / DM Sans) |

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack, React Server Components)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) + CSS Design Tokens
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Solar Icons](https://icon-sets.iconify.design/solar/) via `@iconify/react`
- **Social Previews**: `next/og` (Satori / Resvg image synthesis)
- **Database / Store**: [Drizzle ORM](https://orm.drizzle.team/) with PostgreSQL support + auto-fallback zero-dependency local JSON store
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) with local storage persistence
- **Validation**: [Zod](https://zod.dev/)

---

## Architecture & Folder Structure

```
Trueself/
├── public/                     # Static assets, SVG favicons, fallback OG renders
│   ├── icon.svg                # Vector SVG favicon
│   ├── favicon.ico             # Fallback ICO
│   ├── apple-icon.png          # High-res iOS touch icon
│   └── og.png                  # Static 1200x630 Open Graph fallback
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # REST endpoints (reports, notes, compass, ask)
│   │   ├── appearance/         # Appearance & theme configuration page
│   │   ├── assess/             # 6-step reflection workflow
│   │   ├── compass/            # Interactive values radar visualizer
│   │   ├── notes/              # Personal journal & note capture
│   │   ├── plan/               # Action plan tracker
│   │   ├── privacy/            # Privacy policy & data ownership details
│   │   ├── report/             # Assessment result displays & friend view
│   │   ├── fonts.ts            # Google variable fonts loader
│   │   ├── layout.tsx          # Root layout, metadataBase & social meta
│   │   ├── page.tsx            # Editorial landing page
│   │   ├── opengraph-image.tsx # Dynamic 1200x630 social preview card
│   │   ├── twitter-image.tsx   # Dedicated Twitter card route
│   │   ├── icon.tsx            # Dynamic 32x32 PNG favicon route
│   │   └── apple-icon.tsx      # Dynamic 180x180 Apple touch icon route
│   ├── components/             # Organized component directory
│   │   ├── appearance/         # ThemeProvider, AppearancePanel
│   │   ├── assessment/         # IntroStep, NameStep, QuestionStep
│   │   ├── common/             # Logo, Button, Field, Modal, Toast
│   │   ├── compass/            # RadarChart SVG visualizer
│   │   ├── landing/            # HeroReflection typographic physics
│   │   └── navigation/         # NavBar (liquid glass), ClientChrome
│   ├── db/                     # Drizzle schema & resilient store fallback
│   ├── lib/                    # Helpers, stores, themes, contrast calculators
│   └── styles/                 # tokens.css design system variables
├── next.config.mjs             # Next.js & Turbopack configuration
├── package.json                # Project dependencies and scripts
└── tsconfig.json               # TypeScript configuration
```

---

## Getting Started

### Prerequisites
- **Node.js**: v20.x or later (recommended v22+)
- **Package Manager**: `npm`, `pnpm`, or `bun`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/trueself.git
   cd trueself
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory (see [Environment Variables](#environment-variables)).

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open the application**:
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

| Variable | Required | Description | Default |
| :--- | :---: | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | Optional | Canonical URL used to generate absolute Open Graph links | `https://trueself.me` |
| `DATABASE_URL` | Optional | PostgreSQL connection string (e.g. Supabase, Neon) | In-memory / local JSON store fallback |
| `OPENAI_API_KEY` | Optional | AI provider key for custom analysis generation | Internal pattern engine fallback |

> *Note: Trueself includes a built-in local store fallback. If `DATABASE_URL` is omitted, the application runs seamlessly using local JSON persistence.*

---

## Available Scripts

- `npm run dev`: Starts the local development server with Turbopack.
- `npm run build`: Type-checks and compiles an optimized production build.
- `npm run start`: Boots the production server.
- `npm run typecheck`: Validates TypeScript types across the entire project.
- `npm run lint`: Runs ESLint checks.

---

## Credits & Author

Designed and crafted by **bfkdesign**.

- **Instagram**: [@bfkdesign](https://instagram.com/bfkdesign)
- **License**: MIT License — open for personal reflection and respectful learning.


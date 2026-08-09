<div align="center">

<img src="https://img.shields.io/badge/HH_GOA-2026-FF6A4D?style=for-the-badge&labelColor=0B1710&font=monospace" alt="HH GOA 2026" />

# 🌴 HH Goa 2026 — Builder ID Card Generator

**Your badge. Your identity. Your ticket to the sand.**

Generate a personalized hacker-residency badge for [Hacker House Goa 2026](https://hhgoa.com).  
Upload → Details → Download → Share to X. Done in 30 seconds.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white&labelColor=0B1710)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white&labelColor=0B1710)](https://vite.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white&labelColor=0B1710)](https://www.typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white&labelColor=0B1710)](https://tailwindcss.com)
[![Firebase](https://img.shields.io/badge/Firebase-Storage_+_Functions-FFCA28?style=flat-square&logo=firebase&logoColor=white&labelColor=0B1710)](https://firebase.google.com)

<br />

```
  ┌─────────────────────────────────────┐
  │  · · · · · · · · · · · · · · · · ·  │  ← perforated tear-off edge
  │                                     │
  │           HH GOA  2026             │
  │     HACKER HOUSE GOA · 28–31 OCT   │
  │                                     │
  │            ┌────────┐               │
  │            │  YOUR  │               │
  │            │  PHOTO │               │
  │            └────────┘               │
  │                                     │
  │         ARJUN MEHTA                 │
  │         Pixel Alchemist             │
  │          ┌──────────┐              │
  │          │ FRONTEND │              │
  │          └──────────┘              │
  │                                     │
  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
  │  #FrameInGoa            #047 / 500  │
  └─────────────────────────────────────┘
```

</div>

---

## ✦ What is this?

A mobile-first web app that generates **laminated-badge-style ID cards** for [HH Goa 2026](https://hhgoa.com) — the hacker residency on the beach. Built as part of **Task #1** from the HH Goa shortlisting challenges.

No login. No signup. No fluff.  
Upload a photo, enter your name, pick your stack — your badge prints itself.

---

## ✦ Features

| Feature | Details |
|---|---|
| **📸 Smart Photo Upload** | JPG, PNG, and HEIC (iPhone) — auto-converts with `heic2any`, cover-crops to fit |
| **👥 Team Mode** | Add up to 3 teammates into one badge (overlapping circle layout) |
| **🎲 Deterministic Identity** | Builder number (`#047 / 500`) and title ("Pixel Alchemist") are hashed from your name — same person, same badge, every time |
| **🖼️ Live Canvas Preview** | Card updates as you type (150ms debounce), rendered at 2× for retina sharpness |
| **⬇️ One-tap Download** | Real PNG via `canvas.toBlob()` → `<a download>`, works on iOS Safari + mobile Chrome |
| **🐦 Share to X** | Uploads to Firebase Storage → Cloud Function creates OG meta page → Twitter intent with `#FrameInGoa` |
| **🎨 On-brand Design** | Jungle-dark palette, dot-grid texture, perforated tear-off edge, gradient accent — not a generic template |
| **📱 Mobile-first** | Thumb-zone CTA, safe-area padding, single-column vertical flow on phones |
| **♿ Motion Respect** | Badge "print-in" animation honors `prefers-reduced-motion` |

---

## ✦ The Flow

```
01 upload     →  Drop your photo (or tap to pick)
02 details    →  Name + Stack/Role → auto-generated Builder Title
03 generate   →  Live preview updates as you type (no button needed)
04 share      →  Download PNG  ·  Share to X with #FrameInGoa
```

---

## ✦ Tech Stack

```
Frontend        React 19 + Vite 8 + TypeScript
Styling         Tailwind CSS v4 (theme tokens + @layer base)
Image Gen       Native Canvas API (2× DPR, cover-crop)
HEIC Support    heic2any (client-side conversion)
Backend         Firebase Storage + Cloud Functions (Node 20)
Hosting         Firebase Hosting (SPA + /share/* rewrite)
Fonts           Space Grotesk · IBM Plex Mono · Inter
```

---

## ✦ Design System

The palette and typography are pulled from the HH Goa brand identity — jungle-at-night meets terminal culture.

| Token | Hex | Role |
|-------|-----|------|
| `--ink` | `#0B1710` | Near-black jungle-green — dominant surface |
| `--sand` | `#F1E7CE` | Warm off-white — primary text |
| `--coral` | `#FF6A4D` | Sunset accent — primary CTA |
| `--amber` | `#FFB74A` | Secondary accent — titles & tags |
| `--teal` | `#1FA69B` | Tertiary — success/links |
| `--palm` | `#16241C` | Lifted panel — cards & inputs |

**Typography:**
- **Space Grotesk** (bold) — display/headings, confident & slightly technical
- **IBM Plex Mono** — labels, builder numbers, timestamps — the "badge printer" feel
- **Inter** — body copy, kept minimal

---

## ✦ Quick Start

### Prerequisites

- Node.js 20+
- npm 9+

### Install & Run

```bash
# Clone
git clone https://github.com/Gamerevolusion/Hacker-House-Goa-2026.git
cd Hacker-House-Goa-2026

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) — that's it.

### Build for Production

```bash
npm run build
npm run preview   # preview the production build locally
```

---

## ✦ Firebase Setup (for Share to X)

The download flow works entirely client-side. The **Share to X** flow requires Firebase:

### 1. Create a Firebase project

```bash
npm install -g firebase-tools
firebase login
firebase init   # select Hosting, Functions, Storage, Firestore
```

### 2. Add your config

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Deploy Cloud Functions

```bash
cd functions
npm install
cd ..
firebase deploy
```

### Share Flow Architecture

```
User clicks "Share to X"
  │
  ├─ canvas.toBlob() → PNG blob
  ├─ Upload blob to Firebase Storage (/cards/{uuid}.png)
  ├─ Call Cloud Function: createSharePage({ imageUrl, id })
  │   └─ Stores OG metadata in Firestore
  │   └─ Returns share URL: /share/{id}
  │
  └─ Opens twitter.com/intent/tweet?text=...&url={shareUrl}
       │
       └─ X crawler hits /share/{id}
            ├─ Firebase Hosting rewrites → sharePage Cloud Function
            ├─ Serves <meta og:image> + <meta twitter:card>
            └─ Auto-redirects humans to the main app (1s)
```

---

## ✦ Builder Titles

Each stack category has 10 deterministic titles, picked by hashing the builder's name:

| Stack | Sample Titles |
|-------|--------------|
| Frontend | Pixel Alchemist · CSS Whisperer · DOM Wrangler · Render Prophet |
| Backend | API Architect · Query Optimizer · Cache Strategist · Uptime Sentinel |
| Full-stack | Stack Weaver · Bridge Engineer · System Polyglot · Stack Surgeon |
| Design | Interface Poet · UX Cartographer · Figma Sorcerer · Grid Philosopher |
| ML | Tensor Alchemist · Neural Architect · Gradient Surfer · Embedding Cartographer |
| DevOps | Pipeline Architect · Container Wrangler · Cloud Shepherd · Cluster Whisperer |

Same name → same title → same builder number. Always.

---

## ✦ Project Structure

```
├── index.html                 # Entry HTML with Google Fonts + meta tags
├── vite.config.ts             # Vite + React + Tailwind plugins
├── firebase.json              # Hosting rewrites + Functions config
├── storage.rules              # Public read, size-limited PNG upload
├── firestore.rules            # Public read for share pages
│
├── src/
│   ├── main.tsx               # React entry point
│   ├── App.tsx                # Main app: 4-step flow orchestration
│   ├── index.css              # Tailwind v4 theme + base + animations
│   │
│   ├── components/
│   │   ├── StepIndicator.tsx  # 01–04 step markers (IBM Plex Mono)
│   │   ├── UploadZone.tsx     # Drag-drop + HEIC conversion + team mode
│   │   ├── DetailsForm.tsx    # Name, stack, live builder title
│   │   ├── CardPreview.tsx    # Debounced canvas render + print-in anim
│   │   └── ActionBar.tsx      # Fixed bottom: Download + Share to X
│   │
│   ├── utils/
│   │   ├── builderData.ts     # Hash fn, builder titles, builder numbers
│   │   ├── cardRenderer.ts    # Canvas API: badge layout, textures, text
│   │   ├── imageUtils.ts      # HEIC conversion, cover-crop, image loading
│   │   └── firebase.ts        # Firebase init, upload, share page creation
│   │
│   └── types/
│       └── heic2any.d.ts      # Type declarations for heic2any
│
└── functions/
    └── src/
        └── index.ts           # Cloud Functions: createSharePage + sharePage
```

---

## ✦ Task Brief

> **Task #1 — HH Goa Frame / ID Card Generator**
>
> Design your own HH Goa 2026 themed photo frame generator. Use that same generator to bring your teammates into one combined frame. Post it on X with a quick how-to on generating your own #FrameInGoa post using your generator — and you're done.

— [hhgoa.com/tasks](https://hhgoa.com)

---

## ✦ How to Generate Your Own #FrameInGoa Post

1. Go to the app
2. Upload your photo (iPhone HEIC? No problem)
3. Type your name, pick your stack
4. Hit **Download card** — save the PNG
5. Hit **Share to X** — it pre-fills the caption with `#FrameInGoa`
6. Post it. You're on the radar.

---

<div align="center">

```
500 elite builders. High-speed fiber. Ocean at your doorstep.
No fluff. Ship things that matter.
```

**GOA, INDIA · 28–31 OCT 2026**

Made for [HH Goa 2026](https://hhgoa.com) · `#FrameInGoa`

</div>

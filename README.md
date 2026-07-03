# Arvind — AI-Powered Frontend Engineer Portfolio

A premium, high-performance developer portfolio built to showcase creative web experiences, internal tools, and business-facing product interfaces. 

Designed with a focus on modern web aesthetics, smooth scroll-driven animations, and a responsive component architecture.

## 🚀 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **UI Library:** [React 19](https://react.dev/)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Custom typography and layout architecture)
- **Animations:** [GSAP](https://gsap.com/) (ScrollTrigger, Tween)
- **Icons:** Lucide React

## 🌟 Key Features

- **Canvas-based Robot Animation:** Features a custom 300-frame image sequence (`A.R.V.I.N.D` the AI robot) that scrubs seamlessly based on scroll position and tracks the user's cursor via mouse parallax.
- **Scroll-Triggered UI:** Utilizes GSAP `ScrollTrigger` to pin the hero section, fade text in and out, and dynamically slide a masking track over different titles (e.g. "Intelligent", "Scalable", "AI-Powered").
- **Dynamic Projects Architecture:** A type-safe content layer (`content/projects/projects.ts`) cleanly separates project metadata from presentation logic. It dynamically renders project cards complete with deep-links, tech tags, and collapsible demo credentials.
- **Performance Optimized:** Uses `fetchPriority` and asynchronous image decoding for the massive 3D sequence, guaranteeing a fast time-to-interactive without blocking the main thread.
- **Responsive Layout:** fully optimized for both desktop and mobile viewing with fine-tuned media queries altering the GSAP pinning logic on smaller screens.

## 📁 Project Structure

```text
├── app/                  # Next.js App Router structure (layout, pages, globals.css)
├── components/           
│   ├── hero/             # The intricate GSAP/Canvas hero component
│   └── projects/         # Featured projects feed and UI 
├── content/              
│   └── projects/         # Type-safe project metadata definitions
├── public/               
│   └── images/
│       └── robot-frames/ # The 300-frame image sequence
└── package.json          # Dependency list
```

## 🛠️ Local Development

Ensure you have Node.js and npm installed.

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev -- -p 3001
   ```

3. **Open the application:**
   Navigate to [http://localhost:3001](http://localhost:3001) in your browser.

## 📄 Content Management

To add a new project to the portfolio feed, simply open `content/projects/projects.ts` and add a new entry to the `projects` array. The UI will automatically generate the new card, tags, and credential toggles.

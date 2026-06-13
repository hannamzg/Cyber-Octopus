# 🐙 Cyber Octopus

An interactive, premium cybersecurity mind map and tool directory built with React, Tailwind CSS, and 2D Force-Directed Graphs. It helps cybersecurity professionals and students explore tools, categories, and recommendations in an intuitive visual layout.

## ✨ Features

- **Interactive 2D Mind Map**: Dynamic force-directed graph built with `react-force-graph-2d` for interactive node navigation.
- **Accordion-style Graph Exploration**: Automatically expands and fits viewports as categories, sub-categories, and tool nodes are selected.
- **Curated Categorization**: Clear hierarchy mapping main security categories to sub-categories and specific tools.
- **Search & Filter**: Find tools instantly and highlight their location on the mind map.
- **Special Highlights**: Standout badges for recommended security tools.
- **Sleek Cyber Aesthetics**: Harmony of dark background, glowing interactive elements, and custom micro-animations.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Graph Engine**: [react-force-graph-2d](https://github.com/vasturiano/react-force-graph)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

## 🚀 Getting Started

### Installation
Clone the repository and install dependencies:
```bash
npm install
```

### Run Locally
Launch the Vite development server:
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## 🌐 Deployment to GitHub Pages

This project is configured to deploy to GitHub Pages.

1. Ensure `base: '/Cyber-Octopus/'` is set in your `vite.config.js`.
2. Run the deployment command:
   ```bash
   npm run deploy
   ```
   *This automatically builds the production app and publishes it to the `gh-pages` branch.*

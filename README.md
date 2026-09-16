# FIR FILTERS — Interactive Learning & 8-Mark Exam Guide

A complete interactive textbook (React + Vite + Tailwind + KaTeX + Recharts) that takes an
Electronics/Communication Engineering student from **zero prior knowledge** of FIR filters to being
able to write all **first 10 questions** as proper **8-mark university exam answers**.

## Chapters

- **FIR From Zero** — 20 foundation concepts (signals, sampling, filters, impulse response,
  convolution, FIR vs IIR, delay/multiplier/adder) each explained in plain words + engineering terms.
- **FIR Basic Structure** — the tapped-delay-line block diagram, block by block.
- **Q1–Q10** — characteristics, symmetric/antisymmetric filters, transfer function for
  h(n) = [2, 1, 1, 2], phase & group delay numerical, N = 11 constant-delay proof, Gibbs phenomenon,
  design methods, window comparison (with interactive visualizer), Fourier series design method, and
  the full ideal-LPF N = 11 numerical design.
- **Quick Revision + Formula Sheet** — every definition and equation in one place.

## Features

- Beginner / Detailed / Exam learning modes
- Live search across all topics and questions
- Progress tracker (saved locally), Previous/Next navigation
- Clickable formula cards that explain every symbol
- Interactive graphs: frequency responses, stem plots, phase/group-delay plots, window visualizer,
  convolution stepper
- Every question ends with a model **8-mark exam answer**, common mistakes, exam tips and concept checks

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Tech

React 18 · Vite 5 · Tailwind CSS 3 · KaTeX (all math typeset — no ASCII equations) · Recharts ·
hand-built SVG textbook diagrams

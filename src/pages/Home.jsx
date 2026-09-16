import React from 'react'
import { Link } from 'react-router-dom'
import { GROUPS, QUESTION_ROUTES, ORDER } from '../lib/nav.js'
import { useApp } from '../context/AppContext.jsx'
import { SignalFlowDiagram } from '../components/diagrams.jsx'
import T from '../components/TeX.jsx'

const PATH_CARDS = [
  {
    to: '/zero',
    step: 'STEP 1',
    title: 'FIR From Zero',
    desc: 'No prior knowledge needed. Signals, filters, impulse response, convolution — every term explained twice: first in plain words, then in engineering language.',
    accent: 'border-sky-300 bg-sky-50/60',
    chip: 'bg-sky-600',
  },
  {
    to: '/structure',
    step: 'STEP 2',
    title: 'FIR Basic Structure',
    desc: 'The classic tapped-delay-line block diagram, drawn properly and explained block by block: delays, multipliers, adders.',
    accent: 'border-teal-300 bg-teal-50/60',
    chip: 'bg-teal-600',
  },
  {
    to: '/q1',
    step: 'STEP 3',
    title: 'Questions 1–10',
    desc: 'Each question taught from its prerequisites, solved step by step, and finished with a model 8-mark university exam answer.',
    accent: 'border-navy-300 bg-navy-50/60',
    chip: 'bg-navy-600',
  },
  {
    to: '/revision',
    step: 'STEP 4',
    title: 'Quick Revision + Formula Sheet',
    desc: 'Every definition and every formula on one page — the night-before-exam sheet, rendered with proper mathematical typesetting.',
    accent: 'border-amber-300 bg-amber-50/60',
    chip: 'bg-amber-600',
  },
]

export default function Home() {
  const { done } = useApp()
  const count = QUESTION_ROUTES.filter((r) => done[r]).length

  return (
    <div>
      {/* Hero */}
      <div className="overflow-hidden rounded-2xl border border-navy-800 bg-navy-900 text-white shadow-card">
        <div className="px-6 py-8 md:px-10 md:py-10">
          <div className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-navy-300">
            Digital Signal Processing · Interactive Textbook
          </div>
          <h1 className="mt-2 font-serif text-3xl font-bold leading-tight md:text-4xl">
            FIR FILTERS
            <span className="mt-1 block text-lg font-semibold text-navy-200 md:text-xl">
              Interactive Learning &amp; 8-Mark Exam Guide — Questions 1 to 10
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-[14.5px] leading-7 text-navy-100">
            Built for an Electronics / Communication Engineering student with <b>zero prior knowledge</b> of
            FIR filters. It teaches everything from absolute basics — what a signal even is — and then solves
            all ten questions the way a well-prepared student writes them in an 8-mark university examination.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/zero" className="rounded-full bg-white px-5 py-2.5 text-[13.5px] font-extrabold text-navy-900 shadow hover:bg-navy-100">
              Start from absolute zero →
            </Link>
            <Link to="/q1" className="rounded-full border border-navy-400 px-5 py-2.5 text-[13.5px] font-bold text-navy-100 hover:bg-navy-800">
              Jump to Question 1
            </Link>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <div className="h-2 w-44 overflow-hidden rounded-full bg-navy-700">
              <div className="h-full rounded-full bg-emerald-400 transition-all" style={{ width: `${(count / 10) * 100}%` }} />
            </div>
            <span className="text-[12.5px] font-semibold text-navy-200">
              {count}/10 questions completed {count > 0 && '— nice, keep going!'}
            </span>
          </div>
        </div>
      </div>

      {/* Signal flow figure */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-card">
        <div className="mb-2 text-[13px] font-bold text-navy-900">The one picture behind this entire course</div>
        <div className="tex-scroll"><SignalFlowDiagram /></div>
        <p className="mt-2 text-[13px] leading-6 text-slate-600">
          A digital filter is a small machine made of <b>delays, multipliers and adders</b> that reshapes the
          frequency content of a signal. Everything in the next 10 questions — transfer functions like{' '}
          <T>{'H(z)=\\sum_{k=0}^{N-1} h[k] z^{-k}'}</T>, symmetry, Gibbs phenomenon, window design — is just
          mathematics for designing and understanding this machine.
        </p>
      </div>

      {/* Learning path */}
      <h2 className="mt-10 font-serif text-2xl font-bold text-navy-900">Your learning path</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {PATH_CARDS.map((c) => (
          <Link key={c.to} to={c.to} className={`group rounded-xl border-2 p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-md ${c.accent}`}>
            <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10.5px] font-extrabold uppercase tracking-wider text-white ${c.chip}`}>
              {c.step}
            </span>
            <div className="mt-2 font-serif text-[19px] font-bold text-navy-900 group-hover:text-navy-600">{c.title}</div>
            <p className="mt-1 text-[13.5px] leading-6 text-slate-600">{c.desc}</p>
            <div className="mt-2 text-[13px] font-bold text-navy-600">{c.step === 'STEP 1' ? 'Begin here →' : 'Open →'}</div>
          </Link>
        ))}
      </div>

      {/* Question grid */}
      <h2 className="mt-10 font-serif text-2xl font-bold text-navy-900">The ten questions</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {GROUPS[1].items.map((it, i) => {
          const isDone = !!done[it.path]
          return (
            <Link key={it.path} to={it.path} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-card transition hover:border-navy-300 hover:shadow-md">
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[13px] font-extrabold text-white ${isDone ? 'bg-emerald-500' : 'bg-navy-700'}`}>
                {isDone ? '✓' : i + 1}
              </span>
              <span className="text-[13.5px] font-semibold leading-6 text-slate-700">{it.label}</span>
            </Link>
          )
        })}
      </div>

      {/* How to use */}
      <h2 className="mt-10 font-serif text-2xl font-bold text-navy-900">How this site helps you learn</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {[
          ['☺ Beginner mode', 'Simplifies every explanation. Turns off the dense boxes and keeps the friendly ones.'],
          ['📖 Detailed mode', 'The complete teaching: prerequisites, step-by-step solutions, “why this step?”, mistakes, tips.'],
          ['🎯 Exam mode', 'Hides the tutoring. Shows only definitions, derivations, formulas, diagrams and final answers — ideal for revision.'],
          ['🔍 Search', 'Find any topic instantly: “Gibbs”, “group delay”, “window”, “Q5”…'],
          ['✔ Progress tracker', 'Mark each question complete as you master it. Your progress is saved on this device.'],
          ['∑ Formula cards', 'Every important formula is clickable — tap it to see the meaning of every single symbol.'],
        ].map(([t, d]) => (
          <div key={t} className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
            <div className="text-[14px] font-bold text-navy-900">{t}</div>
            <p className="mt-1 text-[13px] leading-6 text-slate-600">{d}</p>
          </div>
        ))}
      </div>

      <p className="mt-10 rounded-xl border border-navy-200 bg-navy-50 p-4 text-[13px] leading-6 text-navy-800">
        <b>Coverage:</b> this guide intentionally covers only Questions 1–10 of your FIR unit, exactly as listed in
        your study plan. Suggested order: {ORDER.slice(1, 4).map((o) => o.label).join(' → ')} → … → Quick Revision.
      </p>
    </div>
  )
}

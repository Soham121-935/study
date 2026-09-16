import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import T from './TeX.jsx'
import { ModeGate, useApp } from '../context/AppContext.jsx'
import { ORDER, QUESTION_ROUTES } from '../lib/nav.js'

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

const ALL = ['beginner', 'detailed', 'exam']

export function Section({ id, kicker, title, modes = ALL, children, className = '' }) {
  return (
    <ModeGate modes={modes}>
      <section id={id} className={`scroll-mt-24 mt-10 ${className}`}>
        <div className="mb-4">
          {kicker && (
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-navy-500">
              {kicker}
            </div>
          )}
          <h2 className="font-serif text-[22px] md:text-2xl font-bold text-navy-900 leading-snug mt-0.5">
            {title}
          </h2>
          <div className="mt-2 h-[3px] w-14 rounded bg-navy-500" />
        </div>
        <div className="prose-book">{children}</div>
      </section>
    </ModeGate>
  )
}

/* ------------------------------------------------------------------ */
/* Callouts                                                            */
/* ------------------------------------------------------------------ */

const CALLOUT_STYLES = {
  info: { box: 'border-navy-400 bg-navy-50', chip: 'bg-navy-600', icon: '◆', title: 'Key Concept', modes: ALL },
  simple: { box: 'border-sky-400 bg-sky-50', chip: 'bg-sky-600', icon: '☺', title: 'In Simple Words', modes: ['beginner', 'detailed'] },
  tip: { box: 'border-amber-400 bg-amber-50', chip: 'bg-amber-600', icon: '★', title: 'Exam Tip', modes: ['beginner', 'detailed'] },
  warn: { box: 'border-rose-400 bg-rose-50', chip: 'bg-rose-600', icon: '⚠', title: 'Common Mistakes', modes: ['beginner', 'detailed'] },
  formula: { box: 'border-violet-400 bg-violet-50', chip: 'bg-violet-600', icon: '∑', title: 'Important Formula', modes: ALL },
  why: { box: 'border-indigo-400 bg-indigo-50', chip: 'bg-indigo-600', icon: '?', title: 'Why This Step?', modes: ['beginner', 'detailed'] },
  good: { box: 'border-emerald-500 bg-emerald-50', chip: 'bg-emerald-600', icon: '✔', title: 'Final Answer', modes: ALL },
  note: { box: 'border-slate-300 bg-slate-50', chip: 'bg-slate-600', icon: '✎', title: 'Note', modes: ALL },
}

export function Callout({ type = 'info', title, children, modes, className = '' }) {
  const s = CALLOUT_STYLES[type] || CALLOUT_STYLES.info
  return (
    <ModeGate modes={modes || s.modes}>
      <div className={`my-5 rounded-xl border-l-4 ${s.box} border border-slate-200/70 p-4 md:p-5 shadow-card ${className}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-white ${s.chip}`}>
            {s.icon}
          </span>
          <span className="text-[13px] font-bold uppercase tracking-wide text-slate-800">
            {title || s.title}
          </span>
        </div>
        <div className="prose-book [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">{children}</div>
      </div>
    </ModeGate>
  )
}

/* ------------------------------------------------------------------ */
/* Formula card — click to explain every symbol                        */
/* ------------------------------------------------------------------ */

export function FormulaCard({ title, tex, symbols = [], note, open = false, modes = ALL, badge = 'FORMULA' }) {
  const [isOpen, setIsOpen] = useState(open)
  return (
    <ModeGate modes={modes}>
      <div className="my-5 overflow-hidden rounded-xl border border-navy-200 bg-white shadow-card">
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-400"
        >
          <div className="flex items-center justify-between gap-3 border-b border-navy-100 bg-navy-50/60 px-4 py-2">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-navy-600">{badge}</span>
            {symbols.length > 0 && (
              <span className="rounded-full bg-navy-100 px-2.5 py-0.5 text-[11px] font-semibold text-navy-700">
                {isOpen ? '▲ hide symbol meanings' : '▼ click to explain every symbol'}
              </span>
            )}
          </div>
          {title && <div className="px-4 pt-3 text-[14px] font-bold text-navy-900">{title}</div>}
          <div className="px-4 pb-2">
            <T block>{tex}</T>
          </div>
        </button>
        {isOpen && symbols.length > 0 && (
          <div className="border-t border-dashed border-navy-200 bg-navy-50/40 px-4 py-3">
            <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-navy-500">Meaning of every symbol</div>
            <dl className="grid gap-x-6 gap-y-2 md:grid-cols-2">
              {symbols.map((it, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg bg-white/80 px-3 py-2 ring-1 ring-navy-100">
                  <dt className="min-w-[4.5rem] shrink-0 text-center"><T>{it.s}</T></dt>
                  <dd className="text-[13.5px] leading-6 text-slate-700">{it.meaning}</dd>
                </div>
              ))}
            </dl>
            {note && <p className="mt-3 text-[13px] italic text-slate-600">{note}</p>}
          </div>
        )}
      </div>
    </ModeGate>
  )
}

/* ------------------------------------------------------------------ */
/* Numbered solution steps                                             */
/* ------------------------------------------------------------------ */

export function Steps({ items, modes = ALL, title = 'Step-by-Step Solution' }) {
  return (
    <ModeGate modes={modes}>
      <div className="my-5">
        <div className="mb-3 flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-navy-600 text-[13px] font-bold text-white">Σ</span>
          <span className="text-[13px] font-extrabold uppercase tracking-wider text-navy-700">{title}</span>
        </div>
        <ol className="space-y-3">
          {items.map((it, i) => (
            <li key={i} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-card">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy-600 text-[13px] font-bold text-white">
                {i + 1}
              </div>
              <div className="prose-book min-w-0 flex-1">
                {it.title && <div className="mb-1 text-[14.5px] font-bold text-navy-900">{it.title}</div>}
                {it.math && <T block>{it.math}</T>}
                {it.body}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </ModeGate>
  )
}

/* ------------------------------------------------------------------ */
/* Tables                                                              */
/* ------------------------------------------------------------------ */

export function DataTable({ head, rows, caption, modes = ALL, compact = false }) {
  return (
    <ModeGate modes={modes}>
      <div className="my-5 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-card">
        <table className="min-w-full text-left">
          {caption && (
            <caption className="border-b border-slate-200 bg-navy-50/60 px-4 py-2 text-left text-[12px] font-bold uppercase tracking-wider text-navy-600">
              {caption}
            </caption>
          )}
          <thead>
            <tr className="bg-navy-700 text-white">
              {head.map((h, i) => (
                <th key={i} className={`${compact ? 'px-3 py-2' : 'px-4 py-2.5'} whitespace-nowrap text-[12.5px] font-bold uppercase tracking-wide`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className={i % 2 ? 'bg-navy-50/40' : 'bg-white'}>
                {r.map((c, j) => (
                  <td key={j} className={`${compact ? 'px-3 py-2' : 'px-4 py-2.5'} align-top text-[13.5px] leading-6 text-slate-700 border-t border-slate-100 ${j === 0 ? 'font-semibold text-navy-800 whitespace-nowrap' : ''}`}>
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ModeGate>
  )
}

/* ------------------------------------------------------------------ */
/* Concept check (collapsible Q&A)                                     */
/* ------------------------------------------------------------------ */

export function ConceptCheck({ items, modes = ['beginner', 'detailed'] }) {
  return (
    <ModeGate modes={modes}>
      <div className="my-5 rounded-xl border border-teal-200 bg-teal-50/60 p-4 md:p-5">
        <div className="mb-3 flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-teal-600 text-[13px] font-bold text-white">?</span>
          <span className="text-[13px] font-extrabold uppercase tracking-wider text-teal-800">Quick Concept Check — test yourself</span>
        </div>
        <div className="space-y-2">
          {items.map((it, i) => (
            <details key={i} className="group rounded-lg border border-teal-200 bg-white px-4 py-2.5 open:ring-1 open:ring-teal-300">
              <summary className="cursor-pointer list-none text-[14px] font-semibold text-slate-800 marker:hidden">
                <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-[11px] font-bold text-teal-700 group-open:bg-teal-600 group-open:text-white">
                  {i + 1}
                </span>
                {it.q}
                <span className="float-right text-teal-600 transition group-open:rotate-180">▾</span>
              </summary>
              <div className="prose-book mt-2 border-t border-teal-100 pt-2 text-slate-700">{it.a}</div>
            </details>
          ))}
        </div>
      </div>
    </ModeGate>
  )
}

/* ------------------------------------------------------------------ */
/* 8-mark exam answer box                                              */
/* ------------------------------------------------------------------ */

export function ExamAnswer({ children, caption = 'Write your answer in this structure in the university examination' }) {
  return (
    <div className="my-6 overflow-hidden rounded-xl border-2 border-navy-700 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-navy-800 px-4 py-2.5 text-white">
        <span className="text-[13px] font-extrabold uppercase tracking-[0.12em]">8-Mark Exam Answer</span>
        <span className="text-[11.5px] text-navy-200">{caption}</span>
      </div>
      <div className="exam-paper bg-white px-4 py-3 md:px-6">
        <div className="prose-book font-serif">{children}</div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Question page header + footer                                       */
/* ------------------------------------------------------------------ */

export function QHeader({ q, title, question, tags = [] }) {
  return (
    <div className="mb-2">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-navy-800 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-white">
          Question {q}
        </span>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-amber-800">
          8 Marks · University Exam
        </span>
        {tags.map((t) => (
          <span key={t} className="rounded-full bg-navy-50 px-3 py-1 text-[11px] font-semibold text-navy-700 ring-1 ring-navy-200">
            {t}
          </span>
        ))}
      </div>
      <h1 className="font-serif text-2xl md:text-3xl font-bold leading-tight text-navy-900">{title}</h1>
      <figure className="mt-4 rounded-xl border-l-4 border-navy-600 bg-white p-4 shadow-card">
        <figcaption className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-navy-500">
          The question, exactly as asked
        </figcaption>
        <blockquote className="font-serif text-[17px] italic leading-8 text-slate-800">
          “{question}”
        </blockquote>
      </figure>
    </div>
  )
}

export function WhatIsAsked({ children }) {
  return (
    <Callout type="note" title="What is being asked?" modes={ALL}>
      {children}
    </Callout>
  )
}

export function PageFooter() {
  const { pathname } = useLocation()
  const idx = ORDER.findIndex((o) => o.path === pathname)
  const prev = idx > 0 ? ORDER[idx - 1] : null
  const next = idx >= 0 && idx < ORDER.length - 1 ? ORDER[idx + 1] : null
  const isQuestion = QUESTION_ROUTES.includes(pathname)
  const { done, toggleDone } = useApp()
  const isDone = !!done[pathname]

  return (
    <div className="mt-14 border-t border-slate-200 pt-6">
      {isQuestion && (
        <button
          type="button"
          onClick={() => toggleDone(pathname)}
          className={`mb-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-bold shadow-card transition ${
            isDone
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-white text-navy-700 ring-1 ring-navy-300 hover:bg-navy-50'
          }`}
        >
          {isDone ? '✓ Completed — tap to undo' : '○ Mark this question as complete'}
        </button>
      )}
      <div className="flex items-stretch justify-between gap-3">
        {prev ? (
          <Link
            to={prev.path}
            className="group flex-1 rounded-xl border border-slate-200 bg-white p-4 shadow-card transition hover:border-navy-300 hover:shadow-md"
          >
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">← Previous</div>
            <div className="mt-1 text-[14.5px] font-bold text-navy-800 group-hover:text-navy-600">{prev.label}</div>
          </Link>
        ) : <div className="flex-1" />}
        {next ? (
          <Link
            to={next.path}
            className="group flex-1 rounded-xl border border-slate-200 bg-white p-4 text-right shadow-card transition hover:border-navy-300 hover:shadow-md"
          >
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Next →</div>
            <div className="mt-1 text-[14.5px] font-bold text-navy-800 group-hover:text-navy-600">{next.label}</div>
          </Link>
        ) : <div className="flex-1" />}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Prerequisite bar                                                    */
/* ------------------------------------------------------------------ */

export function Prereqs({ items }) {
  return (
    <ModeGate modes={['beginner', 'detailed']}>
      <div className="my-5 rounded-xl border border-dashed border-navy-300 bg-navy-50/50 p-4">
        <div className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-navy-600">
          Prerequisite concepts — learn these first
        </div>
        <div className="flex flex-wrap gap-2">
          {items.map(({ label, to }) => (
            <Link
              key={label}
              to={to || '/zero'}
              className="rounded-full bg-white px-3 py-1 text-[12px] font-semibold text-navy-700 ring-1 ring-navy-200 transition hover:bg-navy-600 hover:text-white"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </ModeGate>
  )
}

/* ------------------------------------------------------------------ */
/* Learning-mode banner                                                */
/* ------------------------------------------------------------------ */

export function ModeNote() {
  const { mode } = useApp()
  const texts = {
    beginner: '☺ Beginner Mode is ON — explanations are simplified and gentle. Extra-depth boxes are hidden.',
    detailed: '📖 Detailed Mode is ON — you see the complete teaching: every concept, every step, every tip.',
    exam: '🎯 Exam Mode is ON — only definitions, derivations, formulas, diagrams and final answers are shown.',
  }
  const styles = {
    beginner: 'bg-sky-50 text-sky-800 ring-sky-200',
    detailed: 'bg-navy-50 text-navy-800 ring-navy-200',
    exam: 'bg-amber-50 text-amber-900 ring-amber-200',
  }
  return (
    <div className={`mb-6 rounded-lg px-4 py-2.5 text-[13px] font-semibold ring-1 ${styles[mode]}`}>
      {texts[mode]}
    </div>
  )
}

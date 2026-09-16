import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { GROUPS, QUESTION_ROUTES, SEARCH_INDEX } from '../lib/nav.js'
import { useApp } from '../context/AppContext.jsx'

/* ------------------------------------------------------------------ */
/* Search                                                              */
/* ------------------------------------------------------------------ */

function SearchBox() {
  const [q, setQ] = useState('')
  const [focus, setFocus] = useState(false)
  const navigate = useNavigate()
  const boxRef = useRef(null)

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (needle.length < 2) return []
    return SEARCH_INDEX.filter((it) => {
      const hay = (it.title + ' ' + it.keywords.join(' ')).toLowerCase()
      return needle.split(/\s+/).every((w) => hay.includes(w))
    }).slice(0, 8)
  }, [q])

  useEffect(() => {
    const onDoc = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setFocus(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const go = (item) => {
    setQ('')
    setFocus(false)
    navigate(item.path + (item.hash ? `#${item.hash}` : ''))
  }

  return (
    <div ref={boxRef} className="relative w-full max-w-md">
      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => setFocus(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && results.length > 0) go(results[0])
          if (e.key === 'Escape') setFocus(false)
        }}
        placeholder="Search: Gibbs, window, group delay, Q5…"
        className="w-full rounded-full border border-slate-300 bg-white py-2 pl-9 pr-4 text-[13.5px] text-slate-800 placeholder-slate-400 shadow-sm focus:border-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-100"
        aria-label="Search the textbook"
      />
      {focus && results.length > 0 && (
        <div className="absolute z-40 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          {results.map((r, i) => (
            <button
              key={i}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => go(r)}
              className="block w-full border-b border-slate-100 px-4 py-2.5 text-left last:border-0 hover:bg-navy-50"
            >
              <div className="text-[13.5px] font-semibold text-navy-800">{r.title}</div>
              <div className="mt-0.5 line-clamp-1 text-[11.5px] text-slate-500">
                {r.keywords.slice(0, 6).join(' · ')}
              </div>
            </button>
          ))}
        </div>
      )}
      {focus && q.trim().length >= 2 && results.length === 0 && (
        <div className="absolute z-40 mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] text-slate-500 shadow-xl">
          No matches — try “Gibbs”, “symmetry”, “window”, “Q10”…
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Mode toggle                                                         */
/* ------------------------------------------------------------------ */

const MODES = [
  { key: 'beginner', label: 'Beginner', icon: '☺' },
  { key: 'detailed', label: 'Detailed', icon: '📖' },
  { key: 'exam', label: 'Exam', icon: '🎯' },
]

function ModeToggle() {
  const { mode, setMode } = useApp()
  return (
    <div className="flex items-center rounded-full border border-slate-300 bg-white p-0.5 shadow-sm" role="group" aria-label="Learning mode">
      {MODES.map((m) => (
        <button
          key={m.key}
          type="button"
          onClick={() => setMode(m.key)}
          title={`${m.label} mode`}
          className={`rounded-full px-2.5 py-1.5 text-[12px] font-bold transition md:px-3 ${
            mode === m.key ? 'bg-navy-700 text-white shadow' : 'text-slate-500 hover:text-navy-700'
          }`}
        >
          <span className="hidden sm:inline">{m.icon} </span>{m.label}
        </button>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Sidebar                                                             */
/* ------------------------------------------------------------------ */

function ProgressPanel() {
  const { done } = useApp()
  const count = QUESTION_ROUTES.filter((r) => done[r]).length
  const pct = Math.round((count / QUESTION_ROUTES.length) * 100)
  return (
    <div className="mx-3 mb-4 rounded-xl border border-navy-100 bg-navy-50/70 p-3">
      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-navy-700">
        <span>Progress</span>
        <span>{count} / {QUESTION_ROUTES.length} questions</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-navy-100">
        <div className="h-full rounded-full bg-navy-600 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-2 grid grid-cols-10 gap-1">
        {QUESTION_ROUTES.map((r, i) => (
          <NavLink
            key={r}
            to={r}
            title={`Question ${i + 1}`}
            className={`flex h-6 items-center justify-center rounded text-[10.5px] font-bold transition ${
              done[r] ? 'bg-emerald-500 text-white' : 'bg-white text-navy-600 ring-1 ring-navy-200'
            }`}
          >
            {i + 1}
          </NavLink>
        ))}
      </div>
    </div>
  )
}

function SideNav({ onNavigate }) {
  return (
    <nav className="flex h-full flex-col">
      <div className="px-4 pb-3 pt-4">
        <Link to="/" onClick={onNavigate} className="block">
          <div className="text-[15px] font-extrabold leading-tight text-navy-900">FIR FILTERS</div>
          <div className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-navy-500">
            Interactive Learning &amp; 8-Mark Exam Guide
          </div>
        </Link>
      </div>
      <ProgressPanel />
      <div className="nice-scroll flex-1 space-y-5 overflow-y-auto px-3 pb-6">
        {GROUPS.map((g) => (
          <div key={g.label}>
            <div className="mb-1.5 px-2 text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
              {g.label}
            </div>
            <ul className="space-y-0.5">
              {g.items.map((it) => (
                <li key={it.path}>
                  <NavLink
                    to={it.path}
                    end={it.path === '/'}
                    onClick={onNavigate}
                    title={it.label}
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2 text-[13px] font-medium leading-snug transition ${
                        isActive
                          ? 'bg-navy-700 text-white shadow'
                          : 'text-slate-600 hover:bg-navy-50 hover:text-navy-800'
                      }`
                    }
                  >
                    {it.short || it.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  )
}

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */

export default function Layout() {
  const [drawer, setDrawer] = useState(false)
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [pathname, hash])

  useEffect(() => {
    document.title = 'FIR FILTERS — Interactive Learning & 8-Mark Exam Guide'
  }, [pathname])

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="flex h-14 items-center gap-3 px-3 md:px-5">
          <button
            type="button"
            onClick={() => setDrawer(true)}
            className="rounded-lg p-2 text-navy-800 hover:bg-navy-50 lg:hidden"
            aria-label="Open navigation"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
          <Link to="/" className="hidden items-center gap-2 md:flex lg:hidden">
            <span className="text-[14px] font-extrabold text-navy-900">FIR FILTERS</span>
          </Link>
          <div className="flex-1"><SearchBox /></div>
          <ModeToggle />
        </div>
      </header>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 top-14 z-30 hidden w-72 border-r border-slate-200 bg-white lg:block">
        <SideNav />
      </aside>

      {/* Mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy-900/40" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-2xl">
            <div className="flex justify-end p-2">
              <button
                type="button"
                onClick={() => setDrawer(false)}
                aria-label="Close navigation"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
            <SideNav onNavigate={() => setDrawer(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="px-4 pb-20 pt-8 md:px-8 lg:ml-72">
        <div className="mx-auto max-w-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

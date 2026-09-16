import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

/**
 * Learning mode:
 *  - beginner  : simplified explanations, hides dense extras, shows "in simple words"
 *  - detailed  : full teaching (default)
 *  - exam      : only definition, derivation, formulas, diagrams, final answer
 */
const AppContext = createContext(null)

const MODE_KEY = 'fir-mode'
const PROGRESS_KEY = 'fir-progress-v1'

export function AppProvider({ children }) {
  const [mode, setMode] = useState(() => {
    try {
      return localStorage.getItem(MODE_KEY) || 'detailed'
    } catch {
      return 'detailed'
    }
  })

  const [done, setDone] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}')
    } catch {
      return {}
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(MODE_KEY, mode)
    } catch { /* ignore */ }
  }, [mode])

  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(done))
    } catch { /* ignore */ }
  }, [done])

  const toggleDone = (route) =>
    setDone((d) => ({ ...d, [route]: !d[route] }))

  const value = useMemo(
    () => ({ mode, setMode, done, toggleDone }),
    [mode, done],
  )
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}

/** Render children only for the listed modes (defaults to all modes). */
export function ModeGate({ modes, children }) {
  const { mode } = useApp()
  const list = modes || ['beginner', 'detailed', 'exam']
  if (!list.includes(mode)) return null
  return <>{children}</>
}

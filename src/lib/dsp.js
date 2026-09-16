/** DSP helpers for plotting FIR responses, windows and spectra. */

export const PI = Math.PI

export function linspace(a, b, n) {
  const out = new Array(n)
  const step = (b - a) / (n - 1)
  for (let i = 0; i < n; i++) out[i] = a + step * i
  return out
}

/** DTFT of causal h[k], k = 0..N-1, evaluated at angular frequency w. */
export function dtft(h, w) {
  let re = 0
  let im = 0
  for (let k = 0; k < h.length; k++) {
    re += h[k] * Math.cos(w * k)
    im -= h[k] * Math.sin(w * k)
  }
  return { re, im, mag: Math.hypot(re, im), phase: Math.atan2(im, re) }
}

/** Magnitude response series: [{w, mag}] over [0, PI]. */
export function magSeries(h, points = 241, wMax = PI) {
  return linspace(0, wMax, points).map((w) => ({ w, mag: dtft(h, w).mag }))
}

/** Window functions, length N, indices n = 0..N-1. */
export const WINDOWS = {
  rectangular: {
    name: 'Rectangular',
    label: 'Rectangular',
    fn: () => 1,
    mainLobe: '4π/N',
    peakSideLobe: '≈ −13 dB',
    stopAtten: '≈ 21 dB',
    transition: 'Narrowest (≈ 1.8π/N)',
  },
  bartlett: {
    name: 'Bartlett (Triangular)',
    label: 'Bartlett',
    fn: (n, N) => 1 - (2 * Math.abs(n - (N - 1) / 2)) / (N - 1),
    mainLobe: '8π/N',
    peakSideLobe: '≈ −25 dB',
    stopAtten: '≈ 25 dB',
    transition: 'Wide (≈ 6.1π/N)',
  },
  hann: {
    name: 'Hann (Hanning)',
    label: 'Hann',
    fn: (n, N) => 0.5 - 0.5 * Math.cos((2 * PI * n) / (N - 1)),
    mainLobe: '8π/N',
    peakSideLobe: '≈ −31 dB',
    stopAtten: '≈ 44 dB',
    transition: 'Wide (≈ 6.2π/N)',
  },
  hamming: {
    name: 'Hamming',
    label: 'Hamming',
    fn: (n, N) => 0.54 - 0.46 * Math.cos((2 * PI * n) / (N - 1)),
    mainLobe: '8π/N',
    peakSideLobe: '≈ −41 dB',
    stopAtten: '≈ 53 dB',
    transition: 'Wide (≈ 6.6π/N)',
  },
  blackman: {
    name: 'Blackman',
    label: 'Blackman',
    fn: (n, N) =>
      0.42 -
      0.5 * Math.cos((2 * PI * n) / (N - 1)) +
      0.08 * Math.cos((4 * PI * n) / (N - 1)),
    mainLobe: '12π/N',
    peakSideLobe: '≈ −57 dB',
    stopAtten: '≈ 74 dB',
    transition: 'Widest (≈ 11π/N)',
  },
}

/** Window coefficient array for given key and length N. */
export function windowCoeffs(key, N) {
  const fn = WINDOWS[key].fn
  const out = new Array(N)
  for (let n = 0; n < N; n++) out[n] = fn(n, N)
  return out
}

/** Normalised magnitude spectrum of a window, in dB (peak = 0 dB), 0..PI. */
export function windowSpectrumDb(key, N, points = 512) {
  const w = windowCoeffs(key, N)
  const ws = linspace(0, PI, points)
  let maxMag = 0
  const raw = ws.map((om) => {
    const m = dtft(w, om).mag
    if (m > maxMag) maxMag = m
    return { w: om, mag: m }
  })
  return raw.map(({ w: om, mag }) => ({
    w: om,
    db: 20 * Math.log10(Math.max(mag / maxMag, 1e-6)),
  }))
}

/** Ideal LPF impulse response (zero-phase, centred at 0), cutoff wc: h[n] = sin(wc n)/(π n). */
export function idealLpf(n, wc) {
  if (n === 0) return wc / PI
  return Math.sin(wc * n) / (PI * n)
}

/**
 * Q10 coefficients: ideal LPF, wc = π/2, N = 11, causal shift M = (N-1)/2 = 5.
 * Returns array of {n, m, exact, value}.
 */
export const Q10 = (() => {
  const N = 11
  const M = (N - 1) / 2
  const wc = PI / 2
  const exact = (m) => {
    const a = Math.abs(m)
    if (a === 0) return '1/2'
    // sin(π m / 2): pattern 1, 0, -1, 0, 1 for |m| = 1..5
    const s = Math.round(Math.sin((PI * a) / 2))
    if (s === 0) return '0'
    const sign = s > 0 ? '' : '-'
    return a === 1 ? `${sign}1/π` : `${sign}1/${a}π`
  }
  const coeffs = []
  for (let n = 0; n < N; n++) {
    const m = n - M
    const a = Math.abs(m)
    const s = Math.round(Math.sin((PI * a) / 2))
    coeffs.push({
      n,
      m,
      exact: exact(m),
      value: idealLpf(m, wc),
      tex:
        a === 0
          ? '\\tfrac{1}{2}'
          : s === 0
            ? '0'
            : `${s > 0 ? '' : '-'}\\dfrac{1}{${a === 1 ? '' : a}\\pi}`,
    })
  }
  const h = coeffs.map((c) => c.value)
  return { N, M, wc, coeffs, h }
})()

/** Magnitude of the Q10 designed filter (rectangular truncation). */
export function q10Series(points = 361) {
  const ideal = (w) => (Math.abs(w) <= PI / 2 ? 1 : 0)
  return linspace(0, PI, points).map((w) => ({
    w,
    designed: dtft(Q10.h, w).mag,
    ideal: ideal(w),
  }))
}

/** Truncated ideal LPF (rectangular window) for Gibbs demo, cutoff wc. */
export function truncatedLpf(N, wc = PI / 2) {
  const M = (N - 1) / 2
  const h = new Array(N)
  for (let n = 0; n < N; n++) h[n] = idealLpf(n - M, wc)
  return h
}

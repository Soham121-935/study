import React from 'react'
import { Link } from 'react-router-dom'
import T from '../components/TeX.jsx'
import { PageFooter, DataTable } from '../components/ui.jsx'

const CARDS = [
  {
    t: 'FIR definition',
    d: <>Impulse response <T>{'h[n]'}</T> is non-zero only for <T>{'0 \\le n \\le N-1'}</T>: a <em>finite</em> echo. Non-recursive (no feedback), always BIBO stable. <Link className="text-navy-600 font-bold underline" to="/q1">Q1</Link></>,
  },
  {
    t: 'Difference equation',
    d: <T block>{'y[n] = \\sum_{k=0}^{N-1} h[k]\\, x[n-k]'}</T>,
  },
  {
    t: 'Transfer function',
    d: <T block>{'H(z) = \\sum_{k=0}^{N-1} h[k]\\, z^{-k}'}</T>,
  },
  {
    t: 'Frequency response',
    d: <T block>{'H(e^{j\\omega}) = \\sum_{k=0}^{N-1} h[k]\\, e^{-j\\omega k} = |H|\\, e^{j\\phi(\\omega)}'}</T>,
  },
  {
    t: 'Impulse response',
    d: <>Output for input <T>{'\\delta[n]'}</T>. In an FIR filter the coefficients <em>are</em> <T>{'h[n]'}</T>. <Link className="text-navy-600 font-bold underline" to="/q3">Q3</Link></>,
  },
  {
    t: 'Symmetry conditions',
    d: <T block>{'h[n] = h[N-1-n] \\;\\text{(sym.)} \\qquad h[n] = -h[N-1-n] \\;\\text{(antisym.)}'}</T>,
  },
  {
    t: 'Linear phase',
    d: <T block>{'\\phi(\\omega) = -\\omega\\,\\frac{N-1}{2} \\quad (\\text{sym.}), \\qquad \\frac{\\pi}{2} - \\omega\\frac{N-1}{2} \\quad (\\text{antisym.})'}</T>,
  },
  {
    t: 'Phase delay & group delay',
    d: <T block>{'\\tau_p = -\\frac{\\phi(\\omega)}{\\omega}, \\qquad \\tau_g = -\\frac{d\\phi(\\omega)}{d\\omega} \\quad \\stackrel{\\text{linear phase}}{\\Longrightarrow}\\quad \\tau_p = \\tau_g = \\frac{N-1}{2}'}</T>,
  },
  {
    t: 'Gibbs phenomenon',
    d: <>Ringing + ≈ 9% overshoot near a discontinuity of a truncated Fourier approximation. N narrows it; only tapered windows shrink it. Rectangular: −21 dB stopband. <Link className="text-navy-600 font-bold underline" to="/q6">Q6</Link></>,
  },
  {
    t: 'FIR design methods',
    d: <>Fourier series (truncate ideal), Window (taper w[n]), Frequency sampling (IDFT of samples), Optimal equiripple (Parks–McClellan, min order). <Link className="text-navy-600 font-bold underline" to="/q7">Q7</Link></>,
  },
  {
    t: 'Window method rule',
    d: <T block>{'h[n] = h_d\\!\\left[n-\\tfrac{N-1}{2}\\right]\\cdot w[n]'}</T>,
  },
  {
    t: 'Fourier series method rule',
    d: <T block>{'h_d[n] = \\frac{1}{2\\pi}\\int_{-\\pi}^{\\pi} H_d(e^{j\\omega})\\, e^{j\\omega n}\\, d\\omega'}</T>,
  },
  {
    t: 'Ideal LPF recipe (cutoff ωc)',
    d: <T block>{'h_d[n] = \\frac{\\sin(\\omega_c n)}{\\pi n}, \\quad h_d[0] = \\frac{\\omega_c}{\\pi}; \\qquad h[n] = h_d\\!\\left[n-\\tfrac{N-1}{2}\\right]'}</T>,
  },
  {
    t: 'N-tap concept',
    d: <>N taps = N coefficients, N−1 delays, order N−1, centre of symmetry α = (N−1)/2, delay = α samples. Multipliers: N (direct) → ≈ N/2 (folded, symmetric).</>,
  },
]

export default function Revision() {
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-amber-600 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-white">
          Final Revision
        </span>
        <span className="rounded-full bg-navy-50 px-3 py-1 text-[11px] font-semibold text-navy-700 ring-1 ring-navy-200">
          The night-before-exam page
        </span>
      </div>
      <h1 className="font-serif text-2xl font-bold leading-tight text-navy-900 md:text-3xl">
        FIR Filter — Quick Revision &amp; Complete Formula Sheet
      </h1>
      <p className="mt-3 max-w-3xl text-[15px] leading-7 text-slate-700">
        Everything from Questions 1–10, compressed. Read top to bottom once slowly; then again, covering the
        right-hand side and reciting the formula behind every concept.
      </p>

      <h2 className="mt-8 font-serif text-xl font-bold text-navy-900">Quick revision — the concept grid</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {CARDS.map((c) => (
          <div key={c.t} className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
            <div className="mb-1 text-[12px] font-extrabold uppercase tracking-wider text-navy-700">{c.t}</div>
            <div className="prose-book text-[13.5px] text-slate-700 [&>div]:!my-1">{c.d}</div>
          </div>
        ))}
      </div>

      <h2 className="mt-12 font-serif text-xl font-bold text-navy-900">Formula sheet — every equation from this unit</h2>

      <DataTable
        caption="A · FIR fundamentals"
        head={['Name', 'Formula', 'Where']}
        rows={[
          ['FIR difference equation', <T>{'y[n] = \\sum_{k=0}^{N-1} h[k]\\, x[n-k]'}</T>, <>Q1</>],
          ['Transfer function', <T>{'H(z) = \\sum_{k=0}^{N-1} h[k]\\, z^{-k}'}</T>, <>Q1, Q3</>],
          ['Frequency response', <T>{'H(e^{j\\omega}) = \\sum_{k=0}^{N-1} h[k]\\, e^{-j\\omega k}'}</T>, <>Q1, Q4</>],
          ['Magnitude & phase', <T>{'H(e^{j\\omega}) = |H(e^{j\\omega})|\\, e^{j\\phi(\\omega)}'}</T>, <>Q1, Q4</>],
          ['Convolution sum', <T>{'y[n] = \\sum_k x[k]\\, h[n-k]'}</T>, <>Basics</>],
          ['Unit impulse', <T>{'\\delta[n] = 1 \\,(n=0),\\; 0 \\,(n \\ne 0)'}</T>, <>Basics</>],
        ]}
      />

      <DataTable
        caption="B · Symmetry, phase, delays"
        head={['Name', 'Formula', 'Where']}
        rows={[
          ['Symmetric condition', <T>{'h[n] = h[N-1-n]'}</T>, <>Q2, Q5</>],
          ['Antisymmetric condition', <T>{'h[n] = -h[N-1-n]'}</T>, <>Q2</>],
          ['Centre of symmetry / delay', <T>{'\\alpha = \\dfrac{N-1}{2}'}</T>, <>Q2, Q5</>],
          ['Linear-phase form', <T>{'H(e^{j\\omega}) = e^{-j\\omega(N-1)/2}\\, A(\\omega), \\; A \\text{ real}'}</T>, <>Q5, Q10</>],
          ['Phase response (sym.)', <T>{'\\phi(\\omega) = -\\omega\\,\\dfrac{N-1}{2}'}</T>, <>Q4, Q5</>],
          ['Phase delay', <T>{'\\tau_p(\\omega) = -\\dfrac{\\phi(\\omega)}{\\omega} = \\dfrac{N-1}{2}'}</T>, <>Q4, Q5</>],
          ['Group delay', <T>{'\\tau_g(\\omega) = -\\dfrac{d\\phi(\\omega)}{d\\omega} = \\dfrac{N-1}{2}'}</T>, <>Q4, Q5</>],
          ['Multiplier saving (sym.)', <T>{'(N+1)/2 \\; (N \\text{ odd}), \\qquad N/2 \\; (N \\text{ even})'}</T>, <>Q2</>],
        ]}
      />

      <DataTable
        caption="C · Fourier series design"
        head={['Name', 'Formula', 'Where']}
        rows={[
          ['Inverse DTFT / Fourier series coefficients', <T>{'h_d[n] = \\dfrac{1}{2\\pi} \\displaystyle\\int_{-\\pi}^{\\pi} H_d(e^{j\\omega})\\, e^{j\\omega n}\\, d\\omega'}</T>, <>Q9, Q10</>],
          ['Ideal LPF impulse response', <T>{'h_d[n] = \\dfrac{\\sin(\\omega_c n)}{\\pi n}, \\; h_d[0] = \\dfrac{\\omega_c}{\\pi}'}</T>, <>Q9, Q10</>],
          ['Causal N-tap design rule', <T>{'h[n] = h_d\\!\\left[n - \\frac{N-1}{2}\\right], \\; n = 0, \\dots, N-1'}</T>, <>Q9, Q10</>],
          ['Window method', <T>{'h[n] = h_d[n]\\, w[n]'}</T>, <>Q7, Q8</>],
          ['Frequency sampling', <T>{'H[k] = H_d(e^{j 2\\pi k/N}), \\; h[n] = \\frac{1}{N} \\sum_k H[k] e^{j2\\pi k n/N}'}</T>, <>Q7</>],
          ['Gibbs overshoot', <T>{'\\approx 9\\% \\text{ of the jump} \\; (8.95\\%)'}</T>, <>Q6</>],
          ['Euler identities', <T>{'\\cos\\theta = \\frac{e^{j\\theta} + e^{-j\\theta}}{2}, \\quad \\sin\\theta = \\frac{e^{j\\theta} - e^{-j\\theta}}{2j}'}</T>, <>Q4, Q5, Q10</>],
          ['Time-shift property', <T>{'x[n-k] \\;\\longleftrightarrow\\; z^{-k} X(z)'}</T>, <>Q3, Q4</>],
        ]}
      />

      <DataTable
        caption="D · Window functions (0 ≤ n ≤ N−1) and their characters"
        head={['Window', 'w[n]', 'Stopband atten.', 'Main lobe']}
        rows={[
          ['Rectangular', <T>{'1'}</T>, <>≈ 21 dB</>, <T>{'4\\pi/N'}</T>],
          ['Bartlett', <T>{'1 - \\frac{2|n - \\frac{N-1}{2}|}{N-1}'}</T>, <>≈ 25 dB</>, <T>{'8\\pi/N'}</T>],
          ['Hann', <T>{'0.5 - 0.5\\cos\\frac{2\\pi n}{N-1}'}</T>, <>≈ 44 dB</>, <T>{'8\\pi/N'}</T>],
          ['Hamming', <T>{'0.54 - 0.46\\cos\\frac{2\\pi n}{N-1}'}</T>, <>≈ 53 dB</>, <T>{'8\\pi/N'}</T>],
          ['Blackman', <T>{'0.42 - 0.5\\cos\\frac{2\\pi n}{N-1} + 0.08\\cos\\frac{4\\pi n}{N-1}'}</T>, <>≈ 74 dB</>, <T>{'12\\pi/N'}</T>],
        ]}
      />

      <DataTable
        caption="E · The two numerical anchors — memorise these results"
        head={['Question', 'Given', 'Result']}
        rows={[
          ['Q4', <T>{'y[n] = 0.25x[n] + x[n-1] + 0.25x[n-2]'}</T>, <><T>{'H = e^{-j\\omega}(1 + 0.5\\cos\\omega)'}</T>, <T>{'\\phi = -\\omega'}</T>, <T>{'\\tau_p = \\tau_g = 1'}</T> sample</>],
          ['Q10', <>Ideal LPF, <T>{'\\omega_c = \\pi/2'}</T>, N = 11</>, <><T>{'h = \\left[\\tfrac{1}{5\\pi}, 0, -\\tfrac{1}{3\\pi}, 0, \\tfrac{1}{\\pi}, \\tfrac12, \\tfrac{1}{\\pi}, 0, -\\tfrac{1}{3\\pi}, 0, \\tfrac{1}{5\\pi}\\right]'}</T>, symmetric ⇒ <T>{'\\tau_p = \\tau_g = 5'}</T></>],
        ]}
      />

      <div className="mt-8 rounded-xl border border-navy-200 bg-navy-50 p-4 text-[13.5px] leading-6 text-navy-800">
        <b>One universal exam skeleton (any of Q1–Q10):</b> definition → draw (diagram/stem/response) → derive
        (formula → substitution → result) → state the key property (linear phase / constant delay / trade-off) →
        conclude. Practise the 30-second recap at the end of each question page until each takes under a minute.
      </div>

      <PageFooter />
    </div>
  )
}

import React, { useMemo, useState } from 'react'
import T from '../components/TeX.jsx'
import {
  QHeader,
  WhatIsAsked,
  Section,
  Callout,
  FormulaCard,
  DataTable,
  ConceptCheck,
  ExamAnswer,
  PageFooter,
  ModeNote,
  Prereqs,
} from '../components/ui.jsx'
import { GraphCard, LinePlot, PLOT_COLORS } from '../components/plots.jsx'
import { WINDOWS, windowCoeffs, windowSpectrumDb, PI, linspace } from '../lib/dsp.js'

/* ------------------------------------------------------------------ */
/* Interactive window visualizer                                       */
/* ------------------------------------------------------------------ */

function WindowVisualizer() {
  const [key, setKey] = useState('hamming')
  const [N, setN] = useState(31)

  const coeffData = useMemo(() => windowCoeffs(key, N).map((v, n) => ({ n, w: +v.toFixed(4) })), [key, N])
  const specData = useMemo(() => windowSpectrumDb(key, N), [key, N])

  // all-window shape overlay for comparison
  const allShapes = useMemo(() => {
    const ws = linspace(0, 1, 121)
    const keys = Object.keys(WINDOWS)
    return ws.map((t) => {
      const n = t * (N - 1)
      const row = { t }
      keys.forEach((k) => (row[k] = +WINDOWS[k].fn(n, N).toFixed(4)))
      return row
    })
  }, [N])

  return (
    <div className="my-5 rounded-xl border-2 border-navy-200 bg-white p-4 shadow-card md:p-5">
      <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-[13px] font-extrabold uppercase tracking-wider text-navy-700">Interactive window visualizer</div>
          <p className="mt-0.5 text-[12.5px] text-slate-500">
            Pick a window and slide N. Watch the coefficient shape and its frequency response (side lobes = ripple floor, main lobe = transition width).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-[12.5px] font-bold text-navy-800">
            Window{' '}
            <select
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="ml-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-[12.5px] font-semibold text-navy-800 focus:border-navy-400 focus:outline-none"
            >
              {Object.entries(WINDOWS).map(([k, w]) => (
                <option key={k} value={k}>{w.name}</option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-[12.5px] font-bold text-navy-800">
            N = {N}
            <input type="range" min={7} max={63} step={2} value={N} onChange={(e) => setN(Number(e.target.value))} className="w-36 accent-navy-600" aria-label="window length N" />
          </label>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-1 text-[12px] font-bold text-slate-600">Coefficient shape w[n], N = {N}</div>
          <LinePlot
            data={coeffData}
            xKey="n"
            series={[{ key: 'w', name: 'w[n]', color: PLOT_COLORS.navy }]}
            xLabel="n"
            yLabel="w[n]"
            yDomain={[0, 1.1]}
            height={230}
            xDecimals={0}
          />
        </div>
        <div>
          <div className="mb-1 text-[12px] font-bold text-slate-600">
            Normalised frequency response |W(<T>{'e^{j\\omega}'}</T>)| in dB (peak = 0 dB)
          </div>
          <LinePlot
            data={specData}
            series={[{ key: 'db', name: '20 log₁₀|W|/Wmax', color: PLOT_COLORS.rose }]}
            xLabel="ω"
            yLabel="dB"
            xTicks={[0, PI / 2, PI]}
            xTickLabels={{ 0: '0', [PI / 2]: 'π/2', [PI]: 'π' }}
            yDomain={[-90, 3]}
            height={230}
          />
        </div>
      </div>
      <DataTable
        compact
        caption={`Textbook characteristics of the ${WINDOWS[key].name} window`}
        head={['Main-lobe width', 'Peak side-lobe', 'Min. stopband attenuation', 'Transition width of designed filter']}
        rows={[[
          <T key="a">{WINDOWS[key].mainLobe.replace(/π/g, '\\pi')}</T>,
          WINDOWS[key].peakSideLobe,
          WINDOWS[key].stopAtten,
          WINDOWS[key].transition,
        ]]}
      />
      <div className="mt-2">
        <div className="mb-1 text-[12px] font-bold text-slate-600">All five window shapes together (N = {N}) — the taper trade-off in one picture</div>
        <LinePlot
          data={allShapes}
          xKey="t"
          series={[
            { key: 'rectangular', name: 'Rectangular', color: '#64748b', width: 1.6 },
            { key: 'bartlett', name: 'Bartlett', color: PLOT_COLORS.teal, width: 1.6 },
            { key: 'hann', name: 'Hann', color: PLOT_COLORS.violet, width: 1.6 },
            { key: 'hamming', name: 'Hamming', color: PLOT_COLORS.amber, width: 2.2 },
            { key: 'blackman', name: 'Blackman', color: PLOT_COLORS.rose, width: 1.6 },
          ]}
          showLegend
          xLabel="n / (N−1)"
          yLabel="w"
          yDomain={[0, 1.1]}
          height={240}
        />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */

export default function Q8() {
  return (
    <div>
      <QHeader
        q={8}
        title="Comparison of Window Functions Used in FIR Filter Design"
        question="Compare different window functions used in FIR."
        tags={['Windows', 'Rectangular · Bartlett · Hann · Hamming · Blackman', 'Ripple vs transition']}
      />
      <ModeNote />

      <WhatIsAsked>
        <p>
          List the standard windows used to truncate the ideal impulse response — <strong>Rectangular,
          Bartlett (triangular), Hann, Hamming and Blackman</strong> — with each window's formula, shape, and
          spectral behaviour (main-lobe width, side-lobe level, stopband attenuation, transition width), then
          compare them with advantages and disadvantages. The controlling trade-off — <strong>transition width
          versus stopband attenuation</strong> — must be crystal clear.
        </p>
      </WhatIsAsked>

      <Prereqs
        items={[
          { label: 'Why truncate? (Gibbs)', to: '/q6' },
          { label: 'Fourier series design', to: '/q9' },
          { label: 'Ideal LPF impulse response', to: '/q10' },
        ]}
      />

      <Section kicker="Learn this first" title="Why is a window required at all?" modes={['beginner', 'detailed']}>
        <Callout type="simple">
          <p>
            The ideal filter's coefficient list is infinitely long — like an echo that never quite stops. A
            practical filter keeps only the N most important coefficients. Cutting the list abruptly is like
            slamming a door mid-sentence: it produces a loud “thud” (Gibbs ripple). A <strong>window</strong> is a
            gentler way to end the list: it smoothly turns the last coefficients down to zero.
          </p>
        </Callout>
        <FormulaCard
          open
          title="The windowing operation"
          tex={'h[n] = h_d[n] \\cdot w[n]'}
          symbols={[
            { s: 'h_d[n]', meaning: 'ideal impulse response (infinite duration, sinc-decaying)' },
            { s: 'w[n]', meaning: 'window sequence of length N — zero outside 0 ≤ n ≤ N−1' },
            { s: 'h[n]', meaning: 'practical N-tap FIR coefficients' },
          ]}
          note="Multiplication in time = convolution in frequency: the designed response is the ideal response smeared with the window spectrum W(e^{jω}). The window's SHAPE is therefore everything."
        />
        <p>
          The window spectrum <T>{'W(e^{j\\omega})'}</T> has a <strong>main lobe</strong> (a wide central bump:
          its width sets the designed filter's <strong>transition width</strong>) and <strong>side lobes</strong>
          (small bumps: their height sets the <strong>ripple / stopband floor</strong>). Physics gives us a cruel
          exchange rate: <em>to lower the side lobes you must widen the main lobe</em>. Choosing a window = choosing
          your position on that exchange.
        </p>
      </Section>

      <WindowVisualizer />

      <Section kicker="The five windows" title="Formulas and character of each window">
        <DataTable
          caption="Window formulas, length N, n = 0, 1, …, N−1 (and zero elsewhere)"
          head={['Window', 'w[n]', 'Character']}
          rows={[
            ['Rectangular', <T key="r">{'w[n] = 1'}</T>, <>No tapering at all — abrupt cut. Narrowest main lobe, worst side lobes (Gibbs).</>],
            ['Bartlett (triangular)', <T key="b">{'w[n] = 1 - \\dfrac{2\\,\\big|n - \\frac{N-1}{2}\\big|}{N-1}'}</T>, <>Linear taper to zero at the ends. First step away from ringing.</>],
            ['Hann (Hanning)', <T key="hn">{'w[n] = 0.5 - 0.5\\cos\\left(\\dfrac{2\\pi n}{N-1}\\right)'}</T>, <>One raised-cosine period; ends exactly at zero ⇒ smooth spectral fall-off.</>],
            ['Hamming', <T key="hm">{'w[n] = 0.54 - 0.46\\cos\\left(\\dfrac{2\\pi n}{N-1}\\right)'}</T>, <>Raised cosine but ends at 0.08 instead of 0 — the “0.54” is optimised to cancel the first side lobe.</>],
            ['Blackman', <T key="bl">{'w[n] = 0.42 - 0.5\\cos\\left(\\dfrac{2\\pi n}{N-1}\\right) + 0.08\\cos\\left(\\dfrac{4\\pi n}{N-1}\\right)'}</T>, <>A second cosine term kills even more side lobes; the price is the widest main lobe.</>],
          ]}
        />
      </Section>

      <Section kicker="Head-to-head" title="The comparison table you memorise for the exam">
        <DataTable
          caption="Window characteristics (N = filter length; values ±1 dB across textbooks)"
          head={['Property', 'Rectangular', 'Bartlett', 'Hann', 'Hamming', 'Blackman']}
          rows={[
            ['Peak side-lobe level', <>≈ −13 dB</>, <>≈ −25 dB</>, <>≈ −31 dB</>, <>≈ −41 dB</>, <>≈ −57 dB</>],
            ['Min. stopband attenuation of designed filter', <>≈ 21 dB</>, <>≈ 25 dB</>, <>≈ 44 dB</>, <>≈ 53 dB</>, <>≈ 74 dB</>],
            ['Main-lobe width', <><T>{'4\\pi/N'}</T></>, <><T>{'8\\pi/N'}</T></>, <><T>{'8\\pi/N'}</T></>, <><T>{'8\\pi/N'}</T></>, <><T>{'12\\pi/N'}</T></>],
            ['Transition width of designed filter (approx.)', <>≈ 1.8π/N — sharpest</>, <>≈ 6.1π/N</>, <>≈ 6.2π/N</>, <>≈ 6.6π/N</>, <>≈ 11π/N — widest</>],
            ['End values w[0], w[N−1]', <>1 (abrupt)</>, <>0</>, <>0</>, <>0.08</>, <>0</>],
          ]}
        />
        <DataTable
          caption="Advantages and disadvantages of each"
          head={['Window', 'Advantages', 'Disadvantages']}
          rows={[
            ['Rectangular', <>Simplest; narrowest transition for given N; no computation needed</>, <>Severe Gibbs ripple; stopband only ≈ 21 dB — often unacceptable</>],
            ['Bartlett', <>Simple linear taper; ripple much lower than rectangular; ends at zero</>, <>Transition width doubled (8π/N); attenuation still modest (≈ 25 dB)</>],
            ['Hann', <>Good attenuation (≈ 44 dB); side lobes decay fast; zero ends</>, <>Wider transition than rectangular</>],
            ['Hamming', <>Best attenuation among “narrow” windows (≈ 53 dB) — the default choice</>, <>Slightly higher near-lobe than Hann; side lobes don't decay (0.08 pedestal)</>],
            ['Blackman', <>Excellent attenuation (≈ 74 dB) — nearly ripple-free design</>, <>Widest transition (12π/N) ⇒ needs much larger N for the same sharpness</>],
          ]}
        />
      </Section>

      <Callout type="info" title="The one-sentence trade-off" modes={['beginner', 'detailed', 'exam']}>
        <p>
          <strong>Rectangular → Blackman is a journey from “sharp edge, heavy ripple” to “gentle edge, almost no
          ripple”:</strong> you buy each additional ~20 dB of stopband attenuation with a wider main lobe, and you
          win the width back only by increasing N. That is the entire window-selection criterion.
        </p>
      </Callout>

      <Callout type="warn" title="Common mistakes">
        <ul>
          <li>Swapping Hann and Hamming constants — Hamming is 0.54/−0.46 ( pedestal 0.08); Hann is 0.5/−0.5 (zero ends).</li>
          <li>Attributing ripple to N — ripple level is set by the <em>window choice</em>; N sets the transition width.</li>
          <li>Writing the Blackman formula with cos(4πn/N) instead of cos(4πn/(N−1)) — every formula here uses N−1 in the denominator.</li>
          <li>Claiming Hamming has zero ends — it ends at 0.08, and that is precisely what lets it cancel the first side lobe.</li>
        </ul>
      </Callout>

      <Callout type="tip" title="Exam tip">
        <p>
          If you can reproduce just the middle comparison table from memory — five rows of numbers — plus one
          formula per window, this question is 8/8. Sketch two window spectra side by side (rectangular vs
          Hamming) and annotate “side-lobe level” and “main-lobe width”.
        </p>
      </Callout>

      <ExamAnswer>
        <p><b>Why windows.</b> Ideal FIR designs need infinite h<sub>d</sub>[n]; a practical filter multiplies it by
        a finite window: h[n] = h<sub>d</sub>[n]·w[n]. In frequency, the ideal response convolves with W(<T>{'e^{j\\omega}'}</T>),
        whose main-lobe width fixes the transition band and side-lobe level fixes the stopband attenuation.</p>
        <p><b>The windows (length N, 0 ≤ n ≤ N−1):</b></p>
        <T block>{'\\text{Rect: } w[n]=1 \\qquad \\text{Bartlett: } 1-\\frac{2|n-\\frac{N-1}{2}|}{N-1} \\qquad \\text{Hann: } 0.5-0.5\\cos\\frac{2\\pi n}{N-1}'}</T>
        <T block>{'\\text{Hamming: } 0.54-0.46\\cos\\frac{2\\pi n}{N-1} \\qquad \\text{Blackman: } 0.42-0.5\\cos\\frac{2\\pi n}{N-1}+0.08\\cos\\frac{4\\pi n}{N-1}'}</T>
        <p><b>Comparison.</b> Rectangular: side lobes ≈ −13 dB, stopband ≈ 21 dB, narrowest transition (≈ 1.8π/N).
        Bartlett: −25 dB / ≈ 25 dB / ≈ 6.1π/N. Hann: −31 dB / ≈ 44 dB / ≈ 6.2π/N. Hamming: −41 dB / ≈ 53 dB /
        ≈ 6.6π/N (0.08 end pedestal cancels the first side lobe — the popular default). Blackman: −57 dB / ≈ 74 dB
        / ≈ 11π/N — supreme smoothness, widest edge. Main-lobe widths: 4π/N (rect), 8π/N (Bartlett, Hann,
        Hamming), 12π/N (Blackman).</p>
        <p><b>Pros / cons.</b> Rectangular: sharpest but heaviest Gibbs ripple. Bartlett: simple taper, modest
        specs. Hann: smooth, zero ends, good all-rounder. Hamming: best stopband for a narrow main lobe.
        Blackman: near ripple-free but demands large N.</p>
        <p><b>Conclusion.</b> Window choice is the exchange between transition width and stopband attenuation:
        sharper taper ⇒ lower ripple but wider transition; N then restores sharpness. Hamming is the usual default;
        Blackman when attenuation dominates; rectangular only when simplicity rules.</p>
      </ExamAnswer>

      <Section kicker="Quick revision" title="The whole question in 30 seconds" modes={['beginner', 'detailed']}>
        <ul>
          <li><T>{'h[n] = h_d[n]\\,w[n]'}</T>; window spectrum main lobe → transition width, side lobes → ripple floor.</li>
          <li>Ladder of attenuation: Rect 21 → Bartlett 25 → Hann 44 → Hamming 53 → Blackman 74 dB.</li>
          <li>Ladder of main lobes: Rect 4π/N → (Bartlett/Hann/Hamming) 8π/N → Blackman 12π/N.</li>
        </ul>
      </Section>

      <ConceptCheck
        items={[
          {
            q: 'Why does the rectangular window give the narrowest transition despite the worst ripple?',
            a: <>It has the narrowest main lobe (4π/N) because it wastes no length on tapering — every sample is weighted 1. The side lobes of its sinc-like spectrum are what create the ripple.</>,
          },
          {
            q: 'What is special about the constants 0.54 and 0.46 in the Hamming window?',
            a: <>They are chosen so the window ends at 0.08 ≠ 0; that residual pedestal creates a side-lobe component that cancels the first side lobe, giving ≈ −41 dB peak side lobes.</>,
          },
          {
            q: 'A design needs ≥ 70 dB stopband attenuation. Which window, and what is the penalty?',
            a: <>Blackman (≈ 74 dB). Penalty: main lobe 12π/N — the transition band triples vs rectangular, so N must grow to keep the edge sharp.</>,
          },
          {
            q: 'In h[n] = hd[n]w[n], which factor controls ripple and which controls transition width?',
            a: <>The window <em>type</em> (its side lobes) controls ripple; the window <em>length</em> N (its main lobe ∝ 1/N) controls transition width.</>,
          },
        ]}
      />

      <PageFooter />
    </div>
  )
}

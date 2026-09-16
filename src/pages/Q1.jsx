import React, { useMemo } from 'react'
import T from '../components/TeX.jsx'
import {
  QHeader,
  WhatIsAsked,
  Section,
  Callout,
  FormulaCard,
  Steps,
  DataTable,
  ConceptCheck,
  ExamAnswer,
  PageFooter,
  ModeNote,
  Prereqs,
} from '../components/ui.jsx'
import { FIRStructure, Figure } from '../components/diagrams.jsx'
import { GraphCard, LinePlot, PLOT_COLORS } from '../components/plots.jsx'
import { idealLpf, magSeries, PI, WINDOWS } from '../lib/dsp.js'

export default function Q1() {
  // Typical FIR low-pass magnitude response (Hamming-windowed ideal LPF, N = 31, wc = 0.45π)
  const lpfData = useMemo(() => {
    const N = 31
    const M = (N - 1) / 2
    const wc = 0.45 * PI
    const win = WINDOWS.hamming.fn
    const h = new Array(N)
    for (let n = 0; n < N; n++) h[n] = idealLpf(n - M, wc) * win(n, N)
    return magSeries(h, 361)
  }, [])

  return (
    <div>
      <QHeader
        q={1}
        title="Characteristics of the FIR Filter — with Filter Response and Transfer Function"
        question="Explain the characteristics of the FIR Filter. (with filter response and Transfer Function)"
        tags={['Definition', 'Transfer function', 'Frequency response', 'Properties']}
      />
      <ModeNote />

      <WhatIsAsked>
        <p>
          The examiner wants three things: (1) a precise <strong>definition</strong> of an FIR filter together with
          its <strong>difference equation</strong>, <strong>transfer function</strong> and <strong>frequency
          response</strong>, (2) a correctly drawn <strong>structure diagram</strong>, and (3) a discussion of the
          <strong>characteristic properties</strong> that make FIR filters special — finite response, no feedback,
          guaranteed stability, exact linear phase, and so on, including a typical magnitude-response sketch.
        </p>
      </WhatIsAsked>

      <Prereqs
        items={[
          { label: 'Impulse response h[n]' },
          { label: 'Convolution' },
          { label: 'Delay element z⁻¹', to: '/structure' },
          { label: 'FIR block diagram', to: '/structure' },
        ]}
      />

      {/* ---------------------------------------------------------- */}
      <Section kicker="Learn this first" title="The basic concept in one paragraph" modes={['beginner', 'detailed']}>
        <p>
          An FIR filter is a machine that produces each new output sample by taking a <strong>weighted average of
          the most recent N input samples</strong>. The “weights” are the filter coefficients
          <T>{'h[0], h[1], \\dots, h[N-1]'}</T> — and these weights <em>are</em> the filter's impulse response.
          Because the response to a single impulse is exactly those N numbers and then silence forever, the impulse
          response is <strong>finite</strong>: hence the name <strong>F</strong>inite <strong>I</strong>mpulse{' '}
          <strong>R</strong>esponse.
        </p>
      </Section>

      <Section kicker="Fundamental definition" title="Definition of the FIR filter">
        <p>
          A digital filter is called an <strong>FIR filter</strong> if its impulse response{' '}
          <T>{'h[n]'}</T> has <strong>finite duration</strong>, i.e. it is non-zero only over a finite range of
          samples — conventionally
        </p>
        <T block>{'h[n] = 0 \\quad \\text{for } n < 0 \\;\\text{and}\\; n \\ge N,\\qquad h[n] \\ne 0 \\text{ only for } 0 \\le n \\le N-1'}</T>
        <p>
          The output is computed by direct convolution of the input with these N coefficients — the{' '}
          <strong>difference equation</strong> of the filter:
        </p>
        <FormulaCard
          open
          title="FIR difference equation (non-recursive convolution form)"
          tex={'y[n] = \\sum_{k=0}^{N-1} h[k]\\, x[n-k]'}
          symbols={[
            { s: 'y[n]', meaning: 'output sample at time index n' },
            { s: 'x[n-k]', meaning: 'input sample delayed by k samples, taken from the tapped delay line' },
            { s: 'h[k]', meaning: 'k-th filter coefficient = impulse response value at n = k' },
            { s: 'N', meaning: 'filter length = number of taps (order is N−1)' },
            { s: '\\sum_{k=0}^{N-1}', meaning: 'finite sum over the N taps — no feedback terms' },
          ]}
          note="Compare with an IIR filter, where y[n] also depends on previous outputs y[n−1], y[n−2], … — the FIR equation contains no such feedback terms."
        />
      </Section>

      <Section kicker="Structure" title="The FIR block diagram">
        <Figure
          title="Direct-form structure of the N-tap FIR filter"
          caption="The signal x[n] enters a tapped delay line; each tap weights one delayed copy by h[k]; the adder forms the sum written in the difference equation."
        >
          <FIRStructure />
        </Figure>
        <p>
          Reading the structure left to right tells the whole story of the filter: <strong>memory</strong> (the
          delay chain), <strong>weighting</strong> (the multipliers), and <strong>combination</strong> (the adder).
          A general N-tap realisation needs N multipliers, N−1 delay elements and N−1 additions per output sample.
        </p>
      </Section>

      <Section kicker="Transfer function" title="From the difference equation to H(z)">
        <p>
          Take the z-transform of the difference equation. Using the time-shift property{' '}
          <T>{'x[n-k] \\;\\longleftrightarrow\\; z^{-k} X(z)'}</T>:
        </p>
        <Steps
          items={[
            {
              title: 'Start from the difference equation',
              math: 'y[n] = h[0]x[n] + h[1]x[n-1] + \\cdots + h[N-1]\\,x[n-N+1]',
            },
            {
              title: 'Transform every term (z-transform of both sides)',
              math: 'Y(z) = h[0]X(z) + h[1]z^{-1}X(z) + \\cdots + h[N-1]z^{-(N-1)}X(z)',
            },
            {
              title: 'Factor out X(z) and divide — the transfer function',
              math: 'H(z) = \\frac{Y(z)}{X(z)} = \\sum_{k=0}^{N-1} h[k]\\, z^{-k}',
            },
          ]}
        />
        <FormulaCard
          title="FIR transfer function — a polynomial in z⁻¹"
          tex={'H(z) = \\sum_{k=0}^{N-1} h[k]\\, z^{-k} = h[0] + h[1]z^{-1} + \\cdots + h[N-1]z^{-(N-1)}'}
          symbols={[
            { s: 'H(z)', meaning: 'system (transfer) function: output z-transform ÷ input z-transform' },
            { s: 'z^{-k}', meaning: 'a delay of k samples; z^{-1} is one delay element' },
            { s: 'h[k]', meaning: 'coefficient multiplying that delayed copy' },
          ]}
          note="H(z) is a polynomial in z^{-1}: it has no poles except at z = 0, and no denominator — one line of proof that the FIR filter is always stable."
        />
      </Section>

      <Section kicker="Frequency response" title="Filter response: H(e^{jω}), magnitude and phase">
        <p>
          The <strong>frequency response</strong> is the transfer function evaluated on the unit circle of the
          z-plane, i.e. at <T>{'z = e^{j\\omega}'}</T> (steady-state response to sinusoids of normalised frequency{' '}
          <T>{'\\omega'}</T>, in radians/sample, with <T>{'\\omega = \\pi'}</T> corresponding to half the sampling
          rate):
        </p>
        <FormulaCard
          open
          title="Frequency response of the FIR filter"
          tex={'H(e^{j\\omega}) = \\sum_{k=0}^{N-1} h[k]\\, e^{-j\\omega k} = \\big| H(e^{j\\omega}) \\big| \\; e^{j\\phi(\\omega)}'}
          symbols={[
            { s: 'e^{-j\\omega k}', meaning: 'a complex sinusoid factor contributed by a delay of k samples (Euler: e^{jθ} = cos θ + j sin θ)' },
            { s: '\\omega', meaning: 'normalised angular frequency in rad/sample; −π … π (or 0 … π for plotting)' },
            { s: '|H(e^{j\\omega})|', meaning: 'magnitude response: how much a sinusoid of frequency ω is amplified or attenuated' },
            { s: '\\phi(\\omega)', meaning: 'phase response: the phase shift suffered by that sinusoid' },
          ]}
        />
        <p>
          The decomposition <T>{'H = |H|e^{j\\phi}'}</T> separates the two questions every filter designer asks:
          the <strong>magnitude response</strong> says <em>how loud</em> each frequency comes out; the{' '}
          <strong>phase response</strong> says <em>how late</em> each frequency comes out. For FIR filters the phase
          can be made <strong>exactly linear</strong> (Question 4 and 5), meaning all frequencies are delayed by
          the same constant number of samples and the signal shape is preserved.
        </p>

        <GraphCard
          title="Typical FIR low-pass magnitude response (real filter, linear scale)"
          caption="A practical FIR low-pass filter: flat-ish passband (gain ≈ 1 — frequencies survive), a finite transition band around the cutoff ωc, and a rippled stopband (gain ≈ 0 — frequencies suppressed). The ripples are the Gibbs/window effects of Questions 6 and 8."
        >
          <LinePlot
            data={lpfData}
            series={[{ key: 'mag', name: '|H(e^{jω})|', color: PLOT_COLORS.navy }]}
            xLabel="ω (rad/sample)"
            yLabel="|H|"
            xTicks={[0, PI / 4, PI / 2, (3 * PI) / 4, PI]}
            xTickLabels={{ 0: '0', [PI / 4]: 'π/4', [PI / 2]: 'π/2', [(3 * PI) / 4]: '3π/4', [PI]: 'π' }}
            refX={[0.45 * PI]}
            yDomain={[0, 1.2]}
          />
          <div className="mt-1 flex flex-wrap gap-4 text-[12px] font-semibold text-slate-500">
            <span>← left of ωc: <b className="text-navy-700">passband</b></span>
            <span>at ωc ≈ 0.45π: <b className="text-rose-600">cutoff / transition band</b></span>
            <span>right: <b className="text-navy-700">stopband</b></span>
          </div>
        </GraphCard>
      </Section>

      <Section kicker="The core of the answer" title="Important characteristics of the FIR filter">
        <DataTable
          caption="The characteristic properties — every one of them follows from ‘finite h[n], no feedback’"
          head={['#', 'Characteristic', 'Explanation']}
          rows={[
            ['1', <>Finite-duration impulse response</>, <><T>{'h[n]'}</T> is non-zero only for <T>{'0 \\le n \\le N-1'}</T>; a single impulse at the input produces at most N non-zero output samples.</>],
            ['2', <>Non-recursive structure</>, <>Output depends only on present and past <em>inputs</em>: <T>{'y[n]=\\sum h[k]x[n-k]'}</T>; no previous outputs are used.</>],
            ['3', <>No feedback</>, <>The structure has no path from output back to input — direct consequence of (2).</>],
            ['4', <>Guaranteed stability</>, <><T>{'\\sum |h[n]|'}</T> is a finite sum of finite numbers, hence always finite → the filter is always <strong>BIBO stable</strong> whenever the coefficients are finite. <T>{'H(z)'}</T> is a polynomial with no poles except at <T>{'z=0'}</T>.</>],
            ['5', <>Exact linear phase possible</>, <>Choosing symmetric or antisymmetric coefficients, <T>{'h[n] = \\pm h[N-1-n]'}</T>, gives a phase <T>{'\\phi(\\omega) = -\\omega (N-1)/2'}</T> — a pure, distortion-free delay (Questions 2, 4, 5).</>],
            ['6', <>No limit-cycle oscillations</>, <>Limit cycles are self-sustained oscillations caused by rounding inside a <em>feedback</em> loop. With no feedback, they cannot occur.</>],
            ['7', <>Robust to coefficient quantization</>, <>Rounding the coefficients slightly changes the response slightly; there is no pole that could jump outside the unit circle.</>],
            ['8', <>Higher order for sharp cutoffs</>, <>The frequency response is controlled only through N coefficients, so narrow transition bands need large N (unlike IIR).</>],
            ['9', <>More computation / memory</>, <>N multiplications and N−1 additions per sample plus N−1 stored samples — the price paid for points 4–7.</>],
            ['10', <>Flexible design</>, <>Multi-band and arbitrary magnitude shapes are easy; methods: Fourier series, window, frequency sampling, optimal equiripple (Question 7).</>],
          ]}
        />
      </Section>

      <Section kicker="Pros and cons" title="Advantages and limitations">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
            <div className="mb-2 text-[13px] font-extrabold uppercase tracking-wider text-emerald-700">Advantages</div>
            <ul>
              <li>Always stable (BIBO) for finite coefficients.</li>
              <li>Exactly linear phase → no phase/group-delay distortion.</li>
              <li>No feedback → no limit cycles; finite-precision friendly.</li>
              <li>Simple, regular structure — easy to implement, pipeline and test.</li>
              <li>Great design flexibility (arbitrary magnitude responses).</li>
            </ul>
          </div>
          <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4">
            <div className="mb-2 text-[13px] font-extrabold uppercase tracking-wider text-rose-700">Limitations</div>
            <ul>
              <li>Sharp transition bands demand high N → long filters.</li>
              <li>Higher arithmetic cost and memory than IIR for the same magnitude spec.</li>
              <li>Larger delay ≈ (N−1)/2 samples (latency grows with N).</li>
            </ul>
          </div>
        </div>
      </Section>

      <Callout type="warn" title="Common mistakes">
        <ul>
          <li>Writing <T>{'y[n]=\\sum h[k]x[n-k]'}</T> and calling it a “feedback equation” — it is the <em>opposite</em>: pure feed-forward convolution.</li>
          <li>Confusing <strong>filter order (N−1)</strong> with <strong>filter length (N taps)</strong>.</li>
          <li>Claiming “FIR has no poles”. It has <T>{'N-1'}</T> poles — all at <T>{'z=0'}</T>, which is why they can never cause instability. The safe statement: <em>no poles outside the origin</em>.</li>
          <li>Writing the transfer function with <T>{'z^{k}'}</T> (positive powers = <em>future</em> samples, non-causal) instead of <T>{'z^{-k}'}</T>.</li>
          <li>Forgetting to name the axes of the response sketch (|H| vertical, ω horizontal).</li>
        </ul>
      </Callout>

      <Callout type="tip" title="Exam tip">
        <p>
          Open with the definition + difference equation, draw the structure, then present the three formulas
          (difference equation → <T>{'H(z)'}</T> → <T>{'H(e^{j\\omega})'}</T>) as a neat chain, and close with the
          characteristics as a numbered list. That ordering alone covers every keyword in the marking scheme
          (“transfer function”, “filter response”, “characteristics”).
        </p>
      </Callout>

      <ExamAnswer>
        <p><b>Definition.</b> An FIR (Finite Impulse Response) filter is a digital filter whose impulse response h[n]
        is non-zero only for a finite number of samples, 0 ≤ n ≤ N−1. Its output is a weighted sum of the current
        and N−1 previous input samples, with no feedback — the filter is non-recursive.</p>
        <p><b>Difference equation.</b></p>
        <T block>{'y[n] = \\sum_{k=0}^{N-1} h[k]\\,x[n-k] = h[0]x[n] + h[1]x[n-1] + \\cdots + h[N-1]\\,x[n-N+1]'}</T>
        <p><b>Transfer function.</b> Taking the z-transform and using x[n−k] ↔ z⁻ᵏX(z):</p>
        <T block>{'H(z) = \\frac{Y(z)}{X(z)} = \\sum_{k=0}^{N-1} h[k]\\, z^{-k}'}</T>
        <p>H(z) is a polynomial in z⁻¹ with all its poles at z = 0 — hence the filter is inherently stable.</p>
        <p><b>Frequency response.</b> Evaluating on the unit circle <T>{'z = e^{j\\omega}'}</T>:</p>
        <T block>{'H(e^{j\\omega}) = \\sum_{k=0}^{N-1} h[k]\\,e^{-j\\omega k} = |H(e^{j\\omega})|\\,e^{j\\phi(\\omega)}'}</T>
        <p>[Draw: direct-form diagram (tapped delay line with multipliers h[k] into one adder) and a typical FIR
        low-pass magnitude response with passband, transition band and stopband labelled.]</p>
        <p><b>Characteristics:</b> (1) finite-duration impulse response; (2) non-recursive structure with no
        feedback; (3) always BIBO stable for finite coefficients, since Σ|h[n]| &lt; ∞; (4) exactly linear phase
        when h[n] = ±h[N−1−n], giving constant group delay (N−1)/2; (5) no limit-cycle oscillations (no feedback);
        (6) robust to coefficient quantization; (7) sharp transitions need high order N, i.e. more computation and
        memory than IIR; (8) great design flexibility — Fourier series, window, frequency-sampling and equiripple
        methods.</p>
        <p><b>Conclusion.</b> The FIR filter trades computation for guarantees: unconditional stability, exact
        linear phase and clean behaviour in finite-precision hardware — which is why it is the workhorse of DSP.</p>
      </ExamAnswer>

      <Section kicker="Quick revision" title="The whole question in 30 seconds" modes={['beginner', 'detailed']}>
        <ul>
          <li>FIR: <T>{'h[n]'}</T> lives only for <T>{'0 \\le n \\le N-1'}</T>.</li>
          <li><T>{'y[n]=\\sum_{k=0}^{N-1} h[k]x[n-k]'}</T> → <T>{'H(z)=\\sum h[k]z^{-k}'}</T> → <T>{'H(e^{j\\omega})=\\sum h[k]e^{-j\\omega k}'}</T>.</li>
          <li>No feedback ⇒ stable + no limit cycles; symmetric h[n] ⇒ exact linear phase.</li>
          <li>Cost: higher N than IIR for sharp responses.</li>
        </ul>
      </Section>

      <ConceptCheck
        items={[
          {
            q: 'Why is an FIR filter “always stable”?',
            a: <>BIBO stability needs <T>{'\\sum_n |h[n]| < \\infty'}</T>. For FIR this is a sum of finitely many finite coefficients, so it is always finite. Equivalently, <T>{'H(z)'}</T> has no poles except at the origin.</>,
          },
          {
            q: 'How do you get the frequency response from H(z)?',
            a: <>Substitute <T>{'z = e^{j\\omega}'}</T> (evaluate on the unit circle): <T>{'H(e^{j\\omega}) = \\sum_k h[k] e^{-j\\omega k}'}</T>, then split into magnitude <T>{'|H|'}</T> and phase <T>{'\\phi(\\omega)'}</T>.</>,
          },
          {
            q: 'What is the difference between filter length N and filter order?',
            a: <>Length = number of taps (coefficients). Order = highest delay used = N−1 for a causal N-tap FIR.</>,
          },
          {
            q: 'Which two FIR drawbacks does an IIR filter improve upon?',
            a: <>Filter order (IIR is sharp at low order) and therefore computation/memory per output sample.</>,
          },
        ]}
      />

      <PageFooter />
    </div>
  )
}

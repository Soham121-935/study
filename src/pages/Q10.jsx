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
import { GraphCard, LinePlot, StemPlot, PLOT_COLORS } from '../components/plots.jsx'
import { Q10, q10Series, linspace, PI } from '../lib/dsp.js'

const fmt = (v) => {
  if (Math.abs(v) < 0.00005) return '0'
  return v.toFixed(4)
}

export default function Q10Page() {
  const resp = useMemo(() => q10Series(512), [])
  const idealData = useMemo(
    () => linspace(0, PI, 361).map((w) => ({ w, ideal: Math.abs(w) <= PI / 2 ? 1 : 0 })),
    [],
  )

  return (
    <div>
      <QHeader
        q={10}
        title="Design of an Ideal Low-Pass Filter by the Fourier Series Method — h(n) and H(z) for N = 11"
        question="Design an ideal Low Pass Filter using Fourier Series method with a frequency response H(e^{jω}) = 1 for −π/2 ≤ ω ≤ π/2 and H(e^{jω}) = 0 for π/2 ≤ |ω| ≤ π. Find the values of h(n) and H(z) for N = 11."
        tags={['Full numerical', 'ωc = π/2', 'N = 11', 'h(n) & H(z)']}
      />
      <ModeNote />

      <WhatIsAsked>
        <p>
          A complete <strong>design numerical</strong>: starting only from the desired ideal low-pass response
          (cutoff <T>{'\\omega_c = \\pi/2'}</T>), derive the ideal impulse response by integration, truncate it to{' '}
          <strong>N = 11 taps</strong>, shift for causality, tabulate all eleven coefficients{' '}
          <T>{'h[0], \\dots, h[10]'}</T>, and assemble the transfer function <T>{'H(z)'}</T>. The symmetry of the
          result — and what it says about phase — is part of the marks.
        </p>
      </WhatIsAsked>

      <Prereqs
        items={[
          { label: 'The Fourier series method', to: '/q9' },
          { label: 'Inverse DTFT integral', to: '/q9' },
          { label: 'Symmetry → linear phase', to: '/q5' },
          { label: 'Gibbs check', to: '/q6' },
        ]}
      />

      <Section kicker="Learn this first" title="What an ideal low-pass filter is" modes={['beginner', 'detailed']}>
        <Callout type="simple">
          <p>
            Imagine a perfect gatekeeper at a nightclub of frequencies: every sine wave slower (lower) than the
            cutoff <T>{'\\omega_c = \\pi/2'}</T> walks in untouched; everything faster is turned away completely.
            That perfect, brick-wall selection is the “ideal” filter — impossible to build exactly, but the design
            starts from it.
          </p>
        </Callout>
        <FormulaCard
          open
          title="The given desired response"
          tex={'H_d(e^{j\\omega}) = \\begin{cases} 1, & |\\omega| \\le \\dfrac{\\pi}{2} \\\\[6pt] 0, & \\dfrac{\\pi}{2} < |\\omega| \\le \\pi \\end{cases}'}
          symbols={[
            { s: '\\omega_c = \\pi/2', meaning: 'cutoff frequency: the edge between passband and stopband (half of the maximum frequency π)' },
            { s: 'H_d', meaning: 'the DESIRED (ideal) response we want the finished filter to approximate' },
            { s: '|\\omega| \\le \\pi', meaning: 'frequency responses of discrete-time systems are 2π-periodic, so one period −π…π describes them completely' },
          ]}
        />
        <GraphCard
          title="The ideal response we are aiming for (magnitude, 0 ≤ ω ≤ π)"
          caption="Passband gain 1 up to ωc = π/2, then a vertical drop — the infamous discontinuity that makes the ideal impulse response infinitely long (and causes Gibbs ripple in the practical filter)."
        >
          <LinePlot
            data={idealData}
            series={[{ key: 'ideal', name: 'H_d', color: PLOT_COLORS.navy }]}
            xLabel="ω"
            yLabel="H_d"
            xTicks={[0, PI / 2, PI]}
            xTickLabels={{ 0: '0', [PI / 2]: 'ωc = π/2', [PI]: 'π' }}
            yDomain={[0, 1.2]}
            refX={[PI / 2]}
          />
        </GraphCard>
      </Section>

      <Section kicker="Step 1–2" title="Inverse DTFT: deriving the ideal impulse response h_d[n]">
        <Steps
          items={[
            {
              title: 'Write the inverse DTFT with the given H_d',
              math: 'h_d[n] = \\frac{1}{2\\pi}\\int_{-\\pi}^{\\pi} H_d(e^{j\\omega})\\,e^{j\\omega n}\\,d\\omega = \\frac{1}{2\\pi}\\int_{-\\pi/2}^{\\pi/2} e^{j\\omega n}\\,d\\omega',
              body: <p>Since <T>{'H_d = 0'}</T> outside <T>{'[-\\pi/2,\\, \\pi/2]'}</T>, only the passband interval remains in the integral.</p>,
            },
            {
              title: 'Evaluate the integral for n ≠ 0',
              math: 'h_d[n] = \\frac{1}{2\\pi}\\left[ \\frac{e^{j\\omega n}}{jn} \\right]_{-\\pi/2}^{\\pi/2} = \\frac{1}{2\\pi} \\cdot \\frac{e^{jn\\pi/2} - e^{-jn\\pi/2}}{jn}',
            },
            {
              title: 'Apply Euler: e^{jθ} − e^{−jθ} = 2j sin θ',
              math: '\\boxed{h_d[n] = \\frac{\\sin(\\pi n/2)}{\\pi n}, \\qquad n \\ne 0}',
            },
            {
              title: 'Treat n = 0 separately (integral of 1, or limit sin θ/θ → 1)',
              math: 'h_d[0] = \\frac{1}{2\\pi}\\int_{-\\pi/2}^{\\pi/2} 1\\,d\\omega = \\frac{1}{2\\pi}\\cdot \\pi = \\boxed{\\frac{1}{2}}',
              body: (
                <p>
                  Indeed <T>{'\\sin(\\pi n/2)/(\\pi n) \\to 1/2'}</T> as <T>{'n \\to 0'}</T>, so the formula is
                  continuous at the centre. General pattern to memorise: for cutoff{' '}
                  <T>{'\\omega_c'}</T>, <T>{'h_d[n] = \\sin(\\omega_c n)/(\\pi n)'}</T> and{' '}
                  <T>{'h_d[0] = \\omega_c/\\pi'}</T> — a <strong>sinc</strong> sequence, symmetric and infinitely long.
                </p>
              ),
            },
          ]}
        />
      </Section>

      <Section kicker="Step 3–4" title="Truncate to N = 11 and make it causal">
        <p>
          N = 11 means <strong>eleven taps</strong>. We keep the eleven central samples of the infinite sinc — the
          five on each side of the peak plus the peak itself — and shift them so the first tap lands at{' '}
          <T>{'n = 0'}</T>. The shift amount is the centre index
        </p>
        <FormulaCard
          open
          title="Centre index (causal shift) and the design rule"
          tex={'M = \\frac{N-1}{2} = \\frac{11-1}{2} = 5 \\qquad\\Longrightarrow\\qquad h[n] = h_d[n - M] = \\frac{\\sin\\!\\big(\\pi(n-5)/2\\big)}{\\pi\\,(n-5)}, \\quad n = 0,\\dots,10'}
          symbols={[
            { s: 'M = 5', meaning: 'the centre of the 11-tap window: tap 5 carries the peak 1/2' },
            { s: 'h_d[n-5]', meaning: 'the ideal response shifted right by 5 samples — now causal (taps 0…10)' },
            { s: 'n - 5 = m', meaning: 'the “centred index” m: it runs from −5 to +5 and tells you which sample of the ideal sinc each tap holds' },
          ]}
        />
        <Callout type="why" title="Why is h[n] = hd[n − 5] and not hd[n + 5]?">
          <p>
            We are <em>delaying</em> the ideal response — moving its peak from position 0 to position 5. A delay by
            5 samples replaces n by n−5: what ideal tap 5 shows is what the peak (<T>{'m = 0'}</T>) used to show.
            The built-in price is exactly the 5-sample constant delay proved in Question 5.
          </p>
        </Callout>
      </Section>

      <Section kicker="Step 5" title="Compute all eleven coefficients">
        <p>
          Work tap by tap with <T>{'m = n - 5'}</T>. The pattern of <T>{'\\sin(\\pi m/2)'}</T> over{' '}
          <T>{'m = \\pm1, \\pm2, \\pm3, \\pm4, \\pm5'}</T> is <T>{'\\pm 1,\\, 0,\\, \\mp 1,\\, 0,\\, \\pm 1'}</T> —
          which is why every <em>even-offset</em> tap is exactly zero.
        </p>
        <DataTable
          caption="The 11-tap design table — every coefficient verified"
          head={['Tap n', 'Centred index m = n−5', 'Computation h_d[m] = sin(πm/2)/(πm)', 'Exact value', 'Decimal']}
          rows={Q10.coeffs.map((c) => [
            <>{c.n}</>,
            <>{c.m}</>,
            c.m === 0
              ? <>limit → <T>{'\\omega_c/\\pi = 1/2'}</T></>
              : <T>{`\\dfrac{\\sin(\\pi\\,(${c.m})/2)}{\\pi (${c.m})}`}</T>,
            <T>{c.tex}</T>,
            <b className={Math.abs(c.value) < 0.00005 ? 'text-slate-400' : ''}>{fmt(c.value)}</b>,
          ])}
        />
        <GraphCard
          title="The designed impulse response — stem plot of the eleven coefficients"
          caption="Perfectly symmetric about tap 5 (dashed). The peak coefficient 0.5 sits at the centre; the alternating zeros come from sin(πm/2) = 0 at even m."
        >
          <StemPlot
            values={Q10.h}
            centerIndex={5}
            valueFmt={(v) => fmt(v)}
            title="h[n], N = 11, ωc = π/2"
          />
        </GraphCard>
      </Section>

      <Section kicker="Step 6" title="Assemble H(z)">
        <p>
          Substituting the coefficients into <T>{'H(z) = \\sum_{n=0}^{10} h[n]\\, z^{-n}'}</T> (all eleven terms
          written explicitly, including the zeros):
        </p>
        <T block>{'\\footnotesize H(z) = 0.0637 + 0\\,z^{-1} - 0.1061\\,z^{-2} + 0\\,z^{-3} + 0.3183\\,z^{-4} + 0.5\\,z^{-5} + 0.3183\\,z^{-6} + 0\\,z^{-7} - 0.1061\\,z^{-8} + 0\\,z^{-9} + 0.0637\\,z^{-10}'}</T>
        <p>…and in tidy exact form:</p>
        <FormulaCard
          open
          title="The transfer function of the designed 11-tap low-pass filter"
          tex={'\\boxed{H(z) = \\frac{1}{5\\pi} - \\frac{1}{3\\pi}z^{-2} + \\frac{1}{\\pi}z^{-4} + \\frac{1}{2}z^{-5} + \\frac{1}{\\pi}z^{-6} - \\frac{1}{3\\pi}z^{-8} + \\frac{1}{5\\pi}z^{-10}}'}
          symbols={[
            { s: '\\frac{1}{2}z^{-5}', meaning: 'the centre-tap term — the biggest coefficient (0.5) at the middle delay' },
            { s: 'z^{-2}, z^{-4}, \\dots', meaning: 'only EVEN powers of z⁻¹ appear beside the centre term, because the odd-offset coefficients are zero' },
            { s: '\\frac{1}{5\\pi}, \\frac{1}{3\\pi}, \\frac{1}{\\pi}', meaning: 'the samples of the ideal sinc at m = ±5, ±3, ±1' },
          ]}
        />
      </Section>

      <Section kicker="Step 7" title="Verify symmetry — and what it buys us">
        <p>Compare taps from both ends:</p>
        <T block>{'h[0]=h[10],\\; h[1]=h[9],\\; h[2]=h[8],\\; h[3]=h[7],\\; h[4]=h[6] \\qquad\\Longrightarrow\\qquad \\boxed{h[n] = h[10-n]}'}</T>
        <p>
          The filter is a <strong>linear-phase FIR</strong> (Question 5), with frequency response{' '}
          <T>{'H(e^{j\\omega}) = e^{-j5\\omega} A(\\omega)'}</T> where the real amplitude is
        </p>
        <T block>{'A(\\omega) = \\frac{1}{2} + \\frac{2}{\\pi}\\cos\\omega - \\frac{2}{3\\pi}\\cos 3\\omega + \\frac{2}{5\\pi}\\cos 5\\omega'}</T>
        <p>
          Hence phase <T>{'\\phi(\\omega) = -5\\omega'}</T> and constant phase/group delays{' '}
          <T>{'\\tau_p = \\tau_g = 5'}</T> samples. (Beautiful detail: <T>{'A(\\omega)'}</T> is exactly the
          truncated cosine Fourier series of the ideal square-edged response — the Gibbs story of Question 6
          returns, as the ripples below confirm.)
        </p>
        <GraphCard
          title="The designed filter vs the ideal — |H(e^{jω})| of the 11-tap FIR"
          caption="The designed response hugs the ideal, with the classic Gibbs overshoot (~9%) beside the edge and a stopband floor near −21 dB — inevitable with a rectangular truncation. A Hamming window (Question 8) would smooth the ripple at the cost of a wider edge."
        >
          <LinePlot
            data={resp}
            series={[
              { key: 'ideal', name: 'Ideal H_d', color: '#64748b', dashed: true, width: 1.8 },
              { key: 'designed', name: 'Designed |H|, N = 11', color: PLOT_COLORS.navy, width: 2.4 },
            ]}
            showLegend
            xLabel="ω"
            yLabel="|H|"
            xTicks={[0, PI / 2, PI]}
            xTickLabels={{ 0: '0', [PI / 2]: 'ωc = π/2', [PI]: 'π' }}
            yDomain={[0, 1.25]}
            refX={[PI / 2]}
            refY={[1]}
          />
        </GraphCard>
      </Section>

      <Callout type="good" title="FINAL ANSWER — box this in your exam booklet">
        <ul className="!text-[14px]">
          <li><b>Filter length:</b> N = 11 taps; <b>cutoff:</b> <T>{'\\omega_c = \\pi/2'}</T>; <b>centre:</b> M = (N−1)/2 = 5.</li>
          <li><b>Ideal response:</b> <T>{'h_d[n] = \\sin(\\pi n/2)/(\\pi n)'}</T>, <T>{'h_d[0] = 1/2'}</T>.</li>
          <li>
            <b>Coefficients (exact / decimal):</b>
            <div className="tex-scroll mt-1">
              <T block>{'\\begin{aligned} h[0] &= h[10] = \\;\\;\\frac{1}{5\\pi} \\approx \\;\\;0.0637, \\\\ h[1] &= h[9] = \\;\\;0, \\\\ h[2] &= h[8] = -\\frac{1}{3\\pi} \\approx -0.1061, \\\\ h[3] &= h[7] = \\;\\;0, \\\\ h[4] &= h[6] = \\;\\;\\frac{1}{\\pi} \\approx \\;\\;0.3183, \\\\ h[5] &= \\;\\;\\frac{1}{2} = \\;\\;0.5 \\end{aligned}'}</T>
            </div>
          </li>
          <li>
            <b>Transfer function:</b>
            <T block>{'H(z) = \\frac{1}{5\\pi} - \\frac{1}{3\\pi}z^{-2} + \\frac{1}{\\pi}z^{-4} + \\frac{1}{2}z^{-5} + \\frac{1}{\\pi}z^{-6} - \\frac{1}{3\\pi}z^{-8} + \\frac{1}{5\\pi}z^{-10}'}</T>
          </li>
          <li><b>Symmetry:</b> <T>{'h[n] = h[10-n]'}</T> ⇒ exact linear phase <T>{'\\phi(\\omega) = -5\\omega'}</T>, constant delays <T>{'\\tau_p = \\tau_g = 5'}</T> samples.</li>
        </ul>
      </Callout>

      <Callout type="warn" title="Common mistakes">
        <ul>
          <li>Using the unspecialised value <T>{'h[0] = \\omega_c/\\pi'}</T> at the wrong end — here the peak <T>{'1/2'}</T> belongs to tap <T>{'n = 5'}</T>, not tap 0.</li>
          <li>Off-by-one indexing: with N = 11 the taps are n = 0…10 and m runs −5…+5. Writing m = n − 6 or n − 4.5 corrupts everything.</li>
          <li>Dropping the negative signs at m = ±3 (sin(3π/2) = −1) — sign errors break the symmetry and the whole frequency response.</li>
          <li>Forgetting <T>{'h[5] = \\tfrac12'}</T> cannot come from the <T>{'n \\ne 0'}</T> formula — it needs the separate evaluation (or the limit).</li>
          <li>Writing <T>{'H(z)'}</T> with the smallest coefficient as the first term <em>without</em> assigning it to <T>{'m = \\pm5'}</T> — order matters: it is the <em>outermost</em> tap.</li>
        </ul>
      </Callout>

      <Callout type="tip" title="Exam tip">
        <p>
          The fastest correct path in the exam: (1) quote the general LPF result{' '}
          <T>{'h_d[n] = \\sin(\\omega_c n)/(\\pi n)'}</T> with one line of integral derivation; (2) build the
          five-column table (<T>{'n,\\; m,\\; \\sin(\\pi m/2)/(\\pi m),'}</T> exact, decimal) — tables mark
          themselves; (3) write H(z) from the table; (4) close with symmetry + 5-sample delay. Rechecking the two
          outermost taps (<T>{'\\pm 1/(5\\pi)'}</T>) catches 90% of arithmetic slips.
        </p>
      </Callout>

      <ExamAnswer>
        <p><b>Given:</b> ideal LPF, H<sub>d</sub>(<T>{'e^{j\\omega}'}</T>) = 1 for |ω| ≤ π/2, 0 for π/2 &lt; |ω| ≤ π; design for
        N = 11 using the Fourier series method.</p>
        <p><b>Step 1 — ideal impulse response.</b></p>
        <T block>{'h_d[n] = \\frac{1}{2\\pi}\\int_{-\\pi/2}^{\\pi/2} e^{j\\omega n} d\\omega = \\frac{e^{jn\\pi/2} - e^{-jn\\pi/2}}{2j\\,\\pi n} = \\frac{\\sin(\\pi n/2)}{\\pi n} \\; (n \\ne 0), \\qquad h_d[0] = \\frac{1}{2}'}</T>
        <p><b>Step 2 — truncate and shift.</b> Centre M = (N−1)/2 = 5. Coefficients: h[n] = h<sub>d</sub>[n−5],
        n = 0, 1, …, 10, so centred index m = n−5 runs from −5 to +5.</p>
        <p><b>Step 3 — coefficient table</b> [insert the 11-row table: n, m, sin(πm/2)/(πm), exact, decimal]:</p>
        <T block>{'\\left[\\tfrac{1}{5\\pi},\\; 0,\\; -\\tfrac{1}{3\\pi},\\; 0,\\; \\tfrac{1}{\\pi},\\; \\tfrac{1}{2},\\; \\tfrac{1}{\\pi},\\; 0,\\; -\\tfrac{1}{3\\pi},\\; 0,\\; \\tfrac{1}{5\\pi}\\right] \\approx [0.0637,\\; 0,\\; -0.1061,\\; 0,\\; 0.3183,\\; 0.5,\\; 0.3183,\\; 0,\\; -0.1061,\\; 0,\\; 0.0637]'}</T>
        <p><b>Step 4 — transfer function.</b></p>
        <T block>{'H(z) = \\frac{1}{5\\pi} - \\frac{1}{3\\pi}z^{-2} + \\frac{1}{\\pi}z^{-4} + \\frac{1}{2}z^{-5} + \\frac{1}{\\pi}z^{-6} - \\frac{1}{3\\pi}z^{-8} + \\frac{1}{5\\pi}z^{-10}'}</T>
        <p><b>Step 5 — observations.</b> h[n] = h[10−n]: symmetric ⇒ linear phase φ(ω) = −5ω, so phase and group
        delays are constant at 5 samples. Magnitude shows the expected Gibbs overshoot (≈ 9%) at ω<sub>c</sub> =
        π/2 and a ≈ −21 dB stopband from rectangular truncation; windowing would trade edge sharpness for ripple
        reduction. [Sketch: stem plot of h[n]; |H(<T>{'e^{j\\omega}'}</T>)| vs ideal.]</p>
      </ExamAnswer>

      <Section kicker="Quick revision" title="The whole question in 30 seconds" modes={['beginner', 'detailed']}>
        <ul>
          <li><T>{'h_d[n] = \\sin(\\pi n/2)/(\\pi n)'}</T>; <T>{'h_d[0] = 1/2'}</T>; shift M = 5 → <T>{'h[n] = h_d[n-5]'}</T>.</li>
          <li>Taps: <T>{'[\\tfrac{1}{5\\pi}, 0, -\\tfrac{1}{3\\pi}, 0, \\tfrac{1}{\\pi}, \\tfrac12, \\tfrac{1}{\\pi}, 0, -\\tfrac{1}{3\\pi}, 0, \\tfrac{1}{5\\pi}]'}</T>.</li>
          <li>Symmetric → linear phase → 5-sample constant delay; Gibbs ripple at the edge.</li>
        </ul>
      </Section>

      <ConceptCheck
        items={[
          {
            q: 'Why are taps h[1], h[3], h[7], h[9] exactly zero — not just small?',
            a: <>Their centred indices are m = ±2, ±4, where <T>{'\\sin(\\pi m/2) = \\sin(\\pm\\pi), \\sin(\\pm 2\\pi) = 0'}</T> exactly. The sinc happens to cross zero at every even offset for ω<sub>c</sub> = π/2.</>,
          },
          {
            q: 'Without recomputing, what is the group delay of this filter?',
            a: <>(N−1)/2 = 5 samples, because the truncated, shifted response is symmetric about tap 5 (Question 5's theorem).</>,
          },
          {
            q: 'How would the table change if N were 15 instead of 11?',
            a: <>M becomes 7, m runs −7…+7, adding the next sinc samples h_d[±6] = 0 and h_d[±7] = −1/(7π) ≈ −0.0455 as the new outer taps; existing taps keep their centred values.</>,
          },
          {
            q: 'The student writes H(z) starting “0.5 + 0.3183z⁻¹…”. What is wrong?',
            a: <>The peak belongs to the CENTRE tap after the causal shift: it must multiply <T>{'z^{-5}'}</T>. Starting with it uncritically means the student drew the non-causal (unshifted) response.</>,
          },
        ]}
      />

      <PageFooter />
    </div>
  )
}

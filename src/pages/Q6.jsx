import React, { useMemo } from 'react'
import T from '../components/TeX.jsx'
import {
  QHeader,
  WhatIsAsked,
  Section,
  Callout,
  FormulaCard,
  Steps,
  ConceptCheck,
  ExamAnswer,
  PageFooter,
  ModeNote,
  Prereqs,
} from '../components/ui.jsx'
import { GraphCard, LinePlot, PLOT_COLORS } from '../components/plots.jsx'
import { linspace, magSeries, truncatedLpf, PI } from '../lib/dsp.js'

export default function Q6() {
  const gibbsData = useMemo(() => {
    const ws = linspace(0, PI, 512)
    const h11 = truncatedLpf(11, PI / 2)
    const h41 = truncatedLpf(41, PI / 2)
    const h101 = truncatedLpf(101, PI / 2)
    const d = (h, w) => {
      let re = 0, im = 0
      h.forEach((v, k) => { re += v * Math.cos(w * k); im -= v * Math.sin(w * k) })
      return Math.hypot(re, im)
    }
    return ws.map((w) => ({
      w,
      ideal: w <= PI / 2 ? 1 : 0,
      n11: d(h11, w),
      n41: d(h41, w),
      n101: d(h101, w),
    }))
  }, [])

  return (
    <div>
      <QHeader
        q={6}
        title="Gibbs Phenomenon — Ringing and Overshoot near a Discontinuity"
        question="Write a brief note on Gibbs phenomenon."
        tags={['Gibbs', 'Overshoot ~9%', 'Truncation', 'Fourier series']}
      />
      <ModeNote />

      <WhatIsAsked>
        <p>
          A “brief note” question: define the Gibbs phenomenon, explain <strong>why</strong> it occurs (Fourier
          series of a discontinuous function / abrupt truncation of an ideal impulse response), state its
          <strong>effects</strong> (overshoot ≈ 9%, ringing/ripple, 21&nbsp;dB stopband floor for a rectangular
          window), explain why <strong>increasing N does not remove it</strong>, and finish with the
          <strong>remedy</strong> (smooth window tapering) plus its relevance to FIR filter design.
        </p>
      </WhatIsAsked>

      <Prereqs
        items={[
          { label: 'Frequency response', to: '/q1' },
          { label: 'Ideal filter shape', to: '/zero' },
          { label: 'Convolution', to: '/zero' },
        ]}
      />

      <Section kicker="Learn this first" title="Four facts that make Gibbs obvious" modes={['beginner', 'detailed']}>
        <ol>
          <li>
            <strong>Fourier series.</strong> Any periodic signal/function can be built from a sum of sinusoids
            (harmonics). A smooth curve needs few harmonics; a curve with corners or jumps needs <em>infinitely
            many</em>.
          </li>
          <li>
            <strong>Discontinuity.</strong> An ideal filter's frequency response jumps vertically at the cutoff{' '}
            <T>{'\\omega_c'}</T> — from 1 to 0 in zero distance. Such a jump is a <strong>discontinuity</strong>,
            and approximating a jump with a <em>finite</em> number of smooth sine curves is fundamentally impossible
            at the jump point.
          </li>
          <li>
            <strong>Truncation.</strong> An ideal filter's impulse response <T>{'h_d[n]'}</T> is infinitely long
            (its slow sinc decay mirrors the infinitely sharp edge). Any real FIR filter must <strong>truncate</strong>{' '}
            it to N samples — and truncation is exactly “keeping a finite number of Fourier terms”.
          </li>
          <li>
            <strong>Therefore:</strong> whenever you truncate to design a practical filter, a predictable
            overshoot/ringing error appears near the cutoff edge. That error is the Gibbs phenomenon.
          </li>
        </ol>
      </Section>

      <Section kicker="Definition" title="What the Gibbs phenomenon is">
        <Callout type="info" title="Definition (learn this wording)">
          <p>
            The <strong>Gibbs phenomenon</strong> is the oscillatory overshoot and undershoot (ringing) that
            appears near a discontinuity when a discontinuous function is approximated by a truncated Fourier sum.
            In FIR filter design it appears as <strong>ripples in the passband and stopband</strong> and a
            characteristic <strong>overshoot of about 9% of the discontinuity height</strong> just beside the
            cutoff edge — no matter how many terms (taps) are kept.
          </p>
        </Callout>
        <p>
          For the ideal low-pass filter, truncating <T>{'h_d[n]'}</T> to N samples with a rectangular window is
          time-domain multiplication by a rectangle; in the frequency domain this convolves the ideal response
          with the window's spectrum (the <em>Dirichlet kernel</em>), which has a central lobe and decaying side
          lobes. Sliding that lobe structure across the ideal step creates the ripples seen below.
        </p>

        <GraphCard
          title="Gibbs phenomenon in an FIR low-pass filter — ideal vs truncated (rectangular window), cutoff ωc = π/2"
          caption="Compare N = 11, 41, 101: more taps squeeze the oscillations closer to the edge, but the overshoot just beside the jump stays ≈ 1.09 (about 9% above the ideal level) — the height does NOT shrink with N."
        >
          <LinePlot
            data={gibbsData}
            series={[
              { key: 'ideal', name: 'Ideal H_d', color: PLOT_COLORS.slate || '#64748b', dashed: true, width: 1.8 },
              { key: 'n11', name: 'N = 11', color: PLOT_COLORS.rose },
              { key: 'n41', name: 'N = 41', color: PLOT_COLORS.amber },
              { key: 'n101', name: 'N = 101', color: PLOT_COLORS.teal },
            ]}
            showLegend
            xLabel="ω"
            yLabel="|H|"
            xTicks={[0, PI / 2, PI]}
            xTickLabels={{ 0: '0', [PI / 2]: 'ωc = π/2', [PI]: 'π' }}
            yDomain={[0, 1.25]}
            refY={[1.09]}
            refX={[PI / 2]}
          />
        </GraphCard>
      </Section>

      <Section kicker="Properties" title="Overshoot, undershoot, ripple — and the magic 9%">
        <Steps
          items={[
            {
              title: 'Overshoot and undershoot',
              body: (
                <p>
                  On each side of the jump the truncated response shoots past the target: about{' '}
                  <strong>+9% above the top</strong> and <strong>−9% below the step</strong> (about 8.95% of the
                  jump height, from the sinc integral / sine-integral maximum), followed by decaying oscillations.
                </p>
              ),
            },
            {
              title: 'Ripple in passband and stopband',
              body: (
                <p>
                  Away from the edge the response settles into equi-rippled behaviour; the ripples in passband and
                  stopband are equal in size for a rectangular window. The first (largest) stopband lobe sits about{' '}
                  <strong>21 dB below</strong> the passband — the famous 21 dB floor of rectangular truncation.
                </p>
              ),
            },
            {
              title: 'Relation to the Fourier series',
              body: (
                <p>
                  The N coefficients of a rectangularly truncated filter <em>are</em> the first N Fourier-series
                  coefficients of the desired periodic response <T>{'H_d(e^{j\\omega})'}</T>. So FIR truncation
                  and the classic Gibbs effect of Fourier series are literally the same phenomenon in two
                  disguises.
                </p>
              ),
            },
            {
              title: 'Effect of increasing N',
              body: (
                <p>
                  Raising N packs more oscillations into a narrower zone around the edge (better “area” fit,
                  transition width ~ 4π/N shrinks), <strong>but the peak overshoot stays ≈ 9%</strong>. Increasing
                  N narrows the error; it does <em>not</em> reduce its height. This surprises most students — and
                  is the examiner's favourite sub-point.
                </p>
              ),
            },
            {
              title: 'How window functions help',
              body: (
                <p>
                  The 9% comes from the rectangle's <em>abrupt</em> cut (its spectrum side lobes). Tapered
                  windows — Hann, Hamming, Blackman (Question 8) — gently roll the coefficients to zero, killing
                  the side lobes: ripple drops from −21 dB to −44, −53 or even −74 dB, at the price of a wider
                  transition band.
                </p>
              ),
            },
          ]}
        />
      </Section>

      <Section kicker="Structured summary" title="Definition → cause → effect → cure → relevance">
        <div className="grid gap-3 md:grid-cols-2">
          {[
            ['Definition', 'Overshoot/ripple near a discontinuity of a Fourier-truncated approximation; peak overshoot ≈ 9% (8.95%) of the jump.'],
            ['Cause', 'An ideal edge needs infinitely many harmonics; truncating hd[n] (rectangular window) keeps only N, convolving the ideal response with the Dirichlet kernel.'],
            ['Effects', '≈ 9% overshoot & undershoot at edges; passband/stopband ripple; stopband only ≈ −21 dB; transition width ≈ 4π/N.'],
            ['Reduction', 'Use tapered windows (Hann/Hamming/Blackman) — ripple falls to −44/−53/−74 dB while the transition band widens (Question 8).'],
            ['N-dependence', 'More taps → oscillations compress toward the edge; overshoot height unchanged ≈ 9%.'],
            ['FIR relevance', 'It is the central design trade-off of the window/Fourier-series methods (Questions 7–10): choose N for transition width, choose the window for ripple.'],
          ].map(([t, d]) => (
            <div key={t} className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
              <div className="text-[13px] font-extrabold uppercase tracking-wider text-navy-700">{t}</div>
              <p className="mt-1 text-[13.5px] leading-6 text-slate-600">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Callout type="warn" title="Common mistakes">
        <ul>
          <li>Saying “increase N to remove Gibbs overshoot” — overshoot stays ≈ 9%; only its <em>width</em> shrinks.</li>
          <li>Confusing ripple <em>size</em> (set by window type) with transition <em>width</em> (set mainly by N).</li>
          <li>Quoting 9% of the <em>passband gain</em> wrongly — it is ≈ 9% of the <em>discontinuity height</em>.</li>
          <li>Calling the rectangular window's 21 dB a design choice — it is a hard floor fixed by its side lobes.</li>
        </ul>
      </Callout>

      <Callout type="tip" title="Exam tip">
        <p>
          Always include the diagram: ideal step + rippled truncated response with the ≈ 9% overshoot marked
          across the discontinuity. A correct sketch plus the four lines “cause — effect — N independent — cure:
          windows” is a guaranteed full-mark brief note.
        </p>
      </Callout>

      <ExamAnswer>
        <p><b>Definition.</b> The Gibbs phenomenon is the oscillatory overshoot and undershoot (ringing) that
        occurs near a discontinuity when a discontinuous periodic function is represented by a truncated Fourier
        series. In FIR design it appears because the ideal impulse response h<sub>d</sub>[n] — infinitely long
        since it corresponds to a brick-wall frequency response — must be truncated to N samples to make a
        realisable filter.</p>
        <p><b>Cause.</b> Truncation = multiplication by a rectangular window in the time domain = convolution, in
        the frequency domain, of the ideal response H<sub>d</sub>(<T>{'e^{j\\omega}'}</T>) with the window's
        Dirichlet-kernel spectrum (main lobe + side lobes). As this kernel slides across the ideal jump, its lobes
        produce local maxima and minima — passband/stopband ripple.</p>
        <p><b>Effects.</b> (i) Peak overshoot ≈ 9% (8.95%) of the discontinuity height on both sides of the edge;
        (ii) decaying ripple through passband and stopband, with the largest stopband lobe ≈ −21 dB for a
        rectangular window; (iii) a finite transition band of width ≈ 4π/N.</p>
        <p><b>Effect of N.</b> Increasing N compresses the ringing toward the edge but does NOT reduce the
        overshoot height, which stays ≈ 9%. So Gibbs error cannot be removed by a longer filter.</p>
        <p><b>Reduction.</b> Tapering the truncation with a smooth window (Hann, Hamming, Blackman, …) suppresses
        the side lobes: ripple falls to roughly −44 dB (Hann), −53 dB (Hamming) or −74 dB (Blackman), at the cost
        of a wider transition band (8π/N, 12π/N).</p>
        <p><b>Relevance to FIR design.</b> Gibbs phenomenon sets the fundamental trade-off of the Fourier-series
        and window design methods: N controls the transition width, the window shape controls the ripple. [Sketch:
        ideal brick-wall LPF vs truncated response with ≈ 9% overshoot marked.]</p>
      </ExamAnswer>

      <Section kicker="Quick revision" title="The whole question in 30 seconds" modes={['beginner', 'detailed']}>
        <ul>
          <li>Truncated Fourier sum near a jump ⇒ ringing + overshoot ≈ 9% of the jump — that's Gibbs.</li>
          <li>Rectangular truncation: ripple floor ≈ −21 dB; transition ≈ 4π/N.</li>
          <li>Bigger N: narrower ringing, same 9%; windows (tapered) are the cure.</li>
        </ul>
      </Section>

      <ConceptCheck
        items={[
          {
            q: 'Why does the Gibbs overshoot occur at all — physically?',
            a: <>A jump contains arbitrarily high frequencies. Keeping only N Fourier terms omits them; near the jump the missing high-frequency content shows up as oscillation and a fixed proportional overshoot of ≈ 9%.</>,
          },
          {
            q: 'You double the filter length N. What exactly improves and what does not?',
            a: <>The transition band halves (width ∝ 1/N) and ringing squeezes toward the edge; the overshoot height (≈ 9%) and stopband floor (≈ −21 dB, rectangular) stay the same.</>,
          },
          {
            q: 'Which specification would make you switch from a rectangular to a Blackman window?',
            a: <>A large stopband-attenuation requirement (≈ 74 dB) — Blackman crushes the side lobes, accepting a transition band about 12π/N wide.</>,
          },
          {
            q: 'Gibbs phenomenon is about truncating WHICH infinite object in filter design?',
            a: <>The ideal impulse response <T>{'h_d[n]'}</T> — infinitely long <em>because</em> the desired frequency response has a discontinuity (brick-wall edge).</>,
          },
        ]}
      />

      <PageFooter />
    </div>
  )
}

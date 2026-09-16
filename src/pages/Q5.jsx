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
import { GraphCard, LinePlot, StemPlot, PLOT_COLORS } from '../components/plots.jsx'
import { linspace, PI } from '../lib/dsp.js'

const ALL = ['beginner', 'detailed', 'exam']

export default function Q5() {
  const { phaseData, delayData } = useMemo(() => {
    const ws = linspace(0, PI, 241)
    return {
      phaseData: ws.map((w) => ({ w, phase: -5 * w })),
      delayData: ws.map((w) => ({ w, tau: 5 })),
    }
  }, [])

  return (
    <div>
      <QHeader
        q={5}
        title="Linear-Phase FIR Filter for N = 11 — Phase and Group Delays are Constant (Proof)"
        question="Determine the frequency response of FIR Filter defined by the transfer function for N = 11 and prove that the phase and group delays are constant."
        tags={['Proof', 'Linear phase', 'Symmetric FIR', 'Group delay']}
      />
      <ModeNote />

      <WhatIsAsked>
        <p>
          This is the <strong>standard linear-phase FIR theorem</strong> specialised to filter length N = 11.
          You must (1) write the frequency response of an 11-tap FIR filter, (2) use the symmetry condition{' '}
          <T>{'h[n] = h[N-1-n]'}</T> to factor it as a pure delay times a real function, (3) extract the phase,
          and (4) prove that both phase delay and group delay equal the constant{' '}
          <T>{'(N-1)/2 = 5'}</T> samples for every frequency.
        </p>
        <p className="mt-2 text-[13px] italic text-slate-500">
          A note on interpretation (being precise, as good engineers are): the phrase “defined by the transfer
          function for N = 11” does not give concrete coefficients, so no specific magnitude can be computed —
          what can be, and must be, proved is the <em>structural</em> result that holds for <strong>any</strong>{' '}
          symmetric 11-tap filter. That is the standard textbook interpretation of this exam question, and it is
          what we prove below.
        </p>
      </WhatIsAsked>

      <Prereqs
        items={[
          { label: 'Symmetric FIR filters', to: '/q2' },
          { label: 'Phase & group delay', to: '/q4' },
          { label: 'Euler’s formula', to: '/zero' },
        ]}
      />

      <Section kicker="Learn this first" title="The three notions you must hold in your head" modes={['beginner', 'detailed']}>
        <ul>
          <li>
            <strong>What N means.</strong> N is the number of taps (coefficients). An <strong>11-tap FIR
            filter</strong> has coefficients <T>{'h[0], h[1], \\dots, h[10]'}</T>, ten delay blocks, and order 10.
          </li>
          <li>
            <strong>What a linear-phase FIR filter is.</strong> One whose phase response is a straight line{' '}
            <T>{'\\phi(\\omega) = a\\omega + b'}</T> — the output is a pure time-shift of the input (plus at most a
            constant offset). This is achieved <em>exactly</em>, for free, by making the coefficients symmetric.
          </li>
          <li>
            <strong>Why symmetry matters.</strong> Symmetry makes the coefficients on both sides of the centre
            equal in pairs. In the frequency domain each pair combines into a cosine (via Euler's formula), and
            every cosine is a <em>real</em> number — leaving a single exponential factor whose angle is a pure
            linear term. The proof below is this sentence written in algebra.
          </li>
        </ul>
        <GraphCard title="The idea: an 11-tap symmetric filter mirrors about tap 5" caption="Example coefficient shape. Whatever the values, symmetry h[k] = h[10−k] about the centre α = 5 is all the proof needs.">
          <StemPlot values={[0.3, 0.42, 0.55, 0.7, 0.86, 1, 0.86, 0.7, 0.55, 0.42, 0.3]} centerIndex={5} title="symmetric h[n]:  h[k] = h[10−k]  (N = 11)" />
        </GraphCard>
      </Section>

      <Section kicker="The setup" title="Frequency response of the 11-tap filter">
        <p>
          Start from the FIR frequency response formula with N = 11:
        </p>
        <T block>{'H(e^{j\\omega}) = \\sum_{k=0}^{10} h[k]\\, e^{-j\\omega k}'}</T>
        <p>
          Impose the <strong>symmetric (linear-phase) condition</strong>:
        </p>
        <FormulaCard
          open
          title="Given symmetry condition and the centre of symmetry"
          tex={'h[k] = h[N-1-k] = h[10-k], \\qquad \\alpha = \\frac{N-1}{2} = \\frac{11-1}{2} = 5'}
          symbols={[
            { s: 'h[10-k]', meaning: 'the mirror partner of tap k, counting from the far end' },
            { s: '\\alpha = 5', meaning: 'the centre tap — the axis about which the coefficients mirror; it will become the delay' },
          ]}
        />
      </Section>

      <Section kicker="The proof" title="Factor out e^{−j5ω} — deriving the linear phase">
        <Steps
          items={[
            {
              title: 'Split the sum into pairs + the centre tap',
              math: 'H(e^{j\\omega}) = \\sum_{k=0}^{4}\\Big[ h[k]e^{-j\\omega k} + h[10-k]e^{-j\\omega(10-k)} \\Big] + h[5]e^{-j5\\omega}',
              body: (
                <p>
                  Taps 0 and 10 are partners, 1 and 9, … 4 and 6; tap 5 is exactly on the centre of symmetry and
                  has no partner.
                </p>
              ),
            },
            {
              title: 'Use the symmetry h[10 − k] = h[k]',
              math: 'H(e^{j\\omega}) = \\sum_{k=0}^{4} h[k]\\Big( e^{-j\\omega k} + e^{-j\\omega(10-k)} \\Big) + h[5]e^{-j5\\omega}',
            },
            {
              title: 'Factor e^{−j5ω} out of every term',
              math: 'e^{-j\\omega k} + e^{-j\\omega(10-k)} = e^{-j5\\omega}\\Big( e^{+j\\omega(5-k)} + e^{-j\\omega(5-k)} \\Big)',
              body: (
                <p>
                  Check the exponents: <T>{'-j5\\omega + j\\omega(5-k) = -j\\omega k'}</T> ✓ and{' '}
                  <T>{'-j5\\omega - j\\omega(5-k) = -j\\omega(10-k)'}</T> ✓. The centre tap term already contains{' '}
                  <T>{'e^{-j5\\omega}'}</T>.
                </p>
              ),
            },
            {
              title: 'Apply Euler: e^{jθ} + e^{−jθ} = 2cos θ',
              math: '\\boxed{H(e^{j\\omega}) = e^{-j5\\omega} \\underbrace{\\Bigg[ h[5] + \\sum_{k=0}^{4} 2h[k]\\cos\\big(\\omega(5-k)\\big) \\Bigg]}_{A(\\omega) \\;\\text{— purely REAL}} = e^{-j\\omega\\frac{N-1}{2}}\\,A(\\omega)}',
              body: (
                <p>
                  <T>{'A(\\omega)'}</T> contains only real coefficients and real cosines — it is a real
                  (zero-phase) amplitude function. All the phase sits in the exponential.
                </p>
              ),
            },
            {
              title: 'Read the phase straight off the exponential',
              math: '\\phi(\\omega) = -\\omega\\frac{N-1}{2} = -5\\,\\omega',
              body: (
                <p>
                  (Up to possible <T>{'\\pi'}</T> jumps where <T>{'A(\\omega)'}</T> changes sign, which does not
                  affect the delay values.) The phase is a straight line through the origin with slope −5.
                </p>
              ),
            },
          ]}
        />
        <Callout type="why" title="Why does pairing the taps kill all non-linear phase?">
          <p>
            A general FIR sum mixes sine and cosine terms into a complicated angle that must be found with{' '}
            <T>{'\\tan^{-1}'}</T>. Symmetry pairs each <T>{'e^{-j\\omega k}'}</T> with its mirror{' '}
            <T>{'e^{-j\\omega(10-k)}'}</T>, and Euler's identity collapses every pair into a cosine — a real
            number. Real numbers carry no phase. The only complex factor left, <T>{'e^{-j5\\omega}'}</T>, is the
            textbook definition of a 5-sample delay.
          </p>
        </Callout>
      </Section>

      <Section kicker="Applying the definitions" title="Phase delay and group delay — the constants">
        <FormulaCard
          open
          title="Applying the two definitions to φ(ω) = −5ω"
          tex={'\\tau_p = -\\frac{\\phi(\\omega)}{\\omega} = \\frac{N-1}{2} = 5 \\qquad\\qquad \\tau_g = -\\frac{d\\phi(\\omega)}{d\\omega} = \\frac{N-1}{2} = 5'}
          symbols={[
            { s: '\\tau_p = 5', meaning: 'phase delay: every individual sinusoid emerges 5 samples late' },
            { s: '\\tau_g = 5', meaning: 'group delay: any envelope/group of frequencies also emerges 5 samples late' },
            { s: '\\dfrac{N-1}{2}', meaning: 'the general rule: delay = centre of symmetry, in samples' },
          ]}
          note="At ω = 0 the phase-delay ratio is 0/0; its limit as ω → 0 is 5, so the constant value holds everywhere (L’Hôpital / continuity)."
        />
        <p>
          <strong>Why are both constant?</strong> Because constant delay is precisely what a straight-line phase
          <em>means</em>: for <T>{'\\phi(\\omega) = -\\alpha\\omega'}</T>, both <T>{'-\\phi/\\omega = \\alpha'}</T>{' '}
          and <T>{'-d\\phi/d\\omega = \\alpha'}</T> are the same constant <T>{'\\alpha'}</T> for every{' '}
          <T>{'\\omega'}</T>. Symmetry forced the line; the line forces the constants. Q.E.D.
        </p>

        <GraphCard
          title="Phase response: φ(ω) = −5ω — a straight line with slope −5"
          caption="Linear phase from ω = 0 to π. The line slope −(N−1)/2 = −5 is the only shape a symmetric 11-tap FIR phase can have."
        >
          <LinePlot
            data={phaseData}
            series={[{ key: 'phase', name: 'φ(ω) = −5ω', color: PLOT_COLORS.violet }]}
            xLabel="ω"
            yLabel="φ (rad)"
            xTicks={[0, PI / 2, PI]}
            xTickLabels={{ 0: '0', [PI / 2]: 'π/2', [PI]: 'π' }}
            yDomain={[-16.5, 1]}
          />
        </GraphCard>
        <GraphCard
          title="Phase delay and group delay: τp(ω) = τg(ω) = 5 samples for all ω"
          caption="Flat lines — the graphical statement of the theorem. Any change of the delay with frequency would mean group-delay distortion; symmetry forbids it."
        >
          <LinePlot
            data={delayData}
            series={[{ key: 'tau', name: 'τp = τg = 5', color: PLOT_COLORS.teal }]}
            xLabel="ω"
            yLabel="delay (samples)"
            xTicks={[0, PI / 2, PI]}
            xTickLabels={{ 0: '0', [PI / 2]: 'π/2', [PI]: 'π' }}
            yDomain={[0, 8]}
            refY={[5]}
          />
        </GraphCard>
      </Section>

      <Callout type="info" title="The general theorem this proves" modes={ALL}>
        <p>
          For <strong>any</strong> symmetric FIR filter of length N:{' '}
          <T>{'H(e^{j\\omega}) = e^{-j\\omega(N-1)/2} A(\\omega)'}</T> with real{' '}
          <T>{'A(\\omega)'}</T>, and hence <T>{'\\tau_p = \\tau_g = (N-1)/2'}</T> samples — independent of both
          frequency and the actual coefficient values. For antisymmetric filters the same delay appears, with an
          extra constant <T>{'\\pi/2'}</T> phase offset (Question 2). Knowing this single box answers almost every
          “delay” question in the unit.
        </p>
      </Callout>

      <Callout type="warn" title="Common mistakes">
        <ul>
          <li>Trying to prove the result <em>without</em> the symmetry condition — it is essential; a general (non-symmetric) 11-tap filter does <strong>not</strong> have constant delays.</li>
          <li>Miscounting the centre: for N = 11 the centre is tap index 5 (the 6th coefficient), since indices run 0…10.</li>
          <li>Differentiating incorrectly: <T>{'-d(-5\\omega)/d\\omega = +5'}</T>, not −5 or 0.</li>
          <li>Writing <T>{'\\tau_p = (N+1)/2'}</T> — the formula is <T>{'(N-1)/2'}</T>.</li>
          <li>Forgetting the unit “samples” (or writing 5 seconds).</li>
        </ul>
      </Callout>

      <Callout type="tip" title="Exam tip">
        <p>
          Structure the proof exactly as the five steps above: split into pairs → use symmetry → factor{' '}
          <T>{'e^{-j5\\omega}'}</T> → Euler → read phase. Examiners award one mark per algebraic milestone, and
          the boxed <T>{'H = e^{-j5\\omega}A(\\omega)'}</T> line is the centrepiece. Finish with the sentence:
          “hence τ<sub>p</sub> = τ<sub>g</sub> = (N−1)/2 = 5 samples, constant for all ω”.
        </p>
      </Callout>

      <ExamAnswer>
        <p><b>Setup.</b> An FIR filter of length N = 11 has frequency response</p>
        <T block>{'H(e^{j\\omega}) = \\sum_{k=0}^{10} h[k]\\,e^{-j\\omega k}'}</T>
        <p>Assume the linear-phase (symmetry) condition h[k] = h[N−1−k] = h[10−k].</p>
        <p><b>Derivation.</b> Group mirrored taps and the centre tap:</p>
        <T block>{'H(e^{j\\omega}) = \\sum_{k=0}^{4} h[k]\\big(e^{-j\\omega k} + e^{-j\\omega(10-k)}\\big) + h[5]e^{-j5\\omega}'}</T>
          <p>Factor out <T>{'e^{-j5\\omega}'}</T> from each pair:</p>
        <T block>{'e^{-j\\omega k} + e^{-j\\omega(10-k)} = e^{-j5\\omega}\\big(e^{j\\omega(5-k)} + e^{-j\\omega(5-k)}\\big) = 2e^{-j5\\omega}\\cos\\big(\\omega(5-k)\\big)'}</T>
        <p>Therefore</p>
        <T block>{'H(e^{j\\omega}) = e^{-j5\\omega}\\Big[h[5] + 2\\sum_{k=0}^{4} h[k]\\cos\\big(\\omega(5-k)\\big)\\Big] = e^{-j\\omega\\frac{N-1}{2}} A(\\omega)'}</T>
        <p>where A(ω) is purely real. Hence the phase response is the straight line</p>
        <T block>{'\\phi(\\omega) = -\\omega\\frac{N-1}{2} = -5\\omega'}</T>
        <p><b>Phase delay:</b> τ<sub>p</sub> = −φ(ω)/ω = (N−1)/2 = 5 samples. <b>Group delay:</b>{' '}
        τ<sub>g</sub> = −dφ(ω)/dω = (N−1)/2 = 5 samples.</p>
        <p><b>Conclusion.</b> Both delays equal the constant 5 samples for every frequency, because the phase is
        linear — exactly the delay of the centre tap α = 5. Hence a symmetric N = 11 FIR filter delays the
        complete signal by 5 samples with zero phase/group-delay distortion. ∎</p>
      </ExamAnswer>

      <Section kicker="Quick revision" title="The whole question in 30 seconds" modes={['beginner', 'detailed']}>
        <ul>
          <li>Symmetric pairs + Euler ⇒ <T>{'H = e^{-j\\omega\\alpha} A(\\omega)'}</T>, <T>{'A'}</T> real.</li>
          <li><T>{'\\phi = -\\omega\\alpha'}</T>, <T>{'\\alpha = (N-1)/2 = 5'}</T> for N = 11.</li>
          <li><T>{'\\tau_p = -\\phi/\\omega = \\alpha'}</T>; <T>{'\\tau_g = -\\phi^{\\prime} = \\alpha'}</T> — both constant.</li>
        </ul>
      </Section>

      <ConceptCheck
        items={[
          {
            q: 'What is the one assumption on h[n] without which this entire proof collapses?',
            a: <>Symmetry: <T>{'h[k] = h[10-k]'}</T>. Without it, pairs do not collapse into real cosines and the phase is generally non-linear (delays vary with frequency).</>,
          },
          {
            q: 'For N = 11, which tap is the centre of symmetry and why does the delay equal its index?',
            a: <>Tap 5 (the 6th coefficient). The factored exponential is <T>{'e^{-j5\\omega}'}</T> — in the time domain a factor <T>{'e^{-j\\omega\\alpha}'}</T> IS a shift by <T>{'\\alpha'}</T> samples, so <T>{'\\tau = \\alpha = 5'}</T>.</>,
          },
          {
            q: 'The real function A(ω) goes negative over some band. What happens to φ(ω) there?',
            a: <>It picks up a step of ±π (a negative number = positive one times <T>{'e^{\\pm j\\pi}'}</T>). The <em>slope</em> of the phase — hence both delays — is unchanged, so τ<sub>p</sub> = τ<sub>g</sub> = 5 still holds.</>,
          },
          {
            q: 'If a filter has N = 7 symmetric taps, what are τp and τg?',
            a: <>Both equal (N−1)/2 = 3 samples — the question's pattern works for any symmetric length.</>,
          },
        ]}
      />

      <PageFooter />
    </div>
  )
}

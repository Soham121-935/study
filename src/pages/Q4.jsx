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
import { linspace, PI } from '../lib/dsp.js'

const ALL_CENTERED = ['beginner', 'detailed', 'exam']

export default function Q4() {
  const { magData, phaseData, delayData } = useMemo(() => {
    const ws = linspace(0, PI, 241)
    return {
      magData: ws.map((w) => ({ w, mag: 1 + 0.5 * Math.cos(w) })),
      phaseData: ws.map((w) => ({ w, phase: -w })),
      delayData: ws.map((w) => ({ w, tau: 1 })),
    }
  }, [])

  return (
    <div>
      <QHeader
        q={4}
        title="Frequency Response, Phase Delay and Group Delay of y(n) = 0.25x(n) + x(n−1) + 0.25x(n−2)"
        question="Determine the frequency response of FIR Filter defined by y(n) = 0.25x(n) + x(n-1) + 0.25x(n-2). Calculate the phase delay and group delay."
        tags={['Numerical', 'Frequency response', 'Phase delay', 'Group delay']}
      />
      <ModeNote />

      <WhatIsAsked>
        <p>
          A 3-tap FIR filter is given as a <strong>difference equation</strong>. You must (1) convert it to{' '}
          <T>{'H(z)'}</T>, (2) evaluate it at <T>{'z = e^{j\\omega}'}</T> to obtain the frequency response and
          split it into magnitude and phase, then (3) apply the definitions of <strong>phase delay</strong> and{' '}
          <strong>group delay</strong> and show that both come out constant (1 sample) — the signature of a
          linear-phase filter.
        </p>
      </WhatIsAsked>

      <Prereqs
        items={[
          { label: 'Difference equation → H(z)', to: '/q1' },
          { label: 'Symmetry & linear phase', to: '/q2' },
          { label: 'Euler’s formula', to: '/zero' },
        ]}
      />

      {/* ------------------------------------------------------- */}
      <Section kicker="Learn this first" title="The six ideas this question combines" modes={['beginner', 'detailed']}>
        <ol>
          <li>
            <strong>What is the frequency response?</strong> Feed the filter a sinusoid
            <T>{'e^{j\\omega n}'}</T>. The output is the same sinusoid, scaled and rotated by a complex number
            that depends only on <T>{'\\omega'}</T>: <T>{'y[n] = H(e^{j\\omega})\\, e^{j\\omega n}'}</T>. That
            scaling/rotation factor <em>is</em> the frequency response.
          </li>
          <li>
            <strong>How do we get H(z) from a difference equation?</strong> Take the z-transform of every term.
            The time-shift property says a delay of k samples multiplies the transform by <T>{'z^{-k}'}</T>:{' '}
            <T>{'x[n-k] \\leftrightarrow z^{-k}X(z)'}</T>. Then <T>{'H(z) = Y(z)/X(z)'}</T>.
          </li>
          <li>
            <strong>How do we go from H(z) to the frequency response?</strong> Substitute{' '}
            <T>{'z = e^{j\\omega}'}</T> — i.e. evaluate <T>{'H(z)'}</T> on the unit circle of the z-plane:{' '}
            <T>{'H(e^{j\\omega}) = H(z)\\big|_{z = e^{j\\omega}}'}</T>.
          </li>
          <li>
            <strong>What is phase?</strong> Write the complex response as
            <T>{'H(e^{j\\omega}) = |H(e^{j\\omega})|\\, e^{j\\phi(\\omega)}'}</T>. The angle
            <T>{'\\phi(\\omega)'}</T> is the <strong>phase response</strong> — it says by how many radians each
            sinusoid is shifted.
          </li>
          <li>
            <strong>What is phase delay?</strong> Ask: “a sinusoid of frequency <T>{'\\omega'}</T> that acquires a
            phase shift <T>{'\\phi'}</T> — how many samples late is it?” Since a phase of <T>{'\\phi'}</T> at
            frequency <T>{'\\omega'}</T> corresponds to a time shift of <T>{'-\\phi/\\omega'}</T> samples:
            <T block>{'\\tau_p(\\omega) = -\\frac{\\phi(\\omega)}{\\omega}'}</T>
          </li>
          <li>
            <strong>What is group delay?</strong> A real signal is a <em>group</em> of nearby frequencies
            (a carrier plus its envelope). Their common delay is measured by the <em>slope</em> of the phase
            curve, not its value:
            <T block>{'\\tau_g(\\omega) = -\\frac{d\\phi(\\omega)}{d\\omega}'}</T>
          </li>
        </ol>
        <Callout type="simple">
          <p>
            <strong>Phase delay</strong> = how many samples late one particular sine wave arrives.{' '}
            <strong>Group delay</strong> = how many samples late the overall “shape” (envelope) of a real signal
            arrives. When the phase is a straight line, the two answers coincide — and that is exactly what will
            happen here.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------- */}
      <Section kicker="Step-by-step solution" title="From the difference equation to H(e^{jω})">
        <Steps
          items={[
            {
              title: 'Write the given difference equation',
              math: 'y[n] = 0.25\\,x[n] + x[n-1] + 0.25\\,x[n-2]',
              body: <p>Coefficients: <T>{'h[0] = 0.25,\\; h[1] = 1,\\; h[2] = 0.25'}</T> (N = 3 taps).</p>,
            },
            {
              title: 'Z-transform both sides using x[n−k] ↔ z⁻ᵏX(z)',
              math: 'Y(z) = 0.25\\,X(z) + z^{-1}X(z) + 0.25\\,z^{-2}X(z)',
            },
            {
              title: 'Divide by X(z) — the transfer function',
              math: 'H(z) = \\frac{Y(z)}{X(z)} = 0.25 + z^{-1} + 0.25\\,z^{-2}',
            },
            {
              title: 'Put z = e^{jω} — the frequency response',
              math: 'H(e^{j\\omega}) = 0.25 + e^{-j\\omega} + 0.25\\,e^{-j2\\omega}',
            },
          ]}
        />
      </Section>

      <Section kicker="The key algebra" title="Factor out e^{−jω} to expose the linear phase">
        <p>
          The coefficients are symmetric (<T>{'h[0] = h[2]'}</T>), so we factor out the exponential belonging to
          the <strong>centre tap</strong> <T>{'\\alpha = (N-1)/2 = 1'}</T>, i.e. <T>{'e^{-j\\omega}'}</T>. That is
          the single move that makes the phase appear “for free”.
        </p>
        <Steps
          items={[
            {
              title: 'Factor e^{−jω} out of all three terms',
              math: 'H(e^{j\\omega}) = e^{-j\\omega}\\Big(0.25\\,e^{+j\\omega} + 1 + 0.25\\,e^{-j\\omega}\\Big)',
              body: (
                <p>
                  Check: <T>{'e^{-j\\omega}\\cdot 0.25\\,e^{+j\\omega} = 0.25'}</T> ✓,{' '}
                  <T>{'e^{-j\\omega}\\cdot e^{-j\\omega} = e^{-j2\\omega}'}</T> ✓. Nothing changed — only grouped.
                </p>
              ),
            },
            {
              title: 'Pair the two complex exponentials',
              math: 'H(e^{j\\omega}) = e^{-j\\omega}\\Big(1 + 0.25\\underbrace{\\big(e^{j\\omega} + e^{-j\\omega}\\big)}_{=\\,2\\cos\\omega}\\Big)',
              body: (
                <p>
                  Euler’s formula: <T>{'\\cos\\omega = \\dfrac{e^{j\\omega} + e^{-j\\omega}}{2}'}</T>, so the
                  bracket becomes real.
                </p>
              ),
            },
            {
              title: 'The factored frequency response',
              math: '\\boxed{H(e^{j\\omega}) = e^{-j\\omega}\\big(1 + 0.5\\cos\\omega\\big)}',
            },
          ]}
        />
        <Callout type="why" title="Why factor out the centre-tap exponential?">
          <p>
            A symmetric FIR filter is a sum of symmetric pairs <T>{'h[k]\\,(e^{-j\\omega k} + e^{-j\\omega(N-1-k)})'}</T>.
            Factoring <T>{'e^{-j\\omega (N-1)/2}'}</T> turns each pair into a cosine via Euler’s formula. What
            remains is a <em>real</em> amplitude function multiplied by a pure-delay exponential — magnitude and
            phase then separate instantly, with no awkward <T>{'\\tan^{-1}'}</T> computations.
          </p>
        </Callout>
      </Section>

      <Section kicker="Magnitude & phase" title="Read off magnitude and phase">
        <p>
          Since <T>{'1 + 0.5\\cos\\omega'}</T> is real and <strong>always positive</strong> — its minimum value is
          <T>{'1 - 0.5 = 0.5 > 0'}</T> at <T>{'\\omega = \\pi'}</T> — it contributes zero phase. Therefore:
        </p>
        <FormulaCard
          open
          title="Magnitude and phase response"
          tex={'\\big|H(e^{j\\omega})\\big| = 1 + 0.5\\cos\\omega \\qquad\\qquad \\phi(\\omega) = -\\omega'}
          symbols={[
            { s: '1 + 0.5\\cos\\omega', meaning: 'real, positive amplitude factor: the gain faced by frequency ω (1.5 at ω = 0, 1.0 at ω = π/2, 0.5 at ω = π — a gentle low-pass behaviour)' },
            { s: '-\\omega', meaning: 'phase contributed by e^{-jω}: a perfectly straight line — LINEAR PHASE' },
          ]}
        />
        <GraphCard
          title="Magnitude response |H(e^{jω})| = 1 + 0.5 cos ω"
          caption="A mild low-pass characteristic: DC (ω = 0) passes with gain 1.5, the highest frequency (ω = π) is attenuated to 0.5."
        >
          <LinePlot
            data={magData}
            series={[{ key: 'mag', name: '1 + 0.5 cos ω', color: PLOT_COLORS.navy }]}
            xLabel="ω"
            yLabel="|H|"
            xTicks={[0, PI / 2, PI]}
            xTickLabels={{ 0: '0', [PI / 2]: 'π/2', [PI]: 'π' }}
            yDomain={[0, 1.7]}
          />
        </GraphCard>
        <GraphCard
          title="Phase response φ(ω) = −ω (radians)"
          caption="A straight line with slope −1 passing through the origin — the visual definition of linear phase. For a linear-phase FIR filter every frequency is delayed by the same number of samples."
        >
          <LinePlot
            data={phaseData}
            series={[{ key: 'phase', name: 'φ(ω) = −ω', color: PLOT_COLORS.violet }]}
            xLabel="ω"
            yLabel="φ (rad)"
            xTicks={[0, PI / 2, PI]}
            xTickLabels={{ 0: '0', [PI / 2]: 'π/2', [PI]: 'π' }}
            yDomain={[-3.5, 0.4]}
          />
        </GraphCard>
      </Section>

      <Section kicker="The asked quantities" title="Phase delay and group delay">
        <Steps
          items={[
            {
              title: 'Apply the phase-delay definition',
              math: '\\tau_p(\\omega) = -\\frac{\\phi(\\omega)}{\\omega} = -\\frac{(-\\omega)}{\\omega} = 1',
              body: (
                <p>
                  <strong>Every</strong> sinusoidal component — regardless of its frequency — is delayed by
                  exactly <strong>1 sample</strong>.
                </p>
              ),
            },
            {
              title: 'Apply the group-delay definition',
              math: '\\tau_g(\\omega) = -\\frac{d\\phi(\\omega)}{d\\omega} = -\\frac{d(-\\omega)}{d\\omega} = 1',
              body: (
                <p>
                  The envelope of any narrowband group of frequencies is also delayed by exactly{' '}
                  <strong>1 sample</strong> — equal to the centre-tap position <T>{'\\alpha = (N-1)/2 = 1'}</T>.
                </p>
              ),
            },
          ]}
        />
        <GraphCard title="Phase delay and group delay are constant: τp(ω) = τg(ω) = 1 sample">
          <LinePlot
            data={delayData}
            series={[{ key: 'tau', name: 'τp = τg = 1', color: PLOT_COLORS.teal }]}
            xLabel="ω"
            yLabel="delay (samples)"
            xTicks={[0, PI / 2, PI]}
            xTickLabels={{ 0: '0', [PI / 2]: 'π/2', [PI]: 'π' }}
            yDomain={[0, 2]}
            refY={[1]}
          />
        </GraphCard>
      </Section>

      <Callout type="info" title="Important observation — why the delays came out constant" modes={ALL_CENTERED}>
        <p>
          The coefficients <T>{'[0.25,\\,1,\\,0.25]'}</T> are <strong>symmetric</strong> about the centre tap. That
          single fact forced the phase to be the straight line <T>{'\\phi(\\omega) = -\\omega\\,(N-1)/2'}</T> (here{' '}
          <T>{'-\\omega'}</T>). For <em>any</em> straight-line phase, both <T>{'-\\phi/\\omega'}</T> and{' '}
          <T>{'-d\\phi/d\\omega'}</T> equal the constant slope <T>{'(N-1)/2'}</T> — so phase delay and group delay
          are frequency-independent. <strong>This is the general theorem for every linear-phase FIR filter</strong>;
          Question 5 proves it for an arbitrary symmetric filter of length N = 11.
        </p>
      </Callout>

      <Callout type="warn" title="Common mistakes">
        <ul>
          <li>Dropping the minus sign in <T>{'\\tau_p = -\\phi/\\omega'}</T> and reporting a delay of −1 sample (a “delay” that predicts the future!).</li>
          <li>Computing phase as <T>{'\\tan^{-1}(\\text{Im}/\\text{Re})'}</T> of the unfactored sum when the factored form gives the answer instantly.</li>
          <li>Claiming <T>{'\\tau_p \\ne \\tau_g'}</T> here — for a <em>linear</em> phase they are always equal.</li>
          <li>Reporting delays “in seconds”. These are normalised quantities: the unit is <em>samples</em> (multiply by the sampling period <T>{'T_s'}</T> if seconds are requested).</li>
        </ul>
      </Callout>

      <Callout type="tip" title="Exam tip">
        <p>
          The factorisation <T>{'e^{-j\\omega(N-1)/2}'}</T> is worth most of the marks in any linear-phase
          numerical. Practise it until “symmetric coefficients → factor centre exponential → Euler →
          magnitude/phase → delays = (N−1)/2” is one reflex. And always end by stating the unit: samples.
        </p>
      </Callout>

      <ExamAnswer>
        <p><b>Given:</b> y(n) = 0.25x(n) + x(n−1) + 0.25x(n−2) — a 3-tap FIR filter with coefficients
        [0.25, 1, 0.25].</p>
        <p><b>Transfer function.</b> Taking the z-transform (x[n−k] ↔ z⁻ᵏX(z)):</p>
        <T block>{'H(z) = 0.25 + z^{-1} + 0.25\\,z^{-2}'}</T>
        <p><b>Frequency response.</b> Putting <T>{'z = e^{j\\omega}'}</T> and factoring out the centre-tap exponential <T>{'e^{-j\\omega}'}</T>:</p>
        <T block>{'H(e^{j\\omega}) = 0.25 + e^{-j\\omega} + 0.25 e^{-j2\\omega} = e^{-j\\omega}\\big(0.25e^{j\\omega} + 1 + 0.25e^{-j\\omega}\\big)'}</T>
        <p>Using Euler's identity <T>{'e^{j\\omega} + e^{-j\\omega} = 2\\cos\\omega'}</T>:</p>
        <T block>{'H(e^{j\\omega}) = e^{-j\\omega}\\big(1 + 0.5\\cos\\omega\\big)'}</T>
        <p>Since 1 + 0.5cos ω ≥ 0.5 &gt; 0 (real and positive), it carries no phase. Hence:</p>
        <T block>{'|H(e^{j\\omega})| = 1 + 0.5\\cos\\omega, \\qquad \\phi(\\omega) = -\\omega'}</T>
        <p><b>Phase delay:</b></p>
        <T block>{'\\tau_p(\\omega) = -\\frac{\\phi(\\omega)}{\\omega} = -\\frac{-\\omega}{\\omega} = \\boxed{1 \\text{ sample}}'}</T>
        <p><b>Group delay:</b></p>
        <T block>{'\\tau_g(\\omega) = -\\frac{d\\phi(\\omega)}{d\\omega} = \\boxed{1 \\text{ sample}}'}</T>
        <p><b>Conclusion.</b> Coefficients are symmetric → phase is linear → both delays are constant and equal to
        the centre-tap position (N−1)/2 = 1 sample: the filter delays every component by exactly one sample
        without phase distortion. [Sketch |H| = 1 + 0.5cos ω and the straight-line phase φ = −ω.]</p>
      </ExamAnswer>

      <Section kicker="Quick revision" title="The whole question in 30 seconds" modes={['beginner', 'detailed']}>
        <ul>
          <li>Difference eq → <T>{'H(z) = 0.25 + z^{-1} + 0.25z^{-2}'}</T> → <T>{'H(e^{j\\omega})'}</T> via <T>{'z=e^{j\\omega}'}</T>.</li>
          <li>Factor <T>{'e^{-j\\omega}'}</T>, use Euler → <T>{'e^{-j\\omega}(1+0.5\\cos\\omega)'}</T>.</li>
          <li><T>{'|H| = 1 + 0.5\\cos\\omega'}</T>, <T>{'\\phi = -\\omega'}</T>, so <T>{'\\tau_p = \\tau_g = 1'}</T> sample.</li>
        </ul>
      </Section>

      <ConceptCheck
        items={[
          {
            q: 'Why could we “read off” the phase without any tan⁻¹ evaluation?',
            a: <>Because after factoring, the bracket <T>{'1 + 0.5\\cos\\omega'}</T> is purely real (and positive), so all the phase lives in the exponential <T>{'e^{-j\\omega}'}</T> whose angle is simply <T>{'-\\omega'}</T>.</>,
          },
          {
            q: 'What would happen to the phase if the bracket became negative for some ω?',
            a: <>A negative real factor contributes a phase jump of ±π at those frequencies (we write the bracket as its magnitude and add π to the phase). Here the minimum is 0.5 &gt; 0, so no π-jumps occur.</>,
          },
          {
            q: 'Phase delay and group delay are both 1. In words, what does the filter do to an input song?',
            a: <>It outputs the same song shifted exactly one sample later (plus mild low-pass smoothing of the treble). No part of the music arrives earlier or later than any other — zero phase distortion.</>,
          },
          {
            q: 'For an FIR filter with delays τp = τg = (N−1)/2, what coefficient condition must hold?',
            a: <>Symmetry (or antisymmetry): <T>{'h[n] = \\pm h[N-1-n]'}</T> — the necessary and sufficient condition for exact linear phase.</>,
          },
        ]}
      />

      <PageFooter />
    </div>
  )
}

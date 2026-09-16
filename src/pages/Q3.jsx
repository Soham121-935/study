import React from 'react'
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
import { FIRStructure, Figure } from '../components/diagrams.jsx'
import { StemPlot, GraphCard } from '../components/plots.jsx'

export default function Q3() {
  return (
    <div>
      <QHeader
        q={3}
        title="Transfer Function of the FIR Filter with h(n) = [2, 1, 1, 2]"
        question="Write the Transfer function of the FIR Filter for impulse response h(n) = [2, 1, 1, 2]"
        tags={['Impulse response', 'H(z)', '4-tap filter', 'Symmetry check']}
      />
      <ModeNote />

      <WhatIsAsked>
        <p>
          You are given the four coefficients of an FIR filter and must write its system function{' '}
          <T>{'H(z)'}</T> by direct substitution into the FIR transfer-function formula. It is a small numerical
          question — but the examiner also expects you to identify the coefficients with their positions{' '}
          <em>and</em> to notice the symmetry that guarantees linear phase.
        </p>
      </WhatIsAsked>

      <Prereqs
        items={[
          { label: 'What is h[n]?' },
          { label: 'H(z) formula', to: '/q1' },
          { label: 'Delay = z⁻¹', to: '/structure' },
        ]}
      />

      <Section kicker="Learn this first" title="What “impulse response h(n) = [2, 1, 1, 2]” actually means" modes={['beginner', 'detailed']}>
        <Callout type="simple">
          <p>
            Clap once at the input. The filter answers with the numbers 2, then 1, then 1, then 2 — and then
            silence forever. Those four numbers <em>are</em> complete knowledge of the filter; the list notation
            [2, 1, 1, 2] is just the impulse response written as a sequence, starting at position n = 0.
          </p>
        </Callout>
        <p>
          By convention the first number in the bracket corresponds to <T>{'n = 0'}</T>. So:
        </p>
        <T block>{'h[0] = 2, \\qquad h[1] = 1, \\qquad h[2] = 1, \\qquad h[3] = 2, \\qquad h[n] = 0 \\;\\; \\text{for all other } n'}</T>
        <p>
          The filter has <strong>N = 4 taps</strong> (length 4, order N−1 = 3): it remembers the current input
          sample plus three past samples.
        </p>
        <GraphCard title="The given impulse response" caption="Each stem is one coefficient = one multiplier gain in the block diagram.">
          <StemPlot values={[2, 1, 1, 2]} valueFmt={(v) => v.toFixed(0)} title="h[n] = [2, 1, 1, 2]" centerIndex={1.5} />
        </GraphCard>
      </Section>

      <Section kicker="Important formula" title="The tool you need — repeat it from memory">
        <FormulaCard
          open
          title="FIR transfer function"
          tex={'H(z) = \\sum_{n=0}^{N-1} h[n]\\, z^{-n}'}
          symbols={[
            { s: 'H(z)', meaning: 'transfer function = Y(z)/X(z)' },
            { s: 'h[n]', meaning: 'coefficient at position n' },
            { s: 'z^{-n}', meaning: 'delay of n samples attached to that coefficient’s tap' },
            { s: 'N', meaning: 'number of taps — here N = 4' },
          ]}
        />
      </Section>

      <Section kicker="Step-by-step solution" title="Substitute — every step written out">
        <Steps
          items={[
            {
              title: 'Write the general formula for N = 4',
              math: 'H(z) = \\sum_{n=0}^{3} h[n]\\, z^{-n} = h[0]z^{0} + h[1]z^{-1} + h[2]z^{-2} + h[3]z^{-3}',
            },
            {
              title: 'Substitute the four coefficient values',
              math: 'H(z) = (2)\\,z^{0} + (1)\\,z^{-1} + (1)\\,z^{-2} + (2)\\,z^{-3}',
            },
            {
              title: 'Simplify (z⁰ = 1)',
              math: '\\boxed{H(z) = 2 + z^{-1} + z^{-2} + 2z^{-3}}',
              body: (
                <p>
                  Equivalently, <T>{'H(z) = \\dfrac{2z^{3} + z^{2} + z + 2}{z^{3}}'}</T> — a polynomial with three
                  poles at <T>{'z = 0'}</T> (all inside/on the origin → stable, as always for FIR).
                </p>
              ),
            },
          ]}
        />
        <Callout type="why" title="Why does h[0] get z⁰ and h[1] get z⁻¹?">
          <p>
            Coefficient <T>{'h[k]'}</T> sits on the tap that has passed through exactly <strong>k delay
            elements</strong>, so it multiplies the sample <T>{'x[n-k]'}</T>. In the z-domain a delay of k samples
            is the factor <T>{'z^{-k}'}</T>. Tap 0 has <em>no</em> delay → <T>{'z^{0} = 1'}</T>; tap 1 has one
            delay → <T>{'z^{-1}'}</T>; and so on. The exponent of z literally counts the delay blocks in front of
            that multiplier.
          </p>
        </Callout>
      </Section>

      <Section kicker="Check for linear phase" title="Look again: the coefficients are symmetric">
        <p>
          Compare positions from both ends of the sequence:
        </p>
        <T block>{'h[0] = 2 = h[3], \\qquad\\qquad h[1] = 1 = h[2] \\qquad\\Longrightarrow\\qquad h[n] = h[3-n] = h[N-1-n]'}</T>
        <p>
          The impulse response is <strong>symmetric</strong> about its centre{' '}
          <T>{'\\alpha = (N-1)/2 = 1.5'}</T>. Therefore this filter has <strong>linear phase</strong>, and its
          group delay equals <T>{'\\alpha = 1.5'}</T> samples (the technique that proves this is Question 5).
        </p>
      </Section>

      <Section kicker="The structure" title="The corresponding 4-tap FIR block diagram">
        <Figure
          title="Direct-form realisation of H(z) = 2 + z⁻¹ + z⁻² + 2z⁻³"
          caption="Four taps, three delay blocks. The multiplier gains are exactly the numbers in h(n) = [2, 1, 1, 2]. Because 1 and 1 (and 2 and 2) repeat, the two middle taps could share a multiplier and the two outer taps another one — the symmetry saving of Question 2."
        >
          <FIRStructure
            labels={['2', '1', '1', '2']}
            nodeLabels={['x[n]', 'x[n−1]', 'x[n−2]', 'x[n−3]']}
            ellipsis={false}
          />
        </Figure>
        <p>
          Reading the diagram gives back the same answer:{' '}
          <T>{'y[n] = 2x[n] + x[n-1] + x[n-2] + 2x[n-3]'}</T>, whose z-transform ratio{' '}
          <T>{'Y(z)/X(z)'}</T> is precisely <T>{'2 + z^{-1} + z^{-2} + 2z^{-3}'}</T>.
        </p>
      </Section>

      <Callout type="info" title="Bonus — the frequency response, in one line">
        <p>
          Setting <T>{'z = e^{j\\omega}'}</T>: <T>{'H(e^{j\\omega}) = 2 + e^{-j\\omega} + e^{-j2\\omega} + 2e^{-j3\\omega}'}</T>.
          The question only asks for <T>{'H(z)'}</T>, but mentioning this line (with the symmetry remark) shows
          the examiner you know where <T>{'H(z)'}</T> leads next. Question 4 solves exactly such a problem in
          full detail.
        </p>
      </Callout>

      <Callout type="warn" title="Common mistakes">
        <ul>
          <li>Dropping <T>{'h[0]'}</T> or pairing it with <T>{'z^{-1}'}</T> — the first coefficient has <em>zero</em> delay: <T>{'z^{0} = 1'}</T>.</li>
          <li>Writing positive powers (<T>{'2 + z + z^{2} + 2z^{3}'}</T>) — positive powers mean <em>future</em> samples and a non-causal filter.</li>
          <li>Mixing up the coefficient order ([2,1,1,2] vs [1,2,2,1]) — position = delay count.</li>
          <li>Forgetting the symmetry remark — with this question it is the difference between 7 and 8 marks.</li>
        </ul>
      </Callout>

      <Callout type="tip" title="Exam tip">
        <p>
          Present it in four lines: formula → substitution → boxed answer → symmetry note with the 4-tap diagram.
          Numerical questions in DSP are marked per correct step, so show the substitution explicitly instead of
          jumping to the final polynomial.
        </p>
      </Callout>

      <ExamAnswer>
        <p><b>Given:</b> impulse response h(n) = [2, 1, 1, 2], i.e. h[0] = 2, h[1] = 1, h[2] = 1, h[3] = 2 and
        h[n] = 0 elsewhere. The filter length is N = 4.</p>
        <p><b>Formula.</b> For an FIR filter of length N:</p>
        <T block>{'H(z) = \\sum_{n=0}^{N-1} h[n]\\,z^{-n}'}</T>
        <p><b>Substitution (N = 4):</b></p>
        <T block>{'H(z) = h[0]z^{0} + h[1]z^{-1} + h[2]z^{-2} + h[3]z^{-3} = 2(1) + 1\\,z^{-1} + 1\\,z^{-2} + 2\\,z^{-3}'}</T>
        <T block>{'\\boxed{H(z) = 2 + z^{-1} + z^{-2} + 2z^{-3}}'}</T>
        <p><b>Observation.</b> h[0] = h[3] = 2 and h[1] = h[2] = 1, i.e. h[n] = h[N−1−n]: the impulse response is
        symmetric, so this is a linear-phase FIR filter with group delay (N−1)/2 = 1.5 samples. [Draw the 4-tap
        direct-form structure with multipliers 2, 1, 1, 2.]</p>
      </ExamAnswer>

      <Section kicker="Quick revision" title="The whole question in 30 seconds" modes={['beginner', 'detailed']}>
        <ul>
          <li>Bracket list starts at n = 0: h[0]=2, h[1]=1, h[2]=1, h[3]=2.</li>
          <li><T>{'H(z) = \\sum h[n]z^{-n} = 2 + z^{-1} + z^{-2} + 2z^{-3}'}</T>.</li>
          <li>Exponent of z = delay count at that tap; h[0] pairs with z⁰ = 1.</li>
          <li>Symmetric → linear phase, delay 1.5 samples.</li>
        </ul>
      </Section>

      <ConceptCheck
        items={[
          {
            q: 'Write H(z) for h(n) = [1, 0, −1].',
            a: <><T>{'H(z) = 1 + 0\\cdot z^{-1} - z^{-2} = 1 - z^{-2}'}</T>. A zero coefficient means that tap has no multiplier (the middle tap contributes nothing).</>,
          },
          {
            q: 'How many delay elements does the structure of this question need?',
            a: <>N−1 = 3 delay elements (order 3), and 4 multipliers labelled 2, 1, 1, 2.</>,
          },
          {
            q: 'Why can the two “1” taps share one multiplier?',
            a: <>Because the filter is symmetric: <T>{'x[n-1] + x[n-2]'}</T> can be added first and multiplied once by h[1] = 1 (<T>{'h_1(x[n-1]+x[n-3])'}</T> pattern of Question 2) — halving multipliers.</>,
          },
          {
            q: 'Is this filter stable? Why?',
            a: <>Yes. Its impulse response contains finitely many finite values, so <T>{'\\sum|h[n]| = 6 < \\infty'}</T>; H(z) has poles only at z = 0.</>,
          },
        ]}
      />

      <PageFooter />
    </div>
  )
}

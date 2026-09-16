import React from 'react'
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
import { SymmetryStems, Figure } from '../components/diagrams.jsx'

export default function Q2() {
  return (
    <div>
      <QHeader
        q={2}
        title="Symmetric and Antisymmetric FIR Filters"
        question="Explain Symmetric and Asymmetric FIR Filters."
        tags={['Symmetry', 'Linear phase', 'Hardware savings', 'Types I–IV']}
      />
      <ModeNote />

      <WhatIsAsked>
        <p>
          The examiner wants the two coefficient-symmetry conditions of an FIR filter —{' '}
          <T>{'h[n] = h[N-1-n]'}</T> (symmetric) and <T>{'h[n] = -h[N-1-n]'}</T> (antisymmetric, which many
          syllabi loosely call “asymmetric”) — with examples, small diagrams of the coefficient mirror, and the two
          big payoffs: <strong>exact linear phase</strong> and an almost <strong>50% saving in multipliers</strong>,
          plus where each type is used.
        </p>
      </WhatIsAsked>

      <Prereqs
        items={[
          { label: 'Impulse response' },
          { label: 'FIR difference equation', to: '/q1' },
          { label: 'Phase = a time delay', to: '/q4' },
        ]}
      />

      <Section kicker="Learn this first" title="What does “symmetry” mean for filter coefficients?" modes={['beginner', 'detailed']}>
        <Callout type="simple">
          <p>
            Write the coefficients on a strip of paper and fold it exactly in half. If the two halves match
            perfectly, the filter is <strong>symmetric</strong>. If they match but one half is upside-down
            (negated), it is <strong>antisymmetric</strong> (negative symmetry).
          </p>
        </Callout>
        <p>
          For an N-tap FIR filter the folding point — the <strong>centre of symmetry</strong> — lies at{' '}
          <T>{'\\alpha = \\dfrac{N-1}{2}'}</T>. Symmetry pairs the first coefficient with the last, the second
          with the second-last, and so on. For odd N one coefficient sits exactly on the fold (the centre tap);
          for even N every coefficient has a partner.
        </p>
        <FormulaCard
          title="Centre of symmetry"
          tex={'\\alpha = \\frac{N-1}{2}'}
          symbols={[
            { s: 'N', meaning: 'filter length (number of taps)' },
            { s: '\\alpha', meaning: 'the mirror axis; also the filter delay in samples for a symmetric/antisymmetric FIR' },
          ]}
          note="For N = 5 taps the centre is α = 2 (sits exactly on tap 2). For N = 4 taps the centre is α = 1.5 (between taps 1 and 2)."
        />
      </Section>

      <Section kicker="Case 1" title="Symmetric FIR filter (even symmetry)">
        <FormulaCard
          open
          title="Symmetric (even) coefficient condition"
          tex={'h[n] = h[N-1-n], \\qquad 0 \\le n \\le N-1'}
          symbols={[
            { s: 'h[n]', meaning: 'coefficient at position n counting from the left' },
            { s: 'h[N-1-n]', meaning: 'its mirror image counting from the right' },
            { s: '=', meaning: 'the two are EQUAL — same sign, same magnitude' },
          ]}
        />
        <p>
          Example for <T>{'N = 5'}</T>: the coefficient list has the palindrome form
        </p>
        <T block>{'[\\,h_0,\\; h_1,\\; h_2,\\; h_1,\\; h_0\\,]\\qquad\\text{e.g. } [\\,2,\\;1,\\;3,\\;1,\\;2\\,]'}</T>
        <p>
          The coefficients <strong>mirror around the centre</strong> <T>{'\\alpha = 2'}</T> because each delayed
          copy <T>{'x[n-k]'}</T> that lies k samples before the centre is given the same importance as the one k
          samples after the centre. Nothing in the “time window” is favoured left or right — and that is exactly
          why the phase becomes a pure delay.
        </p>
        <Figure title="Symmetric coefficients mirror about the centre (N = 5)">
          <SymmetryStems type="sym" />
        </Figure>
      </Section>

      <Section kicker="Case 2" title="Antisymmetric FIR filter (odd symmetry)">
        <FormulaCard
          open
          title="Antisymmetric (odd / negative symmetric) coefficient condition"
          tex={'h[n] = -h[N-1-n], \\qquad 0 \\le n \\le N-1'}
          symbols={[
            { s: '-h[N-1-n]', meaning: 'the mirror coefficient has the SAME magnitude but OPPOSITE sign' },
            { s: 'h[\\alpha]', meaning: 'for odd N the centre tap must satisfy h[α] = -h[α], so the centre coefficient is forced to 0' },
          ]}
        />
        <p>
          Example for <T>{'N = 5'}</T>:
        </p>
        <T block>{'[\\,h_0,\\; h_1,\\; 0,\\; -h_1,\\; -h_0\\,]\\qquad\\text{e.g. } [\\,2,\\;1,\\;0,\\;-1,\\;-2\\,]'}</T>
        <Figure title="Antisymmetric coefficients: mirrored with a sign flip (N = 5)">
          <SymmetryStems type="anti" />
        </Figure>
      </Section>

      <Callout type="note" title="Terminology — “asymmetric” vs “antisymmetric” (read carefully)">
        <p>
          Strict mathematics reserves the word <strong>antisymmetric</strong> for the sign-flipped mirror condition
          <T>{'h[n] = -h[N-1-n]'}</T>. Some syllabi and textbooks (and the wording of this very question) say{' '}
          <strong>“asymmetric FIR”</strong> when they mean this antisymmetric case — because it is the important
          “other symmetric-structured alternative”. A filter with genuinely <em>no</em> symmetry at all
          (“non-symmetric”) simply has <strong>no linear phase</strong> and is rarely what the examiner means.
          When you write the exam answer, state both conditions explicitly and note that “asymmetric” in syllabus
          usage = antisymmetric. That removes all ambiguity.
        </p>
      </Callout>

      <Section kicker="The big payoff #1" title="Linear phase">
        <p>
          If (and only if, for FIR) the coefficients obey <T>{'h[n] = \\pm h[N-1-n]'}</T>, the frequency response
          factors into a real amplitude term times a pure delay:
        </p>
        <FormulaCard
          open
          title="Phase responses of symmetric and antisymmetric FIR filters"
          tex={'\\underbrace{\\phi(\\omega) = -\\omega\\,\\frac{N-1}{2}}_{\\text{symmetric}} \\qquad\\qquad \\underbrace{\\phi(\\omega) = \\frac{\\pi}{2} - \\omega\\,\\frac{N-1}{2}}_{\\text{antisymmetric}}'}
          symbols={[
            { s: '\\phi(\\omega)', meaning: 'phase response (radians)' },
            { s: '-\\omega\\,\\frac{N-1}{2}', meaning: 'a straight line through the origin — a pure time delay of α = (N−1)/2 samples' },
            { s: '\\pi/2', meaning: 'extra constant 90° phase shift in the antisymmetric case (that is why it behaves like a differentiator/Hilbert transformer)' },
          ]}
          note="Derivation carried out fully in Question 5. Phase delay and group delay both equal (N−1)/2 — see Questions 4 and 5."
        />
        <Callout type="simple">
          <p>
            Linear phase means every sine wave inside your signal is delayed by the <em>same number of
            samples</em>. The whole waveform simply arrives a little late, completely undistorted — like a choir
            that starts late but stays perfectly in tune, instead of a choir where some voices run faster than
            others.
          </p>
        </Callout>
      </Section>

      <Section kicker="The big payoff #2" title="Reduction in multiplications (hardware implementation)">
        <p>
          Symmetry makes equal coefficients multiply signals that can be <strong>pre-added first</strong>. For a
          symmetric <T>{'N = 5'}</T> filter:
        </p>
        <Steps
          items={[
            {
              title: 'Direct form — 5 multiplications',
              math: 'y[n] = h_0 x[n] + h_1 x[n-1] + h_2 x[n-2] + h_1 x[n-3] + h_0 x[n-4]',
            },
            {
              title: 'Group the terms that share a coefficient',
              math: 'y[n] = h_0\\,\\big(x[n] + x[n-4]\\big) + h_1\\,\\big(x[n-1] + x[n-3]\\big) + h_2\\,x[n-2]',
            },
            {
              title: 'Folded (linear-phase) form — only 3 multiplications',
              body: (
                <p>
                  The sums in brackets are computed with cheap adders; only 3 multipliers remain
                  (<T>{'(N+1)/2 = 3'}</T>). The delay line is unchanged; extra hardware = a few adders. This
                  “folded” structure is why almost every hardware FIR exploits symmetry.
                </p>
              ),
            },
          ]}
        />
        <DataTable
          caption="Multiplier count with and without symmetry (same for antisymmetric filters)"
          head={['Filter', 'Direct form', 'With symmetry exploited', 'Saving']}
          rows={[
            [<>N odd (e.g. 5)</>, <>N (5)</>, <><T>{'(N+1)/2'}</T> (3)</>, <>(N−1)/2 multipliers saved</>],
            [<>N even (e.g. 6)</>, <>N (6)</>, <><T>{'N/2'}</T> (3)</>, <>N/2 multipliers saved</>],
          ]}
        />
        <p>
          In hardware terms: adders are cheap, multipliers are expensive (area, power, speed). Folding the
          structure around the centre of symmetry nearly <strong>halves the most expensive resource</strong> while
          producing bit-identical output.
        </p>
      </Section>

      <Section kicker="Filter types" title="The four types of linear-phase FIR filter">
        <DataTable
          caption="Symmetry × length parity gives four standard types"
          head={['Type', 'Symmetry', 'Length N', 'Centre α', 'Special feature', 'Typical use']}
          rows={[
            ['I', <>Symmetric</>, <>Odd</>, <>(N−1)/2 (integer)</>, <>No restriction on response</>, <>LP / HP / BP / BS — most common</>],
            ['II', <>Symmetric</>, <>Even</>, <>Half-integer</>, <><T>{'H(e^{j\\pi}) = 0'}</T> — cannot realise a high-pass or band-stop</>, <>LP / BP</>],
            ['III', <>Antisymmetric</>, <>Odd</>, <>(N−1)/2, centre tap = 0</>, <><T>{'H = 0'}</T> at <T>{'\\omega=0'}</T> and <T>{'\\omega=\\pi'}</T></>, <>Differentiators, Hilbert transformers</>],
            ['IV', <>Antisymmetric</>, <>Even</>, <>Half-integer</>, <><T>{'H = 0'}</T> at <T>{'\\omega=0'}</T>; can pass high frequencies</>, <>Differentiators, Hilbert transformers, HP</>],
          ]}
        />
      </Section>

      <Section kicker="Head-to-head" title="Comparison: symmetric vs antisymmetric FIR">
        <DataTable
          caption="Exam-ready comparison table"
          head={['Feature', 'Symmetric FIR', 'Antisymmetric FIR']}
          rows={[
            ['Coefficient relationship', <><T>{'h[n] = h[N-1-n]'}</T> (even mirror)</>, <><T>{'h[n] = -h[N-1-n]'}</T> (odd mirror; centre tap = 0 for odd N)</>],
            ['Phase response', <><T>{'\\phi(\\omega) = -\\omega (N-1)/2'}</T> — straight line through origin</>, <><T>{'\\phi(\\omega) = \\pi/2 - \\omega (N-1)/2'}</T> — same slope plus a constant 90° shift</>],
            ['Frequency response form', <><T>{'H = e^{-j\\omega\\alpha} A(\\omega)'}</T>, with <T>{'A'}</T> real and even</>, <><T>{'H = j\\,e^{-j\\omega\\alpha} A(\\omega)'}</T>, hence zero at <T>{'\\omega=0'}</T> (odd N also zero at <T>{'\\omega=\\pi'}</T>)</>],
            ['Delay (phase & group)', <><T>{'(N-1)/2'}</T> samples</>, <><T>{'(N-1)/2'}</T> samples</>],
            ['Typical applications', <>Low-pass, high-pass, band-pass, band-stop — general frequency selection</>, <>Differentiators, Hilbert transformers (90° phase shifters), edge detectors</>],
            ['Implementation', <>Folded structure: ≈ N/2 multipliers</>, <>Same folded structure (sign of second input to pre-adder is subtracted): ≈ N/2 multipliers</>],
            ['Multiplier savings', <>(N+1)/2 for odd N, N/2 for even N</>, <>Same as symmetric case</>],
          ]}
        />
      </Section>

      <Callout type="warn" title="Common mistakes">
        <ul>
          <li>Writing the mirror index as <T>{'N - n'}</T> instead of <T>{'N - 1 - n'}</T> (tap indices run 0…N−1).</li>
          <li>Claiming <em>any</em> FIR filter has linear phase — only symmetric/antisymmetric ones do.</li>
          <li>Forgetting that an antisymmetric filter with odd N must have its centre coefficient equal to 0.</li>
          <li>Saying symmetric FIR “reduces additions” — it reduces <em>multiplications</em>; it actually adds a few cheap pre-adders.</li>
          <li>Using a Type II (even-length symmetric) filter for a high-pass design — its response is forced to zero at <T>{'\\omega = \\pi'}</T>.</li>
        </ul>
      </Callout>

      <Callout type="tip" title="Exam tip">
        <p>
          Draw the two little coefficient-mirror pictures — they earn marks instantly and take twenty seconds.
          Then give both conditions, the two phase formulas, and the multiplier-saving arithmetic with one concrete
          5-tap example. That is a complete 8-mark package.
        </p>
      </Callout>

      <ExamAnswer>
        <p><b>Definition.</b> An FIR filter is symmetric when its coefficients form a palindrome about the centre
        of symmetry α = (N−1)/2, and antisymmetric when they form a sign-reversed palindrome:</p>
        <T block>{'\\text{Symmetric: } h[n] = h[N-1-n] \\qquad\\quad \\text{Antisymmetric: } h[n] = -h[N-1-n]'}</T>
        <p><b>Examples (N = 5):</b> symmetric: [h₀, h₁, h₂, h₁, h₀]; antisymmetric: [h₀, h₁, 0, −h₁, −h₀] — the
        centre tap of an odd-length antisymmetric filter is always zero. (In syllabus usage “asymmetric FIR” means
        this antisymmetric case.) [Sketch: coefficient mirror diagrams for both cases.]</p>
        <p><b>Linear phase.</b> Both conditions make the frequency response factor into a real amplitude times a
        pure delay (derivation — Question 5):</p>
        <T block>{'\\text{symmetric: } \\phi(\\omega) = -\\omega\\tfrac{N-1}{2}, \\qquad \\text{antisymmetric: } \\phi(\\omega) = \\tfrac{\\pi}{2} - \\omega\\tfrac{N-1}{2}'}</T>
        <p>Hence phase delay = group delay = (N−1)/2 samples: the filtered signal is delayed but never distorted.
        The antisymmetric form adds a constant 90° phase shift, which is why it realises differentiators and
        Hilbert transformers.</p>
        <p><b>Multiplier reduction / hardware.</b> Equal-magnitude pairs can share one multiplier after pre-adding
        their signals, e.g. y[n] = h₀(x[n]+x[n−4]) + h₁(x[n−1]+x[n−3]) + h₂x[n−2]: a 5-tap filter needs only 3
        multipliers. Savings: (N+1)/2 multipliers for odd N, N/2 for even N — nearly half the multiplier hardware
        and power.</p>
        <p><b>Types and applications.</b> Type I (symmetric, odd N): general LP/HP/BP/BS. Type II (symmetric, even
        N): zero at ω = π, so no HP/BS. Type III (antisymmetric, odd N): zero at ω = 0 and π — differentiators,
        Hilbert transformers. Type IV (antisymmetric, even N): zero at ω = 0 — differentiators, HP.</p>
        <p><b>Conclusion.</b> Symmetry is the FIR filter's superpower: one mirror condition buys exact linear phase
        <em>and</em> halves the multipliers — the two properties that dominate FIR design.</p>
      </ExamAnswer>

      <Section kicker="Quick revision" title="The whole question in 30 seconds" modes={['beginner', 'detailed']}>
        <ul>
          <li>Mirror about <T>{'\\alpha=(N-1)/2'}</T>: equal → symmetric; equal-but-negated → antisymmetric.</li>
          <li>Both give linear phase with delay <T>{'\\alpha'}</T>; antisymmetric adds 90°.</li>
          <li>Multipliers: <T>{'(N+1)/2'}</T> (odd N) or <T>{'N/2'}</T> (even N) instead of N.</li>
          <li>Types I–IV = symmetric/antisymmetric × odd/even; antisymmetric → differentiators & Hilbert.</li>
        </ul>
      </Section>

      <ConceptCheck
        items={[
          {
            q: 'Are the coefficients [0.5, −1, 0.5, −1, 0.5] symmetric or antisymmetric?',
            a: <>Symmetric: positions 0/4 (0.5), 1/3 (−1), 2 (centre) mirror with equal sign: <T>{'h[n]=h[N-1-n]'}</T>.</>,
          },
          {
            q: 'A 21-tap symmetric FIR uses the folded structure. How many multipliers does it need?',
            a: <><T>{'(N+1)/2 = 11'}</T> multipliers instead of 21 — a saving of 10 multipliers.</>,
          },
          {
            q: 'Why can an antisymmetric FIR never have non-zero response exactly at ω = 0?',
            a: <>Its response contains the factor jA(ω) with A(0) = Σ h[n] = 0, because the mirrored pairs (h, −h) cancel. Hence no DC gain — ideal for differentiators/Hilbert transformers, unusable for low-pass.</>,
          },
          {
            q: 'Your syllabus says “asymmetric FIR”. Which formula should you write in the exam?',
            a: <>State the distinction, then write the antisymmetric condition <T>{'h[n] = -h[N-1-n]'}</T> — that is the mathematically meaningful and syllabus-intended case.</>,
          },
        ]}
      />

      <PageFooter />
    </div>
  )
}

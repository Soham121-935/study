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
import { Flowchart } from '../components/diagrams.jsx'

export default function Q9() {
  return (
    <div>
      <QHeader
        q={9}
        title="FIR Filter Design Using the Fourier Series Method"
        question="Explain the FIR filter design process using the Fourier Series Method."
        tags={['Design process', 'Inverse DTFT', 'Sinc response', 'Truncation & causality']}
      />
      <ModeNote />

      <WhatIsAsked>
        <p>
          Explain the <strong>complete design procedure</strong> that starts from a desired frequency response{' '}
          <T>{'H_d(e^{j\\omega})'}</T> and ends with a realisable N-tap FIR filter: the Fourier-series / inverse
          DTFT step that yields the ideal impulse response, the <strong>truncation</strong> to N samples, the{' '}
          <strong>causal shift</strong>, and the consequences (linear phase, Gibbs ripple, windows as the cure).
          The mathematical foundation and the reason the ideal response is infinite must both appear.
        </p>
      </WhatIsAsked>

      <Prereqs
        items={[
          { label: 'Impulse response', to: '/zero' },
          { label: 'Frequency response H(e^{jω})', to: '/q1' },
          { label: 'Gibbs phenomenon', to: '/q6' },
        ]}
      />

      <Section kicker="Learn this first" title="The one problem this method solves" modes={['beginner', 'detailed']}>
        <Callout type="simple">
          <p>
            Suppose you could draw a <em>perfect</em> filter: a wall of gain 1 for the frequencies you want, zero
            everywhere else. Fourier analysis can translate that perfect picture into the list of coefficients it
            requires — but the list comes out <strong>infinitely long</strong>. The Fourier series method is simply
            the honest recipe: compute the infinite list, keep its most important N entries, and slide them so the
            filter can run in real time. Question 10 applies this recipe to an actual low-pass design.
          </p>
        </Callout>
      </Section>

      <Section kicker="Mathematical foundation" title="Why the inverse-DTFT integral gives the coefficients">
        <p>
          For <em>any</em> LTI system, impulse response and frequency response are a DTFT pair:
        </p>
        <T block>{'H(e^{j\\omega}) = \\sum_{n=-\\infty}^{\\infty} h[n]\\, e^{-j\\omega n}'}</T>
        <p>
          This is a <strong>Fourier series</strong> of the periodic function <T>{'H(e^{j\\omega})'}</T> (period{' '}
          <T>{'2\\pi'}</T>), and the “Fourier coefficients” are literally the samples <T>{'h[n]'}</T>. The inverse
          relation recovers them:
        </p>
        <FormulaCard
          open
          title="The heart of the method — ideal impulse response from the desired response"
          tex={'h_d[n] = \\frac{1}{2\\pi} \\int_{-\\pi}^{\\pi} H_d(e^{j\\omega})\\, e^{j\\omega n}\\, d\\omega, \\qquad n = 0, \\pm 1, \\pm 2, \\dots'}
          symbols={[
            { s: 'H_d(e^{j\\omega})', meaning: 'the DESIRED (ideal) frequency response — e.g. 1 in the passband, 0 in the stopband' },
            { s: '\\int_{-\\pi}^{\\pi}', meaning: 'integrate over one full period of the response' },
            { s: 'e^{j\\omega n}', meaning: 'complex sinusoid “test signal” that picks out the n-th Fourier coefficient' },
            { s: '\\frac{1}{2\\pi}', meaning: 'normalisation of the Fourier series inversion' },
            { s: 'h_d[n]', meaning: 'the resulting ideal impulse response — defined for ALL integers n' },
          ]}
        />
      </Section>

      <Section kicker="The signature result" title="Ideal low-pass ⇒ a sinc-type (infinitely long) response">
        <p>
          For the ideal LPF that is 1 for <T>{'|\\omega| \\le \\omega_c'}</T> and 0 elsewhere, the integral
          collapses to (full details in Question 10):
        </p>
        <T block>{'h_d[n] = \\frac{\\sin(\\omega_c n)}{\\pi n} = \\frac{\\omega_c}{\\pi}\\,\\mathrm{sinc}\\!\\left(\\frac{\\omega_c n}{\\pi}\\right), \\qquad h_d[0] = \\frac{\\omega_c}{\\pi}'}</T>
        <p>
          The <T>{'\\sin(\\cdot)/n'}</T> (<strong>sinc</strong>) sequence decays only like <T>{'1/n'}</T> and never
          ends: <strong>an infinitely sharp edge in frequency costs an infinitely long response in time</strong>.
          It is also <strong>non-causal</strong> — it extends to negative time (<T>{'n < 0'}</T>). Both defects are
          cured by the next two steps of the recipe.
        </p>
      </Section>

      <Section kicker="The complete process" title="The eight-step design procedure">
        <Flowchart
          steps={[
            { title: 'Specify the desired response', body: <>Write down the ideal <T>{'H_d(e^{j\\omega})'}</T> — passband gain 1, stopband gain 0, cutoff <T>{'\\omega_c'}</T>.</> },
            { title: 'Compute the ideal impulse response', body: <>Apply the inverse DTFT: <T>{'h_d[n] = \\frac{1}{2\\pi}\\int_{-\\pi}^{\\pi} H_d(e^{j\\omega}) e^{j\\omega n} d\\omega'}</T>.</> },
            { title: 'Obtain the infinite-duration sequence', body: <>The result is a sinc-type response: infinitely long, symmetric about n = 0, and non-causal.</> },
            { title: 'Truncate to N samples', body: <>Keep only the central N coefficients: <T>{'h_t[n] = h_d[n]'}</T> for <T>{'|n| \\le (N-1)/2'}</T>, else 0 (rectangular window, or multiply by a tapered window — Question 8).</> },
            { title: 'Shift to make it causal', body: <>Delay by <T>{'M = (N-1)/2'}</T> samples: <T>{'h[n] = h_d[n-M]'}</T>, <T>{'n = 0, 1, \\dots, N-1'}</T>. The shift only adds linear phase.</> },
            { title: 'Finite-length FIR coefficients', body: <>You now hold the N realisable taps; because truncation was symmetric, <T>{'h[n] = h[N-1-n]'}</T> — the filter is linear phase.</> },
            { title: 'Form the transfer function', body: <>Assemble <T>{'H(z) = \\sum_{n=0}^{N-1} h[n]\\,z^{-n}'}</T> — a polynomial of degree N−1 in <T>{'z^{-1}'}</T>.</> },
            { title: 'Analyse the frequency response', body: <>Evaluate <T>{'H(e^{j\\omega}) = \\sum h[n]e^{-j\\omega n}'}</T>: check passband/stopband ripple (Gibbs) and transition width; adjust N or the window.</> },
          ]}
        />

        <Steps
          title="The same recipe, as the algebra you write in the exam"
          items={[
            {
              title: 'Ideal specification',
              math: 'H_d(e^{j\\omega}) = \\begin{cases} 1, & |\\omega| \\le \\omega_c \\\\ 0, & \\omega_c < |\\omega| \\le \\pi \\end{cases}',
            },
            {
              title: 'Inverse DTFT → ideal (infinite, non-causal) response',
              math: 'h_d[n] = \\frac{1}{2\\pi}\\int_{-\\omega_c}^{\\omega_c} e^{j\\omega n} \\, d\\omega = \\frac{\\sin(\\omega_c n)}{\\pi n}',
            },
            {
              title: 'Truncate and shift → causal N-tap filter',
              math: 'h[n] = \\frac{\\sin\\!\\big(\\omega_c (n - \\tfrac{N-1}{2})\\big)}{\\pi\\,(n - \\tfrac{N-1}{2})}, \\quad n = 0, \\dots, N-1',
              body: (
                <p>
                  At the centre <T>{'n = (N-1)/2'}</T>: <T>{'h[(N-1)/2] = \\omega_c/\\pi'}</T>.
                </p>
              ),
            },
            {
              title: 'The designed filter',
              math: 'H(z) = \\sum_{n=0}^{N-1} h[n]\\, z^{-n}, \\qquad |H(e^{j\\omega})| \\approx \\text{ideal} + \\text{Gibbs ripple}',
            },
          ]}
        />
      </Section>

      <Section kicker="Interpretation" title="Why truncation hurts — and how windowing rescues the design">
        <DataTable
          caption="Consequences of each processing step"
          head={['Step', 'Good news', 'Bad news', 'Remedy']}
          rows={[
            ['Truncate to N', <>Filter becomes finite and realisable</>, <>Response ripples — Gibbs phenomenon (≈ 9% overshoot, −21 dB with rectangle)</>, <>Multiply by a tapered window (Hamming, Blackman…): ripple ↓ to −53…−74 dB</>],
            ['Causal shift by (N−1)/2', <>Filter can run in real time; symmetry preserved</>, <>Adds a fixed delay of (N−1)/2 samples and linear phase −ω(N−1)/2</>, <>None needed — linear phase is usually desired (Question 5)</>],
            ['Increase N', <>Transition width shrinks (∝ 1/N)</>, <>More computation; Gibbs overshoot height unchanged</>, <>Choose N from the required transition width</>],
          ]}
        />
      </Section>

      <Callout type="warn" title="Common mistakes">
        <ul>
          <li>Claiming truncation “makes the filter ideal again” — truncation is exactly where the ideality is lost.</li>
          <li>Forgetting the causal shift, and reporting a filter with negative-index taps <T>{'h[-1], h[-2], \\dots'}</T>.</li>
          <li>Saying the shift changes the magnitude response — it only adds the linear phase factor <T>{'e^{-j\\omega(N-1)/2}'}</T>; <T>{'|H|'}</T> is untouched.</li>
          <li>Confusing this method with the window method: windowing is the same recipe with tapered truncation (the last step of the cure, Question 8).</li>
        </ul>
      </Callout>

      <Callout type="tip" title="Exam tip">
        <p>
          Draw the flowchart boxes — markers love a process diagram for a “process” question. Then write the
          three-line algebraic spine: <T>{'H_d'}</T> → integral → <T>{'h_d'}</T> → truncate + shift →{' '}
          <T>{'H(z)'}</T>. Name-drop Fourier <em>series</em>, inverse DTFT, non-causal, truncation, Gibbs,
          window, linear phase: each keyword is a mark.
        </p>
      </Callout>

      <ExamAnswer>
        <p><b>Principle.</b> The desired response H<sub>d</sub>(<T>{'e^{j\\omega}'}</T>) is periodic with period 2π, so it can be
        expanded as a Fourier series whose coefficients are the ideal impulse-response samples:</p>
        <T block>{'H_d(e^{j\\omega}) = \\sum_{n} h_d[n] e^{-j\\omega n} \\;\\Longleftrightarrow\\; h_d[n] = \\frac{1}{2\\pi}\\int_{-\\pi}^{\\pi} H_d(e^{j\\omega}) e^{j\\omega n} d\\omega'}</T>
        <p><b>Process.</b> (1) Specify the ideal response (e.g. brick-wall LPF, cutoff ω<sub>c</sub>).
        (2) Evaluate the inverse-DTFT integral → sinc-type h<sub>d</sub>[n] = sin(ω<sub>c</sub>n)/(πn).
        (3) This response is infinite-duration because the brick-wall edge is a discontinuity, and non-causal
        because it is symmetric about n = 0. (4) Truncate to the central N samples: h<sub>t</sub>[n] = h<sub>d</sub>[n],
        |n| ≤ (N−1)/2. (5) Shift right by M = (N−1)/2 samples to make it causal: h[n] = h<sub>d</sub>[n−M],
        n = 0…N−1. (6) The N symmetric samples are the FIR coefficients. (7) Form H(z) = Σh[n]z⁻ⁿ.
        (8) Evaluate H(<T>{'e^{j\\omega}'}</T>) to verify passband, stopband and transition behaviour.</p>
        <p><b>Consequences.</b> Truncation = rectangular windowing ⇒ ringing at the edges — the Gibbs phenomenon:
        ≈ 9% overshoot and ≈ −21 dB stopband, with transition width ≈ 4π/N. The causal shift contributes only the
        linear phase −ω(N−1)/2; magnitude is unchanged. Ripple is reduced by tapered windows (Hamming −53 dB,
        Blackman −74 dB) at the price of a wider transition band (8π/N, 12π/N).</p>
        <p><b>Merits and limits.</b> The method is simple, fully analytical and preserves linear phase exactly;
        but it offers no independent control of ripple and band edges and needs larger N than optimal methods.
        Question 10 applies this procedure to design an 11-tap low-pass filter by hand.</p>
      </ExamAnswer>

      <Section kicker="Quick revision" title="The whole question in 30 seconds" modes={['beginner', 'detailed']}>
        <ul>
          <li><T>{'H_d'}</T> periodic → Fourier series → coefficients <T>{'h_d[n]'}</T> via the inverse-DTFT integral.</li>
          <li>Ideal edges ⇒ infinite sinc response ⇒ truncate to N → shift by (N−1)/2 for causality.</li>
          <li>Truncation causes Gibbs (windows cure it); the shift adds only linear phase.</li>
        </ul>
      </Section>

      <ConceptCheck
        items={[
          {
            q: 'Why is the ideal impulse response infinite in duration?',
            a: <>The desired response has a discontinuity (brick-wall edge). Discontinuous functions need infinitely many Fourier components; equivalently the inverse DTFT yields a sinc, which decays as 1/n forever.</>,
          },
          {
            q: 'Why do we then shift the truncated sequence right by (N−1)/2?',
            a: <>The truncated response is centred at 0, extending to negative n (non-causal). Shifting by M = (N−1)/2 moves the first tap to n = 0, giving a physically realisable causal filter — adding only linear phase.</>,
          },
          {
            q: 'After truncation with a rectangular window, what two measures of the response suffer, and by how much?',
            a: <>Phase purity is kept, but the magnitude suffers: ≈ 9% edge overshoot and a stopband floor near −21 dB; transition width ≈ 4π/N.</>,
          },
          {
            q: 'Does the causal time shift change |H(e^{jω})|?',
            a: <>No. A shift multiplies the transform by <T>{'e^{-j\\omega M}'}</T> whose magnitude is 1. Only the phase changes, becoming −ωM (linear).</>,
          },
        ]}
      />

      <PageFooter />
    </div>
  )
}

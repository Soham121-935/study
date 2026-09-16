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

export default function Q7() {
  return (
    <div>
      <QHeader
        q={7}
        title="Types of FIR Filter Design — Advantages and Disadvantages of Each"
        question="What are the types of FIR Filter Design and discuss advantages and disadvantages of each in detail."
        tags={['Design methods', 'Fourier series', 'Window', 'Frequency sampling', 'Optimal']}
      />
      <ModeNote />

      <WhatIsAsked>
        <p>
          The examiner wants the catalogue of FIR design techniques — the <strong>Fourier series method</strong>,
          the <strong>window method</strong>, the <strong>frequency sampling method</strong>, and the{' '}
          <strong>optimal (equiripple) method</strong> — each with its working principle, design steps, and a
          balanced list of advantages and disadvantages, ending in a comparison. Question 9 goes deep on the
          Fourier series method; here the breadth is the point.
        </p>
      </WhatIsAsked>

      <Prereqs
        items={[
          { label: 'Impulse response = design target', to: '/zero' },
          { label: 'Gibbs phenomenon', to: '/q6' },
          { label: 'Windows', to: '/q8' },
        ]}
      />

      <Section kicker="Learn this first" title="Why do we need “filter design” at all?" modes={['beginner', 'detailed']}>
        <Callout type="simple">
          <p>
            A filter is fully described by its N coefficients. “Designing an FIR filter” simply means choosing
            those N numbers so that the frequency response matches a wish-list: <em>pass</em> these frequencies,{' '}
            <em>block</em> those, transition this steeply, ripple this small. The different design methods are just
            different recipes for cooking up the N coefficients.
          </p>
        </Callout>
        <p>
            In practice the designer is given <strong>specifications</strong>: passband edge <T>{'\\omega_p'}</T>,
            stopband edge <T>{'\\omega_s'}</T>, allowed passband ripple <T>{'\\delta_p'}</T> and required stopband
            attenuation <T>{'\\delta_s'}</T>. The ideal response satisfying the “pass/block” part is known
            analytically — its impulse response <T>{'h_d[n]'}</T> is unfortunately <strong>infinite and
            non-causal</strong> (brick-wall edges ↔ sinc tails). Every FIR design method is a strategy for
            converting that impossible ideal into N practical coefficients with controlled error.
        </p>
      </Section>

      {/* ---------------------------------------------------------- */}
      <Section kicker="Method 1" title="Fourier Series Method">
        <div className="grid gap-4 md:grid-cols-5">
          <div className="md:col-span-3">
            <p>
              <strong>Principle.</strong> The desired response <T>{'H_d(e^{j\\omega})'}</T> is periodic with period{' '}
              <T>{'2\\pi'}</T>, so it possesses a Fourier series whose coefficients are exactly the ideal impulse
              response samples:
            </p>
            <T block>{'H_d(e^{j\\omega}) = \\sum_{n=-\\infty}^{\\infty} h_d[n]\\, e^{-j\\omega n} \\qquad \\Longleftrightarrow \\qquad h_d[n] = \\frac{1}{2\\pi}\\int_{-\\pi}^{\\pi} H_d(e^{j\\omega})\\, e^{j\\omega n}\\, d\\omega'}</T>
            <p>
              Because <T>{'h_d[n]'}</T> is infinite, keep only the central N samples (truncate with a rectangular
              window) and shift right by <T>{'(N-1)/2'}</T> samples to make the filter causal:
            </p>
            <T block>{'h[n] = h_d\\!\\left[n-\\tfrac{N-1}{2}\\right], \\qquad n = 0,1,\\dots,N-1'}</T>
          </div>
          <div className="md:col-span-2 rounded-xl border border-slate-200 bg-white p-4 shadow-card">
            <div className="mb-2 text-[12px] font-extrabold uppercase tracking-wider text-navy-700">Design steps</div>
            <ol className="text-[13px]">
              <li>1. Write the ideal <T>{'H_d(e^{j\\omega})'}</T>.</li>
              <li>2. Integrate (inverse DTFT) to get <T>{'h_d[n]'}</T> — a sinc-type sequence.</li>
              <li>3. Truncate to N central samples.</li>
              <li>4. Shift to causality (introduces linear phase).</li>
              <li>5. Form <T>{'H(z) = \\sum h[n]z^{-n}'}</T> and verify the response.</li>
            </ol>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 mt-4">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
            <div className="mb-1 text-[12.5px] font-extrabold uppercase tracking-wider text-emerald-700">Advantages</div>
            <ul>
              <li>Simplest, fully analytical — no iterations or optimisation.</li>
              <li>Direct link between the ideal response and the coefficients (Fourier series).</li>
              <li>Preserves symmetry ⇒ exact linear phase.</li>
              <li>Excellent teaching/design entry point; basis of the window method.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4">
            <div className="mb-1 text-[12.5px] font-extrabold uppercase tracking-wider text-rose-700">Disadvantages</div>
            <ul>
              <li>Abrupt truncation ⇒ strong Gibbs ripple (≈ −21 dB stopband for the rectangular window).</li>
              <li>No precise control of passband/stopband edges or ripple size.</li>
              <li>Needs larger N than optimal methods for the same specs.</li>
              <li>Exact integration may be impossible for arbitrary desired shapes.</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      <Section kicker="Method 2" title="Window Method">
        <p>
          <strong>Principle.</strong> Soften the truncation: instead of chopping <T>{'h_d[n]'}</T> abruptly,
          multiply it by a smooth window <T>{'w[n]'}</T> of length N that tapers toward its ends:
        </p>
        <FormulaCard
          title="Window method design equation"
          tex={'h[n] = h_d\\!\\left[n-\\tfrac{N-1}{2}\\right] \\cdot w[n], \\qquad n = 0, \\dots, N-1'}
          symbols={[
            { s: 'h_d[n-M]', meaning: 'ideal (infinite) response centred at M = (N−1)/2 for causality' },
            { s: 'w[n]', meaning: 'window: Rectangular / Bartlett / Hann / Hamming / Blackman… (Question 8)' },
            { s: 'h[n]', meaning: 'final causal N-tap FIR coefficients' },
          ]}
          note="In the frequency domain, windowing convolves the ideal response with the window spectrum: the window fixes the ripple (side lobes), N fixes the transition width (main lobe)."
        />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
            <div className="mb-1 text-[12.5px] font-extrabold uppercase tracking-wider text-emerald-700">Advantages</div>
            <ul>
              <li>Still simple and closed-form — a table of windows + one multiplication.</li>
              <li>Greatly reduced ripple vs plain truncation (e.g. −53 dB with Hamming).</li>
              <li>Flexible: works for LP, HP, BP, BS and multiband ideals.</li>
              <li>Preserves linear phase (symmetric windows).</li>
            </ul>
          </div>
          <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4">
            <div className="mb-1 text-[12.5px] font-extrabold uppercase tracking-wider text-rose-700">Disadvantages</div>
            <ul>
              <li>Passband and stopband ripple are nearly equal — cannot be controlled separately.</li>
              <li>Cutoff location drifts slightly with window choice (edges not exactly placed).</li>
              <li>Not minimum-order: Parks–McClellan beats it for the same specs.</li>
              <li>Trade-off is fixed by the window table — no fine optimisation.</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      <Section kicker="Method 3" title="Frequency Sampling Method">
        <p>
          <strong>Principle.</strong> Instead of describing the ideal response <em>continuously</em>, specify it
          only at N equally spaced frequency points <T>{'\\omega_k = 2\\pi k/N'}</T> and take the inverse DFT to
          get the coefficients directly:
        </p>
        <FormulaCard
          title="Frequency sampling design equations"
          tex={'H[k] = H_d\\!\\left(e^{j 2\\pi k/N}\\right), \\qquad h[n] = \\frac{1}{N}\\sum_{k=0}^{N-1} H[k]\\, e^{j 2\\pi k n/N}'}
          symbols={[
            { s: 'H[k]', meaning: 'desired response sampled at the N DFT frequencies' },
            { s: 'h[n]', meaning: 'FIR coefficients via IDFT — the filter passes EXACTLY through the specified samples' },
            { s: '\\omega_k = 2\\pi k/N', meaning: 'the N equally spaced specification points on the unit circle' },
          ]}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
            <div className="mb-1 text-[12.5px] font-extrabold uppercase tracking-wider text-emerald-700">Advantages</div>
            <ul>
              <li>Extremely direct: draw the desired response at N points, IDFT, done (FFT-friendly).</li>
              <li>Handles arbitrary/irregular desired shapes — no integration needed.</li>
              <li>Response is exact at the sampling frequencies.</li>
              <li>Attractive in hardware (DFT-based realisations exist).</li>
            </ul>
          </div>
          <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4">
            <div className="mb-1 text-[12.5px] font-extrabold uppercase tracking-wider text-rose-700">Disadvantages</div>
            <ul>
              <li>Between the samples the response can ripple badly (Gibbs-type interpolation error).</li>
              <li>Passband/stopband edges are quantised to the grid — poor edge control.</li>
              <li>Stopband attenuation is poor (≈ −20 dB) unless transition samples are optimised.</li>
              <li>Optimising transition samples makes it a numerical (not closed-form) method.</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      <Section kicker="Method 4" title="Optimal (Equiripple / Parks–McClellan) Method">
        <Callout type="note" title="Syllabus note" modes={['beginner', 'detailed']}>
          <p>
            Most introductory syllabi emphasise the <strong>three methods above</strong>. The optimal method is the
            fourth “type of FIR design” in standard DSP texts (Proakis &amp; Manolakis; Oppenheim &amp; Schafer), so
            a complete 8-mark answer includes it briefly. If your course never mentioned Parks–McClellan, present
            the first three in full and keep this one as the closing paragraph.
          </p>
        </Callout>
        <p>
          <strong>Principle.</strong> Formulate design as optimisation: choose h[n] to <strong>minimise the
          maximum deviation</strong> (min-max / Chebyshev criterion) from the desired response, with separate
          weights for passband and stopband. The solution (found iteratively by the Remez exchange algorithm,
          implemented as the Parks–McClellan method) has <strong>equiripple</strong> error: the approximation error
          oscillates evenly to the same peak height in each band.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
            <div className="mb-1 text-[12.5px] font-extrabold uppercase tracking-wider text-emerald-700">Advantages</div>
            <ul>
              <li>Optimal: shortest possible N for given specs.</li>
              <li>Independent control of passband and stopband ripple.</li>
              <li>Precise placement of band edges; ripple spread evenly (equiripple).</li>
              <li>Industry standard (MATLAB firpm / scipy.remez).</li>
            </ul>
          </div>
          <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4">
            <div className="mb-1 text-[12.5px] font-extrabold uppercase tracking-wider text-rose-700">Disadvantages</div>
            <ul>
              <li>No closed form — iterative numerical algorithm; needs software.</li>
              <li>Complexity of understanding/implementation far above the other methods.</li>
              <li>Design values only approximate the requested band edges numerically.</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section kicker="Head-to-head" title="Comparison table — all methods at a glance">
        <DataTable
          caption="FIR design methods compared"
          head={['Feature', 'Fourier series', 'Window', 'Frequency sampling', 'Optimal equiripple']}
          rows={[
            ['Design variable', <>Truncate h_d[n]</>, <>Choice of w[n] & N</>, <>Samples H[k] (+ transition values)</>, <>Band edges, ripple weights, N</>],
            ['Ripple control', <>Poor (≈ −21 dB)</>, <>Fixed by window (−21…−74 dB)</>, <>Poor unless optimised</>, <>Excellent & independent per band</>],
            ['Edge control', <>Indirect</>, <>Indirect</>, <>Quantised to grid</>, <>Precise</>],
            ['Filter order', <>High</>, <>Medium-high</>, <>Medium</>, <>Lowest possible</>],
            ['Effort', <>One integral</>, <>One multiplication</>, <>One IDFT</>, <>Iterative algorithm</>],
            ['Arbitrary shapes', <>Needs integration</>, <>Needs integration</>, <>Easiest</>, <>Easy via weights</>],
            ['Linear phase?', <>Yes (symmetric)</>, <>Yes</>, <>Yes (with care)</>, <>Yes</>],
            ['Best for', <>Learning, quick analytic designs</>, <>General-purpose, specs in dB form</>, <>Arbitrary magnitude sketches, DFT-based realisations</>, <>Tight specs, minimum order, production filters</>],
          ]}
        />
      </Section>

      <Callout type="warn" title="Common mistakes">
        <ul>
          <li>Treating “Fourier series method” and “window method” as rivals — the window method <em>is</em> the Fourier series method with a better truncation.</li>
          <li>Recommending the window method when the spec demands different passband vs stopband ripple — that requires the optimal method.</li>
          <li>Claiming frequency sampling “gives a perfect filter” — it is exact only <em>at</em> the sampling frequencies.</li>
          <li>Listing methods without a single advantage/disadvantage each — the question explicitly demands both.</li>
        </ul>
      </Callout>

      <Callout type="tip" title="Exam tip">
        <p>
          Open with one line on the design problem (infinite h_d[n] → finite h[n]), then give each method the same
          skeleton: <em>principle → steps → pros → cons</em>, and close with the comparison table. Uniform
          structure is what turns a list into 8 marks.
        </p>
      </Callout>

      <ExamAnswer>
        <p><b>The design problem.</b> FIR design = finding N coefficients h[n] so H(<T>{'e^{j\\omega}'}</T>) meets
        given passband/stopband edge and ripple specifications. The ideal impulse response h<sub>d</sub>[n] is
        infinite and non-causal; all methods approximate it by N causal samples.</p>
        <p><b>1. Fourier series method.</b> Expand the periodic desired response H<sub>d</sub>(<T>{'e^{j\\omega}'}</T>) as a Fourier
        series; the coefficients are h<sub>d</sub>[n] = (1/2π)∫H<sub>d</sub>(<T>{'e^{j\\omega}'}</T>)<T>{'e^{j\\omega n}'}</T>dω. Keep the central N
        samples and shift by (N−1)/2 for causality. <i>Advantages:</i> simple, analytical, exact linear phase.
        <i>Disadvantages:</i> strong Gibbs ripple (≈ −21 dB), no control of ripple/edges, large N.</p>
        <p><b>2. Window method.</b> Multiply h<sub>d</sub>[n−M] by a tapered window w[n] (Hann, Hamming, Blackman…).
        Window spectrum sets ripple; N sets transition width. <i>Advantages:</i> simple, closed-form, ripple down
        to −74 dB, flexible. <i>Disadvantages:</i> equal pass/stop ripple (not separately controllable), cutoff not
        placed exactly, not minimum-order.</p>
        <p><b>3. Frequency sampling method.</b> Sample the desired response at ω<sub>k</sub> = 2πk/N and take the
        N-point IDFT to get h[n]. <i>Advantages:</i> trivially handles arbitrary shapes; exact at the sample
        frequencies; FFT-friendly. <i>Disadvantages:</i> interpolation ripples between samples, edges locked to
        the grid, poor attenuation without optimised transition samples.</p>
        <p><b>4. Optimal (equiripple, Parks–McClellan).</b> Iteratively minimise the maximum weighted error
        (Remez exchange), giving equiripple behaviour. <i>Advantages:</i> minimum order for given specs,
        independent band control, precise edges. <i>Disadvantages:</i> needs iterative numerical software, no
        closed form, conceptually harder.</p>
        <p><b>Conclusion.</b> Choose Fourier/window methods for analytic, teaching and everyday designs; frequency
        sampling for arbitrary shapes; the optimal equiripple method whenever specifications are tight and order
        must be minimal. [Add the comparison table.]</p>
      </ExamAnswer>

      <Section kicker="Quick revision" title="The whole question in 30 seconds" modes={['beginner', 'detailed']}>
        <ul>
          <li>All methods: infinite <T>{'h_d[n]'}</T> → N practical coefficients.</li>
          <li>Fourier = understand; window = truncate gently (ripple set by window); frequency sampling = IDFT of N response samples; optimal = min-max equiripple, shortest filter.</li>
          <li>Trade-off everywhere: ripple ↔ transition width ↔ order.</li>
        </ul>
      </Section>

      <ConceptCheck
        items={[
          {
            q: 'Which method would you choose for a filter whose desired response you can only sketch, not integrate?',
            a: <>Frequency sampling: sketch values at ω<sub>k</sub> = 2πk/N and IDFT (or the optimal method with a numerical desired function).</>,
          },
          {
            q: 'Why is the window method considered an improvement OF the Fourier series method rather than a separate idea?',
            a: <>Both begin from the same Fourier-series coefficients h<sub>d</sub>[n]; the window method only replaces the abrupt (rectangular) cut by a tapered w[n], trading transition width for far lower ripple.</>,
          },
          {
            q: 'A spec demands 0.1 dB passband ripple but 60 dB stopband attenuation. Which method and why?',
            a: <>Optimal equiripple (Parks–McClellan): it allows independent ripple weights per band. Window designs deliver essentially equal pass/stop ripple and cannot meet asymmetrical specs efficiently.</>,
          },
          {
            q: 'Do all four methods preserve linear phase?',
            a: <>Yes — as long as the resulting h[n] is kept symmetric (or antisymmetric), every one of them yields a linear-phase FIR filter.</>,
          },
        ]}
      />

      <PageFooter />
    </div>
  )
}

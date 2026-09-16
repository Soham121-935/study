import React from 'react'
import { Link } from 'react-router-dom'
import T from '../components/TeX.jsx'
import { Callout, PageFooter, ModeNote, ConceptCheck, DataTable, FormulaCard } from '../components/ui.jsx'
import {
  SignalFlowDiagram,
  CTvsDTDiagram,
  FilterTypesDiagram,
  ImpulseDiagram,
  BuildingBlocks,
  ConvDemo,
  Figure,
} from '../components/diagrams.jsx'

function Concept({ n, title, children }) {
  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-white p-4 shadow-card md:p-5">
      <div className="mb-2 flex items-center gap-2.5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-navy-700 text-[13px] font-extrabold text-white">
          {n}
        </span>
        <h3 className="font-serif text-[19px] font-bold leading-tight text-navy-900">{title}</h3>
      </div>
      <div className="prose-book">{children}</div>
    </div>
  )
}

export default function ZeroPage() {
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-sky-700 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-white">
          Foundation Chapter
        </span>
        <span className="rounded-full bg-navy-50 px-3 py-1 text-[11px] font-semibold text-navy-700 ring-1 ring-navy-200">
          Read this before Question 1
        </span>
      </div>
      <h1 className="font-serif text-2xl font-bold leading-tight text-navy-900 md:text-3xl">
        FIR From Zero — Everything You Need Before the First Question
      </h1>
      <p className="mt-3 max-w-3xl text-[15px] leading-7 text-slate-700">
        This chapter assumes <strong>absolutely nothing</strong>. Each idea is explained twice: first in plain
        everyday language, then in proper engineering terminology. By the end you will understand every word that
        appears in Questions 1–10 — signals, filters, impulse responses, convolution, and what “finite impulse
        response” actually means.
      </p>

      <ModeNote />

      {/* ---------------------------------------------------------- */}
      <h2 className="mt-8 font-serif text-xl font-bold text-navy-900">Part A — Signals: the raw material</h2>

      <Concept n={1} title="What is a signal?">
        <Callout type="simple">
          <p>
            A signal is any quantity that changes and carries information. Your voice pressing on a microphone, the
            temperature in a room through the day, a song stored on your phone — all of these are signals.
          </p>
        </Callout>
        <p>
          In engineering, a <strong>signal</strong> is a function of one or more independent variables (usually
          time) that carries information. We write it as <T>{'x(t)'}</T> when it lives on a continuously flowing
          time axis, or as <T>{'x[n]'}</T> when it exists only as a list of numbered values.
        </p>
      </Concept>

      <Concept n={2} title="What is a continuous-time signal?">
        <Callout type="simple">
          <p>
            A continuous-time signal has a value at <em>every</em> instant — like the smooth voltage coming out of a
            microphone, which never “skips” a moment.
          </p>
        </Callout>
        <p>
          A <strong>continuous-time (analog) signal</strong> <T>{'x(t)'}</T> is defined for every real value of
          the time variable <T>{'t'}</T>. Between any two instants, no matter how close, the signal still has a
          value. Nature produces continuous-time signals: sound pressure, temperature, heartbeat voltage (ECG).
        </p>
      </Concept>

      <Concept n={3} title="What is a discrete-time signal?">
        <Callout type="simple">
          <p>
            Take the smooth signal and write down its value only once every millisecond. You now have a numbered
            list of values — that list is a discrete-time signal.
          </p>
        </Callout>
        <p>
          A <strong>discrete-time signal</strong> <T>{'x[n]'}</T> is defined only at integer values of the index{' '}
          <T>{'n'}</T> (<T>{'n = 0, 1, 2, \\dots'}</T>). It is usually obtained by <strong>sampling</strong> a
          continuous signal every <T>{'T_s'}</T> seconds: <T>{'x[n] = x(nT_s)'}</T>, where{' '}
          <T>{'F_s = 1/T_s'}</T> is the sampling frequency. A computer can only store and process discrete-time
          signals — they are simply lists of numbers.
        </p>
      </Concept>

      <Figure
        title="Continuous-time vs discrete-time signal"
        caption="Sampling turns a smooth curve x(t) into a sequence of numbers x[n]. DSP works on the sequence."
      >
        <CTvsDTDiagram />
      </Figure>

      <Concept n={4} title="What is digital signal processing (DSP)?">
        <Callout type="simple">
          <p>
            DSP means using arithmetic — additions and multiplications performed by a digital circuit — to clean,
            transform or analyse signals.
          </p>
        </Callout>
        <p>
          <strong>Digital Signal Processing</strong> is the manipulation of discrete-time signals by digital
          hardware or software. Because the signal is a list of numbers, “processing” means applying mathematical
          operations to those numbers. Digital processing is accurate, perfectly repeatable, cheap to copy, and can
          be changed by simply changing the program or the coefficients.
        </p>
      </Concept>

      <Concept n={5} title="What is a digital filter?">
        <Callout type="simple">
          <p>
            A digital filter is a recipe of arithmetic that you apply to the list of numbers to change what the
            signal “sounds like” in frequency terms — for example removing the hiss but keeping the voice.
          </p>
        </Callout>
        <p>
          A <strong>digital filter</strong> is a digital system that accepts an input sequence{' '}
          <T>{'x[n]'}</T> and produces an output sequence <T>{'y[n]'}</T> such that selected frequency components
          are passed and others are attenuated. Physically it is built from only three kinds of elements:{' '}
          <strong>delay elements, multipliers and adders</strong> (concepts 18–20 below).
        </p>
      </Concept>

      <Figure
        title="The basic idea of filtering"
        caption="The filter modifies selected frequency components: wanted parts pass through, unwanted parts are weakened."
      >
        <SignalFlowDiagram />
      </Figure>

      {/* ---------------------------------------------------------- */}
      <h2 className="mt-10 font-serif text-xl font-bold text-navy-900">Part B — Why we filter</h2>

      <Concept n={6} title="Why do we need filters?">
        <Callout type="simple">
          <p>
            Real-world signals almost never arrive clean. The recording you want is always mixed with things you
            don't want. A filter is how we keep the good part and throw away the rest.
          </p>
        </Callout>
        <p>
          Practical signals are mixtures: speech plus background hiss, an ECG plus 50&nbsp;Hz power-line hum, a
          radio station plus every other station. Filtering is the operation of <strong>separating wanted
          frequency components from unwanted ones</strong>, enhancing what's useful and suppressing what isn't.
        </p>
      </Concept>

      <Concept n={7} title="What are unwanted frequencies / noise?">
        <Callout type="simple">
          <p>
            “Noise” is any part of the signal you didn't ask for. A high-pitched hiss is made of fast (high-frequency)
            wiggles; a mains hum is a slow 50&nbsp;Hz wave. If we can say <em>where</em> in frequency the unwanted
            part lives, we can design a filter that removes exactly that region.
          </p>
        </Callout>
        <p>
          Every signal can be decomposed into sinusoidal components of different frequencies (Fourier's idea).
          Components that carry no useful information — hum, hiss, interference, sensor drift — are called{' '}
          <strong>noise</strong> or <strong>unwanted frequency components</strong>. Filters work because wanted
          and unwanted parts usually occupy <em>different frequency ranges</em>, so a frequency-selective system
          can keep one and reject the other.
        </p>
      </Concept>

      <div id="filter-types" className="scroll-mt-24" />
      <Concept n="8–11" title="The four basic filter types">
        <Callout type="simple">
          <p>
            Think of frequency like pitch: low frequencies are “bass”, high frequencies are “treble”. A low-pass
            filter keeps the bass and throws away the treble; a high-pass does the opposite; a band-pass keeps only
            a chosen middle band; a band-stop digs a hole in a chosen band and keeps everything else.
          </p>
        </Callout>
        <ul>
          <li><strong>Low-pass filter (LPF):</strong> passes components with <T>{'|\\omega| \\le \\omega_c'}</T> and attenuates higher frequencies. Used for smoothing and de-noising.</li>
          <li><strong>High-pass filter (HPF):</strong> passes components with <T>{'|\\omega| \\ge \\omega_c'}</T>; removes slow drift/DC.</li>
          <li><strong>Band-pass filter (BPF):</strong> passes only <T>{'\\omega_{c1} \\le |\\omega| \\le \\omega_{c2}'}</T>; used, for example, to select one radio station.</li>
          <li><strong>Band-stop (band-reject) filter (BSF):</strong> attenuates only <T>{'\\omega_{c1} \\le |\\omega| \\le \\omega_{c2}'}</T>; used, for example, to remove 50&nbsp;Hz hum. A narrow band-stop is called a <em>notch</em> filter.</li>
        </ul>
      </Concept>

      <Figure
        title="Ideal magnitude responses of the four basic filter types"
        caption="The region shown shaded is the passband (gain ≈ 1: those frequencies survive). The white region is the stopband (gain ≈ 0: those frequencies are removed). ωc marks the cutoff frequency."
      >
        <FilterTypesDiagram />
      </Figure>

      {/* ---------------------------------------------------------- */}
      <h2 className="mt-10 font-serif text-xl font-bold text-navy-900">Part C — Systems, impulses and convolution</h2>

      <Concept n={12} title="What is an impulse signal δ[n]?">
        <Callout type="simple">
          <p>
            An impulse is the simplest possible “event”: perfect silence, then one single clap of size 1, then
            silence again. In a discrete signal it's just the list [1, 0, 0, 0, …].
          </p>
        </Callout>
        <p>
          The <strong>unit impulse</strong> (unit sample) is defined as
        </p>
        <T block>{'\\delta[n] = \\begin{cases} 1, & n = 0 \\\\ 0, & n \\ne 0 \\end{cases}'}</T>
        <p>
          It is the standard <strong>test signal</strong> of DSP, because any arbitrary signal{' '}
          <T>{'x[n]'}</T> can be written as a sum of scaled, shifted impulses:{' '}
          <T>{'x[n] = \\sum_k x[k]\\,\\delta[n-k]'}</T>. If we know how a system reacts to one impulse, we know how
          it reacts to <em>everything</em>.
        </p>
      </Concept>

      <Concept n={13} title="What is impulse response h[n]?">
        <Callout type="simple">
          <p>
            Clap once inside a cathedral and listen: the echo that follows tells you everything about the room.
            The impulse response is exactly that “echo shape” of a digital system — its unique fingerprint.
          </p>
        </Callout>
        <p>
          The <strong>impulse response</strong> <T>{'h[n]'}</T> of a system is its output when the input is the
          unit impulse: <T>{'\\delta[n] \\;\\longrightarrow\\; h[n]'}</T>. For a <strong>linear time-invariant
          (LTI)</strong> system — one that obeys superposition and whose behaviour doesn't change with time — the
          impulse response is a <em>complete description</em>: given <T>{'h[n]'}</T>, the output for any input can
          be computed by convolution (concept 15). In an FIR filter, the coefficients you see in the block diagram{' '}
          <em>are</em> the impulse-response samples.
        </p>
      </Concept>

      <Figure title="Send in one impulse, observe the impulse response">
        <ImpulseDiagram />
      </Figure>

      <Concept n={14} title="What is a system?">
        <Callout type="simple">
          <p>
            A system is anything that receives a signal and gives back a different signal. A guitar pedal, a
            microphone pre-amp, and our digital filter are all systems.
          </p>
        </Callout>
        <p>
          A <strong>system</strong> is a transformation that maps an input signal to an output signal:{' '}
          <T>{'y[n] = \\mathcal{T}\\{x[n]\\}'}</T>. Throughout this course we assume our filters are{' '}
          <strong>LTI</strong> (linear and time-invariant): (i) the response to a sum of inputs is the sum of the
          responses, and scaling the input scales the output; (ii) delaying the input simply delays the output.
          These two properties are what make the whole convolution/transfer-function machinery possible.
        </p>
      </Concept>

      <Concept n={15} title="What is convolution?">
        <Callout type="simple">
          <p>
            Convolution answers this question: “the input is a stream of impulses of different sizes arriving one
            after another — what total output do I get?” You flip the impulse response, slide it past the input,
            multiply where they overlap, and add. That's all.
          </p>
        </Callout>
        <p>
          The <strong>convolution sum</strong> computes the output of an LTI system from its impulse response:
        </p>
        <FormulaCard
          title="Convolution sum — the engine of every FIR filter"
          tex={'y[n] = x[n] * h[n] = \\sum_{k=-\\infty}^{\\infty} x[k]\\, h[n-k]'}
          symbols={[
            { s: 'x[k]', meaning: 'the input sequence, indexed by the dummy variable k' },
            { s: 'h[n-k]', meaning: 'the impulse response, flipped in time and shifted to position n' },
            { s: 'y[n]', meaning: 'the output sample at time n' },
            { s: '\\sum_k', meaning: '“flip, shift, multiply, then ADD over all positions k”' },
          ]}
          note="For an FIR filter only N terms survive, so the infinite sum collapses into the finite sum you will see in Question 1."
        />
        <p>
          Mechanical recipe for each <T>{'y[n]'}</T>: take <T>{'h[k]'}</T>, flip it about <T>{'k=0'}</T>, shift it
          so its origin sits at <T>{'n'}</T>, multiply point-by-point with <T>{'x[k]'}</T>, and add the products.
          Try it below.
        </p>
      </Concept>

      <ConvDemo />

      {/* ---------------------------------------------------------- */}
      <h2 className="mt-10 font-serif text-xl font-bold text-navy-900">Part D — Enter FIR</h2>

      <Concept n={16} title="What does FIR mean?">
        <Callout type="simple">
          <p>
            “Finite Impulse Response” means: if you clap once at the input, the filter's echo dies out completely
            after a fixed, finite number of samples. The filter only ever remembers a short, recent window of the
            input.
          </p>
        </Callout>
        <p>
          An <strong>FIR (Finite Impulse Response) filter</strong> is a digital filter whose impulse response{' '}
          <T>{'h[n]'}</T> is non-zero only over a finite interval, say{' '}
          <T>{'0 \\le n \\le N-1'}</T>. The output is a weighted sum of the <em>current and N−1 previous input
          samples only</em>:
        </p>
        <T block>{'y[n] = \\sum_{k=0}^{N-1} h[k]\\, x[n-k] = h[0]x[n] + h[1]x[n-1] + \\dots + h[N-1]x[n-N+1]'}</T>
        <p>
          There is <strong>no feedback</strong>: old outputs are never reused. That single fact gives FIR filters
          their famous properties — unconditional stability, exact linear phase, and freedom from limit-cycle
          oscillations — which Question 1 asks you to explain.
        </p>
      </Concept>

      <Concept n={17} title="FIR vs IIR — the two families of digital filters">
        <Callout type="simple">
          <p>
            IIR filters feed their own output back into the calculation, so a single clap can echo forever
            (“infinite”). FIR filters never feed anything back, so the echo always ends (“finite”).
          </p>
        </Callout>
        <DataTable
          caption="FIR versus IIR at a glance"
          head={['Aspect', 'FIR filter', 'IIR filter']}
          rows={[
            ['Impulse response', <>Finite duration (dies to exactly zero)</>, <>Infinite duration (can ring forever)</>],
            ['Feedback?', <>No feedback (non-recursive)</>, <>Uses feedback (recursive)</>],
            ['Stability', <>Always stable for finite coefficients</>, <>Can become unstable; poles must be checked</>],
            ['Linear phase?', <>Yes — exactly, with symmetric coefficients</>, <>Only approximately; phase is non-linear</>],
            ['Order / computation', <>Needs higher order (more arithmetic) for sharp cutoffs</>, <>Sharp responses at low order</>],
            ['Quantization effects', <>Robust; no limit cycles from feedback</>, <>Sensitive; limit-cycle oscillations possible</>],
          ]}
        />
      </Concept>

      <h2 className="mt-10 font-serif text-xl font-bold text-navy-900">Part E — The three building blocks</h2>
      <p className="mt-2 max-w-3xl text-[15px] leading-7 text-slate-700">
        Every digital filter you will ever draw — including every diagram in this course — is assembled from only
        these three elements.
      </p>

      <Concept n={18} title="What is a delay element?">
        <Callout type="simple">
          <p>
            A delay element is a one-sample memory: whatever number goes in now comes out one sample later. A row
            of delay elements is the filter's short-term memory of the recent past.
          </p>
        </Callout>
        <p>
          A <strong>delay element</strong> stores one sample for one sampling period, implementing{' '}
          <T>{'y[n] = x[n-1]'}</T>. In the z-domain it is written <T>{'z^{-1}'}</T>, which is why delay blocks are
          labelled “<T>{'z^{-1}'}</T>” in every diagram.
        </p>
      </Concept>

      <Concept n={19} title="What is a multiplier?">
        <Callout type="simple">
          <p>
            A multiplier scales a sample by a fixed constant — turning the “volume knob” on each remembered sample.
            The constants it multiplies by are exactly the filter coefficients h[0], h[1], …
          </p>
        </Callout>
        <p>
          A <strong>multiplier</strong> computes <T>{'y[n] = a\\,x[n]'}</T> where <T>{'a'}</T> is a constant
          coefficient. In an FIR filter the multiplier gains are the impulse-response values{' '}
          <T>{'h[k]'}</T>; choosing them is what “designing the filter” means.
        </p>
      </Concept>

      <Concept n={20} title="What is an adder?">
        <Callout type="simple">
          <p>
            An adder simply adds streams of numbers, sample by sample. The final adder is where all the scaled,
            delayed copies merge into the single output y[n].
          </p>
        </Callout>
        <p>
          An <strong>adder</strong> (summing node) computes <T>{'y[n] = x_1[n] + x_2[n] + \\dots'}</T>. Delays
          provide memory, multipliers provide weights, and adders combine everything — with just these three, the
          complete FIR output equation is realised in hardware.
        </p>
      </Concept>

      <Figure title="The three building blocks of every digital filter">
        <BuildingBlocks />
      </Figure>

      <ConceptCheck
        items={[
          {
            q: 'Your phone records 48,000 numbers per second from the microphone. Is that a continuous-time or discrete-time signal?',
            a: <>Discrete-time. It is a numbered sequence <T>{'x[n]'}</T> of samples taken every <T>{'T_s = 1/48000'}</T> s; between samples there is no stored value.</>,
          },
          {
            q: 'A filter removes hiss (very high frequencies) but keeps speech (low/mid frequencies). Which type is it?',
            a: <>A low-pass filter: it passes the low-frequency speech and attenuates the high-frequency hiss.</>,
          },
          {
            q: 'The output of a filter to the input [1, 0, 0, 0, …] is [0.5, 0.3, 0.1, 0, 0, …]. What is this output called, and is the filter FIR or IIR?',
            a: <>It is the impulse response <T>{'h[n]'}</T>. It ends after 3 samples — finite — so the filter is FIR (N = 3).</>,
          },
          {
            q: 'Which three physical elements are enough to build any FIR filter?',
            a: <>Delay elements (<T>{'z^{-1}'}</T>), multipliers (gains <T>{'h[k]'}</T>), and adders (Σ).</>,
          },
          {
            q: 'Why can “convolution” also be called “flip, shift, multiply, add”?',
            a: <>Because for each output sample you flip <T>{'h[k]'}</T> in time, shift it to position n, multiply the overlapping samples with <T>{'x[k]'}</T>, and add all the products: <T>{'y[n]=\\sum_k x[k]h[n-k]'}</T>.</>,
          },
        ]}
      />

      <Callout type="info" title="You are ready">
        <p>
          You now know every prerequisite word. Continue to{' '}
          <Link to="/structure" className="font-bold text-navy-700 underline">FIR Basic Structure</Link> to see how
          the three building blocks assemble into the classic FIR diagram, or jump straight to{' '}
          <Link to="/q1" className="font-bold text-navy-700 underline">Question 1</Link>.
        </p>
      </Callout>

      <PageFooter />
    </div>
  )
}

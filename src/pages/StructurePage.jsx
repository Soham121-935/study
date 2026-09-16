import React from 'react'
import { Link } from 'react-router-dom'
import T from '../components/TeX.jsx'
import {
  Callout,
  PageFooter,
  ModeNote,
  ConceptCheck,
  Steps,
  FormulaCard,
  DataTable,
} from '../components/ui.jsx'
import { FIRStructure, Figure, BuildingBlocks } from '../components/diagrams.jsx'
import { StemPlot, GraphCard } from '../components/plots.jsx'

export default function StructurePage() {
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-teal-700 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-white">
          Foundation Chapter
        </span>
        <span className="rounded-full bg-navy-50 px-3 py-1 text-[11px] font-semibold text-navy-700 ring-1 ring-navy-200">
          Read before / along with Question 1
        </span>
      </div>
      <h1 className="font-serif text-2xl font-bold leading-tight text-navy-900 md:text-3xl">
        The Basic Structure of an FIR Filter — the Tapped Delay Line
      </h1>
      <p className="mt-3 max-w-3xl text-[15px] leading-7 text-slate-700">
        A “structure” is a drawing of <em>how the filter is physically realised</em> — which blocks are wired to
        which. The FIR direct form below appears in almost every 8-mark answer in this guide, so we take it apart
        block by block here.
      </p>

      <ModeNote />

      <Figure
        title="Direct-form (transversal) structure of an N-tap FIR filter"
        caption="x[n] travels along a chain of delay elements. At each node a “tap” picks off a delayed copy, a multiplier scales it by a coefficient h[k], and the adder sums all the scaled copies to produce y[n]."
      >
        <FIRStructure />
      </Figure>

      <h2 className="mt-8 font-serif text-xl font-bold text-navy-900">The diagram, block by block</h2>

      <Steps
        items={[
          {
            title: 'The input rail (top line)',
            body: (
              <p>
                The current input sample <T>{'x[n]'}</T> enters on the left and flows along the top rail. Every
                block that touches this rail has access to the present or the remembered past of the input.
              </p>
            ),
          },
          {
            title: 'The chain of delay elements z⁻¹',
            math: 'x[n] \\;\\xrightarrow{\\;z^{-1}\\;}\\; x[n-1] \\;\\xrightarrow{\\;z^{-1}\\;}\\; x[n-2] \\;\\longrightarrow\\; \\cdots',
            body: (
              <p>
                Each <T>{'z^{-1}'}</T> block stores the sample for exactly one sampling period. After the first
                block the rail carries <T>{'x[n-1]'}</T>, after the second it carries <T>{'x[n-2]'}</T>, and so
                on — a sliding window of the most recent inputs. This is why the top row is called a{' '}
                <strong>tapped delay line</strong>, and why an FIR filter “remembers” exactly N input samples.
              </p>
            ),
          },
          {
            title: 'The taps and multipliers ×h[k]',
            math: '\\text{tap } k:\\quad x[n-k] \\;\\times\\; h[k]',
            body: (
              <p>
                A <strong>tap</strong> is simply a wire that picks off the signal at one node of the delay line.
                Each tapped signal passes through a multiplier with gain <T>{'h[k]'}</T> — the k-th coefficient of
                the impulse response. Tap 0 sees the current sample (no delay), tap 1 the one-sample-old sample,
                and so on.
              </p>
            ),
          },
          {
            title: 'The adder Σ',
            math: 'y[n] = h[0]x[n] + h[1]x[n-1] + h[2]x[n-2] + \\cdots + h[N-1]\\,x[n-N+1]',
            body: (
              <p>
                All the scaled copies flow down into one summing node, which adds them sample-by-sample to form
                the output <T>{'y[n]'}</T>. The equation in the adder is nothing but the convolution sum of the
                filter — the structure <em>is</em> the equation, drawn.
              </p>
            ),
          },
          {
            title: 'The output',
            body: (
              <p>
                <T>{'y[n]'}</T> leaves on the right: a weighted moving sum of recent inputs, where the weights are
                the filter coefficients. Choosing those N weights determines the filter's frequency response —
                that is the whole subject of Questions 7–10.
              </p>
            ),
          },
        ]}
      />

      <Callout type="why" title="Why is there no wire from the output back to the input?">
        <p>
          Because an FIR filter is <strong>non-recursive</strong>: <T>{'y[n]'}</T> depends only on the input
          samples <T>{'x[n], x[n-1], \\dots'}</T>, never on previous outputs <T>{'y[n-1], y[n-2], \\dots'}</T>.
          The absence of a feedback path is exactly what makes the impulse response finite, the filter always
          stable, and limit cycles impossible (all of this is the answer to Question 1).
        </p>
      </Callout>

      <h2 className="mt-10 font-serif text-xl font-bold text-navy-900">Vocabulary you must be fluent with</h2>

      <DataTable
        caption="Terms used everywhere in Questions 1–10"
        head={['Term', 'Meaning']}
        rows={[
          [<>N-tap filter</>, <>An FIR filter with N coefficients <T>{'h[0],\\dots,h[N-1]'}</T>. Here N = filter length; its delay line has N−1 delay blocks, so the filter <em>order</em> is N−1.</>],
          [<>Tap</>, <>One multiplier branch of the structure (a delayed copy + its coefficient).</>],
          [<>Coefficient</>, <>The constant <T>{'h[k]'}</T> of one tap; equals the impulse response at <T>{'n=k'}</T>.</>],
          [<>Order</>, <>Highest delay used, N−1 for an N-tap FIR (the highest power of <T>{'z^{-1}'}</T> in <T>{'H(z)'}</T>).</>],
          [<>Direct form</>, <>The straightforward structure above: it directly realises the difference equation with N multipliers, N−1 delays and an adder tree.</>],
          [<>Transversal filter</>, <>Another name for the same direct-form FIR — the signal travels “across” (transverse to) the taps.</>],
        ]}
      />

      <h2 className="mt-10 font-serif text-xl font-bold text-navy-900">Counting the hardware</h2>
      <p className="max-w-3xl text-[15px] leading-7 text-slate-700">
        A general N-tap direct-form FIR filter requires <strong>N multipliers</strong>,{' '}
        <strong>N−1 delay elements</strong> and <strong>N−1 additions</strong> per output sample. Later, in
        Question 2, you will see that <em>symmetric</em> coefficients let us pre-add pairs of signals that share
        the same coefficient, cutting the number of multipliers almost in half — a classic exam point.
      </p>

      <h2 className="mt-10 font-serif text-xl font-bold text-navy-900">A concrete 3-tap example</h2>
      <p className="max-w-3xl text-[15px] leading-7 text-slate-700">
        Let <T>{'h = [0.25,\\; 0.5,\\; 0.25]'}</T> — a tiny smoothing low-pass filter. Its structure is the general
        diagram trimmed to three taps, and its equation is
      </p>
      <T block>{'y[n] = 0.25\\,x[n] + 0.5\\,x[n-1] + 0.25\\,x[n-2]'}</T>
      <p className="max-w-3xl text-[15px] leading-7 text-slate-700">
        For the input <T>{'x=[2,4,2,6]'}</T> the output is{' '}
        <T>{'y[0]=0.25(2)=0.5'}</T>, <T>{'y[1]=0.25(4)+0.5(2)=2'}</T>,{' '}
        <T>{'y[2]=0.25(2)+0.5(4)+0.25(2)=3'}</T>, <T>{'y[3]=0.25(6)+0.5(2)+0.25(4)=3.5'}</T> — each output a gentle
        weighted average: sharp jumps in the input are smoothed, exactly what a low-pass filter should do.
      </p>

      <GraphCard title="The two building blocks meet the math" caption="Coefficients of this 3-tap example — the same numbers that sit on the multiplier symbols in the block diagram.">
        <StemPlot values={[0.25, 0.5, 0.25]} centerIndex={1} title="h[n] = [0.25, 0.5, 0.25]" />
      </GraphCard>

      <Figure title="Reminder — only three kinds of blocks appear">
        <BuildingBlocks />
      </Figure>

      <ConceptCheck
        items={[
          {
            q: 'How many delay elements and multipliers does a 7-tap direct-form FIR filter need?',
            a: <>6 delay elements and 7 multipliers (order = N−1 = 6; taps = N = 7).</>,
          },
          {
            q: 'What travels on the top rail of the direct-form structure?',
            a: <>The input and its progressively delayed copies: <T>{'x[n], x[n-1], x[n-2], \\dots'}</T> — the recent past of the input.</>,
          },
          {
            q: 'The adder output equation of an FIR filter is identical to which mathematical operation?',
            a: <>The convolution sum <T>{'y[n] = \\sum_{k=0}^{N-1} h[k]\\,x[n-k]'}</T> — limited to N terms because the impulse response is finite.</>,
          },
          {
            q: 'Why is an FIR filter also called a “transversal” filter?',
            a: <>Because the input signal travels across (transversely through) a row of taps, each tap contributing one weighted delayed copy to the sum.</>,
          },
        ]}
      />

      <Callout type="info" title="Next">
        <p>
          You can now read the most important picture in this course.{' '}
          <Link to="/q1" className="font-bold text-navy-700 underline">Question 1</Link> asks you to explain the
          characteristics of the FIR filter — starting exactly from this structure.
        </p>
      </Callout>

      <PageFooter />
    </div>
  )
}

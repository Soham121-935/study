/** Navigation model + learning order + search index */

export const GROUPS = [
  {
    label: 'Start Here',
    items: [
      { path: '/', label: 'Home', short: 'Home' },
      { path: '/zero', label: 'FIR From Zero — Absolute Basics', short: 'FIR From Zero' },
      { path: '/structure', label: 'FIR Basic Structure — Block Diagram', short: 'Basic Structure' },
    ],
  },
  {
    label: '8-Mark Questions 1–10',
    items: [
      { path: '/q1', label: 'Q1 · Characteristics of FIR Filter (Response & Transfer Function)', short: 'Q1 · Characteristics' },
      { path: '/q2', label: 'Q2 · Symmetric and Antisymmetric FIR Filters', short: 'Q2 · Symmetry' },
      { path: '/q3', label: 'Q3 · Transfer Function for h(n) = [2, 1, 1, 2]', short: 'Q3 · H(z) for h(n)=[2,1,1,2]' },
      { path: '/q4', label: 'Q4 · Frequency Response, Phase Delay & Group Delay (Numerical)', short: 'Q4 · Phase & Group Delay' },
      { path: '/q5', label: 'Q5 · Linear-Phase FIR for N = 11 — Constant Delays (Proof)', short: 'Q5 · N=11 Constant Delay Proof' },
      { path: '/q6', label: 'Q6 · Gibbs Phenomenon', short: 'Q6 · Gibbs Phenomenon' },
      { path: '/q7', label: 'Q7 · Types of FIR Filter Design — Advantages & Disadvantages', short: 'Q7 · Design Methods' },
      { path: '/q8', label: 'Q8 · Comparison of Window Functions', short: 'Q8 · Windows' },
      { path: '/q9', label: 'Q9 · FIR Design Using the Fourier Series Method', short: 'Q9 · Fourier Series Method' },
      { path: '/q10', label: 'Q10 · Ideal LPF Design, N = 11 (Full Numerical)', short: 'Q10 · LPF Design, N=11' },
    ],
  },
  {
    label: 'Wrap Up',
    items: [
      { path: '/revision', label: 'Quick Revision + Formula Sheet', short: 'Revision & Formula Sheet' },
    ],
  },
]

/** Flat learning order used by Previous / Next + progress tracker */
export const ORDER = [
  { path: '/', label: 'Home' },
  { path: '/zero', label: 'FIR From Zero' },
  { path: '/structure', label: 'FIR Basic Structure' },
  { path: '/q1', label: 'Question 1' },
  { path: '/q2', label: 'Question 2' },
  { path: '/q3', label: 'Question 3' },
  { path: '/q4', label: 'Question 4' },
  { path: '/q5', label: 'Question 5' },
  { path: '/q6', label: 'Question 6' },
  { path: '/q7', label: 'Question 7' },
  { path: '/q8', label: 'Question 8' },
  { path: '/q9', label: 'Question 9' },
  { path: '/q10', label: 'Question 10' },
  { path: '/revision', label: 'Quick Revision' },
]

/** Routes counted in the progress tracker (the 10 questions) */
export const QUESTION_ROUTES = ['/q1', '/q2', '/q3', '/q4', '/q5', '/q6', '/q7', '/q8', '/q9', '/q10']

export const SEARCH_INDEX = [
  { path: '/zero', title: 'FIR From Zero — signals, filters, impulse response, convolution', keywords: ['basics', 'signal', 'what is a signal', 'discrete time', 'continuous time', 'dsp', 'digital filter', 'why filters', 'noise', 'impulse', 'delta', 'convolution', 'fir meaning', 'iir', 'delay element', 'multiplier', 'adder', 'system'] },
  { path: '/zero', hash: 'filter-types', title: 'Low-pass, High-pass, Band-pass, Band-stop filters', keywords: ['low pass', 'lowpass', 'high pass', 'band pass', 'band stop', 'band reject', 'cutoff', 'passband', 'stopband', 'lpf', 'hpf', 'bpf'] },
  { path: '/structure', title: 'FIR Basic Structure — delay chain, taps, multipliers, adders', keywords: ['block diagram', 'structure', 'direct form', 'taps', 'tapped delay line', 'z inverse', 'delay chain'] },
  { path: '/q1', title: 'Q1 — Characteristics of the FIR filter (filter response & transfer function)', keywords: ['question 1', 'characteristics', 'transfer function', 'frequency response', 'magnitude response', 'phase response', 'difference equation', 'stability', 'bibo', 'non recursive', 'linear phase', 'advantages', 'finite impulse response'] },
  { path: '/q2', title: 'Q2 — Symmetric and Antisymmetric FIR filters', keywords: ['question 2', 'symmetric', 'antisymmetric', 'asymmetric', 'linear phase', 'mirror coefficients', 'multiplier savings', 'hardware', 'type 1', 'type 2', 'type 3', 'type 4'] },
  { path: '/q3', title: 'Q3 — Transfer function of FIR filter with h(n) = [2, 1, 1, 2]', keywords: ['question 3', 'h(n)=[2,1,1,2]', 'impulse response', 'transfer function', 'H(z)', 'z transform', '4 tap', 'four tap'] },
  { path: '/q4', title: 'Q4 — Frequency response of y(n)=0.25x(n)+x(n−1)+0.25x(n−2), phase delay and group delay', keywords: ['question 4', 'phase delay', 'group delay', 'frequency response', '0.25', 'e to j omega', 'magnitude'] },
  { path: '/q5', title: 'Q5 — Linear-phase FIR with N=11: prove phase and group delay are constant', keywords: ['question 5', 'n=11', 'prove', 'constant delay', 'linear phase', 'symmetric fir', 'group delay', 'phase delay', '11 tap'] },
  { path: '/q6', title: 'Q6 — Gibbs phenomenon', keywords: ['question 6', 'gibbs', 'overshoot', 'undershoot', 'ripple', 'ringing', 'truncation', 'fourier series', 'discontinuity'] },
  { path: '/q7', title: 'Q7 — Types of FIR filter design: Fourier series, Window, Frequency sampling, Optimal equiripple', keywords: ['question 7', 'design methods', 'fourier series method', 'window method', 'frequency sampling', 'equiripple', 'optimal', 'parks mcclellan', 'remez', 'advantages', 'disadvantages'] },
  { path: '/q8', title: 'Q8 — Compare window functions: Rectangular, Bartlett, Hann, Hamming, Blackman', keywords: ['question 8', 'window', 'rectangular', 'bartlett', 'triangular', 'hann', 'hanning', 'hamming', 'blackman', 'main lobe', 'side lobe', 'stopband attenuation', 'transition width', 'window visualizer'] },
  { path: '/q9', title: 'Q9 — FIR filter design using the Fourier series method (step-by-step)', keywords: ['question 9', 'fourier series method', 'design process', 'inverse dtft', 'integral', 'ideal impulse response', 'sinc', 'causal', 'truncate', 'steps', 'flowchart'] },
  { path: '/q10', title: 'Q10 — Design ideal low-pass filter, cutoff π/2, N=11: h(n) and H(z)', keywords: ['question 10', 'low pass filter design', 'lpf', 'n=11', 'cutoff pi by 2', 'h(n) values', 'H(z) polynomial', 'coefficients', 'numerical', 'sin(pi n/2)'] },
  { path: '/revision', title: 'Quick Revision + Formula Sheet — every FIR formula', keywords: ['revision', 'formula sheet', 'summary', 'all formulas', 'cheat sheet', 'quick revision', 'n tap', 'delay', 'window formulas'] },
]

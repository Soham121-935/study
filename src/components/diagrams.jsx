import React, { useId, useMemo, useState } from 'react'
import { ModeGate } from '../context/AppContext.jsx'

const ALL = ['beginner', 'detailed', 'exam']
const NAVY = '#175488'
const DARK = '#0a2540'
const SLATE = '#334155'
const AMBER = '#d97706'
const TEAL = '#0d9488'
const ROSE = '#e11d48'

/* ------------------------------------------------------------------ */
/* Figure wrapper                                                      */
/* ------------------------------------------------------------------ */

export function Figure({ title, caption, children, modes = ALL }) {
  return (
    <ModeGate modes={modes}>
      <figure className="my-5 rounded-xl border border-slate-200 bg-white p-4 shadow-card">
        {title && (
          <figcaption className="mb-2 border-b border-slate-100 pb-2 text-[13px] font-bold text-navy-900">
            {title}
          </figcaption>
        )}
        <div className="tex-scroll">{children}</div>
        {caption && (
          <p className="mt-2 border-t border-slate-100 pt-2 text-[12.5px] leading-5 text-slate-500">{caption}</p>
        )}
      </figure>
    </ModeGate>
  )
}

function Defs({ id, color = SLATE }) {
  return (
    <defs>
      <marker id={id} markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto" markerUnits="userSpaceOnUse">
        <path d="M0,0 L8,4.5 L0,9 Z" fill={color} />
      </marker>
    </defs>
  )
}

const boxStyle = (fill, stroke) => ({ fill, stroke, strokeWidth: 1.4 })

function Text({ x, y, children, size = 12, weight = 600, fill = SLATE, anchor = 'middle', italic = false }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight} fill={fill} fontStyle={italic ? 'italic' : 'normal'}>
      {children}
    </text>
  )
}

/* ------------------------------------------------------------------ */
/* 1 · Input → Filter → Output                                         */
/* ------------------------------------------------------------------ */

function MiniWave({ x, y, w = 74, h = 34, rough = false, color = NAVY }) {
  const pts = []
  const N = 60
  for (let i = 0; i <= N; i++) {
    const t = i / N
    const yy = rough
      ? Math.sin(t * Math.PI * 4) * 0.55 + Math.sin(t * Math.PI * 26) * 0.3 + Math.sin(t * Math.PI * 60) * 0.15
      : Math.sin(t * Math.PI * 4) * 0.62
    pts.push(`${i === 0 ? 'M' : 'L'}${(x + t * w).toFixed(1)},${(y - (yy * h) / 2).toFixed(1)}`)
  }
  return <path d={pts.join(' ')} fill="none" stroke={color} strokeWidth="1.8" />
}

export function SignalFlowDiagram() {
  const id = useId()
  return (
    <svg viewBox="0 0 760 150" className="w-full min-w-[520px]" role="img" aria-label="input signal to digital filter to output signal">
      <Defs id={id} />
      {/* input */}
      <rect x="20" y="40" width="150" height="70" rx="12" {...boxStyle('#ffffff', '#94a3b8')} />
      <MiniWave x={34} y={68} w={120} h={40} rough />
      <Text x={95} y={32} italic>x[n] — input (with noise)</Text>
      {/* arrow 1 */}
      <line x1="176" y1="75" x2="226" y2="75" stroke={SLATE} strokeWidth="1.8" markerEnd={`url(#${id})`} />
      {/* filter */}
      <rect x="232" y="36" width="200" height="78" rx="12" {...boxStyle('#123f68', '#123f68')} />
      <Text x={332} y={68} size={14} weight={800} fill="#ffffff">DIGITAL FILTER</Text>
      <Text x={332} y={90} size={12} weight={600} fill="#bcd8ee" italic>H(z)</Text>
      {/* arrow 2 */}
      <line x1="438" y1="75" x2="488" y2="75" stroke={SLATE} strokeWidth="1.8" markerEnd={`url(#${id})`} />
      {/* output */}
      <rect x="494" y="40" width="150" height="70" rx="12" {...boxStyle('#ffffff', '#94a3b8')} />
      <MiniWave x={508} y={68} w={120} h={40} />
      <Text x={569} y={32} italic>y[n] — cleaned output</Text>
      {/* removal note */}
      <Text x={332} y={136} size={11.5} weight={500} fill={AMBER}>
        the filter keeps wanted frequencies and reduces the unwanted ones
      </Text>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* 2 · Continuous-time vs discrete-time signal                         */
/* ------------------------------------------------------------------ */

export function CTvsDTDiagram() {
  const mk = (fn, N = 120, x0 = 34, w = 220, y0 = 72, h = 46) => {
    const pts = []
    for (let i = 0; i <= N; i++) {
      const t = i / N
      pts.push(`${i === 0 ? 'M' : 'L'}${(x0 + t * w).toFixed(1)},${(y0 - fn(t) * h).toFixed(1)}`)
    }
    return pts.join(' ')
  }
  const sine = (t) => 0.75 * Math.sin(t * Math.PI * 3)
  const stems = Array.from({ length: 13 }, (_, i) => i / 12)
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <svg viewBox="0 0 300 150" className="w-full" role="img" aria-label="continuous time signal">
        <rect x="24" y="70" width="252" height="2" fill="#cbd5e1" />
        <path d={mk(sine)} fill="none" stroke={NAVY} strokeWidth="2" />
        <Text x={150} y={125} italic size={12.5}>x(t) — defined at every instant of time</Text>
        <Text x={150} y={16} weight={800} size={12.5} fill={DARK}>Continuous-time signal</Text>
        <Text x={276} y={66} size={11} anchor="middle" italic>t</Text>
      </svg>
      <svg viewBox="0 0 300 150" className="w-full" role="img" aria-label="discrete time signal">
        <rect x="24" y="70" width="252" height="2" fill="#cbd5e1" />
        <path d={mk(sine)} fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />
        {stems.map((t, i) => {
          const cx = 34 + t * 220
          const cy = 72 - sine(t) * 46
          return (
            <g key={i}>
              <line x1={cx} y1={71} x2={cx} y2={cy} stroke={AMBER} strokeWidth="2" />
              <circle cx={cx} cy={cy} r="3" fill={AMBER} />
            </g>
          )
        })}
        <Text x={150} y={125} italic size={12.5}>x[n] — defined only at sample instants n = 0, 1, 2, …</Text>
        <Text x={150} y={16} weight={800} size={12.5} fill={DARK}>Discrete-time signal</Text>
        <Text x={276} y={66} size={11} anchor="middle" italic>n</Text>
      </svg>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 3 · Ideal responses of the four basic filter types                  */
/* ------------------------------------------------------------------ */

function FilterSketch({ label, desc, rects, cuts = [] }) {
  // x: 34..206 maps 0..π ; baseline y=92 ; top y=34 (gain 1)
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-2">
      <svg viewBox="0 0 230 150" className="w-full" role="img" aria-label={label}>
        <line x1="30" y1="92" x2="212" y2="92" stroke={SLATE} strokeWidth="1.2" />
        <line x1="34" y1="20" x2="34" y2="98" stroke={SLATE} strokeWidth="1.2" />
        <Text x={24} y={38} size={9.5}>1</Text>
        <Text x={24} y={95} size={9.5}>0</Text>
        {rects.map(([a, b], i) => (
          <rect key={i} x={34 + a * 172} y={34} width={(b - a) * 172} height={58} fill="#bcd8ee" stroke={NAVY} strokeWidth="1.6" />
        ))}
        {cuts.map((c, i) => (
          <line key={i} x1={34 + c.x * 172} y1={26} x2={34 + c.x * 172} y2={98} stroke={ROSE} strokeDasharray="4 3" strokeWidth="1.4" />
        ))}
        {cuts.map((c, i) => (
          <Text key={`t${i}`} x={34 + c.x * 172} y={110} size={9.5} fill={ROSE} italic>{c.label}</Text>
        ))}
        <Text x={206} y={110} size={9.5} italic>π</Text>
        <Text x={218} y={95} size={10} italic>ω</Text>
        <Text x={20} y={24} size={10} italic>|H|</Text>
        <Text x={115} y={132} size={11} weight={800} fill={DARK}>{label}</Text>
        <Text x={115} y={145} size={9.5} weight={500} fill="#64748b">{desc}</Text>
      </svg>
    </div>
  )
}

export function FilterTypesDiagram() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <FilterSketch label="Low-pass filter" desc="passes low frequencies, blocks high ones" rects={[[0, 0.45]]} cuts={[{ x: 0.45, label: 'ωc' }]} />
      <FilterSketch label="High-pass filter" desc="passes high frequencies, blocks low ones" rects={[[0.45, 1]]} cuts={[{ x: 0.45, label: 'ωc' }]} />
      <FilterSketch label="Band-pass filter" desc="passes only one band of frequencies" rects={[[0.3, 0.7]]} cuts={[{ x: 0.3, label: 'ωc1' }, { x: 0.7, label: 'ωc2' }]} />
      <FilterSketch label="Band-stop filter" desc="blocks one band, passes the rest" rects={[[0, 0.3], [0.7, 1]]} cuts={[{ x: 0.3, label: 'ωc1' }, { x: 0.7, label: 'ωc2' }]} />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 4 · Impulse in → impulse response out                               */
/* ------------------------------------------------------------------ */

export function ImpulseDiagram() {
  const id = useId()
  const hVals = [1, 0.6, 0.32, 0.15, 0.05]
  return (
    <svg viewBox="0 0 760 170" className="w-full min-w-[520px]" role="img" aria-label="unit impulse produces impulse response">
      <Defs id={id} />
      {/* delta stem */}
      <line x1="30" y1="120" x2="170" y2="120" stroke="#94a3b8" strokeWidth="1.2" />
      <line x1="66" y1="120" x2="66" y2="48" stroke={ROSE} strokeWidth="2.4" />
      <circle cx="66" cy="48" r="4" fill={ROSE} />
      <Text x="66" y="40" size={11.5} weight={700} fill={ROSE}>1</Text>
      <Text x="100" y="24" italic size={12.5} fill={DARK}>δ[n] — unit impulse</Text>
      <Text x="66" y="136" size={10} fill="#64748b">0</Text>
      <Text x="120" y="136" size={10} fill="#64748b">n</Text>
      {/* arrow */}
      <line x1="178" y1="85" x2="226" y2="85" stroke={SLATE} strokeWidth="1.8" markerEnd={`url(#${id})`} />
      {/* system */}
      <rect x="232" y="50" width="180" height="70" rx="12" {...boxStyle('#123f68', '#123f68')} />
      <Text x="322" y="78" size={13.5} weight={800} fill="#fff">DIGITAL SYSTEM</Text>
      <Text x="322" y={100} size={11.5} fill="#bcd8ee" italic>its “fingerprint” is h[n]</Text>
      {/* arrow */}
      <line x1="418" y1="85" x2="466" y2="85" stroke={SLATE} strokeWidth="1.8" markerEnd={`url(#${id})`} />
      {/* h[n] stems */}
      <line x1="478" y1="120" x2="740" y2="120" stroke="#94a3b8" strokeWidth="1.2" />
      {hVals.map((v, i) => {
        const cx = 500 + i * 46
        const cy = 120 - v * 76
        return (
          <g key={i}>
            <line x1={cx} y1={120} x2={cx} y2={cy} stroke={NAVY} strokeWidth="2.4" />
            <circle cx={cx} cy={cy} r="3.6" fill={NAVY} />
            <Text x={cx} y={136} size={10} fill="#64748b">{i}</Text>
          </g>
        )
      })}
      <Text x="600" y="24" italic size={12.5} fill={DARK}>h[n] — impulse response</Text>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* 5 · FIR direct-form block diagram                                   */
/* ------------------------------------------------------------------ */

function DelayBlock({ cx, cy }) {
  return (
    <g>
      <rect x={cx - 27} y={cy - 15} width="54" height="30" rx="6" {...boxStyle('#eef6fd', NAVY)} />
      <Text x={cx} y={cy + 5} size={13.5} weight={700} fill={NAVY} italic>z⁻¹</Text>
    </g>
  )
}

/**
 * Direct-form (transversal) FIR structure.
 *   labels: coefficient labels for each tap, e.g. ['h[0]','h[1]','h[2]','h[N−1]'] or ['2','1','1','2']
 *   ellipsis: draw the "…" continuation between the 3rd tap and the last tap
 */
export function FIRStructure({
  labels = ['h[0]', 'h[1]', 'h[2]', 'h[N−1]'],
  nodeLabels = ['x[n]', 'x[n−1]', 'x[n−2]', 'x[n−N+1]'],
  ellipsis = true,
  inputLabel = 'x[n]',
  outputLabel = 'y[n]',
}) {
  const id = useId()
  const railY = 74
  const multY = 156
  const sumY = 236
  let xs
  let delays = []
  if (ellipsis) {
    xs = [100, 225, 350].concat([600])
    delays = [162, 288, 552]
  } else {
    const n = labels.length
    const gap = n <= 4 ? 165 : 140
    xs = labels.map((_, i) => 100 + i * gap)
    delays = xs.slice(0, -1).map((v, i) => (v + xs[i + 1]) / 2)
  }
  const lastX = xs[xs.length - 1]
  const sumX = lastX + 78
  const outX = sumX + 88
  const width = outX + 46
  const height = 300

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[560px]" role="img" aria-label="FIR direct form block diagram">
      <Defs id={id} />
      {/* input arrow */}
      <line x1={26} y1={railY} x2={xs[0] - 6} y2={railY} stroke={SLATE} strokeWidth="1.8" markerEnd={`url(#${id})`} />
      <Text x={44} y={railY - 12} italic size={13} fill={DARK}>{inputLabel}</Text>

      {/* top rail segments */}
      {xs.slice(0, -1).map((xv, i) => {
        if (ellipsis && i === xs.length - 2) return null
        return <line key={i} x1={xv} y1={railY} x2={xs[i + 1]} y2={railY} stroke={SLATE} strokeWidth="1.8" />
      })}
      {/* ellipsis gaps */}
      {ellipsis && (
        <>
          <Text x={430} y={railY + 5} size={20} weight={800} fill={SLATE}>⋯</Text>
          <line x1={350} y1={railY} x2={392} y2={railY} stroke={SLATE} strokeWidth="1.8" />
          <line x1={470} y1={railY} x2={600} y2={railY} stroke={SLATE} strokeWidth="1.8" />
          <Text x={430} y={multY + 30} size={20} weight={800} fill={SLATE}>⋯</Text>
        </>
      )}

      {/* delay blocks */}
      {delays.map((cx, i) => (
        <DelayBlock key={i} cx={cx} cy={railY} />
      ))}

      {/* taps */}
      {labels.map((lb, i) => {
        const xv = xs[i]
        const nodeText = nodeLabels[i]
        return (
          <g key={i}>
            <circle cx={xv} cy={railY} r="4" fill={NAVY} />
            {i > 0 && <Text x={xv} y={railY - 12} italic size={11.5} fill="#64748b">{nodeText}</Text>}
            <line x1={xv} y1={railY} x2={xv} y2={multY - 14} stroke={SLATE} strokeWidth="1.6" />
            <circle cx={xv} cy={multY} r="13.5" {...boxStyle('#ffffff', NAVY)} />
            <Text x={xv} y={multY + 4.5} size={13} weight={700} fill={NAVY}>×</Text>
            <Text x={xv + 20} y={multY + 5} size={12.5} weight={800} fill={AMBER} anchor="start">{lb}</Text>
            <line x1={xv} y1={multY + 14} x2={xv} y2={sumY - 4} stroke={SLATE} strokeWidth="1.6" markerEnd={`url(#${id})`} />
          </g>
        )
      })}

      {/* summing rail */}
      <line x1={xs[0]} y1={sumY} x2={sumX - 18} y2={sumY} stroke={SLATE} strokeWidth="1.8" />
      <circle cx={sumX} cy={sumY} r="17" {...boxStyle('#123f68', '#123f68')} />
      <Text x={sumX} y={sumY + 6} size={16} weight={800} fill="#ffffff">Σ</Text>
      <Text x={sumX} y={sumY + 36} size={11} weight={600} fill="#64748b">adder</Text>
      <line x1={sumX + 18} y1={sumY} x2={outX} y2={sumY} stroke={SLATE} strokeWidth="1.8" markerEnd={`url(#${id})`} />
      <Text x={outX + 12} y={sumY + 5} italic size={13} fill={DARK}>{outputLabel}</Text>

      {/* annotations */}
      <Text x={(xs[0] + lastX) / 2} y={26} size={12} weight={700} fill={NAVY}>
        tapped delay line — each z⁻¹ block delays the signal by one sample
      </Text>
      <Text x={(xs[0] + lastX) / 2} y={284} size={12} weight={600} fill="#64748b">
        each tap multiplies a delayed copy by a coefficient h[k]; all products are added to form y[n]
      </Text>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* 6 · Building blocks: delay, multiplier, adder                       */
/* ------------------------------------------------------------------ */

export function BuildingBlocks() {
  const id = useId()
  const Item = ({ children, title, desc }) => (
    <div className="flex flex-col items-center rounded-xl border border-slate-200 bg-white p-3">
      <svg viewBox="0 0 240 92" className="w-full" role="img" aria-label={title}>
        <Defs id={id + title} />
        {children(id + title)}
      </svg>
      <div className="mt-1 text-[13px] font-bold text-navy-900">{title}</div>
      <div className="text-center text-[12px] leading-4.5 text-slate-500">{desc}</div>
    </div>
  )
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Item title="Delay element  z⁻¹" desc="Stores one sample. Output = input shifted by one sampling instant.">
        {(m) => (
          <>
            <line x1="12" y1="46" x2="78" y2="46" stroke={SLATE} strokeWidth="1.8" markerEnd={`url(#${m})`} />
            <rect x="84" y="24" width="72" height="44" rx="8" {...boxStyle('#eef6fd', NAVY)} />
            <Text x="120" y="52" size={15} weight={700} fill={NAVY} italic>z⁻¹</Text>
            <line x1="162" y1="46" x2="226" y2="46" stroke={SLATE} strokeWidth="1.8" markerEnd={`url(#${m})`} />
            <Text x="30" y="34" size={11} italic anchor="start">x[n]</Text>
            <Text x="196" y="34" size={11} italic>x[n−1]</Text>
          </>
        )}
      </Item>
      <Item title="Multiplier" desc="Scales a sample by a constant coefficient h[k].">
        {(m) => (
          <>
            <line x1="12" y1="46" x2="84" y2="46" stroke={SLATE} strokeWidth="1.8" markerEnd={`url(#${m})`} />
            <circle cx="120" cy="46" r="22" {...boxStyle('#ffffff', NAVY)} />
            <Text x="120" y="52" size={15} weight={800} fill={NAVY}>×</Text>
            <line x1="146" y1="46" x2="226" y2="46" stroke={SLATE} strokeWidth="1.8" markerEnd={`url(#${m})`} />
            <Text x="120" y="18" size={12} weight={700} fill={AMBER}>h[k]</Text>
            <line x1="120" y1="24" x2="120" y2="30" stroke={AMBER} strokeWidth="1.6" />
            <Text x="30" y="34" size={11} italic anchor="start">x[n]</Text>
            <Text x="196" y="34" size={11} italic>h[k]·x[n]</Text>
          </>
        )}
      </Item>
      <Item title="Adder (summing node)" desc="Adds two or more sample streams, sample by sample.">
        {(m) => (
          <>
            <line x1="12" y1="30" x2="92" y2="40" stroke={SLATE} strokeWidth="1.8" markerEnd={`url(#${m})`} />
            <line x1="12" y1="64" x2="92" y2="54" stroke={SLATE} strokeWidth="1.8" markerEnd={`url(#${m})`} />
            <circle cx="120" cy="47" r="22" {...boxStyle('#ffffff', NAVY)} />
            <Text x="120" y="53" size={15} weight={800} fill={NAVY}>Σ</Text>
            <line x1="146" y1="47" x2="226" y2="47" stroke={SLATE} strokeWidth="1.8" markerEnd={`url(#${m})`} />
            <Text x="30" y="20" size={11} italic anchor="start">a[n]</Text>
            <Text x="30" y="82" size={11} italic anchor="start">b[n]</Text>
            <Text x="196" y="30" size={11} italic>a[n]+b[n]</Text>
          </>
        )}
      </Item>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 7 · Symmetric / antisymmetric coefficient diagram                   */
/* ------------------------------------------------------------------ */

export function SymmetryStems({ type = 'sym' }) {
  const sym = type === 'sym'
  const vals = sym ? [0.55, 0.85, 1, 0.85, 0.55] : [0.55, 0.85, 0, -0.85, -0.55]
  const labs = sym ? ['h[0]', 'h[1]', 'h[2]', 'h[1]', 'h[0]'] : ['h[0]', 'h[1]', '0', '−h[1]', '−h[0]']
  const idxLabs = ['0', '1', '2', '3', '4']
  const W = 460
  const H = 220
  const yBase = sym ? 168 : 112
  const scale = 78
  const x = (i) => 60 + i * 85
  const centerX = x(2)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[380px]" role="img" aria-label={sym ? 'symmetric coefficients' : 'antisymmetric coefficients'}>
      <line x1="30" y1={yBase} x2={W - 24} y2={yBase} stroke={SLATE} strokeWidth="1.2" />
      {/* mirror axis */}
      <line x1={centerX} y1={14} x2={centerX} y2={H - 34} stroke={AMBER} strokeDasharray="6 4" strokeWidth="1.5" />
      <Text x={centerX} y={12} size={11} weight={700} fill={AMBER}>centre of symmetry (n = 2)</Text>
      {/* pair connectors */}
      {[[0, 4], [1, 3]].map(([a, b], i) => {
        const ya = yBase - vals[a] * scale - 8
        const yb = yBase - vals[b] * scale - 8
        const midX = (x(a) + x(b)) / 2
        if (sym) {
          const ctrlY = i === 0 ? 14 : -16
          const apexY = (ya + 2 * ctrlY + yb) / 4
          return (
            <g key={i}>
              <path d={`M ${x(a)} ${ya} Q ${midX} ${ctrlY} ${x(b)} ${yb}`} fill="none" stroke={TEAL} strokeDasharray="4 3" strokeWidth="1.4" />
              <rect x={midX - 10} y={apexY - 7.5} width="20" height="13" rx="4" fill="#f0fdfa" stroke={TEAL} strokeWidth="0.8" />
              <Text x={midX} y={apexY + 3} size={9.5} weight={800} fill={TEAL}>=</Text>
            </g>
          )
        }
        const midY = (ya + yb) / 2 + (vals[a] < 0 ? -12 : 0)
        return (
          <g key={i}>
            <line x1={x(a)} y1={ya} x2={x(b)} y2={yb} stroke={TEAL} strokeDasharray="4 3" strokeWidth="1.4" />
            <rect x={x(a) + 14} y={ya - 9} width="44" height="13" rx="4" fill="#f0fdfa" stroke={TEAL} strokeWidth="0.8" />
            <Text x={x(a) + 36} y={ya + 1.5} size={9.5} weight={800} fill={TEAL}>× (−1)</Text>
            <circle cx={midX} cy={midY} r="2.4" fill={TEAL} />
          </g>
        )
      })}
      {vals.map((v, i) => {
        const cy = yBase - v * scale
        return (
          <g key={i}>
            <line x1={x(i)} y1={yBase} x2={x(i)} y2={cy} stroke={v < 0 ? ROSE : NAVY} strokeWidth="2.6" />
            <circle cx={x(i)} cy={cy} r="4" fill={v < 0 ? ROSE : NAVY} />
            <Text x={x(i)} y={v >= 0 ? cy - 8 : cy + 16} size={11.5} weight={800} fill={v < 0 ? ROSE : NAVY}>{labs[i]}</Text>
            <Text x={x(i)} y={H - 18} size={10.5} fill="#64748b">n = {idxLabs[i]}</Text>
          </g>
        )
      })}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* 8 · Flowchart                                                       */
/* ------------------------------------------------------------------ */

export function Flowchart({ steps, modes = ALL }) {
  return (
    <ModeGate modes={modes}>
      <div className="my-5 rounded-xl border border-slate-200 bg-white p-4 shadow-card md:p-6">
        <div className="flex flex-col items-center">
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <div className="w-full max-w-lg rounded-xl border-2 border-navy-200 bg-navy-50/50 px-4 py-3 text-center">
                <div className="text-[12px] font-extrabold uppercase tracking-wider text-navy-600">Step {i + 1}</div>
                <div className="mt-0.5 text-[14.5px] font-bold text-navy-900">{s.title}</div>
                {s.body && <div className="prose-book mt-1 text-[13px] text-slate-600">{s.body}</div>}
              </div>
              {i < steps.length - 1 && (
                <div className="my-1 flex flex-col items-center">
                  <div className="h-5 w-0.5 bg-navy-400" />
                  <div className="h-0 w-0 border-x-[6px] border-t-[8px] border-x-transparent border-t-navy-400" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </ModeGate>
  )
}

/* ------------------------------------------------------------------ */
/* 9 · Interactive convolution demo                                    */
/* ------------------------------------------------------------------ */

export function ConvDemo() {
  const x = useMemo(() => [2, 4, 2, 6], [])
  const h = useMemo(() => [0.5, 0.5], [])
  const y = useMemo(() => {
    const out = new Array(x.length + h.length - 1).fill(0)
    x.forEach((xv, i) => h.forEach((hv, j) => (out[i + j] += xv * hv)))
    return out
  }, [x, h])
  const [n, setN] = useState(0)

  const rows = x.map((xv, k) => {
    const j = n - k
    const hval = j >= 0 && j < h.length ? h[j] : null
    return { k, xv, hval, prod: hval == null ? null : +(xv * hval).toFixed(2) }
  })

  return (
    <div className="my-5 rounded-xl border border-slate-200 bg-white p-4 shadow-card md:p-5">
      <div className="mb-1 text-[13px] font-bold text-navy-900">
        Try it yourself — convolution as “flip, shift, multiply, add”
      </div>
      <p className="mb-3 text-[12.5px] leading-5 text-slate-500">
        Signal <b>x</b> = [2, 4, 2, 6], smoothing filter <b>h</b> = [0.5, 0.5] (it averages two neighbours).
        Slide n and watch the shifted copy of h line up with x; the output is the sum of the products:
      </p>
      <div className="mb-3 flex items-center gap-3">
        <span className="text-[12.5px] font-bold text-navy-800">n = {n}</span>
        <input
          type="range"
          min={0}
          max={y.length - 1}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          className="w-full max-w-xs accent-navy-600"
          aria-label="convolution step n"
        />
      </div>
      <div className="tex-scroll">
        <table className="w-full min-w-[420px] text-center text-[13px]">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-slate-500">
              <th className="p-1.5 text-left">index k</th>
              {x.map((_, k) => (
                <th key={k} className="p-1.5">{k}</th>
              ))}
              <th className="p-1.5" />
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-slate-100">
              <td className="p-1.5 text-left font-semibold text-navy-800">x[k]</td>
              {x.map((v, k) => (
                <td key={k} className="p-1.5 font-semibold">{v}</td>
              ))}
              <td />
            </tr>
            <tr className="border-t border-slate-100">
              <td className="p-1.5 text-left font-semibold text-teal-700">h[n−k] (flipped, shifted to n)</td>
              {rows.map((r, k) => (
                <td key={k} className="p-1.5">
                  {r.hval == null ? <span className="text-slate-300">·</span> : (
                    <span className="inline-block rounded bg-teal-50 px-2 py-0.5 font-bold text-teal-700 ring-1 ring-teal-200">{r.hval}</span>
                  )}
                </td>
              ))}
              <td />
            </tr>
            <tr className="border-t border-slate-100">
              <td className="p-1.5 text-left font-semibold text-amber-700">x[k]·h[n−k]</td>
              {rows.map((r, k) => (
                <td key={k} className="p-1.5 font-semibold text-amber-700">
                  {r.prod == null ? <span className="text-slate-300">·</span> : r.prod}
                </td>
              ))}
              <td className="whitespace-nowrap p-1.5 text-left font-extrabold text-navy-800">
                ⇒ y[{n}] = {y[n]}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-3 rounded-lg bg-navy-50 px-3 py-2 text-[12.5px] text-navy-800">
        Full output:&nbsp;
        {y.map((v, i) => (
          <span key={i} className={`mr-1.5 inline-block rounded px-1.5 py-0.5 font-bold ${i === n ? 'bg-navy-600 text-white' : 'bg-white text-navy-700 ring-1 ring-navy-200'}`}>
            y[{i}] = {v}
          </span>
        ))}
      </div>
    </div>
  )
}

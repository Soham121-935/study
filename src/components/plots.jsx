import React from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ModeGate } from '../context/AppContext.jsx'

const ALL = ['beginner', 'detailed', 'exam']

/* ------------------------------------------------------------------ */
/* Card around any graph                                               */
/* ------------------------------------------------------------------ */

export function GraphCard({ title, caption, children, modes = ALL }) {
  return (
    <ModeGate modes={modes}>
      <figure className="my-5 rounded-xl border border-slate-200 bg-white p-4 shadow-card">
        {title && (
          <figcaption className="mb-1 text-[13px] font-bold text-navy-900">{title}</figcaption>
        )}
        {caption && <p className="mb-2 text-[12.5px] leading-5 text-slate-500">{caption}</p>}
        {children}
      </figure>
    </ModeGate>
  )
}

/* ------------------------------------------------------------------ */
/* Generic line plot for magnitude / phase / spectra                   */
/* ------------------------------------------------------------------ */

const NAVY = '#175488'
const AMBER = '#d97706'
const TEAL = '#0d9488'
const ROSE = '#e11d48'
const VIOLET = '#7c3aed'
export const PLOT_COLORS = { navy: NAVY, amber: AMBER, teal: TEAL, rose: ROSE, violet: VIOLET }

function fmt(v) {
  if (v == null || Number.isNaN(v)) return '—'
  if (Math.abs(v) < 1e-12) return '0'
  return Math.abs(v) >= 100 ? v.toFixed(1) : v.toFixed(4)
}

export function LinePlot({
  data,
  xKey = 'w',
  series = [{ key: 'mag', name: '|H|', color: NAVY }],
  xLabel,
  yLabel,
  height = 260,
  xTicks,
  xTickLabels = {},
  yDomain,
  refY = [0],
  refX = [],
  showLegend,
  xDecimals = 2,
}) {
  const labelFor = (v) => {
    const hit = Object.entries(xTickLabels).find(
      ([k]) => Math.abs(Number(k) - v) < 0.012,
    )
    return hit ? hit[1] : Number(v).toFixed(xDecimals)
  }
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 16, bottom: 22, left: 6 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey={xKey}
            type="number"
            domain={['dataMin', 'dataMax']}
            ticks={xTicks}
            tickFormatter={labelFor}
            tick={{ fontSize: 11, fill: '#475569' }}
            stroke="#94a3b8"
            label={
              xLabel
                ? { value: xLabel, position: 'insideBottomRight', offset: -12, fontSize: 12, fill: '#334155' }
                : undefined
            }
          />
          <YAxis
            domain={yDomain || ['auto', 'auto']}
            tick={{ fontSize: 11, fill: '#475569' }}
            stroke="#94a3b8"
            tickFormatter={(v) => (Math.abs(v) < 1 && v !== 0 ? v.toFixed(2) : Math.round(v * 100) / 100)}
            label={
              yLabel
                ? { value: yLabel, angle: -90, position: 'insideLeft', offset: 10, fontSize: 12, fill: '#334155' }
                : undefined
            }
          />
          <Tooltip
            formatter={(value, name) => [fmt(value), name]}
            labelFormatter={(v) => `${xLabel || xKey} = ${labelFor(v)} (${fmt(v)})`}
            contentStyle={{ fontSize: 12, borderRadius: 10, border: '1px solid #cbd5e1' }}
          />
          {showLegend && <Legend wrapperStyle={{ fontSize: 12 }} />}
          {refY.map((y) => (
            <ReferenceLine key={`y${y}`} y={y} stroke="#94a3b8" strokeDasharray="4 4" />
          ))}
          {refX.map((x) => (
            <ReferenceLine key={`x${x}`} x={x} stroke="#cbd5e1" strokeDasharray="4 4" />
          ))}
          {series.map((s) => (
            <Line
              key={s.key}
              type="linear"
              dataKey={s.key}
              name={s.name || s.key}
              stroke={s.color || NAVY}
              strokeWidth={s.width || 2.2}
              strokeDasharray={s.dashed ? '6 4' : undefined}
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Stem plot (impulse responses / coefficients) — pure SVG             */
/* ------------------------------------------------------------------ */

export function StemPlot({
  values,
  startIndex = 0,
  indexLabels,
  height = 230,
  title,
  centerIndex,
  valueFmt = (v) => (Math.abs(v) < 1e-12 ? '0' : v.toFixed(3)),
  yPadding = 0.18,
}) {
  const n = values.length
  const width = Math.max(460, n * 52 + 70)
  const ml = 46
  const mr = 16
  const mt = title ? 34 : 18
  const mb = 34
  const plotW = width - ml - mr
  const plotH = height - mt - mb
  const maxV = Math.max(0, ...values)
  const minV = Math.min(0, ...values)
  const span = maxV - minV || 1
  const hi = maxV + span * yPadding
  const lo = minV - span * yPadding
  const x = (i) => ml + (plotW * (i + 0.5)) / n
  const y = (v) => mt + plotH * (1 - (v - lo) / (hi - lo))
  const y0 = y(0)

  return (
    <div className="tex-scroll">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[380px]" role="img" aria-label={title || 'stem plot'}>
        {title && (
          <text x={width / 2} y={18} textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#0a2540">
            {title}
          </text>
        )}
        {/* axes */}
        <line x1={ml} y1={y0} x2={width - mr} y2={y0} stroke="#334155" strokeWidth="1.2" />
        <line x1={ml} y1={mt - 4} x2={ml} y2={height - mb + 4} stroke="#334155" strokeWidth="1.2" />
        {/* center dashed line */}
        {centerIndex != null && (
          <line
            x1={x(centerIndex - startIndex)}
            y1={mt - 4}
            x2={x(centerIndex - startIndex)}
            y2={height - mb + 4}
            stroke="#d97706"
            strokeDasharray="5 4"
            strokeWidth="1.4"
          />
        )}
        {values.map((v, i) => {
          const idx = startIndex + i
          const cx = x(i)
          const cy = y(v)
          const isCenter = centerIndex != null && idx === centerIndex
          return (
            <g key={i}>
              <line x1={cx} y1={y0} x2={cx} y2={cy} stroke={isCenter ? '#d97706' : '#175488'} strokeWidth="2.4" />
              <circle cx={cx} cy={cy} r="3.6" fill={isCenter ? '#d97706' : '#175488'} />
              <text x={cx} y={v >= 0 ? cy - 7 : cy + 14} textAnchor="middle" fontSize="10.5" fontWeight="600" fill="#0e3050">
                {valueFmt(v)}
              </text>
              <text x={cx} y={height - mb + 16} textAnchor="middle" fontSize="10.5" fill="#475569">
                {indexLabels ? indexLabels[i] : idx}
              </text>
            </g>
          )
        })}
        <text x={width - mr + 2} y={y0 - 6} textAnchor="start" fontSize="11" fontWeight="700" fill="#334155">n</text>
        <text x={ml - 6} y={mt - 6} textAnchor="end" fontSize="11" fontWeight="700" fill="#334155">h[n]</text>
      </svg>
    </div>
  )
}

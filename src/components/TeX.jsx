import React, { useMemo } from 'react'
import katex from 'katex'

/**
 * Render LaTeX with KaTeX.
 * <T>...</T>  → inline math
 * <T block>...</T> → display math (centered, textbook style)
 */
export default function T({ children, block = false, className = '' }) {
  const html = useMemo(() => {
    const src = typeof children === 'string' ? children : String(children)
    try {
      return katex.renderToString(src, {
        displayMode: block,
        throwOnError: false,
        strict: false,
        trust: true,
        output: 'html',
      })
    } catch {
      return src
    }
  }, [children, block])

  if (block) {
    return (
      <div
        className={`tex-scroll text-center ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />
}

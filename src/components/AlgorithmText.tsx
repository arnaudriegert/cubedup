// Priority 1: Strikethrough and bold (can span across parens)
const OUTER_REGEX = /(~[^~]+~|\*\*[^*]+\*\*)/g
// Priority 2: Parentheses (for nowrap)
const PAREN_REGEX = /(\([^)]+\))/g
// Priority 3: Brackets and triggers
const INNER_REGEX = /(\[[^\]]+\]|\{[^}]+\})/g

function renderInner(text: string, keyPrefix: string) {
  const parts = text.split(INNER_REGEX)
  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`
    if (part.match(/^\[.+\]$/)) {
      return <span key={key} className="algo-brackets">{part}</span>
    } else if (part.match(/^\{.+\}$/)) {
      return <em key={key}>{part.slice(1, -1)}</em>
    }
    return <span key={key}>{part}</span>
  })
}

function renderParens(text: string, keyPrefix: string) {
  const parts = text.split(PAREN_REGEX)
  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`
    if (part.match(/^\(.+\)$/)) {
      const inner = part.slice(1, -1)
      return (
        <span key={key} className="whitespace-nowrap">
          ({renderInner(inner, `${key}i`)})
        </span>
      )
    }
    return renderInner(part, `${key}o`)
  })
}

export default function AlgorithmText({ text }: { text: string }) {
  // First split by strikethrough/bold, then parentheses, then brackets/triggers
  const parts = text.split(OUTER_REGEX)

  return (
    <span className="font-mono">
      {parts.map((part, i) => {
        if (part.match(/^~.+~$/)) {
          return (
            <span key={i} className="algo-strikethrough">
              {renderParens(part.slice(1, -1), `s${i}`)}
            </span>
          )
        } else if (part.match(/^\*\*.+\*\*$/)) {
          return (
            <span key={i} className="algo-bold">
              {renderParens(part.slice(2, -2), `b${i}`)}
            </span>
          )
        }
        return renderParens(part, `t${i}`)
      })}
    </span>
  )
}

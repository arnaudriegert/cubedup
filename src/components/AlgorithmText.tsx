const ALGORITHM_REGEX = /(~[^~]+~|\*\*[^*]+\*\*|\[[^\]]+\]|\{[^}]+\})/g

export default function AlgorithmText({ text }: { text: string }) {
  const parts = text.split(ALGORITHM_REGEX)

  return (
    <>
      {parts.map((part, i) => {
        if (part.match(/^~.+~$/)) {
          return (
            <span key={i} className="algo-strikethrough">
              {part.slice(1, -1)}
            </span>
          )
        } else if (part.match(/^\*\*.+\*\*$/)) {
          return (
            <span key={i} className="algo-bold">
              {part.slice(2, -2)}
            </span>
          )
        } else if (part.match(/^\[.+\]$/)) {
          return (
            <span key={i} className="algo-brackets">
              {part}
            </span>
          )
        } else if (part.match(/^\{.+\}$/)) {
          return <em key={i}>{part.slice(1, -1)}</em>
        }
        return <span key={i}>{part}</span>
      })}
    </>
  )
}

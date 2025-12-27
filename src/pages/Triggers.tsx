import { Link } from 'react-router-dom'
import { getTriggerPairsByTag, getAlgorithm } from '../data/algorithms'
import type { Algorithm } from '../types/algorithm'
import { AlgorithmDisplay } from '../components/algorithm'
import SEOHead from '../components/SEOHead'
import { getPlaygroundUrlForNotation } from '../utils/algorithmLinks'
import { expandAlgorithmObject } from '../utils/algorithmExpander'
import { movesToNotation, invertMoves } from '../utils/moveParser'

// ============================================================================
// Presentational data - UI-specific, references algorithm data via tags
// ============================================================================

interface TriggerCategory {
  name: string
  description: string
  tag: string // Links to algorithm tags
}

const triggerCategories: TriggerCategory[] = [
  {
    name: 'Core Triggers',
    description: 'The most frequently used algorithm building blocks',
    tag: 'core',
  },
  {
    name: 'Wide Triggers',
    description: 'Triggers using wide moves (lowercase r/l = two layers together). These affect the M slice, making them useful for edge-related cases.',
    tag: 'wide',
  },
  {
    name: 'Sune Family',
    description: 'The Sune family algorithms orient corners. Chair (Anti-Sune) and Sune are inverses—learning one gives you both. These are standalone OLL solutions and building blocks for other algorithms.',
    tag: 'sune-family',
  },
]

const triggerDescriptions: Record<string, string> = {
  'sexy': 'The most common trigger. Used in nearly half of all OLL algorithms.',
  'left-sexy': 'Mirror of sexy move, executed with left hand.',
  'sledge': 'Second most common trigger. Often paired with sexy move.',
  'left-sledge': 'Mirror of sledgehammer.',
  'fat-sexy': 'Wide version of sexy move. Affects the M slice.',
  'left-fat-sexy': 'Wide version of left sexy move.',
  'fat-sledge': 'Wide version of sledgehammer.',
  'left-fat-sledge': 'Wide version of left sledgehammer.',
  'chair': 'Also known as Anti-Sune. Inverse is Sune.',
  'left-chair': 'Mirror of Chair. Inverse is Left Sune.',
  'half-sune': 'First half of Sune. Appears in many OLL/PLL algorithms.',
  'left-half-sune': 'First half of Left Sune. Mirror of Half Sune.',
}

// ============================================================================

// Trigger badge styled like algorithm trigger tokens
function TriggerBadge({ name }: { name: string }) {
  return (
    <span className="px-2 py-1 text-sm font-mono italic rounded-full bg-indigo-200 text-indigo-800 border border-indigo-400">
      {name}
    </span>
  )
}

function TriggerCard({ algorithm }: { algorithm: Algorithm }) {
  const expanded = expandAlgorithmObject(algorithm)
  const moves = movesToNotation(expanded.moves)
  const inverseMoves = movesToNotation(invertMoves(expanded.moves))

  // Check if there's an explicit inverse algorithm with a different name
  const inverseAlgo = algorithm.inverse ? getAlgorithm(algorithm.inverse) : null
  const inverseName = inverseAlgo ? inverseAlgo.id : `${algorithm.id}'`

  const description = triggerDescriptions[algorithm.id]

  return (
    <div className="case-card">
      {/* Badge as header */}
      <div className="mb-3">
        <TriggerBadge name={algorithm.id} />
      </div>
      {description && (
        <p className="help-text mb-4">{description}</p>
      )}
      <div className="space-y-3">
        {/* Main trigger */}
        <div className="group/algocard rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors p-3">
          <div className="flex items-center gap-2">
            <Link
              to={getPlaygroundUrlForNotation(moves)}
              title="Demo"
              className="shrink-0 w-6 h-6 flex items-center justify-center rounded
                text-indigo-600 hover:bg-indigo-100 transition-opacity
                opacity-0 group-hover/algocard:opacity-100"
            >
              <span className="text-sm">▶</span>
            </Link>
            <div className="flex-1 min-w-0">
              <AlgorithmDisplay
                notation={moves}
                size="sm"
                pinnable
                parentHoverGroup="algocard"
              />
            </div>
          </div>
        </div>

        {/* Inverse */}
        <div className="pt-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="label-text">Inverse</span>
            <TriggerBadge name={inverseName} />
          </div>
          <div className="group/algocard rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors p-3">
            <div className="flex items-center gap-2">
              <Link
                to={getPlaygroundUrlForNotation(inverseMoves)}
                title="Demo"
                className="shrink-0 w-6 h-6 flex items-center justify-center rounded
                  text-indigo-600 hover:bg-indigo-100 transition-opacity
                  opacity-0 group-hover/algocard:opacity-100"
              >
                <span className="text-sm">▶</span>
              </Link>
              <div className="flex-1 min-w-0">
                <AlgorithmDisplay
                  notation={inverseMoves}
                  size="sm"
                  pinnable
                  parentHoverGroup="algocard"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TriggerPairDisplay({ pair }: { pair: [Algorithm, Algorithm] }) {
  const [left, right] = pair
  return (
    <div className="md:col-span-2">
      <div className="pair-container">
        <TriggerCard algorithm={left} />
        <TriggerCard algorithm={right} />
      </div>
    </div>
  )
}

export default function Triggers() {
  return (
    <>
      <SEOHead
        title="Algorithm Triggers"
        description="Learn the building blocks of CFOP algorithms. Master triggers like the sexy move and sledgehammer to read and execute OLL/PLL algorithms faster."
        path="/triggers"
      />

      <header className="header-gradient text-center py-8">
        <h1 className="page-header-title">Algorithm Triggers</h1>
        <p className="page-header-subtitle">
          Building blocks for OLL and PLL algorithms
        </p>
      </header>

      <main className="main-content-detailed">
        {/* Introduction */}
        <div className="section-card mb-8">
          <h2 className="section-subtitle-centered">What are Triggers?</h2>
          <p className="body-text text-center max-w-2xl mx-auto mb-4">
            Triggers are short move sequences that appear repeatedly in OLL and PLL algorithms.
            Learning these building blocks makes it easier to memorize and execute full algorithms.
          </p>
          <p className="text-sm text-slate-500 text-center max-w-2xl mx-auto">
            <strong>How to use this page:</strong> Learn each trigger until it becomes automatic—you should
            execute {'{sexy}'} without consciously thinking "R U R' U'". Practice both the trigger and its
            inverse; many algorithms use both. Once triggers are internalized, OLL and PLL algorithms written in
            shorthand become readable at a glance.
          </p>
        </div>

        {/* Trigger Categories */}
        {triggerCategories.map((category) => {
          const pairs = getTriggerPairsByTag(category.tag)
          return (
            <section key={category.name} className="case-group">
              <h2 className="section-title">{category.name}</h2>
              <p className="section-description">{category.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {pairs.map((pair, index) => (
                  <TriggerPairDisplay key={index} pair={pair} />
                ))}
              </div>
            </section>
          )
        })}
      </main>
    </>
  )
}

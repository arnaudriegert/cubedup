import type { ReactNode } from 'react'
import { getTriggerPairsByTag, getAlgorithm } from '../data/algorithms'
import type { Algorithm } from '../types/algorithm'
import { AlgoCardRow } from '../components/algorithm'
import SEOHead from '../components/SEOHead'
import { getPlaygroundUrlForNotation, getPlaygroundUrlForAlgorithm } from '../utils/algorithmLinks'
import { expandAlgorithmObject } from '../utils/algorithmExpander'
import { movesToNotation, invertMoves } from '../utils/moveParser'
import './Triggers.css'

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
    name: 'Sune Family',
    description: 'Corner orientation algorithms. Each card shows the inverse (Chair/Anti-Sune). Our OLL algorithms favor Chair when possible—it\'s part of the beginner method.',
    tag: 'sune-family',
  },
  {
    name: 'Wide Triggers',
    description: 'Triggers using wide moves (lowercase r/l = two layers together). These affect the M slice, making them useful for edge-related cases.',
    tag: 'wide',
  },
  // The 'pll' tag is rendered by its own section below, which needs prose
  // around the pairs rather than a single description line.
]

const triggerDescriptions: Record<string, ReactNode> = {
  'sexy': 'The most common trigger. Used in nearly half of all OLL algorithms.',
  'left-sexy': 'Mirror of sexy move, executed with left hand.',
  'sledge': 'Second most common trigger. Often paired with sexy move.',
  'left-sledge': 'Mirror of sledgehammer.',
  'fat-sexy': 'Wide version of sexy move. Affects the M slice.',
  'left-fat-sexy': 'Wide version of left sexy move.',
  'fat-sledge': 'Wide version of sledgehammer.',
  'left-fat-sledge': 'Wide version of left sledgehammer.',
  'fat-sune': 'Wide version of Sune. Inverse is Fat Chair.',
  'left-fat-sune': 'Wide version of Left Sune.',
  'sune': 'Classic corner orientation trigger. Inverse is Chair (Anti-Sune).',
  'left-sune': 'Mirror of Sune. Inverse is Left Chair.',
  'half-sune': 'First half of Sune. Appears in many OLL/PLL algorithms.',
  'left-half-sune': 'First half of Left Sune. Mirror of Half Sune.',
  'fexy': (
    <>
      Sexy move ending on <MoveBadge moves="F'" /> instead of <MoveBadge moves="U'" />.
      Opens Jb. Read backwards it is y-hook.
    </>
  ),
  'y-hook': 'The same four moves as fexy, reversed. Opens the Y-perm, and is the setup half of the wrap in T and OLL 37.',
  'left-fexy': 'Mirror of fexy, executed with left hand. Builds Ja the way fexy builds Jb.',
  'n-block': 'Do it twice in a row and the Nb-perm is solved—there is nothing else to the algorithm.',
  'left-n-block': 'Mirror of n-block. Twice through solves Na instead.',
}

// ============================================================================

// Trigger badge styled like algorithm trigger tokens. Use inline when naming a
// trigger inside a sentence - the brace notation ({sexy}) is internal tokenizer
// syntax and is never shown to readers.
function TriggerBadge({ name, inline = false }: { name: string; inline?: boolean }) {
  return <span className={inline ? 'trigger-badge-inline' : 'trigger-badge'}>{name}</span>
}

// Moves named in running text, styled like the move tokens in algorithm displays.
function MoveBadge({ moves }: { moves: string }) {
  return (
    <span className="move-badge-group">
      {moves.trim().split(/\s+/).map((move, i) => (
        <span key={i} className="move-badge-inline">{move}</span>
      ))}
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
        <AlgoCardRow
          notation={moves}
          playgroundUrl={getPlaygroundUrlForNotation(moves)}
        />

        {/* Inverse */}
        <div className="pt-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="label-text">Inverse</span>
            <TriggerBadge name={inverseName} />
          </div>
          <AlgoCardRow
            notation={inverseMoves}
            playgroundUrl={getPlaygroundUrlForNotation(inverseMoves)}
          />
        </div>
      </div>
    </div>
  )
}

// The 'pll' triggers are split across two sections, so select by member ID
// rather than giving them layout-only tags.
function pairsFor(triggerId: string): [Algorithm, Algorithm][] {
  return getTriggerPairsByTag('pll').filter((pair) => pair.some((t) => t.id === triggerId))
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
            execute <TriggerBadge name="sexy" inline /> without consciously thinking
            {' '}<MoveBadge moves="R U R' U'" />. Practice both the trigger and its
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

        {/* fexy / y-hook and the cycle the PLL cases share */}
        <section className="case-group">
          <h2 className="section-title">fexy and y-hook</h2>
          <p className="section-description">
            Take a sexy move and finish it on <MoveBadge moves="F'" /> instead of
            {' '}<MoveBadge moves="U'" />. That is
            {' '}<TriggerBadge name="fexy" inline />—four moves, one letter different
            from the trigger you already know. Read those same four moves backwards and
            you get <TriggerBadge name="y-hook" inline />, so called because it is
            exactly how the Y-perm opens. One block, two names, the same way
            {' '}<TriggerBadge name="chair" inline /> and
            {' '}<TriggerBadge name="sune" inline /> are one sequence read two ways: an
            algorithm uses whichever it <em>starts</em> with, so the prime lands on the
            undo.
          </p>
          <p className="section-description">
            Its job is wrapping. Set up, turn once, undo—
            {' '}<TriggerBadge name="y-hook" inline /> <MoveBadge moves="U'" />
            {' '}<TriggerBadge name="y-hook'" inline />—and put
            {' '}<TriggerBadge name="sexy" inline /> <TriggerBadge name="sledge" inline />
            {' '}beside it, and you have a five-block cycle that four cases all share.
            Where you start reading it is the only difference between them:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pairsFor('fexy').map((pair, index) => (
              <TriggerPairDisplay key={index} pair={pair} />
            ))}

            <div className="case-card">
              <h3 className="case-card-title">OLL 37</h3>
              <p className="help-text mb-4">The wrap on its own.</p>
              <AlgoCardRow
                algorithm={getAlgorithm('oll-37-2')}
                playgroundUrl={getPlaygroundUrlForAlgorithm('oll-37-2')}
              />
            </div>
            <div className="case-card">
              <h3 className="case-card-title">Y-perm</h3>
              <p className="help-text mb-4">
                The same wrap, with <TriggerBadge name="sexy" inline />
                {' '}<TriggerBadge name="sledge" inline /> added after it.
              </p>
              <AlgoCardRow
                algorithm={getAlgorithm('pll-y')}
                playgroundUrl={getPlaygroundUrlForAlgorithm('pll-y')}
              />
            </div>
            <div className="case-card">
              <h3 className="case-card-title">T-perm</h3>
              <p className="help-text mb-4">
                Y-perm's two halves in the opposite order: the same blocks, with
                {' '}<TriggerBadge name="sexy" inline /> <TriggerBadge name="sledge" inline />
                {' '}leading instead of trailing.
              </p>
              <AlgoCardRow
                algorithm={getAlgorithm('pll-t')}
                playgroundUrl={getPlaygroundUrlForAlgorithm('pll-t')}
              />
            </div>
            <div className="case-card">
              <h3 className="case-card-title">Jb-perm</h3>
              <p className="help-text mb-4">
                Starts one block later again, which splits the wrap across the two ends—
                so it reads with <TriggerBadge name="fexy" inline /> rather than
                {' '}<TriggerBadge name="y-hook" inline />. Ja is its mirror, using the
                left-hand blocks throughout.
              </p>
              <AlgoCardRow
                algorithm={getAlgorithm('pll-jb')}
                playgroundUrl={getPlaygroundUrlForAlgorithm('pll-jb')}
              />
            </div>
          </div>

          <p className="section-description mt-8">
            That covers 2-look PLL corners: permute corners first, and check for
            "headlights" (two matching colors on one side). Headlights? T-perm. None?
            Y-perm. Either way you land on an edges-only case.
          </p>
        </section>

        {/* n-block - a PLL trigger, but a different kind of one */}
        <section className="case-group">
          <h2 className="section-title">The n-block</h2>
          <p className="section-description">
            A special case, and the only trigger here that is a whole algorithm by
            itself. Repeat <TriggerBadge name="n-block" inline /> twice and the Nb-perm
            is solved. Its mirror does the same for Na.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pairsFor('n-block').map((pair, index) => (
              <TriggerPairDisplay key={index} pair={pair} />
            ))}
          </div>
        </section>
      </main>
    </>
  )
}

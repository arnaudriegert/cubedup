import { useState } from 'react'
import { Link } from 'react-router-dom'
import { triggerCategories, Trigger } from '../data/triggers'
import { AlgorithmDisplay } from '../components/algorithm'
import SEOHead from '../components/SEOHead'
import { getPlaygroundUrlForNotation } from '../utils/algorithmLinks'

function TriggerCard({
  trigger, flashcardMode,
}: {
  trigger: Trigger
  flashcardMode: boolean
}) {
  const inverseNotation = trigger.inverseNotation || `${trigger.notation}'`
  const inverseName = trigger.inverseNotation
    ? trigger.inverseNotation.slice(1, -1)
    : `${trigger.notation.slice(1, -1)}'`

  return (
    <div className="case-card">
      <div className="flex justify-between items-start mb-4">
        <h4 className="case-card-title mb-0">{trigger.name}</h4>
        <span className="text-sm italic text-indigo-700 bg-indigo-100 border border-indigo-200 px-2 py-0.5 rounded-full">
          {trigger.notation.slice(1, -1)}
        </span>
      </div>
      {trigger.description && (
        <p className="help-text mb-4">{trigger.description}</p>
      )}
      <div className="space-y-3">
        {/* Main trigger */}
        <div className="group/algocard rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors p-3">
          <div className="flex items-center gap-2">
            <Link
              to={getPlaygroundUrlForNotation(trigger.moves)}
              title="Demo"
              className="shrink-0 w-6 h-6 flex items-center justify-center rounded
                text-indigo-600 hover:bg-indigo-100 transition-opacity
                opacity-0 group-hover/algocard:opacity-100"
            >
              <span className="text-sm">▶</span>
            </Link>
            <div className="flex-1 min-w-0">
              <AlgorithmDisplay
                algorithm={flashcardMode
                  ? {
                    decomposition: [{ moves: trigger.moves, trigger: trigger.notation }],
                  }
                  : { decomposition: [{ moves: trigger.moves }] }
                }
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
            <span className="text-xs italic text-indigo-700 bg-indigo-100 border border-indigo-200 px-1.5 py-0.5 rounded-full">
              {inverseName}
            </span>
          </div>
          <div className="group/algocard rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors p-3">
            <div className="flex items-center gap-2">
              <Link
                to={getPlaygroundUrlForNotation(trigger.inverse)}
                title="Demo"
                className="shrink-0 w-6 h-6 flex items-center justify-center rounded
                  text-indigo-600 hover:bg-indigo-100 transition-opacity
                  opacity-0 group-hover/algocard:opacity-100"
              >
                <span className="text-sm">▶</span>
              </Link>
              <div className="flex-1 min-w-0">
                <AlgorithmDisplay
                  algorithm={flashcardMode
                    ? {
                      decomposition: [{ moves: trigger.inverse, trigger: inverseNotation }],
                    }
                    : { decomposition: [{ moves: trigger.inverse }] }
                  }
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

export default function Triggers() {
  const [flashcardMode, setFlashcardMode] = useState(false)

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

      {/* Sticky toggle */}
      <nav className="section-nav sticky top-0 z-20">
        <div className="flex justify-center">
          <label className="flex items-center gap-3">
            <span className="toggle-label">Flashcard mode</span>
            <input
              type="checkbox"
              checked={flashcardMode}
              onChange={(e) => setFlashcardMode(e.target.checked)}
              className="toggle-checkbox"
            />
          </label>
        </div>
      </nav>

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
            inverse; many algorithms use both. The <strong>Flashcard Mode</strong> toggle hides full notation,
            letting you test your recall. Once triggers are internalized, OLL and PLL algorithms written in
            shorthand become readable at a glance.
          </p>
        </div>

        {/* Trigger Categories */}
        {triggerCategories.map((category) => (
          <section key={category.name} className="case-group">
            <h2 className="section-title">{category.name}</h2>
            <p className="section-description">{category.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {category.triggers.map((entry, index) => (
                <div key={index} className="md:col-span-2">
                  <div className="pair-container">
                    <TriggerCard trigger={entry[0]} flashcardMode={flashcardMode} />
                    <TriggerCard trigger={entry[1]} flashcardMode={flashcardMode} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </>
  )
}

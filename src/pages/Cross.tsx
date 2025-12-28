import { useState } from 'react'
import { CentersToggle } from '../components/CentersToggle'
import SEOHead from '../components/SEOHead'
import { PatternIntro } from '../components/PatternIntro'
import { CaseGroup4Rotations } from '../components/CaseGroup4Rotations'
import type { CFOPStep } from '../utils/pieceIdentity'

export default function Cross() {
  const [hideCenters, setHideCenters] = useState(false)
  const mask: CFOPStep = hideCenters ? 'cross-no-centers' : 'cross'

  return (
    <>
      <SEOHead
        title="Cross Patterns"
        description="Learn efficient cross planning for the Rubik's Cube. Practice pattern recognition across all color orientations for faster inspection planning."
        path="/cross"
      />

      <header className="header-gradient text-center py-8">
        <h1 className="page-header-title">Cross Patterns</h1>
        <p className="page-header-subtitle">
          Train pattern recognition across all colors and orientations
        </p>
      </header>

      <main className="main-content-wide">
        <PatternIntro cubeView="bottom-front-right" mask={mask}>
          <p className="body-text mb-3">
            The cross has four edges, each requiring the same insertion patterns—just from different
            angles. This page trains you to recognize these patterns <strong>regardless of which
              edge you're solving</strong>.
          </p>
          <p className="help-text mb-3">
            Each case shows <strong>four cubes</strong>: the same pattern rotated to all four front
            colors. Left and right variants train both hands. The goal is instant recognition—see
            the pattern, execute without thinking.
          </p>
          <p className="text-sm text-slate-500">
            Toggle the <strong>side centers</strong> off to practice relative placement: positioning
            edges correctly relative to each other before worrying about which slot is which.
            This builds the spatial intuition needed for efficient cross planning.
          </p>
        </PatternIntro>

        <CaseGroup4Rotations
          title="1. Bad Edge on Top (white facing out)"
          description="Edge on top layer with white facing sideways—can't insert directly. First two moves swing it down into its slot, last move restores the neighbor."
          left={{ id: 'cross-top-left', steps: [{ moves: "L F' L'" }] }}
          right={{ id: 'cross-top-right', steps: [{ moves: "R' F R" }] }}
          mask={mask}
        />

        <CaseGroup4Rotations
          title="2. Bad Edge in Middle Layer"
          description="Edge stuck between top and bottom layers, white facing sideways. First move swings it down, D opens the neighbor's slot, last move restores the neighbor."
          left={{ id: 'cross-middle-left', steps: [{ moves: "L D L'" }] }}
          right={{ id: 'cross-middle-right', steps: [{ moves: "R' D' R" }] }}
          mask={mask}
        />

        <CaseGroup4Rotations
          title="3. Flipped Edge in Own Slot"
          description="Edge is in the right place but white faces out instead of down. Kick it to the side, rotate bottom, tuck it under, rotate back."
          left={{ id: 'cross-flipped-left', steps: [{ moves: "F D' L D" }] }}
          right={{ id: 'cross-flipped-right', steps: [{ moves: "F' D R' D'" }] }}
          mask={mask}
        />

        <CaseGroup4Rotations
          title="4. Two Edges at Once"
          description="Good edge in the middle layer, bad edge flipped wrong on top in the neighbor's slot. First move inserts the good edge while the bad one becomes good in the middle, second move inserts it."
          left={{ id: 'cross-two-edges-left', steps: [{ moves: "L F'" }] }}
          right={{ id: 'cross-two-edges-right', steps: [{ moves: "R' F" }] }}
          mask={mask}
        />

        <div className="section-card text-center">
          <p className="text-gray-500 italic">More cross patterns to come...</p>
        </div>
      </main>

      <CentersToggle hideCenters={hideCenters} onToggle={() => setHideCenters(!hideCenters)} />
    </>
  )
}

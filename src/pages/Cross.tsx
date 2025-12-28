import { useState } from 'react'
import { CentersToggle } from '../components/CentersToggle'
import { Cube, CubeDisplay } from '../components/cube'
import { CaseCard4Rotations } from '../components/CaseCard.4Rotations'
import SEOHead from '../components/SEOHead'
import { createSolvedCube } from '../utils/cubeState'
import { applyMask, type CFOPStep } from '../utils/pieceIdentity'

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
        {/* Introduction */}
        <div className="section-card mb-8">
          <div className="flex flex-wrap justify-center items-center gap-8">
            <CubeDisplay>
              <Cube
                cubeState={applyMask(createSolvedCube(), mask)}
                view="bottom-front-right"
                size="normal"
              />
            </CubeDisplay>
            <div className="text-left max-w-lg">
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
            </div>
          </div>
        </div>

        {/* Case 1: Bad Edge on Top */}
        <div className="case-group">
          <h3 className="card-title-centered mb-2">1. Bad Edge on Top (white facing out)</h3>
          <p className="help-text mb-6 text-center">
            Edge on top layer with white facing sideways—can't insert directly.
            First two moves swing it down into its slot, last move restores the neighbor.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CaseCard4Rotations
              isLeft
              algorithm={{ id: 'cross-top-left', steps: [{ moves: "L F' L'" }] }}
              mask={mask}
            />
            <CaseCard4Rotations
              algorithm={{ id: 'cross-top-right', steps: [{ moves: "R' F R" }] }}
              mask={mask}
            />
          </div>
        </div>

        {/* Case 2: Bad Edge in Middle Layer */}
        <div className="case-group">
          <h3 className="card-title-centered mb-2">2. Bad Edge in Middle Layer</h3>
          <p className="help-text mb-6 text-center">
            Edge stuck between top and bottom layers, white facing sideways.
            First move swings it down, D opens the neighbor's slot, last move restores the neighbor.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CaseCard4Rotations
              isLeft
              algorithm={{ id: 'cross-middle-left', steps: [{ moves: "L D L'" }] }}
              mask={mask}
            />
            <CaseCard4Rotations
              algorithm={{ id: 'cross-middle-right', steps: [{ moves: "R' D' R" }] }}
              mask={mask}
            />
          </div>
        </div>

        {/* Case 3: Flipped Edge in Own Slot */}
        <div className="case-group">
          <h3 className="card-title-centered mb-2">3. Flipped Edge in Own Slot</h3>
          <p className="help-text mb-6 text-center">
            Edge is in the right place but white faces out instead of down.
            Kick it to the side, rotate bottom, tuck it under, rotate back.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CaseCard4Rotations
              isLeft
              algorithm={{ id: 'cross-flipped-left', steps: [{ moves: "F D' L D" }] }}
              mask={mask}
            />
            <CaseCard4Rotations
              algorithm={{ id: 'cross-flipped-right', steps: [{ moves: "F' D R' D'" }] }}
              mask={mask}
            />
          </div>
        </div>

        {/* Case 4: Two Edges at Once */}
        <div className="case-group">
          <h3 className="card-title-centered mb-2">4. Two Edges at Once</h3>
          <p className="help-text mb-6 text-center">
            Good edge in the middle layer, bad edge flipped wrong on top in the neighbor's slot.
            First move inserts the good edge while the bad one becomes good in the middle, second move inserts it.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CaseCard4Rotations
              isLeft
              algorithm={{ id: 'cross-two-edges-left', steps: [{ moves: "L F'" }] }}
              mask={mask}
            />
            <CaseCard4Rotations
              algorithm={{ id: 'cross-two-edges-right', steps: [{ moves: "R' F" }] }}
              mask={mask}
            />
          </div>
        </div>

        {/* More to come */}
        <div className="section-card text-center">
          <p className="text-gray-500 italic">More cross patterns to come...</p>
        </div>
      </main>

      <CentersToggle hideCenters={hideCenters} onToggle={() => setHideCenters(!hideCenters)} />
    </>
  )
}

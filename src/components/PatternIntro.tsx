import type { ReactNode } from 'react'
import { Cube, CubeDisplay } from './cube'
import { createSolvedCube } from '../utils/cubeState'
import { applyMask } from '../utils/pieceIdentity'
import type { CFOPStep } from '../utils/pieceIdentity'
import type { CubeView } from '../types/cubeState'

interface PatternIntroProps {
  cubeView: CubeView
  mask: CFOPStep
  children: ReactNode
}

export function PatternIntro({ cubeView, mask, children }: PatternIntroProps) {
  return (
    <div className="section-card mb-8">
      <div className="flex flex-wrap justify-center items-center gap-8">
        <CubeDisplay>
          <Cube
            cubeState={applyMask(createSolvedCube(), mask)}
            view={cubeView}
            size="normal"
          />
        </CubeDisplay>
        <div className="text-left max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}

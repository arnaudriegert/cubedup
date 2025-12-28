import { CaseCard4Rotations } from './CaseCard.4Rotations'
import type { Algorithm } from '../types/algorithm'
import type { CFOPStep } from '../utils/pieceIdentity'

interface CaseGroup4RotationsProps {
  title: string
  description: string
  left: Algorithm
  right: Algorithm
  mask: CFOPStep
}

export function CaseGroup4Rotations({
  title,
  description,
  left,
  right,
  mask,
}: CaseGroup4RotationsProps) {
  return (
    <div className="case-group">
      <h3 className="card-title-centered mb-2">{title}</h3>
      <p className="help-text mb-6 text-center">{description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CaseCard4Rotations isLeft algorithm={left} mask={mask} />
        <CaseCard4Rotations algorithm={right} mask={mask} />
      </div>
    </div>
  )
}

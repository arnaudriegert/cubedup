import { Color, FaceColors } from '../../types/cube'
import { GridSize, FACE_SIZE_REM } from './constants'
import Face from './Face'

export interface CubeFaces {
  top?: FaceColors
  bottom?: FaceColors
  front?: FaceColors
  back?: FaceColors
  left?: FaceColors
  right?: FaceColors
}

// Default gray face (unspecified)
const grayFace: FaceColors = [
  Color.GRAY, Color.GRAY, Color.GRAY,
  Color.GRAY, Color.GRAY, Color.GRAY,
  Color.GRAY, Color.GRAY, Color.GRAY,
]

interface IsometricCubeProps {
  faces: CubeFaces
  view?: 'top-front-right' | 'top-front-left' | 'bottom-front-right'
  size?: GridSize
  className?: string
}

/**
 * IsometricCube - 3D isometric view of a Rubik's cube showing 3 faces
 *
 * Views:
 * - 'top-front-right': Standard view with yellow top visible (good for F2L, OLL)
 * - 'top-front-left': Mirrored view showing left side (good for left-handed F2L)
 * - 'bottom-front-right': Tilted view with white bottom visible (good for Cross)
 */
export default function IsometricCube({
  faces,
  view = 'top-front-right',
  size = 'normal',
  className = '',
}: IsometricCubeProps) {
  const faceSize = FACE_SIZE_REM[size]

  const containerStyle = {
    width: `${faceSize * 1.8}rem`,
    height: `${faceSize * 1.8}rem`,
    perspective: '37.5rem',
  }

  // Dynamic styles that depend on faceSize
  const faceMargin = {
    marginLeft: `${-faceSize / 2}rem`,
    marginTop: `${-faceSize / 2}rem`,
  }

  const translateZ = `${faceSize / 2}rem`

  if (view === 'top-front-right') {
    return (
      <div className={`relative ${className}`} style={containerStyle}>
        <div
          className="absolute inset-0 transform-3d"
          style={{ transform: 'rotateX(-20deg) rotateY(-20deg)' }}
        >
          <div className="absolute left-1/2 top-1/2 origin-center" style={{
            ...faceMargin,
            transform: `rotateX(90deg) translateZ(${translateZ})`,
          }}>
            <Face colors={faces.top ?? grayFace} size={size} />
          </div>
          <div className="absolute left-1/2 top-1/2 origin-center" style={{
            ...faceMargin,
            transform: `translateZ(${translateZ})`,
          }}>
            <Face colors={faces.front ?? grayFace} size={size} />
          </div>
          <div className="absolute left-1/2 top-1/2 origin-center" style={{
            ...faceMargin,
            transform: `rotateY(90deg) translateZ(${translateZ})`,
          }}>
            <Face colors={faces.right ?? grayFace} size={size} />
          </div>
        </div>
      </div>
    )
  }

  if (view === 'top-front-left') {
    return (
      <div className={`relative ${className}`} style={containerStyle}>
        <div
          className="absolute inset-0 transform-3d"
          style={{ transform: 'rotateX(-20deg) rotateY(20deg)' }}
        >
          <div className="absolute left-1/2 top-1/2 origin-center" style={{
            ...faceMargin,
            transform: `rotateX(90deg) translateZ(${translateZ})`,
          }}>
            <Face colors={faces.top ?? grayFace} size={size} />
          </div>
          <div className="absolute left-1/2 top-1/2 origin-center" style={{
            ...faceMargin,
            transform: `translateZ(${translateZ})`,
          }}>
            <Face colors={faces.front ?? grayFace} size={size} />
          </div>
          <div className="absolute left-1/2 top-1/2 origin-center" style={{
            ...faceMargin,
            transform: `rotateY(-90deg) translateZ(${translateZ})`,
          }}>
            <Face colors={faces.left ?? grayFace} size={size} />
          </div>
        </div>
      </div>
    )
  }

  // bottom-front-right view
  return (
    <div className={`relative ${className}`} style={containerStyle}>
      <div
        className="absolute inset-0 transform-3d"
        style={{ transform: 'rotateX(20deg) rotateY(-30deg)' }}
      >
        <div className="absolute left-1/2 top-1/2 origin-center" style={{
          ...faceMargin,
          transform: `rotateX(-90deg) translateZ(${translateZ})`,
        }}>
          <Face colors={faces.bottom ?? grayFace} size={size} />
        </div>
        <div className="absolute left-1/2 top-1/2 origin-center" style={{
          ...faceMargin,
          transform: `translateZ(${translateZ})`,
        }}>
          <Face colors={faces.front ?? grayFace} size={size} />
        </div>
        <div className="absolute left-1/2 top-1/2 origin-center" style={{
          ...faceMargin,
          transform: `rotateY(90deg) translateZ(${translateZ})`,
        }}>
          <Face colors={faces.right ?? grayFace} size={size} />
        </div>
      </div>
    </div>
  )
}

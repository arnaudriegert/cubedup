import { TopFace, type GridSize } from './LastLayerGrid'
import { Color, type TopFaceColors } from '../types/cube'

export interface CubeFaces {
  top?: TopFaceColors
  bottom?: TopFaceColors
  front?: TopFaceColors
  back?: TopFaceColors
  left?: TopFaceColors
  right?: TopFaceColors
}

// Default gray face (unspecified)
const grayFace: TopFaceColors = [
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
 * Uses CSS transforms to create a 3D perspective:
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
  // Face size based on TopFace actual dimensions
  // TopFace uses size-12 (3rem = 48px) stickers in a 3x3 grid with 2px gaps
  // So face is approximately: 3*48 + 2*2 + 2*2 = 152px for normal
  // Medium uses size-8 (2rem = 32px): 3*32 + 2*2 + 2*2 = 104px
  // Compact uses size-4 (1rem = 16px): 3*16 + 2*2 + 2*2 = 56px
  const faceSizes = {
    compact: 56,
    medium: 104,
    normal: 152,
  }
  const faceSize = faceSizes[size]

  if (view === 'top-front-right') {
    return (
      <div
        className={`relative ${className}`}
        style={{
          width: faceSize * 1.8,
          height: faceSize * 1.8,
          perspective: '600px',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateX(-20deg) rotateY(-20deg)',
          }}
        >
          {/* Top face */}
          <div
            className="absolute"
            style={{
              transform: `rotateX(90deg) translateZ(${faceSize / 2}px)`,
              transformOrigin: 'center center',
              left: '50%',
              top: '50%',
              marginLeft: -faceSize / 2,
              marginTop: -faceSize / 2,
            }}
          >
            <TopFace colors={faces.top ?? grayFace} size={size} />
          </div>

          {/* Front face */}
          <div
            className="absolute"
            style={{
              transform: `translateZ(${faceSize / 2}px)`,
              left: '50%',
              top: '50%',
              marginLeft: -faceSize / 2,
              marginTop: -faceSize / 2,
            }}
          >
            <TopFace colors={faces.front ?? grayFace} size={size} />
          </div>

          {/* Right face */}
          <div
            className="absolute"
            style={{
              transform: `rotateY(90deg) translateZ(${faceSize / 2}px)`,
              transformOrigin: 'center center',
              left: '50%',
              top: '50%',
              marginLeft: -faceSize / 2,
              marginTop: -faceSize / 2,
            }}
          >
            <TopFace colors={faces.right ?? grayFace} size={size} />
          </div>
        </div>
      </div>
    )
  }

  if (view === 'top-front-left') {
    return (
      <div
        className={`relative ${className}`}
        style={{
          width: faceSize * 1.8,
          height: faceSize * 1.8,
          perspective: '600px',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateX(-20deg) rotateY(20deg)',
          }}
        >
          {/* Top face */}
          <div
            className="absolute"
            style={{
              transform: `rotateX(90deg) translateZ(${faceSize / 2}px)`,
              transformOrigin: 'center center',
              left: '50%',
              top: '50%',
              marginLeft: -faceSize / 2,
              marginTop: -faceSize / 2,
            }}
          >
            <TopFace colors={faces.top ?? grayFace} size={size} />
          </div>

          {/* Front face */}
          <div
            className="absolute"
            style={{
              transform: `translateZ(${faceSize / 2}px)`,
              left: '50%',
              top: '50%',
              marginLeft: -faceSize / 2,
              marginTop: -faceSize / 2,
            }}
          >
            <TopFace colors={faces.front ?? grayFace} size={size} />
          </div>

          {/* Left face */}
          <div
            className="absolute"
            style={{
              transform: `rotateY(-90deg) translateZ(${faceSize / 2}px)`,
              transformOrigin: 'center center',
              left: '50%',
              top: '50%',
              marginLeft: -faceSize / 2,
              marginTop: -faceSize / 2,
            }}
          >
            <TopFace colors={faces.left ?? grayFace} size={size} />
          </div>
        </div>
      </div>
    )
  }

  // bottom-front-right view: tilt to show bottom face
  return (
    <div
      className={`relative ${className}`}
      style={{
        width: faceSize * 1.8,
        height: faceSize * 1.8,
        perspective: '600px',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'rotateX(20deg) rotateY(-30deg)',
        }}
      >
        {/* Bottom face */}
        <div
          className="absolute"
          style={{
            transform: `rotateX(-90deg) translateZ(${faceSize / 2}px)`,
            transformOrigin: 'center center',
            left: '50%',
            top: '50%',
            marginLeft: -faceSize / 2,
            marginTop: -faceSize / 2,
          }}
        >
          <TopFace colors={faces.bottom ?? grayFace} size={size} />
        </div>

        {/* Front face */}
        <div
          className="absolute"
          style={{
            transform: `translateZ(${faceSize / 2}px)`,
            left: '50%',
            top: '50%',
            marginLeft: -faceSize / 2,
            marginTop: -faceSize / 2,
          }}
        >
          <TopFace colors={faces.front ?? grayFace} size={size} />
        </div>

        {/* Right face */}
        <div
          className="absolute"
          style={{
            transform: `rotateY(90deg) translateZ(${faceSize / 2}px)`,
            transformOrigin: 'center center',
            left: '50%',
            top: '50%',
            marginLeft: -faceSize / 2,
            marginTop: -faceSize / 2,
          }}
        >
          <TopFace colors={faces.right ?? grayFace} size={size} />
        </div>
      </div>
    </div>
  )
}

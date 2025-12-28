import { Cube, CubeDisplay } from '../components/cube'
import SEOHead from '../components/SEOHead'
import { createSolvedCube } from '../utils/cubeState'
import { applyMask } from '../utils/pieceIdentity'

export default function Cross() {
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
          Learn to recognize patterns in all color orientations
        </p>
      </header>

      <main className="main-content-wide">
        {/* Introduction */}
        <div className="section-card text-center mb-8">
          <h2 className="section-subtitle">Building an Efficient Cross</h2>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <CubeDisplay>
              <Cube
                cubeState={applyMask(createSolvedCube(), 'cross')}
                view="bottom-front-right"
                size="normal"
              />
            </CubeDisplay>
            <div className="text-left max-w-md">
              <p className="body-text mb-2">
                <strong>Cross on bottom</strong>, with edges matching center colors.
              </p>
              <p className="help-text mb-3">
                While beginners often solve the cross on top (watching their work), advanced solvers
                build it on the bottom—freeing their eyes to track F2L pairs during cross execution.
              </p>
              <p className="text-sm text-slate-500">
                <strong>Speed comes from planning.</strong> During the 15-second inspection period, identify
                where each edge sits and mentally trace an efficient solution. Good cross solutions average
                6-8 moves. The patterns below train you to recognize common positions across all four cross colors.
              </p>
            </div>
          </div>
        </div>

        {/* More cases coming soon */}
        <div className="section-card text-center">
          <p className="text-gray-500 italic">Cross patterns coming soon...</p>
        </div>
      </main>
    </>
  )
}

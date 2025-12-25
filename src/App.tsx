import { lazy, Suspense } from 'react'
import {
  BrowserRouter, Routes, Route, Navigate,
} from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'

// Lazy load all pages for code splitting
const Home = lazy(() => import('./pages/Home'))
const Cross = lazy(() => import('./pages/Cross'))
const F2L = lazy(() => import('./pages/F2L'))
const OLL = lazy(() => import('./pages/OLL'))
const OLLOverview = lazy(() => import('./pages/OLLOverview'))
const OLLDetailed = lazy(() => import('./pages/OLLDetailed'))
const PLL = lazy(() => import('./pages/PLL'))
const PLLOverview = lazy(() => import('./pages/PLLOverview'))
const PLLDetailed = lazy(() => import('./pages/PLLDetailed'))
const Triggers = lazy(() => import('./pages/Triggers'))
const Playground = lazy(() => import('./pages/Playground'))
const Privacy = lazy(() => import('./pages/Privacy'))

// Loading fallback
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter basename="/cubedup">
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>
      <div className="flex">
        <Sidebar />
        <main id="main-content" className="flex-1 min-w-0 flex flex-col min-h-screen page-bg">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cross" element={<Cross />} />
              <Route path="/f2l" element={<F2L />} />
              <Route path="/oll" element={<OLL />}>
                <Route index element={<Navigate to="detailed" replace />} />
                <Route path="detailed" element={<OLLDetailed />} />
                <Route path="overview" element={<OLLOverview />} />
              </Route>
              <Route path="/pll" element={<PLL />}>
                <Route index element={<Navigate to="detailed" replace />} />
                <Route path="detailed" element={<PLLDetailed />} />
                <Route path="overview" element={<PLLOverview />} />
              </Route>
              <Route path="/triggers" element={<Triggers />} />
              <Route path="/playground" element={<Playground />} />
              <Route path="/privacy" element={<Privacy />} />
            </Routes>
          </Suspense>
          <Footer />
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App

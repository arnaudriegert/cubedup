import {
  BrowserRouter, Routes, Route, Navigate,
} from 'react-router-dom'
import Home from './pages/Home'
import Cross from './pages/Cross'
import F2L from './pages/F2L'
import OLL from './pages/OLL'
import OLLOverview from './pages/OLLOverview'
import OLLDetailed from './pages/OLLDetailed'
import PLL from './pages/PLL'
import PLLOverview from './pages/PLLOverview'
import PLLDetailed from './pages/PLLDetailed'
import Triggers from './pages/Triggers'
import Sidebar from './components/Sidebar'

function App() {
  return (
    <BrowserRouter basename="/rubik">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-w-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cross" element={<Cross />} />
            <Route path="/f2l" element={<F2L />} />
            <Route path="/oll" element={<OLL />}>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<OLLOverview />} />
              <Route path="detailed" element={<OLLDetailed />} />
            </Route>
            <Route path="/pll" element={<PLL />}>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<PLLOverview />} />
              <Route path="detailed" element={<PLLDetailed />} />
            </Route>
            <Route path="/triggers" element={<Triggers />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App

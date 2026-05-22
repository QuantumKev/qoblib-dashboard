import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { DecathlonPage } from './pages/DecathlonPage'
import { LabPage } from './pages/LabPage'
import { LearnPage } from './pages/LearnPage'
import { OverviewPage } from './pages/OverviewPage'
import { PortfolioPage } from './pages/PortfolioPage'
import { PresentPage } from './pages/PresentPage'

function DashboardShell() {
  return (
    <div className="flex min-h-full">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8 lg:p-10">
        <Outlet />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || undefined}>
      <Routes>
        <Route path="/present" element={<PresentPage />} />
        <Route element={<DashboardShell />}>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/decathlon" element={<DecathlonPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/lab" element={<LabPage />} />
          <Route path="/learn" element={<LearnPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

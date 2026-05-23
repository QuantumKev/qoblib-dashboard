import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { DecathlonPage } from './pages/DecathlonPage'
import { LabPage } from './pages/LabPage'
import { LearnPage } from './pages/LearnPage'
import { OverviewPage } from './pages/OverviewPage'
import { PortfolioPage } from './pages/PortfolioPage'
import { PresentPage } from './pages/PresentPage'
import { WorkforcePage } from './pages/WorkforcePage'

function DashboardShell() {
  return <AppShell />
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
          <Route path="/workforce" element={<WorkforcePage />} />
          <Route path="/learn" element={<LearnPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

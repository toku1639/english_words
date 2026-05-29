import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AppProvider } from './hooks/useAppData'
import { ListPage } from './pages/ListPage'
import { ReviewPage } from './pages/ReviewPage'
import { StatsPage } from './pages/StatsPage'
import { StudyPage } from './pages/StudyPage'

function App() {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

  return (
    <AppProvider>
      <BrowserRouter basename={basename}>
        <Layout>
          <Routes>
            <Route path="/" element={<StudyPage />} />
            <Route path="/list" element={<ListPage />} />
            <Route path="/review" element={<ReviewPage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App

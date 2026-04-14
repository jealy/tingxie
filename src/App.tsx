import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ensureSeedData } from '@/lib/appData'
import DictationSelectPage from '@/pages/DictationSelectPage'
import DictationPage from '@/pages/DictationPageApp'
import DictationSetupPage from '@/pages/DictationSetupPage'
import GradingPage from '@/pages/GradingPageApp'
import HomePage from '@/pages/HomePageApp'
import LessonPage from '@/pages/LessonPageApp'
import SettingsPage from '@/pages/SettingsPageApp'
import TextbookPage from '@/pages/TextbookPageApp'

function App() {
  useEffect(() => {
    ensureSeedData()
  }, [])

  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<DictationSetupPage />} />
          <Route path="/my" element={<HomePage />} />
          <Route path="/dictation/free" element={<DictationPage />} />
          <Route path="/dictation/select" element={<DictationSelectPage />} />
          <Route path="/textbook/:id" element={<TextbookPage />} />
          <Route path="/lesson/:id" element={<LessonPage />} />
          <Route path="/dictation/:id" element={<DictationPage />} />
          <Route path="/grading/:id" element={<GradingPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  )
}

export default App

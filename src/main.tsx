import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter/wght.css'
import '@fontsource-variable/inter/wght-italic.css'
import '@fontsource-variable/dm-sans/opsz.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/playball/400.css'
import './index.css'
import { MotionConfig } from 'motion/react'
import App from './App.tsx'
import { Router } from './lib/router.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </Router>
  </StrictMode>,
)

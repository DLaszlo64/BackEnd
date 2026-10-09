import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Teszteles from './teszteles.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />

    <Teszteles />
  </StrictMode>,
)

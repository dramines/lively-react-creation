
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import Dashboard from './pages/Dashboard.tsx'
import DateFarcie from './pages/DateFarcie.tsx'
import './index.css'
import './i18n.ts' // Import i18n configuration

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/statistique" element={<Dashboard />} />
        <Route path="/technical-products" element={<App />} />
        <Route path="/dattes-farcies" element={<DateFarcie />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)

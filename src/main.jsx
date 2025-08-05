import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import './index.css'
import App from './App.jsx'
import Layout from './routes/Layout.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Routes>
    <Route path='/' element={<Layout />}>
    <Route index element={<App />} />
    </Route>
    
  </Routes>
  </BrowserRouter>
)

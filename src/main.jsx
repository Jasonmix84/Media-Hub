import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import './index.css'
import App from './App.jsx'
import Layout from './routes/Layout.jsx'
import NotFound from './routes/NotFound'
import Create from './routes/Create.jsx'
import DetailView from './routes/DetailView.jsx'
import Edit from './routes/Edit.jsx'
import Register from './routes/Register.jsx'
import Login from './routes/Login.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Routes>
    
    <Route path='/' element={<Layout />}>
      <Route index element={<App />} />
      <Route path="/Edit/:id" element={<Edit />}/>
      <Route path="/Post/:id" element={<DetailView />}/>
      <Route path="/Create" element={<Create />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Register" element={<Register />} />
    <Route path="*" element={ <NotFound /> } />
    </Route>
    
  </Routes>
  </BrowserRouter>
)

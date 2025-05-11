import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserContextProvider } from './contexts/UserContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';



createRoot(document.getElementById('root')).render(
  <UserContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>

  </UserContextProvider>
  ,
)

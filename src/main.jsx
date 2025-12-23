import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import AuthContext from './context/authContext.jsx'
import Usercontext from './context/Usercontext.jsx'
import { CartProvider } from './context/cartcontext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContext>
        <Usercontext>
          <CartProvider>
            <App />
          </CartProvider>
        </Usercontext>
      </AuthContext>
    </BrowserRouter>
  </StrictMode>
)
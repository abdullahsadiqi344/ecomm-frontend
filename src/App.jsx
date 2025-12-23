import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Regesteration from './pages/Regesteration.jsx'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import NikeStyleNavbar from './component/Navbar.jsx'
import CartPage from './pages/Cartpage.jsx'
import KidsPage from './pages/Kids.jsx'
import AdminPanel from './pages/Admin.jsx'
 import ProductDetail from './pages/ProductDetail.jsx'
import Orders from './pages/Orders.jsx'
import Checkout from './pages/Checkout.jsx'
import Footer from './component/Footer.jsx'
 
const App = () => {
  return (
    <>
      <NikeStyleNavbar />
      
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Regesteration />} />
        <Route path='/login' element={<Login />} />
        <Route path='/cart' element={<CartPage />} />
        <Route path='/admin' element={<AdminPanel />} />
         <Route path='/product/:id' element={<ProductDetail />} />
        
        <Route path="/checkout" element={<Checkout />} />
      <Route path="/orders" element={<Orders />} />
        <Route path='/category/men' element={<Home />} />
        <Route path='/category/women' element={<Home />} />
        <Route path='/category/kids' element={<KidsPage />} />
        <Route path='/category/jordan' element={<Home />} />
        <Route path='/category/like' element={<Home />} />
        <Route path='/category/skms' element={<Home />} />
        <Route path='/category/sport' element={<Home />} />
        <Route path='/sale' element={<Home />} />
        
        {/* Profile and Orders Routes */}
        <Route path='/profile' element={<div className="min-h-screen flex items-center justify-center"><h1>Profile Page - Coming Soon</h1></div>} />
        <Route path='/orders' element={<div className="min-h-screen flex items-center justify-center"><h1>My Orders - Coming Soon</h1></div>} />
        <Route path='/help' element={<div className="min-h-screen flex items-center justify-center"><h1>Help Center - Coming Soon</h1></div>} />
        
        {/* 404 Page */}
        <Route path='*' element={
          <div className="min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
            <a href="/" className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800">
              Go Back Home
            </a>
          </div>
        } />
      </Routes>
      <Footer/>
     </>
  )
}

export default App
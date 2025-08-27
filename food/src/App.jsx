import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home/Home'
import { Routes ,Route} from 'react-router-dom'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Cart from './pages/Cart/Cart'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/Login/LoginPopup'

function App() {

  const [showLogin,SetShowLogin] = useState(false)
  return (
    <>
    {showLogin?<LoginPopup SetShowLogin={SetShowLogin}/>:<></>}
    <div className='app'>
      <Navbar SetShowLogin={SetShowLogin}/>
      <Routes>
        <Route path='/' element ={<Home/>} />
        <Route path='/cart' element ={<Cart/>} />
        <Route path='/order' element ={<PlaceOrder />} />
      </Routes>
    </div>
   <Footer />
   </>
  )
}

export default App

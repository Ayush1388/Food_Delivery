import React, { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import { StoreContext } from '../context/StoreContext'
const Navbar = ({SetShowLogin}) => {



    const [Menu,setMenu] = useState("Home");
    const{getTotalCartAmount} = useContext(StoreContext) 
  return (


    <div className='navbar'>
    <Link to='/'>    <img src={assets.logo} alt="" className='logo'/></Link>
        <ul className="navbar-menu">
            <Link to='/' onClick={()=>setMenu("home")} className={Menu==="Home"? "active":"" }>Home</Link>
            <a href='#explore-menu' onClick={()=>setMenu("menu")} className={Menu==="menu" ? "active":""}>menu</a>
            <a href='#app-download' onClick={()=>setMenu("mobile-app")} className={Menu==="mobile-app"? "active":""} >mobile-app</a>
            <a href = '#footer' onClick={()=>setMenu("contact-us")} className={Menu==="contact-us"? "active":""} >contact us</a>
        </ul>
        <div className="navbar-right">
        <img src={assets.search_icon} alt="" />
        <div className="navbar-search-icon">
          <Link to='/cart'>  <img src={assets.basket_icon} alt="" /></Link>
            <div className={getTotalCartAmount()===0 ? "" : "dot" }></div>
        </div>
        <button onClick={()=>SetShowLogin(true)}>Sign in</button>
    </div>
</div>
  )
}

export default Navbar

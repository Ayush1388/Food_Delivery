import React, { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../context/StoreContext'

const Navbar = ({ SetShowLogin }) => {
    const [Menu, setMenu] = useState("home");
    const [showSearch, setShowSearch] = useState(false)
    const { getTotalCartAmount, token, logout, search, setSearch } = useContext(StoreContext)
    const navigate = useNavigate()

    const onLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <div className='navbar'>
            <Link to='/'><img src={assets.logo} alt="" className='logo' /></Link>
            <ul className="navbar-menu">
                <Link to='/' onClick={() => setMenu("home")} className={Menu === "home" ? "active" : ""}>Home</Link>
                <a href='#explore-menu' onClick={() => setMenu("menu")} className={Menu === "menu" ? "active" : ""}>menu</a>
                <a href='#app-download' onClick={() => setMenu("mobile-app")} className={Menu === "mobile-app" ? "active" : ""}>mobile-app</a>
                <a href='#footer' onClick={() => setMenu("contact-us")} className={Menu === "contact-us" ? "active" : ""}>contact us</a>
            </ul>
            <div className="navbar-right">
                {showSearch && (
                    <input
                        autoFocus
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); navigate('/#food-display') }}
                        placeholder='Search dishes...'
                        style={{ padding: '6px 10px', borderRadius: 20, border: '1px solid tomato' }}
                    />
                )}
                <img src={assets.search_icon} alt="search" style={{ cursor: 'pointer' }}
                    onClick={() => { setShowSearch((s) => !s); if (showSearch) setSearch("") }} />
                <div className="navbar-search-icon">
                    <Link to='/cart'><img src={assets.basket_icon} alt="" /></Link>
                    <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
                </div>
                {!token
                    ? <button onClick={() => SetShowLogin(true)}>Sign in</button>
                    : <>
                        <Link to='/myorders'><button>Orders</button></Link>
                        <button onClick={onLogout}>Logout</button>
                    </>}
            </div>
        </div>
    )
}

export default Navbar

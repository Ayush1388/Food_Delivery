import React from 'react'
import './Navbar.css'
import {assets} from '../../assets/assets'
import { clearToken } from '../../auth'

const Navbar = () => {
  return (
    <div className='navbar'>
        <img className='logo' src={assets.logo} alt="" />
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <button onClick={()=>{clearToken();window.location.assign('/login')}} style={{cursor:'pointer',padding:'6px 14px',border:'1px solid tomato',background:'none',borderRadius:4}}>Logout</button>
          <img className='profile' src={assets.profile_image} alt="" />
        </div>

      
    </div>
  )
}

export default Navbar

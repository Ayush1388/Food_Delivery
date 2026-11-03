import React from 'react'
import Sidebar from './components/Sidebar/Sidebar'
import Navbar from './components/Navbar/Navbar'
import { Routes ,Route, Navigate, useLocation } from 'react-router-dom'
import Login from './pages/Login/Login'
import { getToken } from './auth'
import Add from './pages/Add/Add'
import List from './pages/list/List'
import Orders from './pages/orders/Orders'
 import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const location = useLocation()
  if (location.pathname === '/login') {
    return <><ToastContainer /><Login /></>
  }
  if (!getToken()) {
    return <Navigate to="/login" replace />
  }
  return (
    <div>
      <ToastContainer />
      <Navbar/>
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/" element ={<Navigate to="/list" replace />}/>
          <Route path="/add" element ={<Add />}/>
          <Route path="/list" element ={<List />}/>
          <Route path="/orders" element ={<Orders />}/>
        </Routes>
      </div>
    </div>
  )
}

export default App

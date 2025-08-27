import React from 'react'
import Sidebar from './components/Sidebar/Sidebar'
import Navbar from './components/Navbar/NAvbar'
import { Routes ,Route } from 'react-router-dom'
import Add from './pages/Add/add'
import List from './pages/list/list'
import Orders from './pages/orders/orders'
 import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Navbar/>
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/add" element ={<Add />}/>
          <Route path="/list" element ={<List />}/>
          <Route path="/orders" element ={<Orders />}/>
        </Routes>
      </div>
    </div>
  )
}

export default App

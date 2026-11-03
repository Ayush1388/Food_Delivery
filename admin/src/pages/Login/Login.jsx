import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { url } from '../../assets/assets'
import { setToken } from '../../auth'
import './Login.css'

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError("")
    try {
      const res = await axios.post(`${url}/api/user/admin-login`, data)
      if (res.data.success) {
        setToken(res.data.token)
        navigate("/list")
      } else {
        setError(res.data.message)
      }
    } catch {
      setError("Could not reach the server")
    }
  }

  return (
    <div className='admin-login'>
      <form onSubmit={onSubmit}>
        <h2>Admin Login</h2>
        <input type="email" placeholder='Email' required value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })} />
        <input type="password" placeholder='Password' required value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })} />
        {error && <p className='error'>{error}</p>}
        <button type='submit'>Login</button>
      </form>
    </div>
  )
}

export default Login

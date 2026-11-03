import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'

const LoginPopup = ({ SetShowLogin }) => {
    const { url, setToken } = useContext(StoreContext)
    const [currState, setCurrState] = useState("Login")
    const [data, setData] = useState({ name: "", email: "", password: "" })
    const [error, setError] = useState("")

    const onChangeHandler = (event) => {
        setData((d) => ({ ...d, [event.target.name]: event.target.value }))
    }

    const onSubmit = async (event) => {
        event.preventDefault()
        setError("")
        const endpoint = currState === "Login" ? "/api/user/login" : "/api/user/register"
        try {
            const response = await axios.post(url + endpoint, data)
            if (response.data.success) {
                setToken(response.data.token)
                localStorage.setItem("token", response.data.token)
                SetShowLogin(false)
                // reload so the server-side cart is merged in
                window.location.reload()
            } else {
                setError(response.data.message)
            }
        } catch {
            setError("Could not reach the server")
        }
    }

    return (
        <div className='login-popup'>
            <form onSubmit={onSubmit} className='login-popup-container'>
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img onClick={() => SetShowLogin(false)} src={assets.cross_icon} alt="" />
                </div>
                <div className="login-popup-inputs">
                    {currState === "Login" ? null :
                        <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required />}
                    <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required />
                    <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' minLength={currState === "Login" ? undefined : 8} required />
                </div>
                {error && <p style={{ color: 'tomato' }}>{error}</p>}
                <button type='submit'>{currState === "Sign Up" ? "Create account" : "Login"}</button>
                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>By continuing, I agree to the terms of use & privacy policy.</p>
                </div>
                {currState === "Login"
                    ? <p>Create a new account? <span onClick={() => setCurrState("Sign Up")}>Click here</span></p>
                    : <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></p>
                }
            </form>
        </div>
    )
}

export default LoginPopup

import React, { useContext, useEffect, useState } from 'react'
import { StoreContext, DELIVERY_FEE } from '../../context/StoreContext';
import './PlaceOrder.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const PlaceOrder = () => {
    const { cartItems, food_list, getTotalCartAmount, token, url, setCartItems } = useContext(StoreContext);
    const navigate = useNavigate()
    const [paymentMethod, setPaymentMethod] = useState("cod")
    const [error, setError] = useState("")
    const [data, setData] = useState({
        firstName: "", lastName: "", email: "", street: "",
        city: "", state: "", zipcode: "", country: "", phone: ""
    })

    useEffect(() => {
        if (!token || getTotalCartAmount() === 0) {
            navigate('/cart')
        }
    }, [token])

    const onChangeHandler = (event) => {
        setData((d) => ({ ...d, [event.target.name]: event.target.value }))
    }

    const placeOrder = async (event) => {
        event.preventDefault()
        setError("")
        const items = food_list
            .filter((item) => cartItems[item._id] > 0)
            .map((item) => ({ _id: item._id, quantity: cartItems[item._id] }))
        try {
            const response = await axios.post(url + "/api/order/place",
                { address: data, items, paymentMethod }, { headers: { token } })
            if (response.data.success) {
                if (response.data.session_url) {
                    window.location.replace(response.data.session_url)
                } else {
                    setCartItems({})
                    navigate('/myorders')
                }
            } else {
                setError(response.data.message)
            }
        } catch (e) {
            setError("Could not place the order. Please try again.")
        }
    }

    const subtotal = getTotalCartAmount()

    return (
        <form onSubmit={placeOrder} className='place-order'>
            <div className="place-order-left">
                <p className='title'>Delivery Information</p>
                <div className="multi-fields">
                    <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' />
                    <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
                </div>
                <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
                <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
                <div className="multi-fields">
                    <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
                    <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
                </div>
                <div className="multi-fields">
                    <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip code' />
                    <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
                </div>
                <input required name='phone' onChange={onChangeHandler} value={data.phone} type="tel" placeholder='Phone' />
            </div>
            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Cart Totals</h2>
                    <div>
                        <div className="cart-total-details"><p>Subtotal</p><p>${subtotal}</p></div>
                        <hr />
                        <div className="cart-total-details"><p>Delivery Fee</p><p>${subtotal === 0 ? 0 : DELIVERY_FEE}</p></div>
                        <hr />
                        <div className="cart-total-details"><b>Total</b><b>${subtotal === 0 ? 0 : subtotal + DELIVERY_FEE}</b></div>
                    </div>
                    <div style={{ margin: '16px 0' }}>
                        <label style={{ display: 'block' }}>
                            <input type="radio" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} /> Cash on delivery
                        </label>
                        <label style={{ display: 'block' }}>
                            <input type="radio" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} /> Pay by card (Stripe)
                        </label>
                    </div>
                    {error && <p style={{ color: 'tomato' }}>{error}</p>}
                    <button type='submit'>{paymentMethod === "card" ? "PROCEED TO PAYMENT" : "PLACE ORDER"}</button>
                </div>
            </div>
        </form>
    )
}

export default PlaceOrder

import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import axios from 'axios'
import { StoreContext } from '../../context/StoreContext'

const MyOrders = () => {
    const { url, token } = useContext(StoreContext)
    const [orders, setOrders] = useState([])

    const fetchOrders = async () => {
        try {
            const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } })
            if (response.data.success) setOrders(response.data.data)
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        if (token) fetchOrders()
    }, [token])

    return (
        <div className='my-orders'>
            <h2>My Orders</h2>
            {!token && <p>Please sign in to see your orders.</p>}
            {token && orders.length === 0 && <p>No orders yet.</p>}
            <div className="container">
                {orders.map((order) => (
                    <div key={order._id} className='my-orders-order'>
                        <p>{order.items.map((item, i) =>
                            `${item.name} x ${item.quantity}${i === order.items.length - 1 ? "" : ", "}`)}</p>
                        <p>${order.amount}.00</p>
                        <p>Items: {order.items.length}</p>
                        <p><span>&#x25cf;</span> <b>{order.status}</b></p>
                        <button onClick={fetchOrders}>Track Order</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyOrders

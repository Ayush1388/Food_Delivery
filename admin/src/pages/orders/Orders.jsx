import React, { useEffect, useState } from 'react'
import './Orders.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets, url } from '../../assets/assets'

const STATUSES = ["Food Processing", "Out for delivery", "Delivered"]

const Orders = () => {
  const [orders, setOrders] = useState([])

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`)
      if (response.data.success) setOrders(response.data.data)
      else toast.error("Error loading orders")
    } catch {
      toast.error("Could not reach the server")
    }
  }

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(`${url}/api/order/status`, { orderId, status: event.target.value })
    if (response.data.success) await fetchOrders()
    else toast.error(response.data.message)
  }

  useEffect(() => { fetchOrders() }, [])

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order) => (
          <div key={order._id} className='order-item'>
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className='order-item-food'>
                {order.items.map((item, i) => `${item.name} x ${item.quantity}${i === order.items.length - 1 ? "" : ", "}`)}
              </p>
              <p className='order-item-name'>{order.address.firstName + " " + order.address.lastName}</p>
              <div className='order-item-address'>
                <p>{order.address.street + ","}</p>
                <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
              </div>
              <p className='order-item-phone'>{order.address.phone}</p>
            </div>
            <p>Items: {order.items.length}</p>
            <p>${order.amount}</p>
            <p>{order.paymentMethod === "card" ? (order.payment ? "Paid (card)" : "Unpaid (card)") : "Cash on delivery"}</p>
            <select onChange={(e) => statusHandler(e, order._id)} value={order.status}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders

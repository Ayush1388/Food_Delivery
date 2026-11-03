import React, { useContext, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { StoreContext } from '../../context/StoreContext'

const Verify = () => {
    const [searchParams] = useSearchParams()
    const success = searchParams.get("success")
    const orderId = searchParams.get("orderId")
    const { url, setCartItems } = useContext(StoreContext)
    const navigate = useNavigate()

    useEffect(() => {
        const verify = async () => {
            try {
                const response = await axios.post(url + "/api/order/verify", { success, orderId })
                if (response.data.success) setCartItems({})
                navigate(response.data.success ? "/myorders" : "/cart")
            } catch {
                navigate("/cart")
            }
        }
        verify()
    }, [])

    return (
        <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
            <p>Verifying your payment...</p>
        </div>
    )
}

export default Verify

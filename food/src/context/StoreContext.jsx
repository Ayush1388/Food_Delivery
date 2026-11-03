/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import axios from "axios";
export const StoreContext = createContext(null)

export const url = import.meta.env.VITE_API_URL || "http://localhost:4000"
export const DELIVERY_FEE = 2

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [food_list, setFoodList] = useState([]);
    const [search, setSearch] = useState("");
    const [promo, setPromo] = useState({ code: "", percent: 0 });

    const authHeaders = { headers: { token } }

    const addToCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }))
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, authHeaders).catch(() => {})
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: Math.max((prev[itemId] || 0) - 1, 0) }))
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, authHeaders).catch(() => {})
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                const itemInfo = food_list.find((product) => product._id === item);
                if (itemInfo) totalAmount += itemInfo.price * cartItems[item];
            }
        }
        return totalAmount;
    }

    const getDiscount = () => Math.round(getTotalCartAmount() * promo.percent) / 100

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(url + "/api/food/list")
            if (response.data.success) setFoodList(response.data.data)
        } catch (error) {
            console.error("Failed to load food list", error)
        }
    }

    const loadCartData = async (authToken) => {
        try {
            const response = await axios.post(url + "/api/cart/get", {}, { headers: { token: authToken } })
            if (response.data.success) setCartItems(response.data.cartData)
        } catch {
            // Token is invalid/expired: log out
            setToken("")
            localStorage.removeItem("token")
        }
    }

    const logout = () => {
        localStorage.removeItem("token")
        setToken("")
        setCartItems({})
        setPromo({ code: "", percent: 0 })
    }

    useEffect(() => {
        async function loadData() {
            await fetchFoodList()
            if (localStorage.getItem("token")) {
                await loadCartData(localStorage.getItem("token"))
            }
        }
        loadData()
    }, [])

    const ContextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
        logout,
        search,
        setSearch,
        promo,
        setPromo,
        getDiscount
    }

    return (
        <StoreContext.Provider value={ContextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider

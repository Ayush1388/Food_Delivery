import userModel from "../models/userModel.js"

const addToCart = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId)
        const cartData = user.cartData || {}
        cartData[req.body.itemId] = (cartData[req.body.itemId] || 0) + 1
        await userModel.findByIdAndUpdate(req.userId, { cartData })
        res.json({ success: true, message: "Added to cart" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}

const removeFromCart = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId)
        const cartData = user.cartData || {}
        if (cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1
        }
        await userModel.findByIdAndUpdate(req.userId, { cartData })
        res.json({ success: true, message: "Removed from cart" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}

const getCart = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId)
        res.json({ success: true, cartData: user.cartData || {} })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}

export { addToCart, removeFromCart, getCart }

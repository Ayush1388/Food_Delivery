import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import foodModel from "../models/foodModel.js"
import Stripe from "stripe"

const DELIVERY_FEE = 2
// Promo codes: percentage discounts on the food subtotal. Override with PROMO_CODES="CODE:10,OTHER:20".
const promoCodes = () => {
    const raw = process.env.PROMO_CODES || "WELCOME10:10,FOOD20:20"
    return Object.fromEntries(raw.split(",").map((p) => p.split(":")).map(([c, v]) => [c.trim().toUpperCase(), Number(v)]))
}
const discountFor = (code) => promoCodes()[String(code || "").trim().toUpperCase()] || 0

const applyPromo = async (req, res) => {
    const percent = discountFor(req.body.code)
    if (!percent) return res.json({ success: false, message: "Invalid promo code" })
    res.json({ success: true, percent, message: `${percent}% discount applied` })
}

const frontendUrl = () => process.env.FRONTEND_URL || "http://localhost:5173"

// Place a new order. Prices are recomputed from the database, never trusted from the client.
const placeOrder = async (req, res) => {
    try {
        const { items, address } = req.body
        const paymentMethod = req.body.paymentMethod === "card" ? "card" : "cod"
        if (!Array.isArray(items) || items.length === 0) {
            return res.json({ success: false, message: "Your cart is empty" })
        }

        const foods = await foodModel.find({ _id: { $in: items.map((i) => i._id) } })
        const priced = []
        let amount = 0
        for (const item of items) {
            const food = foods.find((f) => String(f._id) === String(item._id))
            const quantity = Number(item.quantity)
            if (!food || !(quantity > 0)) {
                return res.json({ success: false, message: "Invalid item in cart" })
            }
            priced.push({ _id: food._id, name: food.name, price: food.price, quantity })
            amount += food.price * quantity
        }
        const percent = discountFor(req.body.promoCode)
        const discount = Math.round(amount * percent) / 100
        amount = amount - discount + DELIVERY_FEE

        const order = await new orderModel({
            userId: req.userId,
            items: priced,
            amount,
            address,
            paymentMethod
        }).save()
        await userModel.findByIdAndUpdate(req.userId, { cartData: {} })

        if (paymentMethod === "card") {
            if (!process.env.STRIPE_SECRET_KEY) {
                await orderModel.findByIdAndDelete(order._id)
                return res.json({ success: false, message: "Card payments are not configured" })
            }
            const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
            const line_items = priced.map((i) => ({
                price_data: { currency: "usd", product_data: { name: i.name }, unit_amount: Math.round(i.price * 100) },
                quantity: i.quantity
            }))
            line_items.push({
                price_data: { currency: "usd", product_data: { name: "Delivery Charges" }, unit_amount: DELIVERY_FEE * 100 },
                quantity: 1
            })
            const coupon = discount > 0 ? await stripe.coupons.create({ amount_off: Math.round(discount * 100), currency: "usd", duration: "once" }) : null
            const session = await stripe.checkout.sessions.create({
                line_items,
                mode: "payment",
                ...(coupon ? { discounts: [{ coupon: coupon.id }] } : {}),
                success_url: `${frontendUrl()}/verify?success=true&orderId=${order._id}`,
                cancel_url: `${frontendUrl()}/verify?success=false&orderId=${order._id}`
            })
            return res.json({ success: true, session_url: session.url })
        }

        res.json({ success: true, orderId: order._id })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}

// Called after returning from Stripe. Marks the order paid, or removes it if cancelled.
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body
    try {
        if (success === "true" || success === true) {
            await orderModel.findByIdAndUpdate(orderId, { payment: true })
            res.json({ success: true, message: "Paid" })
        } else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({ success: false, message: "Payment cancelled" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}

const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.userId }).sort({ date: -1 })
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}

// Admin: list every order
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({}).sort({ date: -1 })
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}

// Admin: update order status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status })
        res.json({ success: true, message: "Status Updated" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}

export { applyPromo, placeOrder, verifyOrder, userOrders, listOrders, updateStatus }

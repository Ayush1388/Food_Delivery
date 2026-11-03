import mongoose from "mongoose"

export const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not set. Copy .env.example to .env and fill it in.")
    }
    await mongoose.connect(process.env.MONGO_URI)
    console.log("DB Connected")
}

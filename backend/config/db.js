import mongoose from "mongoose"
export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://ayushji2543:iSFv2T7MjyMLpEUO@cluster0.sd3tpo0.mongodb.net/food-del').then(()=>console.log("DB Connected"));

}
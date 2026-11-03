// Seeds the database with the sample dishes (and copies their images into uploads/).
// Usage: npm run seed   (skips dishes that already exist by name)
import "dotenv/config"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import mongoose from "mongoose"
import { connectDB } from "./config/db.js"
import foodModel from "./models/foodModel.js"

const here = path.dirname(fileURLToPath(import.meta.url))
const assetsDir = path.join(here, "../food/src/assets")
const source = fs.readFileSync(path.join(assetsDir, "assets.js"), "utf8")
const listSrc = source.slice(source.indexOf("export const food_list"))

const dishes = [...listSrc.matchAll(/name:\s*"([^"]+)",\s*image:\s*(food_\d+),\s*price:\s*(\d+),\s*description:\s*"([^"]+)",\s*category:\s*"([^"]+)"/g)]
    .map(([, name, img, price, description, category]) => ({ name, img, price: Number(price), description, category }))

await connectDB()
fs.mkdirSync(path.join(here, "uploads"), { recursive: true })

let added = 0
for (const d of dishes) {
    if (await foodModel.findOne({ name: d.name })) continue
    const filename = `seed-${d.img}.png`
    fs.copyFileSync(path.join(assetsDir, `${d.img}.png`), path.join(here, "uploads", filename))
    await foodModel.create({ name: d.name, description: d.description, price: d.price, category: d.category, image: filename })
    added++
}
console.log(`Seeded ${added} new dishes (${dishes.length - added} already existed).`)
await mongoose.disconnect()

<h1 align="center">🍔 Food Delivery App</h1>

<p align="center">
  <b>A sleek food ordering web app built with modern tech</b><br/>
  <a href="https://food-delivery-hazel-alpha.vercel.app" target="_blank">🚀 Live Demo</a> • 
  <a href="https://github.com/Ayush1388/Food_Delivery/issues">🐞 Report Bug</a> • 
  <a href="https://github.com/Ayush1388/Food_Delivery/pulls">💡 Request Feature</a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/Ayush1388/Food_Delivery?style=for-the-badge" />
  <img src="https://img.shields.io/github/forks/Ayush1388/Food_Delivery?style=for-the-badge" />
  <img src="https://img.shields.io/github/license/Ayush1388/Food_Delivery?style=for-the-badge" />
</p>

---

## ✨ Features
- 📝 Browse and search for dishes  
- 🛒 Add items to your cart  
- 🚚 Place and track food delivery orders  
- 📱 Responsive, clean UI  

---

## 🛠️ Tech Stack

| Frontend | Backend | Database |
|----------|---------|-----------|
| React (Vite) | Node.js / Express.js | MongoDB |

---

## 🚀 Quick Start

The repo has three apps: `backend/` (Express API), `food/` (customer site) and `admin/` (admin panel).

```bash
git clone https://github.com/Ayush1388/Food_Delivery.git
cd Food_Delivery
```

1. **Backend** – copy `backend/.env.example` to `backend/.env`, set `MONGO_URI` and `JWT_SECRET` (optionally `STRIPE_SECRET_KEY` for card payments), then:
   ```bash
   cd backend && npm install && npm run server
   ```
2. **Customer site** – `cd food && npm install && npm run dev` (set `VITE_API_URL` in `.env` if the API is not on `localhost:4000`)
3. **Admin panel** – `cd admin && npm install && npm run dev`

Use the admin panel to add dishes first; the customer site loads the menu from the API.

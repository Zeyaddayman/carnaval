# 🎭 Carnaval

**Carnaval** is a full-stack e-commerce platform built with Next.js, TypeScript, Prisma, and PostgreSQL. It delivers high performance, SEO optimization, and full responsiveness for a seamless shopping experience across all devices.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://carnaval-alpha.vercel.app)

---

## 🚀 Project Features

### 🔍 Product Discovery & Navigation
* **🌐 Global Search with Categories:** Search across all products with dropdown category filtering for targeted results.
* **📂 Multi-Level Browsing:** Explore products via organized **Categories**, **Sub-categories**, and **Brands**.
* **⚡ Dynamic Filtering:** Narrow down choices by **Price Range**, **Ratings**, and **On-Sale Status**.
* **🔃 Smart Sorting:** Arrange products by **Price** (Low ↔ High), **Top Rated**, and **Discount Depth**.
* **📖 Pagination:** Smooth and efficient browsing through large product catalogs.

### 🛒 Smart Cart System
* **💾 Hybrid Cart Logic:** Features a **Local Cart** for guests and a **Persistent Database Cart** for logged-in users.
* **🔗 Seamless Merging:** Automatically transfers items from the local cart to the user's account upon **Login/Register**.
* **🛡️ Real-time Stock Validation:** Inventory checks that automatically adjust quantities to prevent over-ordering.

### 💖 Wishlist
Save favorite items to a personal list for future shopping.

### 💳 Secure Checkout
Clear breakdown of **Items**, **Subtotal**, **Shipping**, and **Grand Total**, with easy selection from saved addresses for faster checkout. Integrated Stripe Web Elements for secure, real-time payment processing.

### 👤 User Dashboard
Manage delivery addresses, update profile information, change password, and track order history.

---

## 🛠️ Tech Stack

* **Framework:** Next.js 15
* **Language:** TypeScript
* **State Management:** Redux Toolkit & RTK Query
* **Styling:** Tailwind CSS & Headless UI
* **Backend/Database:** Prisma ORM (PostgreSQL)
* **Authentication:** JWT & Bcrypt
* **Validation:** Zod

---

## 🧠 Technical Challenges & Solutions

### 🌐🛰️ Hybrid Rendering (ISR + Client-Side Fetching)
**The Challenge:** E-commerce sites need the speed of static pages for better performance and SEO, but "Stock Levels" change every second.

**The Solution:** Implemented a hybrid approach. While product descriptions and images are served via **ISR** for speed, the **Cart component** is dynamic client-side. which fetches the latest inventory data directly from the database on mount, ensuring users never interact with stale stock information.


### 🔗 Seamless Guest-to-User Cart Sync
**The Challenge:** Guest users were previously restricted or "blocked" from adding items to their cart without being logged in. This created friction in the user experience.

**The Solution:** Implemented a **Local Cart system** for guest users. This allows users to:
* **add, delete, and review items** directly in the cart without an account.
* **Seamless Data Synchronization:** Upon login or registration, the system automatically merges the local guest cart with the user's permanent database cart, ensuring no items are lost.

### ⚡ "Zero-Latency" Cart & Wishlist
**The Challenge:** Eliminating disruptive loading spinners during high-frequency user actions. The goal was to provide an "instant-feel" UI while ensuring data consistency between the client and the database.

**The Solution:** Leveraged **RTK Query Optimistic Updates** to achieve immediate UI feedback.
* **Instant Interaction:** UI reflects cart and wishlist changes (add/remove/update) immediately before the server response is received.
* **Background Sync:** Seamlessly handles database synchronization in the background to maintain data integrity.
* **Graceful Error Handling:** Implemented an automated rollback mechanism with toast notifications if a server action fails.
* **Smart Reconciliation:** Integrated real-time notifications to inform users if item quantities are automatically adjusted based on live stock changes.

### 📦 Intelligent Inventory Management
**The Challenge:** Preventing "over-selling" by ensuring cart quantities never exceed actual warehouse stock.

**The Solution:** Implemented stock validation system that runs during the cart retrieval process to ensure order fulfillment reliability.
* **Auto-Adjust:** If stock is low, the cart automatically lowers the item quantity and notifies the user
via UI message.
* **Separation:** Out-of-stock items are moved to an "Unavailable" section.
* **Secure Checkout:** Disables the checkout button until the user removes unavailable items.

---

## 🧰 Installation & Setup

1. **Clone the repo:** `git clone https://github.com/Zeyaddayman/carnaval.git`
2. **Install dependencies:** `npm install`
3. **Env Variables:** Create a `.env` file.
4. **Generate the Prisma Client:** `npx prisma generate`
5. **Database Sync:** `npx prisma db push`
6. **Run Dev Server:** `npm run dev`
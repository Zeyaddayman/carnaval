# 🎭 Carnaval

**Carnaval** is a full-stack, high-performance e-commerce platform built for a seamless shopping experience. It features dynamic product filtering, sophisticated cart management with optimistic updates, and a robust inventory validation system.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://carnaval-alpha.vercel.app)

---

## 🚀 Key Features

- **Comprehensive Catalog:** Browse by multiple categories, subcategories, and specific brands.
- **Advanced Filtering & Sorting:** Filter products by price range, rating, and "On Sale" status. Sort by price, rating, and discount percentage.
- **Smart Cart System:**
  - **Hybrid Data Strategy:** Product details are served via ISR for speed, while cart/stock validation remains dynamic (client-side) to ensure 100% stock accuracy.
  - **Local & User Sync:** Seamlessly merges Local Storage items into the user’s database profile upon login or registration.
  - **Optimistic Updates:** Immediate UI feedback using RTK Query for a "zero-latency" feel.
  - **Inventory Guard:** Real-time stock validation that adjusts quantities automatically and provides instant UX feedback.
- **SEO & Performance:**
  - **Dynamic Metadata:** Automated SEO optimization for category products, brand products, and product pages.
  - **ISR (Incremental Static Regeneration):** Product pages are pre-rendered for speed and updated in the background without a full rebuild while utilizing Client-side Hydration to fetch real-time stock levels. This ensures a high-performance experience without sacrificing data accuracy for business-critical inventory.
- **User Dashboard:** Manage delivery addresses, update profile information, change password, and track order history.
- **Secure Checkout:** Streamlined leading to order placement.

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **State Management:** Redux Toolkit & RTK Query
- **Styling:** Tailwind CSS & Headless UI
- **Backend/Database:** Prisma ORM (PostgreSQL)
- **Validation:** Zod (Schema validation for Forms)

---

## 🧠 Technical Challenges & Solutions

### 1. Hybrid Rendering (ISR + Client-Side Fetching)
**The Challenge:** E-commerce sites need the speed of static pages for SEO, but "Stock Levels" change every second. Serving a static "Out of Stock" button results in a poor user experience.

**The Solution:** I implemented a hybrid approach. While product descriptions and images are served via **ISR** for speed, the **Cart and Stock components** are dynamic client-side elements. They fetch the latest inventory data directly from the database on mount, ensuring users never interact with stale stock information.



### 2. The "Zero-Latency" Cart
**The Challenge:** Eliminating loading spinners during cart interactions while maintaining data integrity between `localStorage` (guests) and `PostgreSQL` (users).

**The Solution:** I implemented **Optimistic Updates** using RTK Query. The UI reflects changes instantly, while background processes handle database synchronization. I built a custom merge logic to ensure guest items are intelligently combined with user profiles during the auth transition without creating duplicates.

### 3. Intelligent Inventory Management
**The Challenge:** Preventing "over-selling" while keeping the user informed of stock limitations in real-time.

**The Solution:** I integrated real-time inventory checks that validate the cart against the database. If a user requests more than what is available, the system automatically adjusts the cart to the maximum available stock and triggers a **UX notification** to inform the user. I also implemented a checkout guard that disables the purchase flow if an item becomes unavailable.

---

## 🚧 Roadmap (Upcoming Features)

- [ ] **Stripe Integration:** Implementing Stripe Web Elements for secure, real-time payment processing.
- [ ] **Global Search:** Adding a dedicated search page with predictive text and brand suggestions.
- [ ] **Admin Dashboard:** A private interface for managing stock levels and viewing sales analytics.
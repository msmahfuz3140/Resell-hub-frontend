# 🛍️ ReSell Hub — Modern Full-Stack Second-Hand Marketplace

> **Bangladesh's Premier Escrow-Protected Marketplace for Pre-Loved Gadgets, Vehicles, Furniture & Tech.**

[![Next.js](https://img.shields.io/badge/Next.js-16.3.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 🌐 Live URLs & Demo

| Service | Environment | URL |
|---|---|---|
| **Frontend Web App** | Production / Vercel | [https://resell-hub-frontend.vercel.app](https://resell-hub-frontend.vercel.app) *(or your Vercel URL)* |
| **Backend REST API** | Production / Render | [https://resell-hub-backend.onrender.com](https://resell-hub-backend.onrender.com) |
| **API Health Check** | Live Status | [https://resell-hub-backend.onrender.com/health](https://resell-hub-backend.onrender.com/health) |

---

## 📖 Project Overview

**ReSell Hub** is an ultra-modern, production-grade circular commerce platform built to solve trust and safety issues in traditional second-hand classifieds. With an encrypted **Escrow Vault**, **48-Hour Buyer Inspection Window**, verified seller profiles, real-time messaging, and multi-gateway checkout (bKash, Nagad, Stripe cards), ReSell Hub offers a seamless experience for buyers and sellers across all 64 districts of Bangladesh.

---

## ✨ Key Features

### 🎨 Dual-Theme System (Obsidian Dark & Clean Light)
- **Fluid Switcher**: One-tap toggle between elegant light cream mode and deep obsidian dark mode with zero flash of unstyled content.
- **Tailwind CSS v4 Native**: Uses custom variant `@custom-variant dark (&:where(.dark, .dark *))` and CSS design tokens for smooth transitions.

### 🛡️ ReSell Hub Escrow Protocol
- **Locked Vault**: 100% of buyer payment is safely held in escrow upon checkout.
- **48-Hour Test Window**: Buyer receives the package via doorstep courier and has 48 hours to verify condition and authenticity.
- **Instant Automated Payouts**: Funds are released to seller's bKash/Nagad/Bank in 30 seconds upon approval.

### 🔍 Discovery & Dynamic Marketplace
- **Live Search & Autocomplete**: Real-time search by keywords, category, district, and condition.
- **Side-by-Side Comparison**: Compare up to 4 items simultaneously on specifications, warranty, condition, and price.
- **Price Range & Quick Buckets**: Filter by price brackets, district locations, and condition tags.

### 💬 Real-Time Buyer-Seller Chat
- **Instant Negotiation**: Message sellers directly on product pages.
- **Safety Prompts**: Automated warnings to prevent off-platform scamming.

### 📊 Seller & Admin Command Centers
- **Seller Dashboard**: Real-time sales charts, views tracker, active listing manager, and escrow balance cashout.
- **Admin Control Panel**: User role management, disputed transaction arbitration, listing moderation, and platform revenue metrics.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 16.3.1 (App Router, Turbopack)
- **Language**: TypeScript 5
- **UI & Styling**: Tailwind CSS v4, Vanilla CSS Design System (`globals.css`)
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: Sonner (Rich Toast Notifications)
- **HTTP Client**: Native Fetch API with custom interceptors & token refresh

### Backend
- **Runtime**: Node.js & Express 5
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (Access + Refresh Token cookies) & Google OAuth
- **Payments**: Stripe API, bKash/Nagad Escrow simulation
- **Media**: Cloudinary SDK (Image upload, transformation, CDN delivery)
- **Security**: Helmet, CORS origin whitelist, Express Rate Limit, Input Validation

---

## 📦 NPM Packages Reference

### Frontend Dependencies (`ass-frontend`)

| Package | Version | Purpose |
|---|---|---|
| `next` | `16.3.1` | React framework for SSR, SSG & Server Components |
| `react` | `19.0.0` | Core UI library |
| `react-dom` | `19.0.0` | React DOM renderer |
| `framer-motion` | `^12.38.0` | Fluid micro-animations & layout transitions |
| `lucide-react` | `^1.16.0` | Comprehensive modern iconography |
| `sonner` | `^2.0.7` | Stacked rich toast notification system |
| `@tailwindcss/postcss` | `^4.0.0` | Tailwind CSS v4 PostCSS build integration |
| `tailwindcss` | `^4.0.0` | Utility-first CSS engine |
| `typescript` | `^5` | Static type safety |

### Backend Dependencies (`ass-backend`)

| Package | Version | Purpose |
|---|---|---|
| `express` | `^5.2.1` | Web framework & API router |
| `mongoose` | `^9.9.3` | MongoDB ODM & schema validation |
| `jsonwebtoken` | `^9.0.3` | Secure stateless JWT authentication |
| `bcryptjs` | `^3.0.3` | Salted password hashing |
| `cors` | `^2.8.6` | Cross-Origin Resource Sharing control |
| `helmet` | `^8.3.0` | HTTP security response headers |
| `cloudinary` | `^2.10.1` | Cloud media storage and image transformations |
| `multer` | `^2.2.0` | Multipart form-data parser for file uploads |
| `stripe` | `^22.5.0` | Stripe payment gateway SDK |
| `express-rate-limit` | `^8.6.2` | Anti-DDoS and brute-force rate limiter |
| `morgan` | `^1.11.0` | HTTP request logging middleware |
| `dotenv` | `^17.4.2` | Environment variable loader |
| `cookie-parser` | `^1.4.7` | HTTP-only cookie parser |

---

## ⚙️ Environment Variables Setup

### Frontend `.env.local`

```env
# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# Stripe (Public Key)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### Backend `.env`

```env
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/resell-hub?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=super_secret_jwt_key_make_it_64_characters_random
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=super_secret_jwt_refresh_key_make_it_long
JWT_REFRESH_EXPIRES_IN=30d

# Allowed Frontend Origin(s)
CLIENT_URL=http://localhost:3000,https://resell-hub-frontend.vercel.app

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

---

## 🚀 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/msmahfuz3140/Resell-hub-frontend.git
git clone https://github.com/msmahfuz3140/Resell-hub-backend.git
```

### 2. Run Backend
```bash
cd ass-backend
npm install
npm run dev
# API running at http://localhost:5000
```

### 3. Run Frontend
```bash
cd ass-frontend
npm install
npm run dev
# Web app running at http://localhost:3000
```

---

## 🚀 Deployment Guide

### Deploying Frontend to Vercel
1. Push code to your GitHub repository.
2. Import project into [Vercel Dashboard](https://vercel.com/new).
3. Set Framework Preset to **Next.js**.
4. Configure Environment Variables:
   - `NEXT_PUBLIC_APP_URL` = `https://your-domain.vercel.app`
   - `NEXT_PUBLIC_API_URL` = `https://your-backend.onrender.com/api`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_test_...`
5. Click **Deploy**.

### Deploying Backend to Render / Railway
1. Create a new **Web Service** on [Render](https://render.com/).
2. Select your `Resell-hub-backend` repository.
3. Set Build Command: `npm install`
4. Set Start Command: `npm start`
5. Add all Environment Variables from backend `.env`.
6. Add Health Check Path: `/health`.

---

## 🛡️ License

This project is licensed under the [MIT License](LICENSE).
Built with ❤️ for Bangladesh's circular economy by **ReSell Hub Team**.

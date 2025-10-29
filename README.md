# 🛒 MyShop v1

Fullstack e-commerce system built with **Laravel 12 (API)** + **Filament Admin** + **Next.js frontend**.

---

## 🚀 Tech Stack

* **Backend:** Laravel 12 (API)
* **Admin Panel:** Filament v3
* **Frontend:** Next.js (React)
* **Database:** MySQL
* **Authentication:** Laravel Sanctum
* **Deployment Ready:** XAMPP / Laravel Sail / Vercel (for Next.js)

---

## ⚙️ Setup Guide

### 🔹 Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

**Default Admin Login**

```
Email: admin@myshop.com
Password: admin123
```

**API Base URL**

```
http://127.0.0.1:8000/api
```

---

### 🔹 Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

**Frontend URL**

```
http://localhost:3000
```

**Create `.env.local`:**

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

---

## 🔐 Authentication (Sanctum)

Laravel Sanctum handles API token authentication.
Ensure your API middleware includes Sanctum:

```php
'api' => [
    \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
    'throttle:api',
    \Illuminate\Routing\Middleware\SubstituteBindings::class,
],
```

---

## 🧩 API Examples

| Method | Endpoint             | Description        |
| ------ | -------------------- | ------------------ |
| GET    | `/api/products`      | Fetch all products |
| GET    | `/api/products/{id}` | Product details    |
| POST   | `/api/orders`        | Create order       |
| GET    | `/api/categories`    | List categories    |

---

## 🧑‍💻 Admin Panel

Filament Admin Dashboard
👉 [http://127.0.0.1:8000/admin](http://127.0.0.1:8000/admin)

---

## 🧠 Redis Integration (Optional)

Redis support is **prepared but not integrated yet**.
Enable later by editing `.env`:

```
CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
REDIS_CLIENT=predis
```

---

## 🧪 Testing

**Laravel (PHPUnit)**

```bash
php artisan test
```

**Frontend (Cypress)**

```bash
cd frontend
npx cypress open
```

---

## 📦 Production Build

**Laravel**

```bash
php artisan optimize
```

**Next.js**

```bash
cd frontend
npm run build
npm run start
```

---

## 📁 Project Structure

```
myshop-v1/
├── backend/        # Laravel 12 API + Filament Admin
├── frontend/       # Next.js Frontend
├── database/       # Migrations & Seeders
├── routes/         # API Routes
└── tests/          # PHPUnit Tests
```

---

## 💡 Roadmap

* 🔁 Integrate Redis cache & queue
* 💳 Add payment gateway
* 📱 Add PWA support
* 🐳 Dockerized setup

---

**Developed by [kkdev20](https://github.com/kkdev20) ⚡**

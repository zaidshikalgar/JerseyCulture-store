JerseyCulture Backend
Stack
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
Setup
- Start MongoDB (optional via Docker from project root):
- docker compose up -d mongo
- Open terminal in backend/
- Install dependencies:
- npm install
- Create .env from .env.example
- Run development server:
- npm run dev
Seed Sample Products
- npm run seed
Frontend Connection
Set frontend env (root .env.local) if backend runs on a different URL:
- NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
Cashfree env required in backend/.env:
- FRONTEND_BASE_URL=http://localhost:3000
- CASHFREE_ENV=sandbox
- CASHFREE_APP_ID=your_app_id
- CASHFREE_SECRET_KEY=your_secret_key
- CASHFREE_API_VERSION=2025-01-01
Gmail SMTP for signup OTP:
- GMAIL_SMTP_USER=yourgmail@gmail.com
- GMAIL_SMTP_APP_PASSWORD=16_digit_app_password
- GMAIL_FROM_EMAIL=yourgmail@gmail.com
API Endpoints
- GET /api/health
Products
- GET /api/products
- GET /api/products/:slug
- POST /api/products
- PUT /api/products/:id
- DELETE /api/products/:id
Auth
- POST /api/auth/register (starts OTP flow)
- POST /api/auth/register/request-otp
- POST /api/auth/register/verify-otp
- POST /api/auth/login
- GET /api/auth/me (Bearer token required)
Orders
- POST /api/orders (guest or logged in)
- POST /api/orders/cashfree/session (guest or logged in, UPI/Card)
- POST /api/orders/cashfree/verify/:orderNumber
- GET /api/orders/track/:orderNumber?email=you@example.com
- GET /api/orders/my-orders (Bearer token required)
- GET /api/orders (admin only)
Query Params
GET /api/products
- category=club|national|retro
- featured=true
- new=true

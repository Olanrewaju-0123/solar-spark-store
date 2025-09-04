# Solar Spark Store - Full Stack Technical Assessment

## Overview

This is a full-stack solar equipment store application built for a fintech company that sells solar equipment and finances customer purchases through installment loans. The application provides a complete e-commerce experience with product catalog, cart management, and order processing.

## Tech Stack

### Backend

- **Node.js** with **TypeScript** for type safety and modern JavaScript features
- **Express.js** for RESTful API development
- **Sequelize ORM** for database operations and relationships
- **PostgreSQL** as the primary database
- **Zod** for input validation and schema definition
- **Swagger/OpenAPI** for API documentation
- **Pino** for structured logging
- **Express Rate Limiting** for API protection
- **CORS** and **Helmet** for security

### Frontend

- **React** with **TypeScript** for type-safe UI development
- **Vite** for fast development and building
- **Tailwind CSS** for utility-first styling
- **Shadcn/ui** components for consistent design system

## Features

### Core Functionality

- **Product Catalog**: List products with pagination, search, and filtering
- **Product Details**: View individual product information, images, and stock
- **Shopping Cart**: Add/remove items, update quantities
- **Checkout Process**: Simulate payment and create orders
- **Order Management**: View order history and status

### Technical Features

- **RESTful API** with consistent error handling
- **Input Validation** using Zod schemas
- **Database Transactions** for data integrity
- **Rate Limiting** and security middleware
- **Comprehensive Logging** for debugging
- **OpenAPI Documentation** accessible via `/api/docs`
- **Unit Tests** for core functionality
- **Docker Compose** for easy development setup

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)

### Running with Docker Compose

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd solar-spark-store
   ```

2. **Start all services**

   ```bash
   docker compose up -d
   ```

3. **Seed the database with sample products**

   ```bash
   docker exec -it rivy_store_backend sh -lc "npm run db:seed:prod"
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000
   - API Documentation: http://localhost:4000/api/docs
   - Database: localhost:5436 (external access)

### Local Development Setup

1. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Start PostgreSQL** (or use Docker)

   ```bash
   docker run -d --name postgres \
     -e POSTGRES_DB=rivy_store \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=postgres \
     -p 5432:5432 \
     postgres:15-alpine
   ```

4. **Run database migrations and seed data**

   ```bash
   npm run db:seed
   ```

5. **Start the backend server**

   ```bash
   npm run dev
   ```

6. **Install frontend dependencies**

   ```bash
   cd ../frontend
   npm install
   ```

7. **Start the frontend development server**
   ```bash
   npm run dev
   ```

### Docker Commands Reference

```bash
# View running containers
docker compose ps

# View logs
docker compose logs backend
docker compose logs frontend
docker compose logs postgres

# Restart services
docker compose restart

# Stop all services
docker compose down

# Rebuild and start
docker compose up -d --build

# Access backend container
docker exec -it rivy_store_backend sh

# Seed database (inside backend container)
docker exec -it rivy_store_backend sh -lc "npm run db:seed:prod"
```

## Environment Variables

### Docker Compose Environment

The system uses Docker Compose with the following environment configuration:

```yaml
# Backend Service
NODE_ENV: development
PORT: 4000
DB_PORT: 5432
DB_HOST: postgres
DB_PASSWORD: postgres
DB_NAME: rivy_store
JWT_SECRET: fd1e4a64b9b4436e9e3b0bd5b4a7f2f2c2f5c9c8f0a7d1b3c6e9a4b2c7d9e1f3

# Frontend Service
VITE_API_URL: http://localhost:4000

# PostgreSQL Service
POSTGRES_DB: rivy_store
POSTGRES_USER: postgres
POSTGRES_PASSWORD: postgres
```

### Local Development (.env files)

#### Backend (.env)

```env
NODE_ENV=development
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=rivy_store
JWT_SECRET=your-secret-key-here
```

#### Frontend (.env)

```env
VITE_API_URL=http://localhost:4000
```

## Database Seeding

The application includes sample solar products and a demo order. The seeder creates:

- **8 Solar Products**: Solar panels, charge controllers, inverters, batteries, mounting kits, cables, water pumps, and LED lights
- **Sample Order**: Demo order with order items for testing the checkout flow

### Seeding Options

#### Option 1: Docker Compose (Recommended)

```bash
# Start the system
docker compose up -d

# Seed the database
docker exec -it rivy_store_backend sh -lc "npm run db:seed:prod"
```

#### Option 2: Local Development

```bash
cd backend
npm run db:seed
```

### Clear Database

```bash
# Docker
docker exec -it rivy_store_backend sh -lc "npm run db:clear:prod"

# Local
cd backend
npm run db:clear
```

### Sample Data

The seeder creates realistic solar equipment products with:

- Product names, descriptions, and pricing
- Stock quantities and categories
- Image URLs (placeholder images included)
- Proper database relationships and constraints

## Running Tests

### Backend Tests

```bash
cd backend
npm test
```

**Note**: Test suite is currently being implemented. The backend includes:

- Unit tests for core business logic
- Integration tests for API endpoints
- Test coverage for order processing and validation

### Frontend Tests

```bash
cd frontend
npm test
```

**Note**: Frontend test suite is being implemented with:

- Component testing
- User interaction testing
- Cart and checkout flow validation

### Test Coverage Goals

- Backend: Core logic, API handlers, database operations
- Frontend: Component rendering, user flows, cart management
- Integration: End-to-end checkout process

## API Endpoints

### Products

- `GET /api/products` - List products with pagination and filtering
- `GET /api/products/:id` - Get product details
- `GET /api/products/categories` - Get product categories

### Orders

- `POST /api/orders` - Create new order (checkout)
- `GET /api/orders/:id` - Get order details
- `GET /api/orders` - List orders (admin)

### Documentation

- `GET /api/docs` - Interactive API documentation

## Project Structure

```
solar-spark-store/
├── backend/                 # Node.js + Express + Sequelize backend
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Sequelize models
│   │   ├── routes/         # API route definitions
│   │   ├── db/            # Database configuration
│   │   ├── utils/         # Utility functions
│   │   └── server.ts      # Main application file
│   ├── tests/             # Test files
│   └── Dockerfile         # Backend container
├── frontend/               # React + TypeScript frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   └── ...
│   └── Dockerfile         # Frontend container
├── docker-compose.yml      # Multi-service orchestration
└── README.md              # This file
```

## Known Trade-offs and Future Improvements

### Current Trade-offs

- **Authentication**: Basic implementation without JWT refresh tokens
- **Payment Processing**: Simulated payment only (no real gateway integration)
- **Image Storage**: Local file storage (not cloud-based)
- **Caching**: No Redis or CDN implementation
- **Monitoring**: Basic logging without APM tools
- **Testing**: Test suite is being implemented (not yet complete)
- **Accessibility**: Basic accessibility features, needs comprehensive audit
- **Part 1 Requirements**: Audit write-up and wireframes not yet completed

### Future Improvements

1. **Authentication & Authorization**

   - JWT refresh token rotation
   - Role-based access control
   - OAuth integration

2. **Performance & Scalability**

   - Redis caching for products and sessions
   - CDN for image delivery
   - Database query optimization
   - Horizontal scaling with load balancers

3. **Payment & Financing**

   - Real payment gateway integration
   - Installment loan calculation engine
   - Credit scoring integration
   - Payment plan management

4. **Monitoring & Analytics**

   - Application performance monitoring
   - User behavior analytics
   - Business metrics dashboard
   - Error tracking and alerting

5. **Security Enhancements**

   - API key management
   - Request sanitization
   - SQL injection protection
   - Rate limiting per user

6. **Testing & Quality**

   - Complete unit test suite for backend
   - Frontend component testing
   - Integration test suite
   - E2E testing with Playwright
   - Performance testing
   - Security testing

7. **Part 1 Requirements Completion**
   - Complete storefront audit and critique
   - Create mid-fidelity wireframes
   - Document information architecture improvements
   - UX, accessibility, and performance analysis

## Deployment

### Current Status

The application is currently running locally with Docker Compose. For production deployment:

### Production Considerations

- Use environment-specific configuration
- Implement proper logging and monitoring
- Set up SSL/TLS certificates
- Configure database backups
- Use managed database services
- Implement CI/CD pipelines

### Environment Variables for Production

```env
NODE_ENV=production
DB_HOST=<production-db-host>
DB_PORT=5432
DB_USER=<production-db-user>
DB_PASSWORD=<production-db-password>
DB_NAME=<production-db-name>
JWT_SECRET=<strong-secret-key>
LOG_LEVEL=info
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100
```

### Deployment Options

1. **Container Orchestration**: Deploy to Kubernetes or Docker Swarm
2. **Cloud Platforms**: Deploy to AWS ECS, Google Cloud Run, or Azure Container Instances
3. **PaaS**: Deploy to Heroku, Railway, or Render
4. **VPS**: Deploy to DigitalOcean, Linode, or AWS EC2

### Live Product URL

**Status**: Not yet deployed
**Next Steps**: Deploy to a cloud platform and update this section with the live URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is part of a technical assessment and is not intended for production use without proper review and modifications.

## Support

For questions or issues related to this technical assessment, please refer to the project requirements or contact the development team.

## Current System Status

### ✅ Completed Features

- Full-stack solar equipment store
- Product catalog with pagination, search, and filtering
- Product detail pages
- Shopping cart functionality
- Checkout process with order creation
- Order confirmation and management
- RESTful API with validation and error handling
- Docker Compose setup
- Database seeding with sample products
- OpenAPI documentation

### 🚧 In Progress

- Test suite implementation
- Accessibility improvements
- Performance optimization

### 📋 Pending Requirements

- Part 1: Storefront audit and wireframes
- Live deployment and URL
- Comprehensive testing coverage
- Accessibility audit and improvements

### 🔧 Technical Status

- **Backend**: Fully functional with TypeScript compilation
- **Frontend**: Responsive UI with cart and checkout
- **Database**: PostgreSQL with sample data
- **API**: Documented with Swagger at `/api/docs`
- **Docker**: Multi-service orchestration working

## 🧪 Testing

### Backend

- Tooling: Jest, ts-jest, Supertest
- Commands:
  - Install (already installed via backend package.json):
    - `cd backend`
  - Run tests:
    - `npm test`
- What’s covered:
  - Products API (list, pagination, filtering)
  - Orders API (create success, invalid payload, not found)
  - Unit tests for controllers (order totals, invalid payload) and products pagination edge cases
- Notes:
  - Server boot is skipped during tests via a test guard in `src/server.ts`.
  - ESM `.js` source imports are resolved by a Jest `moduleNameMapper` in `jest.config.cjs`.

### Frontend

- Tooling: Vitest (jsdom), @testing-library/react, @testing-library/user-event, jest-dom
- Commands:
  - `cd frontend`
  - `npm test`
- What’s covered:
  - Index page: loading → render, search filter behavior
  - Index error-state: 500 from products API shows error UI
  - ProductDetail: renders details from mocked API
  - Cart: add to cart and checkout error displays toast
- Test structure:
  - Files under `frontend/src/pages/__tests__/` and `backend/tests/`
  - Global setup at `frontend/vitest.config.ts` and `frontend/src/setupTests.ts`
- Notes:
  - `fetch` is mocked per test; `VITE_API_URL` is injected via `window.importMeta.env` in tests
  - Some UI components (Radix) need `ResizeObserver` polyfill added in `setupTests.ts`

## 🚀 Deployment (Render + Neon + Vercel)

This guide deploys:

- Backend API (Node/Express/Sequelize) to Render
- PostgreSQL database to Neon (serverless Postgres)
- Frontend (Vite/React) to Vercel

### 1) Database (Neon)

1. Create account and project: Neon → New Project → PostgreSQL 15+.
2. Create a database (e.g., `solar_spark_store`).
3. Create a role/user (or use default) and set a strong password.
4. Get connection details (host, user, password, database, port, SSL=true).
5. Save these for the backend env.

Optional: If Neon provides a single DATABASE_URL, parse into:

- DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME

### 2) Backend API (Render)

1. Render → New → Web Service → Connect this repo → Choose `backend/` as root.
2. Environment: `Node`.
3. Build Command:

```bash
npm ci && npm run build
```

4. Start Command:

```bash
npm start
```

5. Environment Variables (Render → Settings → Environment):

- DB_HOST = <from Neon>
- DB_PORT = 5432
- DB_USER = <from Neon>
- DB_PASSWORD = <from Neon>
- DB_NAME = <from Neon>
- JWT_SECRET = <min 32 chars>
- NODE_ENV = production

6. (If Neon requires SSL) Add:

- PGSSLMODE = require

7. Deploy. After the first deploy, open the Render service URL. Validate:

- API Docs: GET `<RENDER_BACKEND_URL>/api/docs`
- Health (example): GET `<RENDER_BACKEND_URL>/api/products?page=1&pageSize=12`

8. Seed (optional) – if you need sample data and you enabled the script:

- Open a one-off shell in Render (or temporarily set a deploy command) to run:

```bash
node dist/src/db/seeder.js
```

Notes:

- The backend Dockerfile is set for Docker builds, but Render’s native Node build is fine (faster). If you prefer Docker on Render, choose Blueprint/ Docker and ensure the Docker context is `backend/`.

### 3) Frontend (Vercel)

1. Vercel → New Project → Import this repo → Set Root Directory to `frontend/`.
2. Framework Preset: `Vite`.
3. Build Command: default (Vercel detects `vite`).
4. Output Directory: `dist`.
5. Environment Variables:

- VITE_API_URL = `<RENDER_BACKEND_URL>` (e.g., `https://your-api.onrender.com`)

6. Deploy → Open the Vercel URL and validate:

- Products list loads
- Product details page
- Add to cart and checkout (ensure backend reachable)

### 4) Post-Deployment Checklist

- Update this README:
  - Deployed URL (Vercel frontend)
  - API Docs URL (Render `/api/docs`)
- Verify CORS (backend) allows your Vercel origin.
- Confirm rate limiting, logging, and error formats are visible in logs.
- Optional: disable force-sync in Sequelize in production (we already don’t force; validate migrations if added later).

### 5) Troubleshooting

- 500 errors on products → check DB envs and SSL in Render.
- 401/403 or JWT errors → ensure JWT_SECRET is set and ≥32 chars.
- Frontend cannot reach API → confirm `VITE_API_URL` has no trailing `/api` (our frontend adds route paths), example:
  - Correct: `VITE_API_URL=https://your-api.onrender.com`
- CORS blocked → enable your Vercel domain in backend CORS config (wildcard is enabled by default here).

### 6) Local vs Cloud env map

- Local (docker compose) ➜ `.env` or compose vars
- Render (cloud) ➜ Render service Environment tab
- Vercel (cloud) ➜ Project Settings → Environment Variables
- Neon (cloud) ➜ Connection details, SSL enabled

With these steps, you’ll have: Neon (DB) → Render (API) → Vercel (UI). Update the README’s “Deployed URL” and “API Docs URL” after going live.

## ✅ Current Status Snapshot

- Catalog: server-side pagination, search, category/price filters working
- Product Detail: images, description, price, stock, add to cart
- Cart & Checkout: view/update/remove items, VAT (7.5%) totals, simulated checkout, confirmation page
- Orders API: persist orders and items, read endpoint (status defaults to "pending")
- Security & Ops: CORS, Helmet, rate limiting, structured logs
- API Docs: Swagger served at `/api/docs` (validate schemas before prod)
- Tests: Backend unit + API tests, Frontend UI tests (Index/ProductDetail/error, cart checkout error)
- Docs: Local run (docker compose), seeding steps, envs, testing, deployment guide

## 🧪 Test Coverage (High-Level)

- Backend (Jest):
  - Products API: list, pagination, search and filters
  - Orders: create (happy/invalid), read not-found, controller unit totals, invalid payload, pagination edges
  - Test notes: Server start skipped in tests; ESM `.js` imports handled by Jest config
- Frontend (Vitest + RTL):
  - Index: loading → render, search filter, error-state (API 500)
  - ProductDetail: renders details from mocked API
  - Cart: add to cart → checkout error shows toast
  - Test notes: jsdom polyfills (`fetch`, `ResizeObserver`) and path alias set in vitest config; Toaster rendered during tests to assert messages

## ⚠️ Known Trade-offs & Future Improvements (Updated)

- Wireframes: ASCII included in `redesign.md`. Image exports (Excalidraw/diagrams.net) pending; add to `docs/wireframes/` and link in `redesign.md` when ready
- Accessibility:
  - Added aria-labels for search and cart controls; dialog now uses `aria-describedby`
  - Recommend a short axe pass (labels across all forms, skip links, keyboard flow validation)
- Orders status flow: Currently `pending` on creation; if desired, finalize to `placed` on successful checkout or add an explicit status transition endpoint
- OpenAPI/Swagger: Endpoints and grouping present; do a schema review for examples and error formats prior to production
- Deployment: URLs pending; add Vercel frontend URL and Render API docs URL after go-live
- Performance polish: Image optimization/lazy-loading (optional enhancement)
- Analytics: Add basic events (page view, add-to-cart) if desired

## 📝 After Deployment Checklist

- Add to this README:
  - Deployed URL (frontend)
  - API Docs URL (backend `/api/docs`)
  - Wireframe image links (PNG/SVG) or live Excalidraw board URL
- Confirm CORS allows the Vercel domain and rate limits are appropriate
- Verify error and success logs are visible in your host provider

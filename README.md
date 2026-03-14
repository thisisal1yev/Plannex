# Planner AI

> **Marketplace for Event Organization in Uzbekistan**

A comprehensive full-stack platform for organizing events, booking venues, hiring services, managing tickets, and processing payments.

![License](https://img.shields.io/badge/license-UNLICENSED-red.svg)
![NestJS](https://img.shields.io/badge/NestJS-v11-ea2845?logo=nestjs)
![React](https://img.shields.io/badge/React-v19-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-v5.9-3178c6?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-v7.4-2d3748?logo=prisma)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Database Setup](#database-setup)
  - [Running the App](#running-the-app)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Database](#database)
- [API Documentation](#api-documentation)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

Planner AI is a marketplace that connects event organizers with venues, service providers, and participants in Uzbekistan. The platform streamlines the entire event lifecycle—from planning and booking to ticketing and payment processing.

**Key Capabilities:**
- Create and manage events with multiple ticket tiers
- Discover and book venues with advanced filtering
- Hire event services (catering, decoration, photography, etc.)
- Generate QR-coded tickets for seamless check-in
- Process payments via Click, Payme, and other providers
- Manage volunteer applications
- Collect reviews and ratings
- Access detailed analytics and reports

---

## ✨ Features

### Core Platform Features

| Category | Features |
|----------|----------|
| **Events** | Create, publish, edit, and cancel events • Multiple ticket tiers (VIP, Standard, Free) • Capacity management • Event analytics |
| **Venues** | Search with filters (indoor/outdoor, WiFi, parking, sound, stage) • Real-time availability • Booking management |
| **Services** | Marketplace for vendors • Service categories (catering, decoration, sound, photography, security) • Vendor ratings |
| **Tickets** | QR code generation • Mobile ticket validation • Tiered pricing • Purchase history |
| **Payments** | Click integration • Payme integration • Multiple payment methods • Payment history and receipts |
| **Users** | Role-based access (Organizer, Participant, Admin, Vendor, Volunteer) • Profile management • JWT authentication |
| **Reviews** | Rate events, venues, and services • Verified reviews from participants |
| **Volunteers** | Apply for volunteer positions • Track application status • Volunteer management dashboard |
| **Analytics** | Event performance metrics • Ticket sales reports • Revenue tracking • Excel export |

### Advanced Features

- **Multi-role System**: Granular permissions for Admins, Organizers, Participants, Vendors, and Volunteers
- **QR Code Tickets**: Secure QR code generation for each ticket with mobile validation
- **Payment Gateway Integration**: Seamless integration with Click and Payme payment providers
- **Email Notifications**: Automated emails for ticket purchases, event updates, and confirmations
- **File Upload**: Support for event images, venue photos, and service portfolios
- **Caching**: Response caching for improved performance on frequently accessed data
- **Rate Limiting**: Protection against abuse with configurable rate limits
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **Excel Reports**: Export analytics and sales data to Excel format
- **Database Migrations**: Version-controlled database schema with Prisma migrations

---

## 🛠️ Tech Stack

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| [NestJS](https://nestjs.com/) | v11 | Backend framework |
| [TypeScript](https://www.typescriptlang.org/) | v5.9 | Type-safe development |
| [Prisma](https://www.prisma.io/) | v7.4 | Database ORM |
| [PostgreSQL](https://www.postgresql.org/) | 14+ | Relational database |
| [Passport](http://www.passportjs.org/) | v0.7 | Authentication middleware |
| [JWT](https://jwt.io/) | - | Token-based auth |
| [Swagger](https://swagger.io/) | - | API documentation |
| [Nodemailer](https://nodemailer.com/) | v8 | Email delivery |
| [Multer](https://github.com/expressjs/multer) | v2 | File upload handling |
| [ExcelJS](https://github.com/exceljs/exceljs) | v4 | Excel report generation |
| [cache-manager](https://github.com/node-cache/node-cache) | v7 | Response caching |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | v6 | Password hashing |
| [QRCode](https://github.com/soldair/node-qrcode) | v1.5 | QR code generation |

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| [React](https://react.dev/) | v19 | UI library |
| [TypeScript](https://www.typescriptlang.org/) | v5.9 | Type safety |
| [Vite](https://vite.dev/) | v8 | Build tool & dev server |
| [TailwindCSS](https://tailwindcss.com/) | v4 | Utility-first CSS |
| [React Query](https://tanstack.com/query) | v5 | Server state management |
| [Zustand](https://zustand-demo.pmnd.rs/) | v5 | Client state management |
| [React Router](https://reactrouter.com/) | v7 | Client-side routing |
| [React Hook Form](https://react-hook-form.com/) | v7 | Form handling |
| [Axios](https://axios-http.com/) | v1 | HTTP client |

---

## 📁 Project Structure

```
planner-ai/
├── backend/
│   ├── src/
│   │   ├── analytics/          # Event analytics and reporting
│   │   ├── auth/               # JWT authentication & guards
│   │   ├── common/             # Shared utilities, filters, interceptors
│   │   ├── config/             # Environment configuration
│   │   ├── events/             # Event CRUD & management
│   │   ├── payments/           # Click, Payme integrations
│   │   ├── prisma/             # Prisma service & database
│   │   ├── reviews/            # Review & rating system
│   │   ├── services/           # Service marketplace
│   │   ├── tickets/            # Ticketing & QR codes
│   │   ├── users/              # User management
│   │   ├── venues/             # Venue listings & bookings
│   │   ├── volunteers/         # Volunteer applications
│   │   ├── app.module.ts       # Root module
│   │   └── main.ts             # Application entry point
│   ├── prisma/
│   │   ├── migrations/         # Database migrations
│   │   ├── schema.prisma       # Database schema definition
│   │   └── seed.ts             # Database seeding
│   ├── generated/              # Generated Prisma client
│   ├── test/                   # E2E tests
│   ├── .env.example            # Environment template
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── app/                # App configuration & routing
│   │   ├── entities/           # Feature entities (analytics, event, review, etc.)
│   │   ├── features/           # User-facing features
│   │   ├── pages/              # Page components
│   │   ├── widgets/            # Composite widgets
│   │   ├── shared/             # Shared utilities
│   │   │   ├── api/            # API client & HTTP utilities
│   │   │   ├── model/          # Shared models
│   │   │   ├── types/          # TypeScript types
│   │   │   └── ui/             # Reusable UI components
│   │   ├── assets/             # Static assets
│   │   ├── index.css           # Global styles
│   │   ├── main.tsx            # React entry point
│   │   └── App.tsx             # Root component
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18 or higher ([download](https://nodejs.org/))
- **PostgreSQL** v14 or higher ([download](https://www.postgresql.org/download/))
- **Bun** (recommended) or **npm** ([install Bun](https://bun.sh/))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd planner-ai
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   bun install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   bun install
   ```

### Environment Setup

1. **Copy the environment template**
   ```bash
   cd ../backend
   cp .env.axample .env
   ```

2. **Configure your environment variables** (see [Environment Variables](#environment-variables))

3. **Create frontend environment file** (optional)
   ```bash
   cd ../frontend
   echo "VITE_API_URL=http://localhost:3000" > .env
   ```

### Database Setup

```bash
cd backend

# Generate Prisma client
bun run prisma:generate

# Run database migrations
bun run prisma:migrate

# (Optional) Seed the database with sample data
bun run prisma:seed
```

### Running the App

Start both servers in separate terminals:

```bash
# Terminal 1 - Backend (http://localhost:3000)
cd backend
bun run start:dev

# Terminal 2 - Frontend (http://localhost:5173)
cd frontend
bun run dev
```

**Access the application:**
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:3000](http://localhost:3000)
- API Documentation: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

---

## ⚙️ Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/planner_ai` |
| `JWT_SECRET` | Secret key for JWT signing | `your-secret-key` |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | `your-refresh-secret` |
| `JWT_EXPIRES_IN` | Access token expiration | `1h` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration | `7d` |
| `CLICK_SECRET` | Click payment API secret | `your-click-secret` |
| `PAYME_KEY` | Payme payment API key | `your-payme-key` |
| `PORT` | Server port | `3000` |

### Frontend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3000` |

---

## 📝 Available Scripts

### Backend

| Command | Description |
|---------|-------------|
| `bun run start:dev` | Development server with hot reload (NestJS watch mode) |
| `bun run start:debug` | Development server with debug mode |
| `bun run build` | Build for production (compiles TypeScript) |
| `bun run start` | Production server |
| `bun run prisma:generate` | Generate Prisma client from schema |
| `bun run prisma:migrate` | Run database migrations (creates and applies) |
| `bun run prisma:studio` | Open Prisma Studio (visual DB browser) |
| `bun run prisma:seed` | Seed database with sample data using tsx |
| `bun run test` | Run unit tests with Jest |
| `bun run test:watch` | Run tests in watch mode |
| `bun run test:cov` | Run tests with coverage report |
| `bun run test:e2e` | Run E2E tests |
| `bun run lint` | Run ESLint with auto-fix |
| `bun run format` | Format code with Prettier |

### Frontend

| Command | Description |
|---------|-------------|
| `bun run dev` | Development server with Hot Module Replacement (HMR) |
| `bun run build` | Build for production (optimizes and bundles) |
| `bun run preview` | Preview production build locally |
| `bun run lint` | Run ESLint |

---

## 🗄️ Database

### Main Entities

| Entity | Description |
|--------|-------------|
| **User** | User accounts with roles (Organizer, Participant, Admin, Vendor, Volunteer) |
| **Event** | Events with status, capacity, dates, and locations |
| **Ticket & TicketTier** | Tickets with QR codes and pricing tiers (VIP, Standard, Free) |
| **Venue** | Venues with amenities (WiFi, parking, sound, stage, indoor/outdoor) |
| **Service** | Event services (catering, decoration, sound, photography, security) |
| **Payment** | Payment records with provider (Click, Payme) and status |
| **VolunteerApplication** | Volunteer applications linked to events |
| **Review** | Reviews and ratings for events, venues, and services |
| **VenueBooking** | Venue reservations linked to events |
| **EventService** | Services associated with events |

### Database Commands

```bash
# Open Prisma Studio (visual database browser)
bun run prisma:studio

# Create a new migration
bun exec prisma migrate dev --name <migration-name>

# Reset database (⚠️ deletes all data)
bun exec prisma migrate reset

# View database schema
cat prisma/schema.prisma
```

---

## 📖 API Documentation

Once the backend server is running, access the interactive Swagger documentation at:

```
http://localhost:3000/api/docs
```

### API Endpoints

| Category | Endpoints |
|----------|-----------|
| **Authentication** | `POST /auth/register` • `POST /auth/login` • `POST /auth/refresh` |
| **Users** | `GET /users/profile` • `PATCH /users/profile` • `GET /users/events` |
| **Events** | `GET /events` • `POST /events` • `GET /events/:id` • `PATCH /events/:id` • `DELETE /events/:id` |
| **Venues** | `GET /venues` • `GET /venues/:id` • `POST /venues/bookings` |
| **Services** | `GET /services` • `GET /services/:id` • `POST /events/:id/services` |
| **Tickets** | `GET /events/:id/tickets` • `POST /tickets/purchase` • `GET /tickets/:id/qr` |
| **Payments** | `POST /payments/click` • `POST /payments/payme` • `GET /payments/history` |
| **Volunteers** | `POST /events/:id/volunteers` • `GET /volunteers/applications` |
| **Reviews** | `POST /reviews` • `GET /reviews/:entityId` • `PATCH /reviews/:id` |
| **Analytics** | `GET /analytics/events/:id` • `GET /analytics/sales` • `GET /analytics/export` |

---

## 🏗️ Architecture

### Backend Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Requests                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Global Guards & Interceptors                                │
│  • JwtAuthGuard  • RolesGuard  • LoggingInterceptor         │
│  • ResponseTransformInterceptor  • GlobalExceptionFilter    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        Modules                               │
│  Auth │ Events │ Venues │ Services │ Tickets │ Payments    │
│  Users │ Reviews │ Volunteers │ Analytics │ Prisma         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Prisma ORM                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     PostgreSQL Database                      │
└─────────────────────────────────────────────────────────────┘
```

### Frontend Architecture (Feature-Sliced Design)

```
src/
├── app/           # Application initialization, routing, providers
├── pages/         # Page components (routes)
├── widgets/       # Composite blocks (header, footer, sidebar)
├── features/      # User interactions (forms, actions)
├── entities/      # Business entities (Event, User, Venue, etc.)
└── shared/        # Reusable utilities (UI, API, types, models)
```

### Role-Based Access Control

| Role | Permissions |
|------|-------------|
| **Admin** | Full system access • User management • All analytics |
| **Organizer** | Create/manage events • View event analytics • Manage tickets |
| **Participant** | Browse events • Purchase tickets • Leave reviews |
| **Vendor** | List services • Manage bookings • View service analytics |
| **Volunteer** | Apply to events • View application status |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style (Prettier + ESLint)
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 📄 License

This project is **UNLICENSED**. All rights reserved.

---

## 📞 Support

For questions, issues, or support, please contact the development team.

---

<p align="center">
  <strong>Built with</strong>
  <a href="https://nestjs.com/">NestJS</a> •
  <a href="https://prisma.io/">Prisma</a> •
  <a href="https://react.dev/">React</a> •
  <a href="https://vite.dev/">Vite</a>
</p>

<p align="center">
  🇺🇿 Made for event organizers in Uzbekistan
</p>

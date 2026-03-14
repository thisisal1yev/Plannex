# Planner AI — Backend

> NestJS-based backend API for the Event Organization Marketplace

[![NestJS](https://img.shields.io/badge/NestJS-v11-ea2845?logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.9-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-v7.4-2d3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169e1?logo=postgresql)](https://www.postgresql.org/)

---

## 📋 Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Architecture](#architecture)
- [Modules](#modules)
- [Database](#database)
- [Authentication](#authentication)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Deployment](#deployment)

---

## 🎯 Overview

This is the backend API for **Planner AI** — a marketplace for event organization in Uzbekistan. Built with NestJS 11, TypeScript, and Prisma, it provides a robust, scalable, and type-safe REST API for:

- User authentication and authorization
- Event management and publishing
- Venue booking and availability
- Service marketplace
- Ticket sales with QR codes
- Payment processing (Click, Payme)
- Volunteer applications
- Reviews and ratings
- Analytics and reporting

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| [NestJS](https://nestjs.com/) | 11 | Backend framework |
| [TypeScript](https://www.typescriptlang.org/) | 5.9 | Type-safe development |
| [Prisma](https://www.prisma.io/) | 7.4 | Database ORM |
| [PostgreSQL](https://www.postgresql.org/) | 14+ | Relational database |
| [Passport](http://www.passportjs.org/) | 0.7 | Authentication middleware |
| [JWT](https://jwt.io/) | - | Token-based auth |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | 6 | Password hashing |
| [Swagger](https://swagger.io/) | - | API documentation |
| [Nodemailer](https://nodemailer.com/) | 8 | Email delivery |
| [Multer](https://github.com/expressjs/multer) | 2 | File upload handling |
| [ExcelJS](https://github.com/exceljs/exceljs) | 4 | Excel report generation |
| [QRCode](https://github.com/soldair/node-qrcode) | 1.5 | QR code generation |
| [cache-manager](https://github.com/node-cache/node-cache) | 7 | Response caching |
| [class-validator](https://github.com/typestack/class-validator) | 0.15 | DTO validation |
| [class-transformer](https://github.com/typestack/class-transformer) | 0.5 | Object transformation |

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── analytics/              # Analytics and reporting
│   │   ├── analytics.controller.ts
│   │   ├── analytics.service.ts
│   │   ├── analytics.module.ts
│   │   ├── dto/
│   │   └── types/
│   │
│   ├── auth/                   # Authentication & authorization
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── strategies/         # JWT strategies
│   │   ├── guards/             # Auth guards
│   │   ├── decorators/         # Auth decorators
│   │   └── dto/
│   │
│   ├── common/                 # Shared utilities
│   │   ├── filters/            # Exception filters
│   │   ├── guards/             # Shared guards
│   │   ├── interceptors/       # Request/response interceptors
│   │   ├── decorators/         # Shared decorators
│   │   └── utils/              # Utility functions
│   │
│   ├── config/                 # Configuration
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── mailer.config.ts
│   │
│   ├── events/                 # Event management
│   │   ├── events.controller.ts
│   │   ├── events.service.ts
│   │   ├── events.module.ts
│   │   ├── dto/
│   │   ├── entities/
│   │   └── types/
│   │
│   ├── payments/               # Payment processing
│   │   ├── payments.controller.ts
│   │   ├── payments.service.ts
│   │   ├── payments.module.ts
│   │   ├── providers/          # Payment providers (Click, Payme)
│   │   └── dto/
│   │
│   ├── prisma/                 # Prisma database layer
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   │
│   ├── reviews/                # Reviews and ratings
│   │   ├── reviews.controller.ts
│   │   ├── reviews.service.ts
│   │   └── reviews.module.ts
│   │
│   ├── services/               # Service marketplace
│   │   ├── services.controller.ts
│   │   ├── services.service.ts
│   │   └── services.module.ts
│   │
│   ├── tickets/                # Ticketing system
│   │   ├── tickets.controller.ts
│   │   ├── tickets.service.ts
│   │   ├── tickets.module.ts
│   │   └── qr/                 # QR code generation
│   │
│   ├── users/                  # User management
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   │
│   ├── venues/                 # Venue management
│   │   ├── venues.controller.ts
│   │   ├── venues.service.ts
│   │   └── venues.module.ts
│   │
│   ├── volunteers/             # Volunteer management
│   │   ├── volunteers.controller.ts
│   │   ├── volunteers.service.ts
│   │   └── volunteers.module.ts
│   │
│   ├── app.module.ts           # Root module
│   └── main.ts                 # Application entry point
│
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── migrations/             # Database migrations
│   └── seed.ts                 # Database seeding
│
├── generated/                  # Generated Prisma client
├── test/                       # E2E tests
├── .env.example                # Environment template
├── package.json
├── tsconfig.json
└── nest-cli.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **PostgreSQL** v14 or higher
- **Bun** (recommended) or **npm**

### Installation

```bash
# Install dependencies
bun install

# Copy environment file
cp .env.axample .env

# Configure your .env file (see Environment Variables)
```

### Database Setup

```bash
# Generate Prisma client
bun run prisma:generate

# Run migrations
bun run prisma:migrate

# (Optional) Seed database with sample data
bun run prisma:seed

# Open Prisma Studio (visual database browser)
bun run prisma:studio
```

### Running the Server

```bash
# Development mode with hot reload
bun run start:dev

# Debug mode
bun run start:debug

# Production mode
bun run build
bun run start
```

The API will be available at: **http://localhost:3000**

---

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `bun run start:dev` | Development server with hot reload (NestJS watch mode) |
| `bun run start:debug` | Development server with debug mode enabled |
| `bun run build` | Build for production (compiles TypeScript to JavaScript) |
| `bun run start` | Production server |
| `bun run prisma:generate` | Generate Prisma client from schema |
| `bun run prisma:migrate` | Run database migrations (creates and applies) |
| `bun run prisma:studio` | Open Prisma Studio (visual database browser) |
| `bun run prisma:seed` | Seed database with sample data using tsx |
| `bun run test` | Run unit tests with Jest |
| `bun run test:watch` | Run tests in watch mode |
| `bun run test:cov` | Run tests with coverage report |
| `bun run test:e2e` | Run E2E tests |
| `bun run lint` | Run ESLint with auto-fix |
| `bun run format` | Format code with Prettier |

---

## 🏗️ Architecture

### Module Structure

Each feature module follows a consistent structure:

```
module/
├── module.controller.ts    # HTTP request handlers
├── module.service.ts       # Business logic
├── module.module.ts        # Module configuration
├── dto/                    # Data Transfer Objects
│   ├── create-*.dto.ts
│   └── update-*.dto.ts
├── entities/               # Database entities
└── types/                  # TypeScript types
```

### Global Guards & Interceptors

| Name | Purpose |
|------|---------|
| **JwtAuthGuard** | Global JWT authentication |
| **RolesGuard** | Role-based authorization |
| **ThrottlerGuard** | Rate limiting |
| **LoggingInterceptor** | Request/response logging |
| **ResponseTransformInterceptor** | Unified response format |
| **CacheInterceptor** | Response caching |
| **GlobalExceptionFilter** | Centralized error handling |

### Dependency Injection

```typescript
// Example service with dependencies
@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheManager: Cache,
    @Inject(forwardRef(() => TicketsService))
    private readonly ticketsService: TicketsService,
  ) {}
}
```

---

## 📦 Modules

### Core Modules

| Module | Description |
|--------|-------------|
| **Auth** | JWT authentication, refresh tokens, role-based access |
| **Users** | User CRUD, profile management, role assignment |
| **Events** | Event creation, management, publishing, cancellation |
| **Venues** | Venue listings, search, availability, bookings |
| **Services** | Service marketplace, vendor management |
| **Tickets** | Ticket tiers, QR generation, purchase, validation |
| **Payments** | Click & Payme integration, payment history |
| **Volunteers** | Volunteer applications, status management |
| **Reviews** | Reviews and ratings for events, venues, services |
| **Analytics** | Event metrics, sales reports, Excel export |

### Module Dependencies

```
AppModule
├── PrismaModule
├── AuthModule
├── UsersModule
├── EventsModule
│   ├── TicketsModule
│   └── VolunteersModule
├── VenuesModule
├── ServicesModule
├── PaymentsModule
├── ReviewsModule
└── AnalyticsModule
```

---

## 🗄️ Database

### Main Entities

| Entity | Description |
|--------|-------------|
| **User** | Users with roles (Organizer, Participant, Admin, Vendor, Volunteer) |
| **Event** | Events with status, capacity, dates, locations |
| **Ticket & TicketTier** | Tickets with QR codes and pricing tiers |
| **Venue** | Venues with amenities and availability |
| **Service** | Event services with categories |
| **Payment** | Payment records with provider and status |
| **VolunteerApplication** | Volunteer applications for events |
| **Review** | Reviews and ratings |
| **VenueBooking** | Venue reservations |
| **EventService** | Services linked to events |

### Prisma Commands

```bash
# Generate Prisma client
bun run prisma:generate

# Create new migration
bun exec prisma migrate dev --name <migration-name>

# Reset database (⚠️ deletes all data)
bun exec prisma migrate reset

# Open Prisma Studio
bun run prisma:studio
```

### Database Schema Location

```
prisma/
└── schema.prisma    # Database schema definition
```

---

## 🔐 Authentication

### JWT Strategy

The application uses JWT-based authentication with access and refresh tokens:

| Token Type | Expiration | Storage |
|------------|------------|---------|
| Access Token | 1 hour | Client (memory/localStorage) |
| Refresh Token | 7 days | HTTP-only cookie |

### Authentication Flow

```
1. POST /auth/login
   → Returns: accessToken, refreshToken (cookie)

2. Protected Request
   → Header: Authorization: Bearer <accessToken>

3. Token Refresh
   → POST /auth/refresh (with refreshToken cookie)
   → Returns: new accessToken
```

### Role-Based Access Control

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ORGANIZER', 'ADMIN')
@Post()
createEvent(@Body() dto: CreateEventDto) {
  return this.eventsService.create(dto);
}
```

### Available Roles

| Role | Permissions |
|------|-------------|
| **ADMIN** | Full system access |
| **ORGANIZER** | Create/manage events, view analytics |
| **PARTICIPANT** | Browse events, purchase tickets, leave reviews |
| **VENDOR** | List services, manage bookings |
| **VOLUNTEER** | Apply to events, view applications |

---

## 📖 API Documentation

### Swagger UI

Once the server is running, access the interactive API documentation at:

```
http://localhost:3000/api/docs
```

### API Endpoints Overview

| Category | Endpoints |
|----------|-----------|
| **Auth** | `POST /auth/register` • `POST /auth/login` • `POST /auth/refresh` |
| **Users** | `GET /users/profile` • `PATCH /users/profile` |
| **Events** | `GET /events` • `POST /events` • `GET /events/:id` • `PATCH /events/:id` • `DELETE /events/:id` |
| **Venues** | `GET /venues` • `GET /venues/:id` • `POST /venues/bookings` |
| **Services** | `GET /services` • `POST /events/:id/services` |
| **Tickets** | `GET /events/:id/tickets` • `POST /tickets/purchase` |
| **Payments** | `POST /payments/click` • `POST /payments/payme` |
| **Volunteers** | `POST /events/:id/volunteers` • `GET /volunteers/applications` |
| **Reviews** | `POST /reviews` • `GET /reviews/:entityId` |
| **Analytics** | `GET /analytics/events/:id` • `GET /analytics/export` |

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend` directory:

```env
# ======================
# Database
# ======================
DATABASE_URL=postgresql://user:password@localhost:5432/planner_ai

# ======================
# JWT Configuration
# ======================
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# ======================
# Payment Providers
# ======================
CLICK_SECRET=your-click-merchant-secret
PAYME_KEY=your-payme-merchant-key

# ======================
# Email (Nodemailer)
# ======================
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# ======================
# Server
# ======================
PORT=3000
NODE_ENV=development

# ======================
# CORS (Frontend URL)
# ======================
CORS_ORIGIN=http://localhost:5173
```

---

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
bun run test

# Watch mode
bun run test:watch

# With coverage
bun run test:cov
```

### E2E Tests

```bash
# Run E2E tests
bun run test:e2e
```

### Test Structure

```
test/
├── app.e2e-spec.ts       # Application-level tests
└── jest-e2e.json         # E2E test configuration
```

### Example Test

```typescript
// events/events.service.spec.ts
describe('EventsService', () => {
  let service: EventsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [EventsService, PrismaService],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  it('should create an event', async () => {
    const event = await service.create(createEventDto);
    expect(event.title).toBe(createEventDto.title);
  });
});
```

---

## 🚀 Deployment

### Production Build

```bash
# Build the application
bun run build

# Start production server
bun run start
```

### Docker Deployment

```dockerfile
# Build stage
FROM oven/bun:1 AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

# Production stage
FROM oven/bun:1-slim
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/generated ./generated
RUN bun run prisma:generate

ENV NODE_ENV=production
EXPOSE 3000

CMD ["bun", "run", "start"]
```

### Environment-Specific Configs

Use environment variables for different deployments:

```bash
# Production
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://...
```

---

## 🔍 Linting & Formatting

```bash
# Run ESLint
bun run lint

# Format code with Prettier
bun run format
```

---

## 📚 Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Swagger Documentation](https://swagger.io/docs/)

---

<p align="center">
  <strong>Part of</strong> <a href="../README.md">Planner AI</a>
</p>

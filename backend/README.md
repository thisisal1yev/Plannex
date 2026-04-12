# Planner AI — Backend

NestJS REST API for the Event Organization Marketplace.

[![NestJS](https://img.shields.io/badge/NestJS-v11-ea2845?logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.9-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-v7.7-2d3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169e1?logo=postgresql)](https://www.postgresql.org/)

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| NestJS | v11 | Framework |
| TypeScript | v5.9 | Type safety |
| Prisma | v7.7 | ORM |
| PostgreSQL | 14+ | Database |
| Passport + JWT | — | Authentication |
| bcrypt | v6 | Password hashing |
| Swagger | — | API documentation |
| Nodemailer | v8 | Email delivery |
| Multer | v2 | File uploads |
| ExcelJS | v4 | Analytics export |
| QRCode | v1.5 | Ticket QR generation |
| cache-manager | v7 | Response caching |
| class-validator | v0.15 | DTO validation |

---

## Project Structure

```
backend/
├── src/
│   ├── analytics/          # Metrics, reports, Excel export
│   ├── auth/               # JWT auth, refresh tokens, guards
│   │   ├── strategies/     # Access + refresh JWT strategies
│   │   ├── guards/         # JwtAuthGuard
│   │   └── decorators/     # @CurrentUser, @Public
│   ├── common/             # Shared utilities
│   │   ├── filters/        # GlobalExceptionFilter
│   │   ├── guards/         # RolesGuard, ThrottlerGuard
│   │   ├── interceptors/   # Logging, ResponseTransform
│   │   └── decorators/     # @Roles
│   ├── config/             # DB, JWT, mailer config
│   ├── events/             # Event CRUD & management
│   ├── payments/           # Click & Payme integrations
│   ├── prisma/             # PrismaService & module
│   ├── reviews/            # Reviews & ratings
│   ├── services/           # Service marketplace
│   ├── tickets/            # Ticketing & QR codes
│   ├── users/              # User management
│   ├── venues/             # Venue listings & bookings
│   ├── volunteers/         # Volunteer applications
│   ├── app.module.ts
│   └── main.ts
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── test/                   # E2E tests
└── .env.example
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL v14+
- Bun (recommended)

### Installation

```bash
bun install
cp .env.example .env
# Edit .env with your values
```

### Database

```bash
# Generate Prisma client
bun run prisma:generate

# Run migrations
bun run prisma:migrate

# Seed sample data (optional)
bun run prisma:seed
```

### Run

```bash
# Development (hot reload)
bun run start:dev

# Debug mode
bun run start:debug

# Production
bun run build && bun run start
```

Server: **http://localhost:3000**
Swagger: **http://localhost:3000/api/docs**

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun run start:dev` | Dev server with hot reload |
| `bun run start:debug` | Dev server in debug mode |
| `bun run build` | Compile TypeScript |
| `bun run start` | Start production server |
| `bun run prisma:generate` | Generate Prisma client |
| `bun run prisma:migrate` | Run migrations |
| `bun run prisma:studio` | Open Prisma Studio |
| `bun run prisma:seed` | Seed database |
| `bun run test` | Unit tests |
| `bun run test:watch` | Tests in watch mode |
| `bun run test:cov` | Tests with coverage |
| `bun run test:e2e` | E2E tests |
| `bun run lint` | ESLint with auto-fix |
| `bun run format` | Prettier format |

---

## Architecture

### Module Pattern

Every feature module follows the same structure:

```
module/
├── module.controller.ts    # HTTP handlers
├── module.service.ts       # Business logic
├── module.module.ts        # Module definition
└── dto/
    ├── create-*.dto.ts
    └── update-*.dto.ts
```

### Global Middleware

| Name | Purpose |
|------|---------|
| **JwtAuthGuard** | Applied globally; opt-out with `@Public()` |
| **RolesGuard** | Role-based authorization |
| **ThrottlerGuard** | Rate limiting |
| **LoggingInterceptor** | Request/response logging |
| **ResponseTransformInterceptor** | Unified response shape |
| **GlobalExceptionFilter** | Centralized error handling |

### Response Format

```json
{
  "success": true,
  "data": { ... },
  "meta": { "total": 100, "page": 1, "limit": 20, "totalPages": 5 }
}
```

---

## Authentication

### Tokens

| Token | TTL | Storage |
|-------|-----|---------|
| Access Token | 15 min | `Authorization: Bearer` header |
| Refresh Token | 7 days | HTTP-only cookie |

### Flow

```
POST /auth/register  →  create user, get tokens
POST /auth/login     →  get accessToken + refreshToken cookie
Protected request    →  Authorization: Bearer <accessToken>
POST /auth/refresh   →  renew accessToken via refreshToken cookie
```

### Roles

```typescript
@Roles('ORGANIZER', 'ADMIN')
@Post()
createEvent(@Body() dto: CreateEventDto) { ... }
```

| Role | Permissions |
|------|-------------|
| **ADMIN** | Full access |
| **ORGANIZER** | Events, analytics |
| **PARTICIPANT** | Browse, tickets, reviews |
| **VENDOR** | Services, bookings |
| **VOLUNTEER** | Apply to events |

---

## Database

### Main Entities

| Entity | Description |
|--------|-------------|
| **User** | Accounts with roles |
| **Event** | Events with status, capacity, dates |
| **Ticket / TicketTier** | QR tickets with pricing tiers |
| **Venue** | Venues with amenities |
| **Service** | Event services by category |
| **Payment** | Click / Payme payment records |
| **VenueBooking** | Venue reservations |
| **VolunteerApplication** | Volunteer applications |
| **Review** | Ratings for events, venues, services |
| **EventService** | Services linked to events |

### Prisma Commands

```bash
# New migration
bun exec prisma migrate dev --name <name>

# Reset database (deletes all data)
bun exec prisma migrate reset

# Visual DB browser
bun run prisma:studio
```

---

## Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/planner_ai

JWT_SECRET=your-secret-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

CLICK_SECRET=your-click-secret
PAYME_KEY=your-payme-key

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your@gmail.com
MAIL_PASSWORD=your-app-password

PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

---

## API Endpoints

| Module | Endpoints |
|--------|-----------|
| **Auth** | `POST /auth/register` · `POST /auth/login` · `POST /auth/refresh` |
| **Users** | `GET /users/profile` · `PATCH /users/profile` |
| **Events** | `GET /events` · `POST /events` · `GET /events/:id` · `PATCH /events/:id` · `DELETE /events/:id` |
| **Venues** | `GET /venues` · `GET /venues/:id` · `POST /venues/bookings` |
| **Services** | `GET /services` · `GET /services/:id` · `POST /events/:id/services` |
| **Tickets** | `GET /events/:id/tickets` · `POST /tickets/purchase` · `GET /tickets/:id/qr` |
| **Payments** | `POST /payments/click` · `POST /payments/payme` · `GET /payments/history` |
| **Volunteers** | `POST /events/:id/volunteers` · `GET /volunteers/applications` |
| **Reviews** | `POST /reviews` · `GET /reviews/:entityId` · `PATCH /reviews/:id` |
| **Analytics** | `GET /analytics/events/:id` · `GET /analytics/sales` · `GET /analytics/export` |

Full interactive docs at **http://localhost:3000/api/docs**.

---

## Testing

```bash
bun run test          # unit tests
bun run test:watch    # watch mode
bun run test:cov      # with coverage
bun run test:e2e      # E2E tests
```

Unit test files live alongside source (`*.spec.ts`). E2E tests are in `test/`.

---

## Docker

```dockerfile
FROM oven/bun:1 AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM oven/bun:1-slim
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/generated ./generated
ENV NODE_ENV=production
EXPOSE 3000
CMD ["bun", "run", "start"]
```

---

<p align="center">
  Part of <a href="../README.md">Planner AI</a>
</p>

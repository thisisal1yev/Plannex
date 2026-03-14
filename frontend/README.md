# Planner AI — Frontend

> React-based frontend for the Event Organization Marketplace

[![React](https://img.shields.io/badge/React-v19-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.9-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-v8-646cff?logo=vite)](https://vite.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)

---

## 📋 Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Architecture](#architecture)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Styling](#styling)
- [Environment Variables](#environment-variables)
- [Build & Deployment](#build--deployment)
- [Linting & Formatting](#linting--formatting)

---

## 🎯 Overview

This is the frontend application for **Planner AI** — a marketplace for event organization in Uzbekistan. Built with React 19, TypeScript, and Vite, it provides a modern, fast, and type-safe user interface for:

- Browsing and creating events
- Booking venues and services
- Purchasing and managing tickets
- Processing payments
- Managing user profiles and applications

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| [React](https://react.dev/) | 19 | UI library |
| [TypeScript](https://www.typescriptlang.org/) | 5.9 | Type safety |
| [Vite](https://vite.dev/) | 8 | Build tool & dev server |
| [TailwindCSS](https://tailwindcss.com/) | 4 | Utility-first CSS |
| [React Query](https://tanstack.com/query) | 5 | Server state management |
| [Zustand](https://zustand-demo.pmnd.rs/) | 5 | Client state management |
| [React Router](https://reactrouter.com/) | 7 | Client-side routing |
| [React Hook Form](https://react-hook-form.com/) | 7 | Form handling |
| [Axios](https://axios-http.com/) | 1 | HTTP client |

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                # App initialization & configuration
│   │   ├── providers.tsx   # Context providers wrapper
│   │   └── router.tsx      # Route definitions
│   │
│   ├── pages/              # Page components (route-level)
│   │   ├── HomePage/
│   │   ├── EventsPage/
│   │   ├── VenuePage/
│   │   ├── ProfilePage/
│   │   └── ...
│   │
│   ├── widgets/            # Composite UI blocks
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── Sidebar/
│   │   └── ...
│   │
│   ├── features/           # User interactions & actions
│   │   ├── auth/           # Login, register, logout
│   │   ├── eventCreation/  # Create/edit event forms
│   │   ├── ticketPurchase/ # Buy tickets flow
│   │   ├── payment/        # Payment processing
│   │   └── ...
│   │
│   ├── entities/           # Business entities (domain models)
│   │   ├── event/          # Event entity (types, API, UI)
│   │   ├── user/           # User entity
│   │   ├── venue/          # Venue entity
│   │   ├── ticket/         # Ticket entity
│   │   ├── service/        # Service entity
│   │   ├── review/         # Review entity
│   │   ├── analytics/      # Analytics entity
│   │   └── volunteer/      # Volunteer entity
│   │
│   ├── shared/             # Reusable utilities
│   │   ├── api/            # API client & HTTP utilities
│   │   │   ├── apiClient.ts
│   │   │   ├── endpoints.ts
│   │   │   └── index.ts
│   │   ├── model/          # Shared data models
│   │   ├── types/          # TypeScript type definitions
│   │   └── ui/             # Reusable UI components
│   │       ├── Button/
│   │       ├── Input/
│   │       ├── Modal/
│   │       ├── Card/
│   │       └── ...
│   │
│   ├── assets/             # Static assets
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── index.css           # Global styles
│   ├── main.tsx            # React entry point
│   └── App.tsx             # Root component
│
├── public/                 # Static public assets
│   ├── favicon.svg
│   └── icons.svg
│
├── index.html              # HTML template
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── eslint.config.js
```

### Architecture: Feature-Sliced Design

This project follows **Feature-Sliced Design (FSD)** methodology:

| Layer | Purpose | Dependencies |
|-------|---------|--------------|
| **app** | App initialization, routing, providers | All layers |
| **pages** | Page compositions for routes | widgets, features |
| **widgets** | Composite UI blocks | features, entities |
| **features** | User actions & interactions | entities, shared |
| **entities** | Business domain entities | shared |
| **shared** | Reusable utilities & UI | None |

**Rule:** Lower layers cannot depend on higher layers.

---

## ✨ Features

### User Features

- **Event Discovery**: Browse events with advanced filters (date, location, category, price)
- **Event Creation**: Create and manage events with multiple ticket tiers
- **Venue Booking**: Search and book venues with real-time availability
- **Service Marketplace**: Hire event services (catering, decoration, photography, security)
- **Ticket Purchasing**: Buy tickets with secure payment processing
- **Digital Tickets**: QR-coded tickets delivered to your email
- **Payment Integration**: Pay with Click, Payme, or other payment providers
- **Profile Management**: Manage your profile, events, and purchase history
- **Reviews & Ratings**: Leave reviews for events, venues, and services
- **Volunteer Applications**: Apply for volunteer positions at events

### Technical Features

- **Feature-Sliced Design (FSD)**: Scalable architecture with clear layer separation
- **Type-Safe Development**: Full TypeScript support with strict typing
- **Dual State Management**: React Query for server state, Zustand for client state
- **Hot Module Replacement**: Fast development with Vite HMR
- **Responsive Design**: Mobile-first UI with TailwindCSS v4
- **Form Validation**: React Hook Form with built-in validation
- **API Interceptors**: Automatic JWT token handling and error processing
- **Code Splitting**: Optimized bundle size with automatic code splitting
- **SEO Friendly**: Server-side rendering ready architecture

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher ([download](https://nodejs.org/))
- **Bun** (recommended) or **npm** ([install Bun](https://bun.sh/))

### Installation

1. **Navigate to the frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Create environment file (optional)**
   ```bash
   echo "VITE_API_URL=http://localhost:3000" > .env
   ```

4. **Start development server**
   ```bash
   bun run dev
   ```

The application will be available at: **http://localhost:5173**

### Connecting to Backend

Make sure the backend server is running on `http://localhost:3000` or update the API URL:

```bash
# Create .env file with your backend URL
echo "VITE_API_URL=http://localhost:3000" > .env
```

---

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server with Hot Module Replacement (HMR) |
| `bun run build` | Build for production (optimizes and bundles with Vite) |
| `bun run preview` | Preview production build locally on port 4173 |
| `bun run lint` | Run ESLint to check code quality |

### Development Tips

```bash
# Run dev server with forced port
bun run dev --port 3001

# Open browser automatically
bun run dev --open

# Build with sourcemaps for debugging
bun run build --sourcemap
```

---

## 🏗️ Architecture

### State Management

The application uses a **dual state management** approach:

| Library | Use Case | Location |
|---------|----------|----------|
| **React Query** | Server state (API data) | `entities/*/api/` |
| **Zustand** | Client state (UI, auth, filters) | `shared/model/` |

#### React Query (Server State)

```typescript
// Example: Fetching events
import { useQuery } from '@tanstack/react-query'
import { eventApi } from '@/entities/event/api'

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: eventApi.getAll,
  })
}
```

#### Zustand (Client State)

```typescript
// Example: Auth store
import { create } from 'zustand'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}))
```

---

## 🌐 API Integration

### API Client

The API client is configured in `shared/api/`:

```typescript
// shared/api/apiClient.ts
import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
  return config
})
```

### Entity-based API Structure

Each entity has its own API module:

```
entities/
└── event/
    ├── api/
    │   ├── eventApi.ts      # API calls
    │   └── index.ts         # Exports
    ├── model/
    │   ├── types.ts         # TypeScript types
    │   └── selectors.ts     # Data selectors
    └── ui/
        ├── EventCard.tsx    # UI components
        └── EventList.tsx
```

---

## 🎨 Styling

### TailwindCSS v4

This project uses **TailwindCSS v4** with the new Vite plugin:

```typescript
// vite.config.ts
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

### Usage

```tsx
// Utility-first CSS classes
<button className="btn-primary">
  Click me
</button>

// With custom CSS in index.css
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
}
```

### Global Styles

Edit `src/index.css` for global styles and custom theme configuration.

---

## ⚙️ Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:3000

# Optional: Feature flags, analytics keys, etc.
VITE_ENABLE_ANALYTICS=true
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

### Accessing Variables

```typescript
const apiUrl = import.meta.env.VITE_API_URL
```

---

## 📦 Build & Deployment

### Production Build

```bash
# Build for production
bun run build

# Preview production build
bun run preview
```

### Deployment

The `dist/` folder contains the production build and can be deployed to any static hosting:

- **Vercel** — Automatic deployments from Git
- **Netlify** — Drag & drop or Git integration
- **Docker** — Use a multi-stage Dockerfile
- **Traditional server** — Serve with Nginx or Apache

### Docker Deployment (Example)

```dockerfile
# Build stage
FROM oven/bun:1 AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🔍 Linting & Formatting

### ESLint Configuration

This project uses ESLint with TypeScript and React-specific rules:

```bash
# Run ESLint
bun run lint

# Fix auto-fixable issues
bun run lint -- --fix
```

### Recommended VS Code Extensions

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

---

## 📚 Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Docs](https://vite.dev/)
- [TailwindCSS Docs](https://tailwindcss.com/)
- [React Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Feature-Sliced Design](https://feature-sliced.design/)

---

<p align="center">
  <strong>Part of</strong> <a href="../README.md">Planner AI</a>
</p>

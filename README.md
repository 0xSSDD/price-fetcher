# Price Fetcher

A SvelteKit application that fetches and displays cryptocurrency price pairs with caching support.

## Live Demo & Production Deployment

The application is live at [https://price.j16z.org](https://price.j16z.org)

### Production Infrastructure

- **Server**: Ubuntu VPS with Nginx reverse proxy
- **Process Management**: PM2 for Node.js application management
- **SSL**: Let's Encrypt SSL certificates with auto-renewal
- **Domain**: Custom subdomain configuration with Hostinger DNS
- **Reverse Proxy**: Nginx with WebSocket support for Vite HMR

## Features

- Real-time cryptocurrency price fetching via CoinGecko API
- Price caching with PostgreSQL database
- Token pair selection interface
- API endpoints for tokens and price data
- Tailwind CSS for styling

## Prerequisites

- Node.js (LTS version)
- Docker (for PostgreSQL database)
- CoinGecko API key

## Setup

1. Clone the repository and install dependencies:
```bash
git clone <repository-url>
cd price-fetcher
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Add your CoinGecko API key to .env
```

3. Start the database:
```bash
npm run db:start
npm run db:push   # Apply database schema
npm run db:seed   # Seed initial token data
```

## Development

Start the development server:
```bash
npm run dev
```

Run tests:
```bash
# API tests
npm run test:api

# Frontend component tests
npm run test:frontend

## Production

Build and start the production server:
```bash
npm run build
npm run preview
```

## Backend Architecture

### API Implementation
The backend is implemented using SvelteKit's built-in API routes (`+server.ts` files), chosen for:
- Seamless integration with the frontend
- File-based routing
- Built-in TypeScript support
- Zero-config deployment
- Efficient server/client code splitting

### API Endpoints

#### `GET /api/tokens`
Returns list of available tokens.

Response:
```typescript
[
  {
    id: string,       // UUID of the token
    name: string,     // Token symbol (e.g., 'ton', 'usdt')
    api_id: string,   // External API identifier
    created_at: Date  // Token creation timestamp
  }
]
```

#### `GET /api/prices/[base]/[quote]`
Fetches price for a token pair with built-in caching.

Parameters:
- `base`: Base token symbol (e.g., 'ton')
- `quote`: Quote token symbol (e.g., 'usdt')
- `refresh`: Optional query param to force cache refresh

Response:
```typescript
{
  pair: string,        // "base/quote"
  rate: number,        // Exchange rate
  timestamp: number,   // Unix timestamp
  baseUsdPrice: number,
  quoteUsdPrice: number
}
```

Features:
- 5-minute price caching using PostgreSQL
- Error handling for invalid pairs
- Logging for monitoring and debugging
- External API integration with CoinGecko

### Database
- PostgreSQL with Drizzle ORM for type-safe queries
- Token and price caching tables
- Managed through Docker for development


## Tech Stack

#### Frontend
- SvelteKit for server-side rendering and routing
- TypeScript for type safety
- Tailwind CSS for responsive design
- Vite for development and build optimization

#### Backend
- SvelteKit API routes for backend endpoints
- PostgreSQL with Drizzle ORM for data persistence
- Docker for database containerization
- CoinGecko API integration for real-time pricing

#### Testing & Quality
- Vitest for unit and integration testing
- Playwright for end-to-end testing
- TypeScript for static type checking
- ESLint and Prettier for code quality

#### DevOps & Deployment
- PM2 for process management and auto-restart
- Nginx for reverse proxy and SSL termination
- Docker Compose for database orchestration

## Potential Improvements & Future enhancements
### Product
- Add multiple price providers support
- Consider moving to /api/prices?base=X&quote=Y format
- Use API logging preesnt to monitor outages from Price providers
- Implement rate limiting
- Add pagination for tokens endpoint
- Include token metadata (decimals, full name)
- Make cache duration configurable
- Consider query parameter format for price endpoint
- Extract price fetching logic to service layer

### Tech
- Implement Redis caching layer for API responses
- Add CDN integration for static assets
- Optimize bundle size with dynamic imports
- Implement service worker for offline support

### Scalability
- Set up load balancing with multiple PM2 instances
- Implement database replication for read scaling
- Add rate limiting for API endpoints
- Configure automated database backups

### Monitoring & Reliability
- Add Prometheus/Grafana for metrics monitoring
- Implement ELK stack for centralized logging
- Set up uptime monitoring with Pingdom/UptimeRobot
- Add error tracking with Sentry

### Security
- Implement API key authentication
- Add rate limiting per IP/user
- Regular security audits with OWASP guidelines
- Set up automated vulnerability scanning

### Developer Experience
- Add Docker containerization for the entire application
- Implement automated deployment pipelines
- Add staging environment for testing
- Improve local development setup with docker-compose
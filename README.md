# Price Fetcher

A SvelteKit application that fetches and displays cryptocurrency price pairs with caching support.

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
npm run db:start # this will use docker to spin up the postgres DB
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

- SvelteKit
- TypeScript
- PostgreSQL with Drizzle ORM
- Tailwind CSS
- Vitest & Playwright for testing

## Potential Improvements & Future enhancements

- Add multiple price providers support
- Consider moving to /api/prices?base=X&quote=Y format
- Use API logging preesnt to monitor outages from Price providers
- Implement rate limiting
- Add pagination for tokens endpoint
- Include token metadata (decimals, full name)
- Make cache duration configurable
- Consider query parameter format for price endpoint
- Extract price fetching logic to service layer

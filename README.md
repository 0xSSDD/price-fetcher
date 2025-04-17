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

## API Documentation

### GET /api/tokens
Returns list of available tokens.

### GET /api/prices/[base]/[quote]
Fetches price for a token pair with 5-minute cache.

## Potential Improvements

- Add multiple price providers support
- Use API logging preesnt to monitor outages from Price providers
- Implement rate limiting
- Add pagination for tokens endpoint
- Include token metadata (decimals, full name)
- Make cache duration configurable
- Consider query parameter format for price endpoint
- Extract price fetching logic to service layer

## Tech Stack

- SvelteKit
- TypeScript
- PostgreSQL with Drizzle ORM
- Tailwind CSS
- Vitest & Playwright for testing

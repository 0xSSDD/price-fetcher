// src/routes/api/prices/[base]/[quote]/+server.test.ts
import { describe, it, expect, vi } from 'vitest';
import { GET } from './+server';
import type { RequestEvent } from './$types';

// Mock environment variables
vi.mock('$env/static/private', () => ({
    COINGECKO_API_KEY: 'fake-key'
}));

// Mock postgres with logging
vi.mock('postgres', () => ({
    default: () => ({
        end: () => Promise.resolve()
    })
}));

// Mock drizzle with logging
vi.mock('drizzle-orm/postgres-js', () => ({
    drizzle: () => ({
        select: () => ({
            from: () => ({
                where: (query: any) => {
                    // For token queries
                    if (!Array.isArray(query)) {
                        const val = query.val;
                        const mockTokens = {
                            bitcoin: { id: '1', name: 'bitcoin', api_id: 'bitcoin' },
                            usdt: { id: '2', name: 'usdt', api_id: 'tether' }
                        };
                        return Promise.resolve([mockTokens[val]].filter(Boolean));
                    }
                    // For cache queries (using and())
                    return {
                        orderBy: () => ({
                            limit: () => Promise.resolve([])  // Empty cache by default
                        })
                    };
                }
            })
        }),
        insert: () => ({
            values: () => Promise.resolve()
        })
    })
}));

// Mock drizzle-orm operators
vi.mock('drizzle-orm', () => ({
    eq: (col: string, val: string) => ({ col: 'name', val }),
    and: (...conditions: any[]) => conditions,
    sql: (template: string) => ({ template })
}));

describe('GET /api/prices/[base]/[quote]', () => {
    it('should return price data for BTC/USDT', async () => {
        console.log('\n--- Starting BTC/USDT test ---');

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: () => {
                console.log('CoinGecko API response mock');
                return Promise.resolve({
                    'bitcoin': { usd: 50000 },
                    'tether': { usd: 1 }
                });
            }
        });

        const response = await GET({
            params: { base: 'bitcoin', quote: 'usdt' },
            url: new URL('http://localhost/api/prices/bitcoin/usdt')
        } as RequestEvent);

        const data = await response.json();
        console.log('Response data:', data);

        expect(response.status).toBe(200);
        expect(data).toMatchObject({
            pair: 'bitcoin/usdt',
            rate: 50000,
            baseUsdPrice: 50000,
            quoteUsdPrice: 1
        });
    });

    it('should handle invalid token', async () => {
        const response = await GET({
            params: { base: 'invalid', quote: 'usdt' },
            url: new URL('http://localhost/api/prices/invalid/usdt')
        } as RequestEvent);

        const data = await response.json();
        expect(response.status).toBe(400);
        expect(data.error).toBe('Invalid trading pair');
    });
});
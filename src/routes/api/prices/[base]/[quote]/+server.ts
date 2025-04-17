import { json } from '@sveltejs/kit';
import type { RequestHandler, RouteParams} from './$types';
import { COINGECKO_API_KEY } from '$env/static/private';
import { tokens, prices } from '$lib/server/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';

/**
 * Price API endpoint for cryptocurrency price fetching with caching.
 *
 * @endpoint GET /api/prices/[base]/[quote]
 * @param base - Base token symbol (e.g., 'ton')
 * @param quote - Quote token symbol (e.g., 'usdt')
 * @param refresh - Optional query param to force cache refresh
 *
 * @returns {Object} JSON response
 * {
 *   pair: string,        // "base/quote"
 *   rate: number,        // Exchange rate
 *   timestamp: number,   // Unix timestamp
 *   baseUsdPrice: number,
 *   quoteUsdPrice: number
 * }
 *
 * @cache Prices are cached for 5 minutes
 *
 * @todo
 * - Add support for multiple price providers via ?provider param
 * - Make cache duration configurable
 * - Consider moving to /api/prices?base=X&quote=Y format
 * - Extract price fetching logic to service layer
 */

const coingeckoApiRoot = 'https://api.coingecko.com/api/v3/';
const headers = {
    'accept': 'application/json',
    'x-cg-demo-api-key': COINGECKO_API_KEY
};

// Update the type to include the schema
type DB = typeof db;

/**
 * @DEV NOTE
 * This is the API route that fetches the price from CoinGecko
 * and stores the price in the database, cache it and return the price from the cache.
 *
 */
export const GET: RequestHandler = async ({ params, url }: { params: RouteParams, url: URL }) => {
    const requestStart = Date.now();
    const forceRefresh = url.searchParams.get('refresh') === 'true';
    const base = params.base.toLowerCase();
    const quote = params.quote.toLowerCase();

    console.log(`[Price API] Request for ${base}/${quote}${forceRefresh ? ' (force refresh)' : ''}`);

    try {
        const tokens = await getTokenPair(db, base, quote);

        if (!forceRefresh) {
            const cacheCheckStart = Date.now();
            const cachedPrice = await getCachedPrice(db, tokens.base.id, tokens.quote.id);

            if (cachedPrice.length > 0) {
                const cacheHitDuration = Date.now() - cacheCheckStart;
                console.log(`[Price API] Cache HIT for ${base}/${quote} (took ${cacheHitDuration}ms)`);
                return json({
                    pair: `${tokens.base.name}/${tokens.quote.name}`,
                    rate: Number(cachedPrice[0].rate),
                    timestamp: cachedPrice[0].created_at.getTime(),
                    baseUsdPrice: Number(cachedPrice[0].base_usd_price),
                    quoteUsdPrice: Number(cachedPrice[0].quote_usd_price),
                });
            }
            console.log(`[Price API] Cache MISS for ${base}/${quote}`);
        }

        const { baseUsdPrice, quoteUsdPrice } = await fetchPriceFromCoingecko(
            tokens.base.api_id,
            tokens.quote.api_id
        );

        const rate = baseUsdPrice / quoteUsdPrice;

        const dbStart = Date.now();
        await db.insert(prices).values({
            base_token_id: tokens.base.id,
            quote_token_id: tokens.quote.id,
            rate: rate.toString(),
            base_usd_price: baseUsdPrice.toString(),
            quote_usd_price: quoteUsdPrice.toString()
        });
        const dbDuration = Date.now() - dbStart;
        console.log(`[Price API] Price stored in database (took ${dbDuration}ms)`);

        const totalDuration = Date.now() - requestStart;
        console.log(`[Price API] Request completed in ${totalDuration}ms`);

        return json({
            pair: `${tokens.base.name}/${tokens.quote.name}`,
            rate,
            timestamp: Date.now(),
            baseUsdPrice,
            quoteUsdPrice,
        });
    } catch (error) {
        console.error(`[Price API] Error:`, error);
        if (error instanceof Error && error.message.includes('Could not find')) {
            return json({
                error: 'Invalid trading pair',
                message: error.message
            }, { status: 400 });
        }
        return json({ error: 'Failed to fetch price data' }, { status: 500 });
    }
};

async function getTokenPair(db: DB, base: string, quote: string) {
    const [baseToken, quoteToken] = await Promise.all([
        db.select().from(tokens).where(eq(tokens.name, base)),
        db.select().from(tokens).where(eq(tokens.name, quote))
    ]);

    if (!baseToken[0] || !quoteToken[0]) {
        throw new Error(`Could not find one or both tokens: ${base}/${quote}`);
    }

    return { base: baseToken[0], quote: quoteToken[0] };
}

async function getCachedPrice(db: DB, baseId: string, quoteId: string) {
    return db.select()
        .from(prices)
        .where(
            and(
                eq(prices.base_token_id, baseId),
                eq(prices.quote_token_id, quoteId),
                sql`created_at > NOW() - INTERVAL '5 minutes'`
            )
        )
        .orderBy(sql`created_at DESC`)
        .limit(1);
}

async function fetchPriceFromCoingecko(baseApiId: string, quoteApiId: string) {
    const coingeckoStart = Date.now();
    console.log(`[Price API] Fetching from CoinGecko: ${baseApiId},${quoteApiId}`);

    const response = await fetch(
        `${coingeckoApiRoot}simple/price?ids=${baseApiId},${quoteApiId}&vs_currencies=usd`,
        { headers }
    );

    if (!response.ok) {
        console.error(`[Price API] CoinGecko error: ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const coingeckoDuration = Date.now() - coingeckoStart;
    console.log(`[Price API] CoinGecko response received (took ${coingeckoDuration}ms)`);

    return {
        baseUsdPrice: data[baseApiId].usd,
        quoteUsdPrice: data[quoteApiId].usd
    };
}
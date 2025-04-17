import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { tokens } from '$lib/server/db/schema';

/**
 * Tokens API endpoint for retrieving all available tokens.
 *
 * @endpoint GET /api/tokens
 * @returns {Object[]} JSON response
 * [
 *   {
 *     id: string,       // UUID of the token
 *     name: string,     // Token symbol (e.g., 'ton', 'usdt')
 *     api_id: string,   // External API identifier
 *     created_at: Date  // Token creation timestamp
 *   }
 * ]
 *
 * @error
 * - 500: Database error while fetching tokens
 *
 * @todo
 * - Add pagination support
 * - Add filtering options
 * - Add token metadata (decimals, full name, etc)
 */
export const GET: RequestHandler = async () => {
    try {
        const allTokens = await db.select().from(tokens);
        return json(allTokens);
    } catch (error) {
        console.error('Error fetching tokens:', error);
        return json({ error: 'Failed to fetch tokens' }, { status: 500 });
    }
}
import { writable } from 'svelte/store';

/**
 * Core token/currency types and stores for the application.
 * Manages the state of available tokens, selected pairs, and current price.
 *
 */

export interface Token {
    name: string;
    api_id: string;
}

/**
 * Application state stores
 */
export const isInitialized = writable(false);
export const availableTokens = writable<Token[]>([]);
export const selectedBase = writable<string | null>(null);
export const selectedQuote = writable<string | null>(null);
export const currentPrice = writable<number | null>(null);
export const isLoading = writable(false);

/**
 * Initializes available tokens from the API and sets default selections.
 * @throws {Error} If token fetch fails
 */
export async function initializeTokens() {
    isLoading.set(true);
    try {
        const response = await fetch('/api/tokens');
        if (!response.ok) throw new Error('Failed to fetch tokens');
        const tokens = await response.json();
        availableTokens.set(tokens);

        // Set default values only if not already set
        selectedBase.update(current => current || tokens[0]?.name || 'ton');
        selectedQuote.update(current => current || tokens[1]?.name || 'usdt');

        isInitialized.set(true);
    } catch (error) {
        console.error('Failed to load tokens:', error);
    } finally {
        isLoading.set(false);
    }
}
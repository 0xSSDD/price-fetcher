// src/lib/components/FetchButton.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { currentPrice, isLoading } from '$lib/stores/Currency';
import { get } from 'svelte/store';

// Mock the fetch function globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Currency Store', () => {
    beforeEach(() => {
        currentPrice.set(null);
        isLoading.set(false);
        mockFetch.mockClear();
    });

    it('handles price updates correctly', async () => {
        // Setup mock response
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ rate: 50000 })
        });

        // Simulate fetch action
        isLoading.set(true);
        const response = await fetch('/api/prices/bitcoin/usdt');
        const data = await response.json();
        currentPrice.set(data.rate);
        isLoading.set(false);

        // Verify store updates
        expect(get(currentPrice)).toBe(50000);
        expect(get(isLoading)).toBe(false);
        expect(mockFetch).toHaveBeenCalledWith('/api/prices/bitcoin/usdt');
    });

    it('handles errors correctly', async () => {
        // Setup mock error response
        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: () => Promise.resolve({ error: 'API Error' })
        });

        // Simulate fetch action
        isLoading.set(true);
        const response = await fetch('/api/prices/bitcoin/usdt');
        if (!response.ok) {
            currentPrice.set(null);
        }
        isLoading.set(false);

        // Verify error handling
        expect(get(currentPrice)).toBe(null);
        expect(get(isLoading)).toBe(false);
    });
});
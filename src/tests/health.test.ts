import { describe, it, expect } from 'vitest';
import { app } from '@/server.js';

describe('Health check', () => {
    it('should return ok', async () => {
        const res = await app.request('/health', {
            method: 'GET'
        });

        expect(res.status).toBe(200);

        const json = await res.json();
        expect(json.status).toBe('ok');
    });
});

const nameBase = require('../test-suite.config.js');

describe('Domains API GET Endpoints', () => {
    it('Tests Domains.Popular status and object structure', async () => {
        const { status, data } = await nameBase.Domains.Popular();

        const expectedKeys = ['success', 'height', 'domains'];
        const objKeys = Object.keys(data);
        expect(objKeys).toEqual(expectedKeys);
        expect(data.success).toBe(true);
        expect(status).toBe(200);
    });

    it('Tests Domains.RecentlyWon status and object structure', async () => {
        const { status, data } = await nameBase.Domains.RecentlyWon();

        const expectedKeys = ['success', 'height', 'domains'];
        const objKeys = Object.keys(data);
        expect(objKeys).toEqual(expectedKeys);
        expect(data.success).toBe(true);
        expect(status).toBe(200);
    });

    it('Tests Domains.EndingSoon status and object structure', async () => {
        const { status, data } = await nameBase.Domains.EndingSoon();

        const expectedKeys = ['success', 'height', 'domains'];
        const objKeys = Object.keys(data);
        expect(objKeys).toEqual(expectedKeys);
        expect(data.success).toBe(true);
        expect(status).toBe(200);
    });

    it('Tests Domains.Sold status and object structure', async () => {
        const { status, data } = await nameBase.Domains.Sold();

        const expectedKeys = ['success', 'height', 'domains', 'totalCount'];
        const objKeys = Object.keys(data);
        expect(objKeys).toEqual(expectedKeys);
        expect(data.success).toBe(true);
        expect(status).toBe(200);
    });

    it('Tests Domains.Marketplace status and object structure', async () => {
        const { status, data } = await nameBase.Domains.Marketplace();

        const expectedKeys = ['success', 'height', 'domains', 'totalCount'];
        const objKeys = Object.keys(data);
        expect(objKeys).toEqual(expectedKeys);
        expect(data.success).toBe(true);
        expect(status).toBe(200);
    });

    it('Tests Domain status and object structure', async () => {
        const { status, data } = await nameBase.Domain('skittles');

        const expectedKeys = [
            'bids',
            'watching',
            'numberViews',
            'name',
            'releaseBlock',
            'openBlock',
            'revealBlock',
            'closeBlock',
            'closeAmount',
            'reserved',
            'highestStakeAmount',
            'numWatching',
            'success',
            'height',
        ];
        const objKeys = Object.keys(data);
        expect(objKeys).toEqual(expectedKeys);
        expect(data.success).toBe(true);
        expect(status).toBe(200);
    });

    it('Tests WatchDomain status and object structure', async () => {
        const { status, data } = await nameBase.WatchDomain('skittles');

        const expectedKeys = ['success'];
        const objKeys = Object.keys(data);
        expect(objKeys).toEqual(expectedKeys);
        expect(data.success).toBe(true);
        expect(status).toBe(200);
    });
});

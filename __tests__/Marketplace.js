const nameBase = require('../test-suite.config.js');

describe('Marketplace API GET Endpoints', () => {
    it('Tests Marketplace.Domain status and object structure', async () => {
        const { status, data } = await nameBase.Marketplace.Domain('skittles');

        const expectedKeys = [
            'success',
            'isOwner',
            'isAcceptingOffers',
            'listing',
        ];
        const objKeys = Object.keys(data);
        expect(objKeys).toEqual(expectedKeys);
        expect(data.success).toBe(true);
        expect(status).toBe(200);
    });

    it('Tests Marketplace.History status and object structure', async () => {
        const { status, data } = await nameBase.Marketplace.History('skittles');

        const expectedKeys = ['success', 'history'];
        const objKeys = Object.keys(data);
        expect(objKeys).toEqual(expectedKeys);
        expect(data.success).toBe(true);
        expect(status).toBe(200);
    });
});

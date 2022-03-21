const nameBase = require('../test-suite.config.js');

describe('Trade API GET Endpoints', () => {
    it('Tests Trade.History status and object structure', async () => {
        const { status, data } = await nameBase.Trade.History();
        expect(typeof data).toBe('object');
        expect(status).toBe(200);
    });

    it('Tests Trade.Depth status and object structure', async () => {
        const { status, data } = await nameBase.Trade.Depth();

        const expectedKeys = ['lastEventId', 'asks', 'bids'];
        const objKeys = Object.keys(data);
        expect(objKeys).toEqual(expectedKeys);
        expect(status).toBe(200);
    });
});

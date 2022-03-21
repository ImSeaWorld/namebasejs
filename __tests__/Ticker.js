const nameBase = require('../test-suite.config.js');

describe('Ticker API GET Endpoints', () => {
    it('Tests Ticker.Day status and object structure', async () => {
        const { status, data } = await nameBase.Ticker.Day();

        const expectedKeys = [
            'volumeWeightedAveragePrice',
            'priceChange',
            'priceChangePercent',
            'openPrice',
            'highPrice',
            'lowPrice',
            'closePrice',
            'volume',
            'quoteVolume',
            'openTime',
            'closeTime',
            'firstTradeId',
            'lastTradeId',
            'numberOfTrades',
        ];
        const objKeys = Object.keys(data);
        expect(objKeys).toEqual(expectedKeys);
        expect(status).toBe(200);
    });

    it('Tests Ticker.Book status and object structure', async () => {
        const { status, data } = await nameBase.Ticker.Book();

        const expectedKeys = [
            'bidPrice',
            'bidQuantity',
            'askPrice',
            'askQuantity',
        ];
        const objKeys = Object.keys(data);
        expect(objKeys).toEqual(expectedKeys);
        expect(status).toBe(200);
    });

    it('Tests Ticker.Price status and object structure', async () => {
        const { status, data } = await nameBase.Ticker.Price();

        const expectedKeys = ['price'];
        const objKeys = Object.keys(data);
        expect(objKeys).toEqual(expectedKeys);
        expect(status).toBe(200);
    });

    it('Tests Ticker.Supply status and object structure', async () => {
        const { status, data } = await nameBase.Ticker.Supply();

        const expectedKeys = ['height', 'circulatingSupply'];
        const objKeys = Object.keys(data);
        expect(objKeys).toEqual(expectedKeys);
        expect(status).toBe(200);
    });

    it('Tests Ticker.Klines status and object structure', async () => {
        const { status, data } = await nameBase.Ticker.Supply();

        const objKeys = Object.keys(data);
        expect(objKeys.length).toBe(true);
        expect(status).toBe(200);
    });
});

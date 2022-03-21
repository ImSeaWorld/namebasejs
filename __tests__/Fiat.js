const nameBase = require('../test-suite.config.js');

describe('Fiat API GET Endpoints', () => {
    it('Tests Fiat.Transfers status and object structure', async () => {
        const { status, data } = await nameBase.Fiat.Transfers();

        const expectedKeys = ['success', 'deposits', 'withdrawals'];
        const objKeys = Object.keys(data);
        expect(objKeys).toEqual(expectedKeys);
        expect(data.success).toBe(true);
        expect(status).toBe(200);
    });

    it('Tests Fiat.Transfers status and object structure', async () => {
        const { status, data } = await nameBase.Fiat.Transfers();

        const expectedKeys = [
            'success',
            'namebaseExternalAccounts',
            'depositLimit',
            'withdrawalLimit',
        ];
        const objKeys = Object.keys(data);
        expect(objKeys).toEqual(expectedKeys);
        expect(data.success).toBe(true);
        expect(status).toBe(200);
    });
});

const nameBase = require('../test-suite.config.js');

describe('Account API GET Endpoints', () => {
    it('Tests Account.Self status and object structure', async () => {
        const { status, data } = await nameBase.Account.Self();

        const expectedKeys = ['makerFee', 'takerFee', 'canTrade', 'balances'];
        const objKeys = Object.keys(data);
        expect(objKeys).toEqual(expectedKeys);
        expect(status).toBe(200);
    });

    it('Tests Account.Limits status and object structure', async () => {
        const { status, data } = await nameBase.Account.Limits();

        const expectedKeys = ['startTime', 'endTime', 'withdrawalLimits'];
        const objKeys = Object.keys(data);
        expect(objKeys).toEqual(expectedKeys);
        expect(status).toBe(200);
    });

    it('Tests Account.Log status and object structure', async () => {
        const { status, data } = await nameBase.Account.Log();

        const expectedKeys = ['success', 'currency', 'entries'];
        const objKeys = Object.keys(data);
        expect(objKeys).toEqual(expectedKeys);
        expect(data.success).toBe(true);
        expect(status).toBe(200);
    });

    it('Tests Account.Deposit.Address status and object structure', async () => {
        const { status, data } = await nameBase.Account.Log();

        const expectedKeys = ['address', 'asset', 'success'];
        const objKeys = Object.keys(data);
        expect(objKeys).toEqual(expectedKeys);
        expect(status).toBe(200);
    });

    // it('Tests Account.Deposit.History status and object structure', async () => {
    //     const { status, data } = await nameBase.Account.History();

    //     const expectedKeys = ['address', 'asset', 'success'];
    //     const objKeys = Object.keys(data);
    //     expect(objKeys).toEqual(expectedKeys);
    //     // expect(data.success).toBe(true);
    //     expect(status).toBe(200);
    // });

    it('Tests Account.Deposit.Address status and object structure', async () => {
        const { status, data } = await nameBase.Account.Log();

        const expectedKeys = ['address', 'asset', 'success'];
        const objKeys = Object.keys(data);
        expect(objKeys).toEqual(expectedKeys);
        expect(status).toBe(200);
    });
});

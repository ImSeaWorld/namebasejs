const nameBase = require('../test-suite.config.js');

describe('User API Endpoints', () => {
    it('Tests User.Self status and object structure', async () => {
        const { status, data } = await nameBase.User.Self();

        const expectedKeys = [
            'serverTime',
            'email',
            'segmentUuid',
            'intercomHmac',
            'custodian',
            'hns_balance',
            'usd_balance',
            'verificationStatus',
            'canLinkBank',
            'canDepositHns',
            'canDepositBtc',
            'canDepositUsd',
            'canWithdrawHns',
            'canWithdrawBtc',
            'canWithdrawUsd',
            'canUseProExchange',
            'canUseConsumerHnsBtc',
            'canUseConsumerBtcHns',
            'canUseConsumerHnsUsd',
            'canUseConsumerUsdHns',
            'fullName',
            'isNewYork',
            'referralCode',
        ];
        const objKeys = Object.keys(data);
        expect(objKeys).toEqual(expectedKeys);
        expect(status).toBe(200);
    });

    it('Tests User.Wallet status and object structure', async () => {
        const { status, data } = await nameBase.User.Wallet();

        const expectedKeys = [
            'bidLockedHns',
            'revealLockedHns',
            'totalCountOngoingBids',
            'totalCountOwnedDomains',
            'totalCountRevealingBids',
        ];
        const objKeys = Object.keys(data);
        expect(objKeys).toEqual(expectedKeys);
        expect(status).toBe(200);
    });

    it('Tests User.DomainSummary status and object structure', async () => {
        const { status, data } = await nameBase.User.DomainSummary();

        const expectedKeys = [
            'totalCountOwnedDomains',
            'totalCountWatchlistDomains',
        ];
        const objKeys = Object.keys(data);
        expect(objKeys).toEqual(expectedKeys);
        expect(status).toBe(200);
    });

    it('Tests User.Messages status and object structure', async () => {
        const { status, data } = await nameBase.User.Messages();

        const expectedKeys = ['success', 'messages'];
        const objKeys = Object.keys(data);
        expect(objKeys).toEqual(expectedKeys);
        expect(data.success).toBe(true);
        expect(status).toBe(200);
    });

    it('Tests User.ReferralStats status and object structure', async () => {
        const { status, data } = await nameBase.User.ReferralStats();

        const expectedKeys = [
            'totalUsersReferred',
            'hnsReceivedPending',
            'hnsReceivedConfirmed',
            'leaderboard',
            'rank',
        ];
        const objKeys = Object.keys(data);
        expect(objKeys).toEqual(expectedKeys);
        expect(status).toBe(200);
    });

    it('Tests User.PendingHistory status and object structure', async () => {
        const { status, data } = await nameBase.User.PendingHistory();

        const expectedKeys = ['success', 'buys', 'claims', 'seeds'];
        const objKeys = Object.keys(data);
        expect(objKeys).toEqual(expectedKeys);
        expect(data.success).toBe(true);
        expect(status).toBe(200);
    });

    it('Tests User.Domains status and object structure', async () => {
        const { status, data } = await nameBase.User.Domains();

        const expectedKeys = [
            'success',
            'currentHeight',
            'domains',
            'totalCount',
        ];
        const objKeys = Object.keys(data);
        expect(objKeys).toEqual(expectedKeys);
        expect(data.success).toBe(true);
        expect(status).toBe(200);
    });

    it('Tests User.TransferredDomains status and object structure', async () => {
        const { status, data } = await nameBase.User.TransferredDomains();

        const expectedKeys = ['success', 'currentHeight', 'transferred'];
        const objKeys = Object.keys(data);
        expect(objKeys).toEqual(expectedKeys);
        expect(data.success).toBe(true);
        expect(status).toBe(200);
    });

    it('Tests User.ListedDomains status and object structure', async () => {
        const { status, data } = await nameBase.User.ListedDomains();

        const expectedKeys = ['success', 'currentHeight', 'domains'];
        const objKeys = Object.keys(data);
        expect(objKeys).toEqual(expectedKeys);
        expect(data.success).toBe(true);
        expect(status).toBe(200);
    });

    it('Tests User.MFA status and object structure', async () => {
        const { status, data } = await nameBase.User.MFA();

        const expectedKeys = ['success', 'hasSetUpMfa'];
        const objKeys = Object.keys(data);
        expect(objKeys).toEqual(expectedKeys);
        expect(data.success).toBe(true);
        expect(status).toBe(200);
    });

    it('Tests User.Offers.Received status and object structure', async () => {
        const { status, data } = await nameBase.User.Offers.Received();

        const expectedKeys = ['success', 'totalCount', 'domains'];
        const objKeys = Object.keys(data);
        expect(objKeys).toEqual(expectedKeys);
        expect(data.success).toBe(true);
        expect(status).toBe(200);
    });

    it('Tests User.Offers.Sent status and object structure', async () => {
        const { status, data } = await nameBase.User.Offers.Sent();

        const expectedKeys = ['success', 'totalCount', 'domains'];
        const objKeys = Object.keys(data);
        expect(objKeys).toEqual(expectedKeys);
        expect(data.success).toBe(true);
        expect(status).toBe(200);
    });

    it('Tests User.Offers.Notification status and object structure', async () => {
        const { status, data } = await nameBase.User.Offers.Notification();

        const expectedKeys = ['success', 'isUnseen'];
        const objKeys = Object.keys(data);
        expect(objKeys).toEqual(expectedKeys);
        expect(data.success).toBe(true);
        expect(status).toBe(200);
    });

    it('Tests User.Offers.Inbox.Received status and object structure', async () => {
        const { status, data } = await nameBase.User.Offers.Inbox.Received();

        const expectedKeys = [
            'success',
            'inbox',
            'pendingSales',
            'totalCountInbox',
            'totalCountPendingSales',
        ];
        const objKeys = Object.keys(data);
        expect(objKeys).toEqual(expectedKeys);
        expect(data.success).toBe(true);
        expect(status).toBe(200);
    });

    it('Tests User.Bids.Open status and object structure', async () => {
        const { status, data } = await nameBase.User.Bids.Open();

        const expectedKeys = ['success', 'height', 'openBids'];
        const objKeys = Object.keys(data);
        expect(objKeys).toEqual(expectedKeys);
        expect(data.success).toBe(true);
        expect(status).toBe(200);
    });

    it('Tests User.Bids.Lost status and object structure', async () => {
        const { status, data } = await nameBase.User.Bids.Lost();

        const expectedKeys = ['success', 'height', 'lostBids'];
        const objKeys = Object.keys(data);
        expect(objKeys).toEqual(expectedKeys);
        expect(data.success).toBe(true);
        expect(status).toBe(200);
    });

    it('Tests User.Bids.Revealing status and object structure', async () => {
        const { status, data } = await nameBase.User.Bids.Revealing();

        const expectedKeys = ['success', 'height', 'revealingBids'];
        const objKeys = Object.keys(data);
        expect(objKeys).toEqual(expectedKeys);
        expect(data.success).toBe(true);
        expect(status).toBe(200);
    });
});

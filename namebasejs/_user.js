export default class User {
    /**
     * User constructor
     * @param {NameBase} namebase Namebase instance
     */
    constructor(namebase) {
        this.nb = namebase;
    }

    /**
     * Account information
     * @returns {AxiosPromise} AxiosPromise
     */
    self() {
        return this.nb.request('api/user', 'GET');
    }

    /**
     * Wallet contents
     * @returns {AxiosPromise} AxiosPromise
     */
    wallet() {
        return this.nb.request('api/user/wallet', 'GET');
    }

    /**
     * Dashboard widget domain summary
     * @returns {AxiosPromise} AxiosPromise
     */
    domainSummary() {
        return this.nb.request('api/user/domains/summary', 'GET');
    }

    /**
     * *NAME* has offered you 1.00hns for *DOMAIN*.
     * @returns {AxiosPromise} AxiosPromise
     */
    messages() {
        return this.nb.request('api/user/messages', 'GET');
    }

    /**
     * Dashboard widget domain summary
     * @param {int} limit
     * @returns {AxiosPromise} AxiosPromise
     */
    referralStats(limit = 10) {
        return this.nb.request(`api/user/referral-stats/${limit}`, 'GET');
    }

    /**
     * Dashboard widget pending history
     * @returns {AxiosPromise} AxiosPromise
     */
    pendingHistory() {
        return this.nb.request('api/user/pending-history', 'GET');
    }

    /**
     * List of domains that are currently not for sale
     * @param {int} offset Page offset
     * @param {string} sortKey
     * @param {string} sortDirection
     * @param {int} limit
     * @returns {AxiosPromise} AxiosPromise
     */
    domains(
        offset = 0,
        sortKey = 'acquiredAt',
        sortDirection = 'desc',
        limit = 100,
    ) {
        return this.nb.request(
            'api/user/domains/not-listed/{{offset}}',
            'GET',
            {
                offset,
                sortKey,
                sortDirection,
                limit,
            },
        );
    }

    /**
     * Transferred domains history
     * @param {int} offset Page offset
     * @param {string} sortKey
     * @param {string} sortDirection
     * @param {int} limit
     * @returns {AxiosPromise} AxiosPromise
     */
    transferredDomains(
        offset = 0,
        sortKey = 'acquiredAt',
        sortDirection = 'desc',
        limit = 100,
    ) {
        return this.nb.request(
            'api/user/domains/transferred/{{offset}}',
            'GET',
            {
                offset,
                sortKey,
                sortDirection,
                limit,
            },
        );
    }

    /**
     * Domains listed for sale
     * @param {int} offset Page offset
     * @param {int} limit
     * @returns {AxiosPromise} AxiosPromise
     */
    listedDomains(offset = 0, limit = 100) {
        return this.nb.request('api/user/domains/listed/{{offset}}', 'GET', {
            offset,
            limit,
        });
    }

    /**
     * Check if you have multifactor authentication enabled
     * @returns {AxiosPromise} AxiosPromise
     */
    mfa() {
        return this.nb.request('api/user/mfa', 'GET');
    }

    /**
     * List of offers you've made
     * *NAME* has offered you 1.00hns for *DOMAIN*.
     * @returns {AxiosPromise} AxiosPromise
     */
    offers() {
        return this.nb.request('api/offers', 'GET');
    }

    /**
     * Offers sent
     * @param {int} offset Page offset
     * @param {string} sortKey
     * @param {string} sortDirection
     * @returns {AxiosPromise} AxiosPromise
     */
    offersSent(offset = 0, sortKey = 'created_at', sortDirection = 'desc') {
        return this.nb.request('api/{{version}}/offers/sent', 'GET', {
            offset,
            sortKey,
            sortDirection,
        });
    }

    /**
     * Offers received
     * @param {int} offset page offset
     * @param {string} sortKey
     * @param {string} sortDirection
     * @returns {AxiosPromise} AxiosPromise
     */
    offersRecieved(offset = 0, sortKey = 'created_at', sortDirection = 'desc') {
        return this.nb.request('api/{{version}}/offers/received', 'GET', {
            offset,
            sortKey,
            sortDirection,
        });
    }

    /**
     * Dashboard widget offer summary
     * @returns {AxiosPromise} AxiosPromise
     */
    offerNotifications() {
        return this.nb.request('api/{{version}}/offers/inbox/received', 'GET');
    }

    /**
     * Bids on active auctions
     * @param {int} offset Page offset
     * @returns {AxiosPromise} AxiosPromise
     */
    openBids(offset = 0) {
        return this.nb.request('api/user/open-bids/{{offset}}', 'GET', {
            offset,
        });
    }

    /**
     * Domains you've lost in auction
     * @param {int} offset Page offset
     * @returns {AxiosPromise} AxiosPromise
     */
    lostBids(offset = 0) {
        return this.nb.request('api/user/lost-bids/{{offset}}', 'GET', {
            offset,
        });
    }

    /**
     * Domains in auction that are currently
     * in the reveal period of the auction
     * @param {int} offset Page offset
     * @returns {AxiosPromise} AxiosPromise
     */
    revealingBids(offset = 0) {
        return this.nb.request('api/user/revealing-bids/{{offset}}', 'GET', {
            offset,
        });
    }
}

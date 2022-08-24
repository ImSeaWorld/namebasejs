class Domains {
    /**
     * Domains constructor
     * @param {NameBase} namebase Namebase instance
     */
    constructor(namebase) {
        this.nb = namebase;
    }

    /**
     * Popular domains, as dictated by Namebase
     * @param {int} offset Page offset
     * @returns {AxiosPromise} AxiosPromise
     */
    popular(offset = 0) {
        return this.nb.request('api/domains/popular/{{offset}}', 'GET', {
            offset,
        });
    }

    /**
     * Recently won domains
     * @param {int} offset Page offset
     * @returns {AxiosPromise} AxiosPromise
     */
    recentlyWon(offset = 0) {
        return this.nb.request('api/domains/recently-won/{{offset}}', 'GET', {
            offset,
        });
    }

    /**
     * HNS TLD auctions ending soon
     * @param {int} offset Page offset
     * @returns {AxiosPromise} AxiosPromise
     */
    endingSoon(offset = 0) {
        return this.nb.request('api/domains/ending-soon/{{offset}}', 'GET', {
            offset,
        });
    }

    /**
     * List of sold domains
     * @param {int} offset Page offset
     * @param {string} sortKey
     * @param {string} sortDirection
     * @returns {AxiosPromise} AxiosPromise
     */
    sold(offset = 0, sortKey = 'date', sortDirection = 'desc') {
        return this.nb.request('api/domains/sold/{{offset}}', 'GET', {
            offset,
            sortKey,
            sortDirection,
        });
    }

    /**
     * Domains actively for sale on the marketplace
     * @param {int} offset Page offset
     * @param {string} sortKey
     * @param {string} sortDirection
     * @param {bool} onlyPuny
     * @param {bool} onlyIdnaPuny
     * @param {bool} onlyAlternativePuny
     * @param  {...any} moreArgs They'll probably add more options later
     * @returns {AxiosPromise} AxiosPromise
     */
    marketplace(
        offset = 0,
        sortKey = 'bid',
        sortDirection = 'desc',
        onlyPuny = false,
        onlyIdnaPuny = false,
        onlyAlternativePuny = false,
        ...moreArgs
    ) {
        return this.nb.request('api/domains/marketplace/{{offset}}', 'GET', {
            offset,
            sortKey,
            sortDirection,
            onlyPuny,
            onlyIdnaPuny,
            onlyAlternativePuny,
            ...moreArgs,
        });
    }
}

export default Domains;

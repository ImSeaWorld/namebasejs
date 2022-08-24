class Auction {
    /**
     * Auction constructor
     * @param {NameBase} namebase Namebase instance
     */
    constructor(namebase) {
        this.nb = namebase;
    }

    /**
     * Bid on an open auction. Or start one.. I won't judge.
     * @param {string} domain HNS TLD
     * @param {float} bidAmount Bid amount in HNS
     * @param {float} blindAmount Blind amount in HNS
     * @returns {AxiosPromise} AxiosPromise
     */
    bid(domain, bidAmount, blindAmount) {
        return this.nb.request('auction/{{domain}}/bid', 'POST', {
            domain,
            bidAmount,
            blindAmount,
        });
    }
}

export default Auction;

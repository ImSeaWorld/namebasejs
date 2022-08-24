class Marketplace {
    /**
     * Fiat constructor
     * @param {NameBase} namebase Namebase instance
     */
    constructor(namebase) {
        this.nb = namebase;
    }

    /**
     * List domain for sale on the marketplace
     * @param {string} domain HNS TLD
     * @param {float} amount Amount in HNS
     * @param {*} description
     * @param {*} asset Default is HNS
     * @returns {AxiosPromise} AxiosPromise
     */
    list(domain, amount, description, asset = 'HNS') {
        return this.nb.request(
            'api/{{version}}/marketplace/{{domain}}',
            'POST',
            {
                domain,
                amount,
                description,
                asset,
            },
        );
    }

    /**
     * Get marketplace listing
     * @param {string} domain HNS TLD
     * @returns {AxiosPromise} AxiosPromise
     */
    domain(domain) {
        return this.nb.request(
            'api/{{version}}/marketplace/{{domain}}',
            'GET',
            {
                domain,
            },
        );
    }

    /**
     * Marketplace history of a domain
     * @param {string} domain HNS TLD
     * @returns {AxiosPromise} AxiosPromise
     */
    history(domain) {
        return this.nb.request(
            'api/{{version}}/marketplace/{{domain}}/history',
            'GET',
            {
                domain,
            },
        );
    }

    /**
     * Offer HNS for a domain listed on the marketplace
     * @param {string} domain HNS TLD
     * @param {float} buyOfferAmount Amount in HNS
     * @returns {AxiosPromise} AxiosPromise
     */
    offer(domain, buyOfferAmount) {
        return this.nb.request(
            'api/{{version}}/marketplace/{{domain}}/bid',
            'POST',
            {
                domain,
                buyOfferAmount,
            },
        );
    }

    /**
     * Cancel your domain's listing on the marketplace
     * @param {string} domain HNS TLD
     * @returns {AxiosPromise} AxiosPromise
     */
    cancelListing(domain) {
        return this.nb.request(
            'api/{{version}}/marketplace/{{domain}}/cancel',
            'POST',
            {
                domain,
            },
        );
    }

    /**
     * Buy domain on the marketplace
     * @param {string} domain HNS TLD
     * @returns {AxiosPromise} AxiosPromise
     */
    buyNow(domain) {
        return this.nb.request(
            'api/{{version}}/marketplace/{{domain}}/buynow',
            'POST',
            {
                domain,
            },
        );
    }
}

export default Marketplace;

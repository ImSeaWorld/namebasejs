class Domain {
    /**
     * Domain constructor
     * @param {NameBase} namebase Namebase instance
     */
    constructor(namebase) {
        this.nb = namebase;
    }

    /**
     * Get info about a domain
     * @param {string} domain HNS TLD
     * @returns {AxiosPromise} AxiosPromise
     */
    get(domain) {
        return this.nb.request('api/domains/get/{{domain}}', 'GET', {
            domain,
        });
    }

    /**
     * Watch a domain, this endpoint is used
     * to toggle the watch status of a domain
     * @param {string} domain HNS TLD
     * @returns {AxiosPromise} AxiosPromise
     */
    watch(domain) {
        return this.nb.request('api/domains/watch/{{domain}}', 'POST', {
            domain,
        });
    }

    /**
     * Gift a sub level domain to another namebase user
     * @param {string} domain HNS TLD
     * @param {string} recipientEmail
     * @param {string} senderName Bob or sumtin'
     * @param {string} note
     * @returns {AxiosPromise} AxiosPromise
     */
    giftSLD(domain, recipientEmail, senderName, note) {
        if (!domain.includes('.')) {
            throw new Error(
                'Domain must include an owned TLD, and SLD, e.g. SLD.TLD',
            );
        }

        return this.nb.request('api/gift/{{domain}}', 'POST', {
            domain,
            recipientEmail,
            senderName,
            note,
        });
    }

    /**
     * Gift a top level domain to another namebase user
     * @param {string} domain HNS TLD
     * @param {string} recipientEmail
     * @param {string} senderName Bob or sumtin'
     * @param {string} note
     * @returns {AxiosPromise} AxiosPromise
     */
    giftTLD(domain, recipientEmail, senderName, note) {
        if (domain.includes('.')) {
            throw new Error("TLD musn't include an SLD, e.g. TLD");
        }

        return this.nb.request('api/gift/{{domain}}', 'POST', {
            domain,
            recipientEmail,
            senderName,
            note,
        });
    }
}

export default Domain;

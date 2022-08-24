class DNS {
    /**
     * DNS constructor
     * @param {NameBase} namebase Namebase instance
     */
    constructor(namebase) {
        this.nb = namebase;
    }

    /**
     * Get DNS records for specified domain
     * @param {string} domain HNS TLD
     * @returns {AxiosPromise} AxiosPromise
     */
    get(domain) {
        return this.nb.request(
            'api/{{version}}/dns/domains/{{domain}}',
            'GET',
            {
                domain,
            },
        );
    }

    /**
     * Set DNS records for specified domain
     * @param {string} domain HNS TLD
     * @param {string} records DNS records
     * @returns {AxiosPromise} AxiosPromise
     */
    set(domain, records) {
        return this.nb.request(
            'api/{{version}}/dns/domains/{{domain}}',
            'PUT',
            {
                domain,
                records,
            },
        );
    }

    /**
     * Spookier way to set DNS records for specified domain
     * @param {string} domain HNS TLD
     * @param {string} rawNameState Raw name state
     * @returns {AxiosPromise} AxiosPromise
     */
    advanced(domain, rawNameState) {
        return this.nb.request(
            'api/{{version}}/dns/domains/{{domain}}/advanced',
            'PUT',
            {
                domain,
                rawNameState,
            },
        );
    }

    /**
     * Nameservers for a specified domain
     * @param {string} domain HNS TLD
     * @returns {AxiosPromise} AxiosPromise
     */
    nameServers(domain) {
        return this.nb.request(
            'api/{{version}}/dns/domains/{{domain}}/nameserver',
            'GET',
            {
                domain,
            },
        );
    }

    /**
     * Set nameservers for a specified domain
     * @param {string} domain HNS TLD
     * @param {string} records DNS records
     * @param {string} deleteRecords DNS records to delete
     * @returns {AxiosPromise} AxiosPromise
     */
    setNameservers(domain, records, deleteRecords) {
        return this.nb.request(
            'api/{{version}}/dns/domains/{{domain}}/nameserver',
            'PUT',
            {
                domain,
                records,
                deleteRecords,
            },
        );
    }
}

export default DNS;

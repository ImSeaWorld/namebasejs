class Fiat {
    /**
     * Fiat constructor
     * @param {NameBase} namebase Namebase instance
     */
    constructor(namebase) {
        this.nb = namebase;
    }

    /**
     * Bank transfers
     * @returns {AxiosPromise} AxiosPromise
     */
    transfers() {
        return this.nb.request('api/fiat/ach/transfers', 'GET');
    }

    /**
     * Banks linked to account
     * @returns {AxiosPromise} AxiosPromise
     */
    accounts() {
        return this.nb.request('api/fiat/ach/accounts', 'GET');
    }
}

export default Fiat;

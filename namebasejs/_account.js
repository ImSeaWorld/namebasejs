export default class Account {
    /**
     * Account constructor
     * @param {NameBase} namebase Namebase instance
     */
    constructor(namebase) {
        this.nb = namebase;
    }

    /**
     * Returns the current account information.
     * @returns {AxiosPromise} AxiosPromise
     */
    self() {
        return this.nb.timedRequest('api/{{version}}/account', 'GET');
    }

    /**
     * Account limitations set by NameBase
     * @returns {AxiosPromise} AxiosPromise
     */
    limits() {
        return this.nb.timedRequest('api/{{version}}/account/limits', 'GET');
    }

    /**
     * No clue what this does
     * @param {string} accountName Always 'unlocked'
     * @param {int} limit
     * @returns {AxiosPromise} AxiosPromise
     */
    log(accountName = 'unlocked', limit = 10) {
        return this.nb.timedRequest('api/{{version}}/account/log', 'GET', {
            accountName,
            limit,
        });
    }

    /**
     * Returns the signed in user's active HNS wallet deposit address
     * @param {string} asset enums.assets
     * @returns {AxiosPromise} AxiosPromise
     */
    depositAddress(asset = 'HNS') {
        return this.nb.timedRequest('api/{{version}}/deposit/address', 'GET', {
            asset,
        });
    }

    /**
     * Accounts deposit history
     * @param {string} asset enums.assets
     * @param {int} startTime unix timestamp
     * @param {int} endTime unix timestamp
     * @returns {AxiosPromise} AxiosPromise
     */
    depositHistory(
        asset = 'HNS',
        startTime = new Date().getTime() - 2592e6,
        endTime = new Date().getTime(),
    ) {
        return this.nb.timedRequest('api/{{version}}/deposit/history', 'GET', {
            asset,
            startTime,
            endTime,
        });
    }

    /**
     * Withdraw HNS from signed in users wallet
     * @param {string} asset enums.assets
     * @param {string} address HNS wallet address
     * @param {int} amount HNS amount
     * @returns {AxiosPromise} AxiosPromise
     */
    withdraw(asset = 'HNS', address, amount) {
        return this.nb.timedRequest('api/{{version}}/withdraw', 'POST', {
            asset,
            address,
            amount,
        });
    }

    /**
     * Widthdrawal history of account
     * @param {string} asset enums.assets
     * @param {int} startTime unix timestamp
     * @param {int} endTime unix timestamp
     * @returns {AxiosPromise} AxiosPromise
     */
    withdrawHistory(
        asset = 'HNS',
        startTime = new Date().getTime() - 2592e6,
        endTime = new Date().getTime(),
    ) {
        return this.nb.timedRequest('api/{{version}}/withdraw/history', 'GET', {
            asset,
            startTime,
            endTime,
        });
    }
}

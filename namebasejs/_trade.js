export default class Trade {
    /**
     * Trade constructor
     * @param {NameBase} namebase Namebase instance
     */
    constructor(namebase) {
        this.nb = namebase;
    }

    /**
     * Trade history
     * @param {string} symbol enums.symbols
     * @param {number} limit
     * @returns {AxiosPromise} AxiosPromise
     */
    history(symbol = 'HNSBTC', limit = 30) {
        return this.nb.timedRequest('api/{{version}}/trade', 'GET', {
            symbol,
            limit,
        });
    }

    /**
     * Return exchange account info
     * @returns {AxiosPromise} AxiosPromise
     */
    account() {
        return this.nb.timedRequest('api/{{version}}/trade/account', 'GET');
    }

    /**
     * Trade depth
     * @param {string} symbol enums.symbols
     * @param {number} limit
     * @returns {AxiosPromise} AxiosPromise
     */
    depth(symbol = 'HNSBTC', limit = 100) {
        return this.nb.request('api/{{version}}/depth', 'GET', {
            symbol,
            limit,
        });
    }

    /**
     * Trade orders
     * @param {string} symbol
     * @param {*} orderId
     * @param {number} limit
     * @returns {AxiosPromise} AxiosPromise
     */
    orders(symbol = 'HNSBTC', orderId, limit = 100) {
        return this.nb.timedRequest('api/{{version}}/order/all', 'GET', {
            symbol,
            orderId,
            limit,
        });
    }

    /**
     * Trade order by id
     * @param {string} symbol
     * @param {*} orderId
     * @returns {AxiosPromise} AxiosPromise
     */
    getOrder(symbol = 'HNSBTC', orderId) {
        return this.nb.timedRequest('api/{{version}}/trade/order', 'GET', {
            symbol,
            orderId,
            limit,
        });
    }

    /**
     * Create an order
     * @param {string} symbol enums.symbols
     * @param {string} side enums.order_sides
     * @param {string} type enums.order_types
     * @param {float} quantity Quantity of assets to buy or sell
     * @param {float} price Price of asset in account's currency
     * @returns {AxiosPromise} AxiosPromise
     */
    newOrder(symbol = 'HNSBTC', side, type, quantity, price) {
        return this.nb.timedRequest('api/{{version}}/order', 'POST', {
            symbol,
            side,
            type,
            quantity,
            price,
        });
    }

    /**
     * Delete an order by id
     * @param {string} symbol enums.symbols
     * @param {*} orderId
     * @returns {AxiosPromise} AxiosPromise
     */
    deleteOrder(symbol = 'HNSBTC', orderId) {
        return this.nb.timedRequest('api/{{version}}/order', 'DELETE', {
            symbol,
            orderId,
        });
    }

    /**
     * Open orders
     * @param {string} symbol enums.symbols
     * @returns {AxiosPromise} AxiosPromise
     */
    openOrders(symbol = 'HNSBTC') {
        return this.nb.timedRequest('api/{{version}}/order/open', 'GET', {
            symbol,
        });
    }
}

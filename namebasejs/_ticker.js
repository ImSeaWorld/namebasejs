export default class Ticker {
    /**
     * Ticker constructor
     * @param {NameBase} namebase Namebase instance
     */
    constructor(namebase) {
        this.nb = namebase;
    }

    /**
     * Ticker for the last calander day
     * @param {string} symbol
     * @returns {AxiosPromise} AxiosPromise
     */
    day(symbol = 'HNSBTC') {
        return this.nb.request('api/{{version}}/ticker/day', 'GET', { symbol });
    }

    /**
     * Book ticker
     * @param {string} symbol
     * @returns {AxiosPromise} AxiosPromise
     */
    book(symbol = 'HNSBTC') {
        return this.nb.request('api/{{version}}/ticker/book', 'GET', {
            symbol,
        });
    }

    /**
     * Current trading price and volume on namebase's exchange
     * @param {string} symbol
     * @returns {AxiosPromise} AxiosPromise
     */
    price(symbol = 'HNSBTC') {
        return this.nb.request('api/{{version}}/ticker/price', 'GET', {
            symbol,
        });
    }

    /**
     * HNS supply of namebase's exchange
     * @param {string} asset
     * @returns {AxiosPromise} AxiosPromise
     */
    supply(asset = 'HNS') {
        return this.nb.request('api/{{version}}/ticker/supply', 'GET', {
            asset,
        });
    }

    /**
     * Klines between start and end time
     * @param {string} symbol
     * @param {string} interval
     * @param {number} startTime
     * @param {number} endTime
     * @param {number} limit
     * @returns {AxiosPromise} AxiosPromise
     */
    klines(
        symbol = 'HNSBTC',
        interval = '5m',
        startTime = new Date().getTime() - 2592e6,
        endTime = new Date().getTime(),
        limit = 100,
    ) {
        return this.nb.request('api/{{version}}/ticker/klines', 'GET', {
            symbol,
            interval,
            startTime,
            endTime,
            limit,
        });
    }
}

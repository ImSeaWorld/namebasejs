import axios from 'axios';

import Account from './_account.js';
import Auction from './_auction.js';
import Auth from './_auth.js';
import DNS from './_dns.js';
import Domain from './_domain.js';
import Domains from './_domains.js';
import Fiat from './_fiat.js';
import Marketplace from './_marketplace.js';
import Ticker from './_ticker.js';
import Trade from './_trade.js';
import User from './_user.js';

const VERSION = 'v0';
const ENDPOINT = 'www.namebase.io';

const Enums = {
    assets: { HNS: 'HNS', BTC: 'BTC' },
    symbols: { HNSBTC: 'HNSBTC' },
    order_types: { LMT: 'LMT', MKT: 'MKT' },
    order_sides: { BUY: 'BUY', SELL: 'SELL' },
    intervals: {
        ONE_MINUTE: '1m',
        FIVE_MINUTES: '5m',
        FIFTEEN_MINUTES: '15m',
        ONE_HOUR: '1h',
        FOUR_HOURS: '4h',
        TWELVE_HOURS: '12h',
        ONE_DAY: '1d',
        ONE_WEEK: '1w',
    },
};

export default class NameBaseJS {
    constructor({ aKey, sKey, session } = {}) {
        if (aKey && sKey) {
            this._auth_key =
                'Basic ' + Buffer.from(`${aKey}:${sKey}`).toString('base64');
        } else if (session) {
            this._auth_session = 'namebase-main=' + session;
        } else {
            console.warn(
                'Namebase functionality is limited without authentication!!',
            );
        }

        let _headers = {
            'Content-Type': 'application/json',
        };

        if (this._auth_key ?? false) {
            _headers.Authorization = this._auth_key;
        }

        if (this._auth_session ?? false) {
            _headers.Cookie = this._auth_session;
        }

        this._receive_window = 10000;

        this.axios = axios.create({
            baseURL: `https://${ENDPOINT}/`,
            timeout: 10000,
            headers: _headers,
        });

        this.account = new Account(this);
        this.auction = new Auction(this);
        this.auth = new Auth(this);
        this.dns = new DNS(this);
        this.domain = new Domain(this);
        this.domains = new Domains(this);
        this.fiat = new Fiat(this);
        this.marketplace = new Marketplace(this);
        this.ticker = new Ticker(this);
        this.trade = new Trade(this);
        this.user = new User(this);
    }

    get receive_window() {
        return this._receive_window;
    }

    /**
     * Set receive window for timed requests
     * @param {number} ms Milliseconds
     */
    set receive_window(receive_window) {
        this._receive_window = receive_window;
    }

    get enums() {
        return Enums;
    }

    get session() {
        return this._auth_session;
    }

    /**
     * Set session cookie
     * @param {string} session session cookie after 'namebase-main='
     */
    set session(session) {
        this._auth_session = 'namebase-main=' + session;
        this.axios.defaults.headers.Cookie = this._auth_session;
    }

    get auth_key() {
        return this._auth_key;
    }

    /**
     * Set authentication key
     * @param {string} access_and_secret_key access and secret keys delimited by a colon
     */
    set auth_key(access_and_secret_key) {
        this._auth_key =
            'Basic ' + Buffer.from(access_and_secret_key).toString('base64');
        this.axios.defaults.headers.Authorization = this._auth_key;
    }

    /**
     * Send request to Namebase API
     * @param {string} _interface URL Structure
     * @param {string} method HTTP Method
     * @param {object} payload Request Payload
     * @param  {...any} args Extra arguments
     * @returns {AxiosPromise} Axios Promise
     */
    request(_interface, method, payload = {}, ...args) {
        let _url = _interface;

        method = method.toUpperCase();

        if (method == 'GET') {
            _url += '?';

            Object.keys(payload).forEach((key) => {
                if (key === 'domain' || key === 'offset') return;
                _url += `${key}=${payload[key]}&`;
            });
        }

        const repl = {
            '{{domain}}': payload.domain,
            '{{offset}}': payload.offset,
            '{{version}}': VERSION,
        };

        Object.keys(repl).forEach((key) => {
            _url = _url.replace(key, repl[key]);
        });

        delete payload.offset;
        delete payload.domain;

        return this.axios({
            method: method,
            url: _url,
            data: method !== 'GET' ? payload : undefined,
            ...args,
        });
    }

    /**
     * Timed request to Namebase API
     * @param {string} _interface URL Structure
     * @param {string} method HTTP Method
     * @param {object} payload Request Payload
     * @param  {...any} args Extra arguments
     * @returns {AxiosPromise} Axios Promise
     */
    timedRequest(_interface, method, payload = {}, ...args) {
        return this.request(
            _interface,
            method,
            {
                ...payload,
                timestamp: new Date().getTime(),
                receiveWindow: this._receive_window,
            },
            ...args,
        );
    }
}

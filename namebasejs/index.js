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

class NameBase {
    constructor({ aKey, sKey, Session } = {}) {
        if (aKey && sKey) {
            this._auth_key =
                'Basic ' + Buffer.from(`${aKey}:${sKey}`).toString('base64');
        } else if (Session) {
            this._auth_session = 'namebase-main=' + Session;
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
        this.enums = Enums;
    }

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

    timedRequest(_interface, method, payload = {}, ...args) {
        return this.request(
            _interface,
            method,
            {
                ...payload,
                timestamp: new Date().getTime(),
                receiveWindow: 10000,
            },
            ...args,
        );
    }
}

export default NameBase;

const utils = require('./utils.js');

const VERSION = 'v0';
const ENDPOINT = 'www.namebase.io';

class NameBase {
    _auth = {
        key: null,
        session: null,
    };
    _enums = {
        Assets: { HNS: 'HNS', BTC: 'BTC' },
        Symbols: { HNSBTC: 'HNSBTC' },
        OrderTypes: { LMT: 'LMT', MKT: 'MKT' },
        OrderSides: { BUY: 'BUY', SELL: 'SELL' },
        Intervals: {
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

    constructor({ aKey, sKey, Session } = {}) {
        if (aKey && sKey) {
            this._auth.key =
                'Basic ' + Buffer.from(`${aKey}:${sKey}`).toString('base64');
        } else if (Session) {
            this._auth.session = 'namebase-main=' + Session;
        } else {
            console.warn(
                'Namebase functionality is limited without authentication!!',
            );
        }
    }

    Call(
        _interface,
        method,
        httpmethod,
        parameters,
        disableVersion = false,
        disableApi = false,
        disableOffset = false,
    ) {
        return new Promise((res, rej) => {
            var URLPath = `?`;

            method = method.split(':')[0];

            // Build URL structure
            for (var key in parameters) {
                if (key === 'domain' || (key === 'offset' && !disableOffset)) {
                    continue;
                }

                URLPath += `${key}=${parameters[key]}&`;
            }

            var API = disableApi ? '' : '/api';
            var Version = disableVersion ? '/' : `/${VERSION}/`;
            var Offset =
                parameters.offset != undefined && !disableOffset
                    ? `${method}/${parameters.offset}`
                    : method;

            if (method === '/') {
                Offset = '';
            }

            var GetParams = httpmethod === 'GET' ? URLPath : '';
            if (URLPath === '?') {
                GetParams = '';
            }
            // Final URL structure
            URLPath = `${API}${Version}${_interface}/${Offset}${GetParams}`;

            if (URLPath.indexOf('{{domain}}') > -1) {
                if (parameters.domain) {
                    URLPath = URLPath.replace('{{domain}}', parameters.domain);
                } else return rej(`Domain is required!`);
            }

            var data = JSON.stringify(
                utils.excludeProperty(
                    utils.excludeProperty(parameters, 'offset'),
                    'domain',
                ),
            );

            var Headers = {
                Authorization: this._auth.key ?? undefined,
                Cookie: this._auth.session ?? undefined,
                ...((m, l) => {
                    if (m != 'GET') {
                        return {
                            'Content-Type': 'application/json',
                            'Content-Length': l,
                        };
                    }
                    return {};
                })(httpmethod, data.length),
            };

            Object.keys(Headers).forEach(
                (key) => Headers[key] === undefined && delete Headers[key],
            );

            utils.getJSON(
                {
                    host: ENDPOINT,
                    port: 443,
                    path: ((method, path) => {
                        if (method === 'GET') {
                            return path;
                        }
                        return path.split('?')[0];
                    })(httpmethod, URLPath),
                    method: httpmethod,
                    encoding: 'utf8',
                    headers: {
                        ...Headers,
                    },
                    data: data,
                },
                (err, status, result, respHeaders) => {
                    if (err) {
                        rej(err);
                    }

                    return res({
                        data: result,
                        status: status,
                        rawheaders: respHeaders,
                    });
                },
            );
        });
    }

    Auth = {
        Login: ({ Email, Password, Token = '' }) => {
            return new Promise((resolve, reject) => {
                this.Call(
                    'auth',
                    'local/account-login',
                    'POST',
                    { email: Email, password: Password, token: Token },
                    true,
                    true,
                )
                    .then(({ data, status, rawheaders }) => {
                        if (rawheaders['set-cookie']) {
                            for (var key in rawheaders['set-cookie']) {
                                if (
                                    rawheaders['set-cookie'][key].indexOf(
                                        'namebase-main',
                                    ) > -1
                                ) {
                                    this._auth.session =
                                        rawheaders['set-cookie'][key].split(
                                            ' ',
                                        )[0];
                                }
                            }
                        }
                        resolve({
                            data,
                            status,
                            rawheaders,
                            session: this._auth.session,
                        });
                    })
                    .catch((e) => reject(e));
            });
        },

        Logout: () => {
            return this.Call('auth', 'logout', 'POST', {}, true, true);
        },

        API: {
            Keys: () => {
                return this.Call('auth', 'keys', 'GET', {}, true, true);
            },

            Create: (name) => {
                return this.Call('auth', 'key', 'POST', { name }, true, true);
            },

            Delete: (AccessKey) => {
                return this.Call(
                    'auth',
                    'key',
                    'DELETE',
                    { accessKey: AccessKey },
                    true,
                    true,
                );
            },
        },
    };

    User = {
        Self: () => {
            return this.Call('user', '/', 'GET', {}, true);
        },

        Dashboard: () => {
            // Deprecated
            //return this.Call('user', 'dashboard', 'GET', {}, true);
            throw new Error('Dashboard has been deprecated by Namebase');
        },

        Wallet: () => {
            return this.Call('user', 'wallet', 'GET', {}, true);
        },

        DomainSummary: () => {
            return this.Call('user', 'domains/summary', 'GET', {}, true);
        },

        Messages: () => {
            return this.Call('user', 'messages', 'GET', {}, true);
        },

        ReferralStats: (limit = 10) => {
            return this.Call(
                'user',
                `referral-stats/${limit}`,
                'GET',
                {},
                true,
            );
        },

        PendingHistory: () => {
            return this.Call('user', 'pending-history', 'GET', {}, true);
        },

        Domains: (
            { offset, sortKey, sortDirection, limit } = {
                offset: 0,
                sortKey: 'acquiredAt',
                sortDirection: 'desc',
                limit: 100,
            },
        ) => {
            return this.Call(
                'user',
                'domains/not-listed',
                'GET',
                {
                    offset,
                    sortKey,
                    sortDirection,
                    limit,
                },
                true,
            );
        },

        TransferredDomains: (
            { offset, sortKey, sortDirection, limit } = {
                offset: 0,
                sortKey: 'acquiredAt',
                sortDirection: 'desc',
                limit: 100,
            },
        ) => {
            return this.Call(
                'user',
                'domains/transferred',
                'GET',
                {
                    offset,
                    sortKey,
                    sortDirection,
                    limit,
                },
                true,
            );
        },

        ListedDomains: (page = 0, limit = 100) => {
            return this.Call(
                'user',
                `domains/listed/${page}`,
                'GET',
                { limit },
                true,
            );
        },

        MFA: () => {
            return this.Call('user', 'mfa', 'GET', {}, true);
        },

        Offers: {
            // Expected Reply
            // { success: bool, totalCount: int, domains: obj }
            Received: ({
                offset = 0,
                sortKey = 'createdAt',
                sortDirection = 'desc',
            } = {}) => {
                return this.Call(
                    'offers',
                    'received',
                    'GET',
                    {
                        offset,
                        sortKey,
                        sortDirection,
                    },
                    false,
                    false,
                    true,
                );
            },

            Sent: ({
                offset = 0,
                sortKey = 'createdAt',
                sortDirection = 'desc',
            } = {}) => {
                return this.Call(
                    'offers',
                    'sent',
                    'GET',
                    {
                        offset,
                        sortKey,
                        sortDirection,
                    },
                    false,
                    false,
                    true,
                );
            },

            Notification: () => {
                return this.Call('offers', '/', 'GET', {});
            },

            Inbox: {
                Received: () => {
                    return this.Call('offers', 'inbox/received', 'GET', {});
                },
            },
        },

        Bids: {
            Open: (offset = 0) => {
                return this.Call('user', 'open-bids', 'GET', { offset }, true);
            },

            Lost: (offset = 0) => {
                return this.Call('user', 'lost-bids', 'GET', { offset }, true);
            },

            Revealing: (offset = 0) => {
                return this.Call(
                    'user',
                    'revealing-bids',
                    'GET',
                    { offset },
                    true,
                );
            },
        },
    };

    Account = {
        Self: (
            { receiveWindow = 10000, timestamp = new Date().getTime() } = {
                receiveWindow: 10000,
                timestamp: new Date().getTime(),
            },
        ) => {
            return this.Call('account', '/', 'GET', {
                receiveWindow,
                timestamp,
            });
        },

        Limits: (
            { receiveWindow = 10000, timestamp = new Date().getTime() } = {
                receiveWindow: 10000,
                timestamp: new Date().getTime(),
            },
        ) => {
            return this.Call('account', 'limits', 'GET', {
                receiveWindow,
                timestamp,
            });
        },

        Log: ({ accountName = 'unlocked', limit = 10 } = {}) => {
            return this.Call('account', 'log', 'GET', {
                accountName,
                limit,
            });
        },

        Deposit: {
            Address: (
                {
                    asset = 'HNS',
                    timestamp = new Date().getTime(),
                    receiveWindow = 10000,
                } = {
                    asset: 'HNS',
                    timestamp: new Date().getTime(),
                    receiveWindow: 10000,
                },
            ) => {
                return this.Call('deposit', 'address', 'POST', {
                    asset,
                    timestamp,
                    receiveWindow,
                });
            },

            History: (
                {
                    asset = 'HNS',
                    startTime,
                    endTime,
                    timestamp = new Date().getTime(),
                    receiveWindow = 10000,
                } = {
                    asset: 'HNS',
                    timestamp: new Date().getTime(),
                    receiveWindow: 10000,
                },
            ) => {
                return this.Call('deposit', 'history', 'GET', {
                    asset,
                    startTime,
                    endTime,
                    timestamp,
                    receiveWindow,
                });
            },
        },

        Withdraw: {
            Asset: (
                {
                    asset = 'HNS',
                    address,
                    amount,
                    timestamp = new Date().getTime(),
                    receiveWindow = 10000,
                } = {
                    asset: 'HNS',
                    timestamp: new Date().getTime(),
                    receiveWindow: 10000,
                },
            ) => {
                return this.Call('withdraw', '/', 'POST', {
                    asset,
                    address,
                    amount,
                    timestamp,
                    receiveWindow,
                });
            },

            History: (
                {
                    asset = 'HNS',
                    startTime,
                    endTime,
                    timestamp = new Date().getTime(),
                    receiveWindow = 10000,
                } = {
                    asset: 'HNS',
                    timestamp: new Date().getTime(),
                    receiveWindow: 10000,
                },
            ) => {
                return this.Call('withdraw', 'history', 'GET', {
                    asset,
                    startTime,
                    endTime,
                    timestamp,
                    receiveWindow,
                });
            },
        },
    };

    Auction = {
        Bid: (domain, bid, blind) => {
            return this.Call('auction', '{{domain}}/bid', 'POST', {
                domain,
                bidAmount: bid,
                blindAmount: blind,
            });
        },
    };

    Marketplace = {
        Domain: (domain) => {
            return this.Call('marketplace', '{{domain}}', 'GET', {
                domain,
            });
        },

        History: (domain) => {
            return this.Call('marketplace', '{{domain}}/history', 'GET', {
                domain,
            });
        },

        List: (domain, amount, description, asset = 'HNS') => {
            return this.Call('marketplace', '{{domain}}', 'POST', {
                domain,
                amount,
                description,
                asset,
            });
        },

        CancelListing: (domain) => {
            return this.Call('marketplace', '{{domain}}/cancel', 'POST', {
                domain,
            });
        },

        BuyNow: (domain) => {
            return this.Call('marketplace', '{{domain}}/buynow', 'POST', {
                domain,
            });
        },
    };

    Trade = {
        History: (
            {
                symbol = 'HNSBTC',
                timestamp = new Date().getTime(),
                receiveWindow = 10000,
                limit = 30,
            } = {
                symbol: 'HNSBTC',
                timestamp: new Date().getTime(),
                receiveWindow: 10000,
                limit: 30,
            },
        ) => {
            return this.Call('trade', '/', 'GET', {
                symbol,
                timestamp,
                receiveWindow,
                limit,
            });
        },

        Account: (
            { timestamp = new Date().getTime(), receiveWindow = 10000 } = {
                timestamp: new Date().getTime(),
                receiveWindow: 10000,
            },
        ) => {
            return this.Call('trade', 'account', 'GET', {
                timestamp,
                receiveWindow,
            });
        },

        Depth: (
            { symbol = 'HNSBTC', limit = 100 } = {
                symbol: 'HNSBTC',
                limit: 100,
            },
        ) => {
            return this.Call('depth', '/', 'GET', {
                symbol,
                limit,
            });
        },

        Order: {
            Get: (
                {
                    symbol = 'HNSBTC',
                    orderId,
                    receiveWindow = 10000,
                    timestamp = new Date().getTime(),
                } = {
                    symbol: 'HNSBTC',
                    receiveWindow: 10000,
                    timestamp: new Date().getTime(),
                },
            ) => {
                return this.Call('trade', 'order', 'GET', {
                    symbol,
                    orderId,
                    timestamp,
                    receiveWindow,
                });
            },

            New: (
                {
                    symbol = 'HNSBTC',
                    side,
                    type,
                    quantity,
                    price,
                    timestamp = new Date().getTime(),
                    receiveWindow = 10000,
                } = {
                    symbol: 'HNSBTC',
                    receiveWindow: 10000,
                    timestamp: new Date().getTime(),
                },
            ) => {
                return this.Call('order', '/', 'POST', {
                    symbol,
                    side,
                    type,
                    quantity,
                    price,
                    timestamp,
                    receiveWindow,
                });
            },

            Delete: (
                {
                    symbol = 'HNSBTC',
                    orderId,
                    receiveWindow = 10000,
                    timestamp = new Date().getTime(),
                } = {
                    symbol: 'HNSBTC',
                    receiveWindow: 10000,
                    timestamp: new Date().getTime(),
                },
            ) => {
                return this.Call('order', '/', 'delete', {
                    symbol,
                    orderId,
                    timestamp,
                    receiveWindow,
                });
            },

            Open: (
                {
                    symbol = 'HNSBTC',
                    receiveWindow = 10000,
                    timestamp = new Date().getTime(),
                } = {
                    symbol: 'HNSBTC',
                    receiveWindow: 10000,
                    timestamp: new Date().getTime(),
                },
            ) => {
                return this.Call('order', 'open', 'GET', {
                    symbol,
                    orderId,
                    timestamp,
                    receiveWindow,
                });
            },

            All: (
                {
                    symbol = 'HNSBTC',
                    orderId,
                    limit = 100,
                    receiveWindow = 10000,
                    timestamp = new Date().getTime(),
                } = {
                    limit: 100,
                    symbol: 'HNSBTC',
                    receiveWindow: 10000,
                    timestamp: new Date().getTime(),
                },
            ) => {
                return this.Call('order', 'all', 'GET', {
                    symbol,
                    orderId,
                    limit,
                    timestamp,
                    receiveWindow,
                });
            },
        },
    };

    DNS = {
        Get: (domain) => {
            return this.Call('dns', 'domains/{{domain}}', 'GET', {
                domain,
            });
        },
        // Record[] { ENUM type, STRING host, STRING value, INTEGER ttl }
        Set: (domain, records) => {
            return this.Call('dns', 'domains/{{domain}}', 'PUT', {
                domain,
                records,
            });
        },
        // rawNameState needs to be HEX of the DNS records
        AdvancedSet: (domain, rawNameState) => {
            return this.Call('dns', 'domains/{{domain}}/advanced', 'PUT', {
                domain,
                rawNameState,
            });
        },

        NameServers: (domain) => {
            return this.Call('dns', 'domains/{{domain}}/nameserver', 'GET', {
                domain,
            });
        },

        SetNameServers: (domain, records, deleteRecords) => {
            return this.Call('dns', 'domains/{{domain}}/nameserver', 'PUT', {
                domain,
                records,
                deleteRecords,
            });
        },
    };

    Fiat = {
        Transfers: () => {
            return this.Call('fiat', 'ach/transfers', 'GET', {}, true);
        },

        Accounts: () => {
            return this.Call('fiat', 'ach/accounts', 'GET', {}, true);
        },
    };

    Ticker = {
        Day: (symbol = 'HNSBTC') => {
            return this.Call('ticker', 'day', 'GET', { symbol });
        },

        Book: (symbol = 'HNSBTC') => {
            return this.Call('ticker', 'book', 'GET', { symbol });
        },

        Price: (symbol = 'HNSBTC') => {
            return this.Call('ticker', 'price', 'GET', { symbol });
        },

        Supply: (symbol = 'HNSBTC') => {
            return this.Call('ticker', 'supply', 'GET', { symbol });
        },

        Klines: (
            {
                symbol = 'HNSBTC',
                interval = '5m',
                startTime,
                endTime,
                limit = 100,
            } = {
                symbol: 'HNSBTC',
                interval: '5m',
                limit: 100,
            },
        ) => {
            return this.Call('ticker', 'klines', 'GET', {
                symbol,
                interval,
                startTime,
                endTime,
                limit,
            });
        },
    };

    Domains = {
        Popular: (offset = 0) => {
            return this.Call('domains', 'popular', 'GET', { offset }, true);
        },

        RecentlyWon: (offset = 0) => {
            return this.Call(
                'domains',
                'recently-won',
                'GET',
                { offset },
                true,
            );
        },

        EndingSoon: (offset = 0) => {
            return this.Call('domains', 'ending-soon', 'GET', { offset }, true);
        },

        Anticipated: (offset = 0) => {
            return this.Call('domains', 'anticipated', 'GET', { offset }, true);
        },

        Sold: (sortKey, sortDirection) => {
            return this.Call(
                'domains',
                'sold',
                'GET',
                { sortKey, sortDirection },
                true,
            );
        },

        Marketplace: (
            offset,
            sortKey,
            sortDirection,
            firstCharacter,
            maxPrice,
            maxLength,
            onlyPuny,
        ) => {
            return this.Call(
                'domains',
                'markeplace',
                'GET',
                {
                    offset,
                    sortKey,
                    sortDirection,
                    firstCharacter,
                    maxPrice,
                    maxLength,
                    onlyPuny,
                },
                true,
            );
        },
    };

    Domain(domain) {
        return this.Call('domains', 'get/{{domain}}', 'GET', { domain }, true);
    }
    // Toggles
    WatchDomain(domain) {
        return this.Call(
            'domains',
            'watch/{{domain}}',
            'GET',
            { domain },
            true,
        );
    }
}

module.exports = NameBase;

const utils = require('./utils.js');

const VERSION = 'v0';
const ENDPOINT = 'www.namebase.io';

class NameBase {
    _auth = {};
    AssetMeta = {
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
                'Basic ' +
                Buffer.from(`${AccessKey}:${SecretKey}`).toString('base64');
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
    ) {
        return new Promise((res, rej) => {
            var URLPath = `?`;

            method = method.split(':')[0];

            // Build URL structure
            for (var key in parameters) {
                if (key === 'domain' || key === 'offset') {
                    continue;
                }

                URLPath += `${key}=${parameters[key]}&`;
            }

            var API = disableApi ? '' : '/api';
            var Version = disableVersion ? '/' : `/${VERSION}/`;
            var Offset =
                parameters.offset != undefined
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
                                    this._auth.session = rawheaders[
                                        'set-cookie'
                                    ][key].split(' ')[0];
                                }
                            }
                        }
                        resolve({ data, status, rawheaders });
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
                return this.Call(
                    'auth',
                    'key',
                    'POST',
                    { name: name },
                    true,
                    true,
                );
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
            return this.Call('user', 'dashboard', 'GET', {}, true);
        },

        PendingHistory: () => {
            return this.Call('user', 'pending-history', 'GET', {}, true);
        },

        Domains: ({ offset, sortKey, sortDirection, limit }) => {
            return this.Call(
                'user',
                'domains/not-listed',
                'GET',
                {
                    offset: offset,
                    sortKey: sortKey,
                    sortDirection: sortDirection,
                    limit: limit,
                },
                true,
            );
        },

        TransferredDomains: ({ offset, sortKey, sortDirection, limit }) => {
            return this.Call(
                'user',
                'domains/transferred',
                'GET',
                {
                    offset: offset,
                    sortKey: sortKey,
                    sortDirection: sortDirection,
                    limit: limit,
                },
                true,
            );
        },

        ListedDomains: () => {
            return this.Call('user', 'domains/listed', 'GET', {}, true);
        },

        MFA: () => {
            return this.Call('user', 'mfa', 'GET', {}, true);
        },

        Offers: {
            // Expected Reply
            // { success: bool, totalCount: int, domains: obj }
            Recieved: ({
                Offset = 0,
                sKey = 'createdAt',
                sDirection = 'desc',
            }) => {
                return this.Call('offers', 'recieved', 'GET', {
                    offset: Offset,
                    sortKey: sKey,
                    sortDirection: sDirection,
                });
            },

            Sent: ({ Offset = 0, sKey = 'createdAt', sDirection = 'desc' }) => {
                return this.Call('offers', 'recieved', 'GET', {
                    offset: Offset,
                    sortKey: sKey,
                    sortDirection: sDirection,
                });
            },

            Notification: () => {
                return this.Call('offers', '/', 'GET', {});
            },
        },

        Bids: {
            Open: (offset = 0) => {
                return this.Call(
                    'user',
                    'open-bids',
                    'GET',
                    { offset: offset },
                    true,
                );
            },

            Lost: (offset = 0) => {
                return this.Call(
                    'user',
                    'lost-bids',
                    'GET',
                    { offset: offset },
                    true,
                );
            },

            Revealing: (offset = 0) => {
                return this.Call(
                    'user',
                    'revealing-bids',
                    'GET',
                    { offset: offset },
                    true,
                );
            },
        },
    };

    Account = {
        Self: ({
            receiveWindow = 10000,
            timestamp = new Date().getTime(),
        } = {}) => {
            return this.Call('account', '/', 'GET', {
                receiveWindow: receiveWindow,
                timestamp: timestamp,
            });
        },

        Limits: ({
            receiveWindow = 10000,
            timestamp = new Date().getTime(),
        } = {}) => {
            return this.Call('account', 'limits', 'GET', {
                receiveWindow: receiveWindow,
                timestamp: timestamp,
            });
        },

        Log: ({ accountName = 'unlocked', limit = 10 } = {}) => {
            return this.Call('account', 'log', 'GET', {
                accountName: accountName,
                limit: limit,
            });
        },

        Deposit: {
            Address: ({
                asset = 'HNS',
                timestamp = new Date().getTime(),
                receiveWindow = 10000,
            } = {}) => {
                return this.Call('deposit', 'address', 'POST', {
                    asset: asset,
                    timestamp: timestamp,
                    receiveWindow: receiveWindow,
                });
            },

            History: ({
                asset = 'HNS',
                startTime,
                endTime,
                timestamp = new Date().getTime(),
                receiveWindow = 10000,
            } = {}) => {
                return this.Call('deposit', 'history', 'GET', {
                    asset: asset,
                    startTime: startTime,
                    endTime: endTime,
                    timestamp: timestamp,
                    receiveWindow: receiveWindow,
                });
            },
        },

        Withdraw: {
            Asset: ({
                asset = 'HNS',
                address,
                amount,
                timestamp = new Date().getTime(),
                receiveWindow = 10000,
            } = {}) => {
                return this.Call('withdraw', '/', 'POST', {
                    asset: asset,
                    address: address,
                    amount: amount,
                    timestamp: timestamp,
                    receiveWindow: receiveWindow,
                });
            },

            History: ({
                asset = 'HNS',
                startTime,
                endTime,
                timestamp = new Date().getTime(),
                receiveWindow = 10000,
            } = {}) => {
                return this.Call('withdraw', 'history', 'GET', {
                    asset: asset,
                    startTime: startTime,
                    endTime: endTime,
                    timestamp: timestamp,
                    receiveWindow: receiveWindow,
                });
            },
        },
    };

    Auction = {
        Bid: (domain, bid, blind) => {
            return this.Call('auction', '{{domain}}/bid', 'POST', {
                domain: domain,
                bidAmount: bid,
                blindAmount: blind,
            });
        },
    };

    Marketplace = {
        Domain: (domain) => {
            return this.Call('marketplace', '{{domain}}', 'GET', {
                domain: domain,
            });
        },

        History: (domain) => {
            return this.Call('marketplace', '{{domain}}/history', 'GET', {
                domain: domain,
            });
        },

        List: (domain, amount, description, asset = 'HNS') => {
            return this.Call('marketplace', '{{domain}}', 'POST', {
                domain: domain,
                amount: amount,
                description: description,
                asset: asset,
            });
        },

        CancelListing: (domain) => {
            return this.Call('marketplace', '{{domain}}/cancel', 'POST', {
                domain: domain,
            });
        },

        BuyNow: (domain) => {
            return this.Call('marketplace', '{{domain}}/buynow', 'POST', {
                domain: domain,
            });
        },
    };

    Trade = {
        History: ({
            symbol = 'HNSBTC',
            timestamp = new Date().getTime(),
            receiveWindow = 10000,
            limit = 30,
        } = {}) => {
            return this.Call('trade', '/', 'GET', {
                symbol: symbol,
                timestamp: timestamp,
                receiveWindow: receiveWindow,
                limit: limit,
            });
        },

        Account: ({
            timestamp = new Date().getTime(),
            receiveWindow = 10000,
        } = {}) => {
            return this.Call('trade', 'account', 'GET', {
                timestamp: timestamp,
                receiveWindow: receiveWindow,
            });
        },

        Depth: ({ symbol = 'HNSBTC', limit = 100 } = {}) => {
            return this.Call('depth', '/', 'GET', {
                symbol: symbol,
                limit: limit,
            });
        },

        Order: {
            Get: ({
                symbol = 'HNSBTC',
                orderId,
                receiveWindow = 10000,
                timestamp = new Date().getTime(),
            } = {}) => {
                return this.Call('trade', 'order', 'GET', {
                    symbol: symbol,
                    orderId: orderId,
                    timestamp: timestamp,
                    receiveWindow: receiveWindow,
                });
            },

            New: ({
                symbol = 'HNSBTC',
                side,
                type,
                quantity,
                price,
                timestamp = new Date().getTime(),
                receiveWindow = 10000,
            } = {}) => {
                return this.Call('order', '/', 'POST', {
                    symbol: symbol,
                    side: side,
                    type: type,
                    quantity: quantity,
                    price: price,
                    timestamp: timestamp,
                    receiveWindow: receiveWindow,
                });
            },

            Delete: ({
                symbol = 'HNSBTC',
                orderId,
                receiveWindow = 10000,
                timestamp = new Date().getTime(),
            } = {}) => {
                return this.Call('order', '/', 'delete', {
                    symbol: symbol,
                    orderId: orderId,
                    timestamp: timestamp,
                    receiveWindow: receiveWindow,
                });
            },

            Open: ({
                symbol = 'HNSBTC',
                receiveWindow = 10000,
                timestamp = new Date().getTime(),
            } = {}) => {
                return this.Call('order', 'open', 'GET', {
                    symbol: symbol,
                    orderId: orderId,
                    timestamp: timestamp,
                    receiveWindow: receiveWindow,
                });
            },

            All: ({
                symbol = 'HNSBTC',
                orderId,
                limit = 100,
                receiveWindow = 10000,
                timestamp = new Date().getTime(),
            } = {}) => {
                return this.Call('order', 'all', 'GET', {
                    symbol: symbol,
                    orderId: orderId,
                    limit: limit,
                    timestamp: timestamp,
                    receiveWindow: receiveWindow,
                });
            },
        },
    };

    DNS = {
        Get: (domain) => {
            return this.Call('dns', 'domains/{{domain}}', 'GET', {
                domain: domain,
            });
        },
        // Record[] { ENUM type, STRING host, STRING value, INTEGER ttl }
        Set: (domain, records) => {
            return this.Call('dns', 'domains/{{domain}}', 'PUT', {
                domain: domain,
                records: records,
            });
        },
        // rawNameState needs to be HEX of the DNS records
        AdvancedSet: (domain, rawNameState) => {
            return this.Call('dns', 'domains/{{domain}}/advanced', 'PUT', {
                domain: domain,
                rawNameState: rawNameState,
            });
        },

        NameServers: (domain) => {
            return this.Call('dns', 'domains/{{domain}}/nameserver', 'GET', {
                domain: domain,
            });
        },

        SetNameServers: (domain, records, deleteRecords) => {
            return this.Call('dns', 'domains/{{domain}}/nameserver', 'PUT', {
                domain: domain,
                records: records,
                deleteRecords: deleteRecords,
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
            return this.Call('ticker', 'day', 'GET', { symbol: symbol });
        },

        Book: (symbol = 'HNSBTC') => {
            return this.Call('ticker', 'book', 'GET', { symbol: symbol });
        },

        Price: (symbol = 'HNSBTC') => {
            return this.Call('ticker', 'price', 'GET', { symbol: symbol });
        },

        Supply: (symbol = 'HNSBTC') => {
            return this.Call('ticker', 'supply', 'GET', { symbol: symbol });
        },

        Klines: ({
            symbol = 'HNSBTC',
            interval = '5m',
            startTime,
            endTime,
            limit = 100,
        } = {}) => {
            return this.Call('ticker', 'klines', 'GET', {
                symbol: symbol,
                interval: interval,
                startTime: startTime,
                endTime: endTime,
                limit: limit,
            });
        },
    };

    Domains = {
        Popular: (offset = 0) => {
            return this.Call(
                'domains',
                'popular',
                'GET',
                { offset: offset },
                true,
            );
        },

        RecentlyWon: (offset = 0) => {
            return this.Call(
                'domains',
                'recently-won',
                'GET',
                { offset: offset },
                true,
            );
        },

        EndingSoon: (offset = 0) => {
            return this.Call(
                'domains',
                'ending-soon',
                'GET',
                { offset: offset },
                true,
            );
        },

        Anticipated: (offset = 0) => {
            return this.Call(
                'domains',
                'anticipated',
                'GET',
                { offset: offset },
                true,
            );
        },

        Sold: (sortKey, sortDirection) => {
            return this.Call(
                'domains',
                'sold',
                'GET',
                { sortKey: sortKey, sortDirection: sortDirection },
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
                'sold',
                'GET',
                {
                    offset: offset,
                    sortKey: sortKey,
                    sortDirection: sortDirection,
                    firstCharacter: firstCharacter,
                    maxPrice: maxPrice,
                    maxLength: maxLength,
                    onlyPuny: onlyPuny,
                },
                true,
            );
        },
    };

    Domain(domain) {
        return this.Call(
            'domains',
            'get/{{domain}}',
            'GET',
            { domain: domain },
            true,
        );
    }
    // Toggles
    WatchDomain(domain) {
        return this.Call(
            'domains',
            'watch/{{domain}}',
            'GET',
            { domain: domain },
            true,
        );
    }
}

module.exports = NameBase;

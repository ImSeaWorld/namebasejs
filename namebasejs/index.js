const { API } = require('./meta.js');
const utils = require('./utils.js');

const VERSION = 'v0';
const ENDPOINT = 'www.namebase.io';

class NameBase {
    constructor({ AccessKey = false, SecretKey = false, Session = false }) {
        let COOKIES;
        let AUTHORIZATION;

        if (!AccessKey && !SecretKey && !Session) {
            console.log(
                'NameBaseJS - Features will be limited without full authorization!!!',
            );
        } else {
            if (Session) {
                COOKIES = `namebase-main=${Session};`;
                AUTHORIZATION = undefined;
            } else {
                AUTHORIZATION =
                    'Basic ' +
                    Buffer.from(`${AccessKey}:${SecretKey}`).toString('base64');
                COOKIES = undefined;
            }
        }

        function Call(_interface, method, parameters, cb) {
            let URLPath = '?';
            let methods_key, interface_key, httpmethod;

            if (!parameters) parameters = {};

            if ((interface_key = utils.ReturnKey(_interface, API.interfaces))) {
                if (
                    (methods_key = utils.ReturnKey(
                        method,
                        API.interfaces[interface_key].methods,
                    ))
                ) {
                    var apiMethod =
                        API.interfaces[interface_key].methods[methods_key];

                    if (
                        utils.objSize(apiMethod.parameters) <
                        utils.objSize(parameters)
                    ) {
                        return cb(
                            `NameBaseJS Error: Too many parameters for method.`,
                        );
                    }

                    httpmethod = apiMethod.httpmethod;

                    var missingParams = [];
                    for (var param in apiMethod.parameters) {
                        if (
                            !parameters.hasOwnProperty(
                                apiMethod.parameters[param].name,
                            )
                        ) {
                            if (!apiMethod.parameters[param].optional) {
                                if (
                                    apiMethod.parameters[param].name ===
                                    'timestamp'
                                ) {
                                    parameters[
                                        'timestamp'
                                    ] = new Date().getTime();
                                    URLPath += `timestamp=${new Date().getTime()}`;
                                } else {
                                    missingParams.push(
                                        apiMethod.parameters[param].name,
                                    );
                                }
                            }
                        } else {
                            if (
                                apiMethod.parameters[param].name === 'domain' ||
                                apiMethod.parameters[param].name === 'offset'
                            )
                                continue;

                            URLPath += `${apiMethod.parameters[param].name}=${
                                parameters[apiMethod.parameters[param].name]
                            }&`;
                        }
                    }

                    if (missingParams.length > 0) {
                        return cb(
                            `NameBaseJS Error: Missing "${missingParams.join(
                                '", "',
                            )}" parameter${utils.mto(
                                missingParams,
                                's',
                            )}! ${utils.mto(
                                missingParams,
                                "They're",
                                "It's",
                            )} required!`,
                        );
                    }
                } else
                    return cb(
                        `NameBaseJS Error: Method "${method}" doesn't exist!`,
                    );
            } else
                return cb(
                    `NameBaseJS Error: Interface "${_interface}" doesn't exist!`,
                );

            method = method.split(':')[0];

            var verOut = API.interfaces[interface_key].disableVersion
                ? '/'
                : `/${VERSION}/`;

            var b =
                parameters.offset != undefined
                    ? `${method}/${parameters.offset}`
                    : method;

            var appendData = httpmethod === 'GET' ? URLPath : '';

            URLPath = `/api${verOut}${_interface}/${method === '/' ? '' : b}${
                URLPath === '?' ? '' : appendData
            }`;

            if (URLPath.indexOf('{{domain}}') > -1) {
                if (parameters.domain) {
                    URLPath = URLPath.replace('{{domain}}', parameters.domain);
                } else return cb(`Domain is required!`);
            }

            var data = JSON.stringify(
                utils.excludeProperty(
                    utils.excludeProperty(parameters, 'offset'),
                    'domain',
                ),
            );

            var Headers = {
                Authorization: AUTHORIZATION,
                Cookie: COOKIES,
                ...((method, len) => {
                    if (method === 'POST' || method === 'PUT') {
                        return {
                            'Content-Type': 'application/json',
                            'Content-Length': len,
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
                    if (respHeaders['set-cookie']) {
                        console.log(
                            'Cookie Set Request: ',
                            respHeaders['set-cookie'],
                        );
                        let index = -1;
                        if (
                            (index = respHeaders['set-cookie'].indexOf(
                                'namebase-main',
                            )) > -1
                        ) {
                            console.log(
                                'Found session: ',
                                respHeaders['set-cookie'][index],
                            );
                            COOKIES = respHeaders['set-cookie'][index];
                        }
                    }
                    return cb(err, status, result);
                },
            );
        }

        return {
            user: (cb = undefined) => {
                if (!cb) {
                    return {
                        // Session is needed
                        login: (email, password, token, cb) => {
                            return Call(
                                'local',
                                'account-login',
                                {
                                    email: email,
                                    password: password,
                                    token: token,
                                },
                                cb,
                            );
                        },
                        // Session is needed
                        logout: (cb) => Call('auth', 'logout', {}, cb),
                        dashboard: (cb) => Call('user', 'dashboard', {}, cb),
                        // Session is needed
                        apiKeys: (cb = undefined) => {
                            if (cb) {
                                return Call('auth', 'keys', {}, cb);
                            } else {
                                return {
                                    create: (name, cb) => {
                                        return Call(
                                            'auth',
                                            'key:post',
                                            { name: name },
                                            cb,
                                        );
                                    },
                                    delete: (key, cb) => {
                                        return Call(
                                            'auth',
                                            'key:delete',
                                            { accessKey: key },
                                            cb,
                                        );
                                    },
                                };
                            }
                        },
                        bid: (domain, amount, blind, cb) => {
                            return Call(
                                'auction',
                                '{{domain}}/bid',
                                {
                                    domain: domain,
                                    bidAmount: amount,
                                    blindAmount: blind,
                                },
                                cb,
                            );
                        },
                        // Session is needed
                        domains: (
                            offset,
                            sortKey,
                            sortDirection,
                            limit,
                            cb,
                        ) => {
                            return Call(
                                'user',
                                'domains/not-listed',
                                {
                                    offset: offset,
                                    sortDirection: sortDirection,
                                    sortKey: sortKey,
                                    limit: limit,
                                },
                                cb,
                            );
                        },
                        listedDomains: (
                            offset,
                            sortKey,
                            sortDirection,
                            limit,
                            cb,
                        ) => {
                            return Call(
                                'user',
                                'domains/listed',
                                {
                                    offset: offset,
                                    sortDirection: sortDirection,
                                    sortKey: sortKey,
                                    limit: limit,
                                },
                                cb,
                            );
                        },
                        transferredDomains: (
                            offset,
                            sortKey,
                            sortDirection,
                            limit,
                            cb,
                        ) => {
                            return Call(
                                'user',
                                'domains/transferred',
                                {
                                    offset: offset,
                                    sortDirection: sortDirection,
                                    sortKey: sortKey,
                                    limit: limit,
                                },
                                cb,
                            );
                        },
                        bids: (offset = undefined, cb = undefined) => {
                            if (cb) {
                                return Call(
                                    'user',
                                    'open-bids',
                                    {
                                        offset: offset,
                                    },
                                    cb,
                                );
                            } else {
                                return {
                                    lost: (offset, cb) =>
                                        Call(
                                            'user',
                                            'open-bids',
                                            {
                                                offset: offset,
                                            },
                                            cb,
                                        ),
                                    revealing: (offset, cb) =>
                                        Call(
                                            'user',
                                            'open-bids',
                                            {
                                                offset: offset,
                                            },
                                            cb,
                                        ),
                                };
                            }
                        },
                        pendingHistory: (cb) =>
                            Call('user', 'pending-history', {}, cb),
                    };
                } else {
                    return Call('user', '/', {}, cb);
                }
            },
            withdraw: (params = {}, cb = false) => {
                if (cb) {
                    return Call('withdraw', '/', params, cb);
                } else {
                    return {
                        history: (asset, cb) =>
                            Call(
                                'withdraw',
                                'history',
                                { asset: asset, ...params },
                                cb,
                            ),
                    };
                }
            },
            deposit: (params = {}) => {
                return {
                    address: (asset, cb) =>
                        Call(
                            'deposit',
                            'address',
                            { asset: asset, ...params },
                            cb,
                        ),
                    history: (asset, cb) =>
                        Call(
                            'deposit',
                            'history',
                            { asset: asset, ...params },
                            cb,
                        ),
                };
            },
            order: (params = {}, cb = false) => {
                if (cb) {
                    return Call('order', '/', params, cb);
                } else {
                    return {
                        new: (symbol, side, type, quantity, cb) =>
                            Call(
                                'order',
                                '/:post',
                                {
                                    symbol: symbol,
                                    side: side,
                                    type: type,
                                    quantity: quantity,
                                    ...params,
                                },
                                cb,
                            ),
                        delete: (symbol, orderId, cb) =>
                            Call(
                                'order',
                                '/:delete',
                                { symbol: symbol, orderId: orderId },
                                cb,
                            ),
                        // current open orders
                        open: (symbol, cb) =>
                            Call(
                                'order',
                                'open',
                                { symbol: symbol, ...params },
                                cb,
                            ),
                        // Get all account orders; active, canceled, or filled.
                        all: (symbol, cb) =>
                            Call(
                                'order',
                                'all',
                                { symbol: symbol, ...params },
                                cb,
                            ),
                    };
                }
            },
            depth: (params, cb) => {
                return Call('depth', '/', params, cb);
            },
            ticker: (params = {}, callback = false) => {
                if (callback) {
                    return Call('ticker', 'day', params, callback);
                } else {
                    return {
                        day: (symbol, cb) =>
                            Call(
                                'ticker',
                                'day',
                                { symbol: symbol, ...params },
                                cb,
                            ),
                        book: (symbol, cb) =>
                            Call(
                                'ticker',
                                'book',
                                { symbol: symbol, ...params },
                                cb,
                            ),
                        price: (symbol, cb) =>
                            Call(
                                'ticker',
                                'price',
                                { symbol: symbol, ...params },
                                cb,
                            ),
                        supply: (symbol, cb) =>
                            Call(
                                'ticker',
                                'supply',
                                { symbol: symbol, ...params },
                                cb,
                            ),
                        klines: (symbol, interval, cb) =>
                            Call(
                                'ticker',
                                'klines',
                                {
                                    symbol: symbol,
                                    interval: interval,
                                    ...params,
                                },
                                cb,
                            ),
                    };
                }
            },
            trade: (params = {}, cb = false) => {
                if (cb) {
                    return Call('trade', '/', params, cb);
                } else {
                    return {
                        //Get trades for a specific account and symbol.
                        account: (symbol, cb) =>
                            Call(
                                'trade',
                                'account',
                                { symbol: symbol, ...params },
                                cb,
                            ),
                        //Get trades for a specific order and symbol.
                        order: (symbol, cb) =>
                            Call(
                                'trade',
                                'order',
                                { symbol: symbol, ...params },
                                cb,
                            ),
                    };
                }
            },
            account: (params = {}, cb = false) => {
                if (cb) {
                    return Call('account', '/', params, cb);
                } else {
                    return {
                        limits: (cb) => Call('account', 'limit', params, cb),
                        log: (limit, cb) =>
                            Call(
                                'account',
                                'log',
                                { accountName: 'unlocked', limit: limit },
                                cb,
                            ),
                    };
                }
            },
            dns: (params = {}, cb = false) => {
                if (cb) {
                    return Call('dns', 'domains/{{domain}}', params, cb);
                } else {
                    return {
                        set: (settings, cb) => {
                            return Call(
                                'dns',
                                'domains/{{domain}}:put',
                                { ...params, ...settings },
                                cb,
                            );
                        },
                        setAdvanced: (rawHexNameState, cb) => {
                            return Call(
                                'dns',
                                'domains/{{domain}}/advanced',
                                { rawNameState: rawHexNameState, ...params },
                                cb,
                            );
                        },
                        nameserver: (domain, cb = false) => {
                            if (cb) {
                                return Call(
                                    'dns',
                                    'domains/{{domain}}/nameserver',
                                    { domain: domain, ...params },
                                    cb,
                                );
                            } else {
                                return {
                                    set: (domain, records, deleteRecords) =>
                                        Call(
                                            'dns',
                                            'domains/{{domain}}/nameserver',
                                            {
                                                domain: domain,
                                                records: records,
                                                deleteRecords: deleteRecords,
                                                ...params,
                                            },
                                            cb,
                                        ),
                                };
                            }
                        },
                    };
                }
            },
            marketplace: (params = {}, callback = false) => {
                if (callback) {
                    return Call('domains', 'marketplace', params, callback);
                } else {
                    return {
                        sold: (cb) => Call('domains', 'sold', params, cb),
                        soldByDomain: (domain, cb) =>
                            Call(
                                'marketplace',
                                '{{domain}}/history',
                                { domain: domain, ...params },
                                cb,
                            ),
                        list: (domain, amount, asset, cb) =>
                            Call(
                                'marketplace',
                                '{{domain}}/list',
                                {
                                    domain: domain,
                                    amount: amount,
                                    asset: asset,
                                    ...params,
                                },
                                cb,
                            ),
                        updateListing: (domain, amount, asset, cb) =>
                            Call(
                                'marketplace',
                                '{{domain}}/list',
                                {
                                    domain: domain,
                                    amount: amount,
                                    asset: asset,
                                    ...params,
                                },
                                cb,
                            ),
                        cancelListing: (domain, cb) =>
                            Call(
                                'marketplace',
                                '{{domain}}/cancel',
                                { domain: domain, ...params },
                                cb,
                            ),
                        purchaseDomain: (domain, cb) =>
                            Call(
                                'marketplace',
                                '{{domain}}/buynow',
                                { domain: domain, ...params },
                                cb,
                            ),
                    };
                }
            },
        };
    }
}

module.exports = NameBase;

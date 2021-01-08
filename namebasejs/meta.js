exports.API = {
    interfaces: [
        {
            name: 'local',
            disableVersion: true,
            methods: [
                {
                    name: 'account-login',
                    httpmethod: 'POST',
                    parameters: [
                        {
                            name: 'email',
                            type: String,
                            optional: false,
                            description: 'Account email',
                        },
                        {
                            name: 'password',
                            type: String,
                            optional: false,
                            description: 'Account password',
                        },
                        {
                            name: 'token',
                            type: String,
                            optional: false,
                            description: '2fa token',
                        },
                    ],
                },
            ],
        },
        {
            name: 'auth',
            disableVersion: true,
            methods: [
                {
                    name: 'logout', // sends empty body
                    httpmethod: 'POST',
                    parameters: [],
                },
                {
                    name: 'keys',
                    httpmethod: 'GET',
                    parameters: [],
                },
                {
                    name: 'key:post',
                    httpmethod: 'POST',
                    parameters: [
                        {
                            name: 'name',
                            type: String,
                            optional: false,
                            description: 'Name of your API key',
                        },
                    ],
                },
                {
                    name: 'key:delete',
                    httpmethod: 'DELETE',
                    parameters: [
                        {
                            name: 'accessKey',
                            type: String,
                            optional: false,
                            description: 'Given access key.',
                        },
                    ],
                },
            ],
        },
        {
            name: 'auction',
            methods: [
                {
                    name: '{{domain}}/bid',
                    httpmethod: 'POST',
                    parameters: [
                        {
                            name: 'domain',
                            type: String,
                            optional: false,
                            description: 'Domain you want to bid on',
                        },
                        {
                            name: 'bidAmount',
                            type: Number,
                            optional: false,
                            description: 'Bit amount in HNS',
                        },
                        {
                            name: 'blindAmount',
                            type: Number,
                            optional: false,
                            description: 'Blind amount in HNS',
                        },
                    ],
                },
            ],
        },
        {
            name: 'offers',
            methods: [
                {
                    name: '/',
                    httpmethod: 'GET',
                    parameters: [
                        {
                            name: 'offset',
                            type: Number,
                            optional: false,
                            description: 'Paginate by nth offset',
                        },
                        {
                            name: 'sortKey',
                            type: String,
                            optional: true,
                            description: 'acquiredAt',
                        },
                        {
                            name: 'sortDirection',
                            type: String,
                            optional: true,
                            description: 'asc or desc',
                        },
                        {
                            name: 'limit',
                            type: Number,
                            optional: true,
                            description: 'Limit output',
                        },
                    ],
                },
            ],
        },
        {
            name: 'domains',
            disableVersion: true,
            methods: [
                {
                    name: 'get/{{domain}}',
                    httpmethod: 'GET',
                    parameters: [
                        {
                            name: 'domain',
                            type: String,
                            optional: false,
                            description: 'Get auction results of domain',
                        },
                    ],
                },
                {
                    // this toggles watching for specified domain
                    name: 'watch/{{domain}}',
                    httpmethod: 'POST',
                    parameters: [
                        {
                            name: 'domain',
                            type: String,
                            optional: false,
                            description: 'Get auction results of domain',
                        },
                    ],
                },
                {
                    name: 'popular',
                    httpmethod: 'GET',
                    parameters: [
                        {
                            name: 'offset',
                            type: Number,
                            optional: false,
                            description: 'Paginate by nth offset',
                        },
                    ],
                },
                {
                    name: 'recently-won',
                    httpmethod: 'GET',
                    parameters: [
                        {
                            name: 'offset',
                            type: Number,
                            optional: false,
                            description: 'Paginate by nth offset',
                        },
                    ],
                },
                {
                    name: 'ending-soon',
                    httpmethod: 'GET',
                    parameters: [
                        {
                            name: 'offset',
                            type: Number,
                            optional: false,
                            description: 'Paginate by nth offset',
                        },
                    ],
                },
                {
                    name: 'anticipated',
                    httpmethod: 'GET',
                    parameters: [
                        {
                            name: 'offset',
                            type: Number,
                            optional: false,
                            description: 'Paginate by nth offset',
                        },
                    ],
                },
                {
                    name: 'sold',
                    httpmethod: 'GET',
                    parameters: [
                        {
                            name: 'sortKey',
                            type: String,
                            optional: true,
                            description:
                                'Default: date, Valid inputs: [date, price, name]',
                        },
                        {
                            name: 'sortDirection',
                            type: String,
                            optional: true,
                            description:
                                'Default: desc, Valid inputs: [desc, asc]',
                        },
                    ],
                },
                {
                    name: 'marketplace',
                    httpmethod: 'GET',
                    parameters: [
                        {
                            name: 'offset',
                            type: Number,
                            optional: false,
                            description: 'Paginate by nth offset',
                        },
                        {
                            name: 'sortKey',
                            type: Object,
                            optional: true,
                            description:
                                'Default: bid; Valid sortKeys: [bid, price, name, date]',
                        },
                        {
                            name: 'sortDirection',
                            type: Object,
                            optional: true,
                            description:
                                'Default: asc; Valid sortDirections: [desc, asc]',
                        },
                        {
                            name: 'firstCharacter',
                            type: String,
                            optional: true,
                            description:
                                'Use # to select for all names starting with a number',
                        },
                        {
                            name: 'maxPrice',
                            type: String,
                            optional: true,
                            description: 'Small HNS units',
                        },
                        {
                            name: 'maxLength',
                            type: String,
                            optional: true,
                            description: 'N/A',
                        },
                        {
                            name: 'onlyPuny',
                            type: Boolean,
                            optional: true,
                            description: 'Default: false',
                        },
                    ],
                },
            ],
        },
        {
            name: 'user',
            disableVersion: true,
            methods: [
                {
                    name: '/',
                    httpmethod: 'GET',
                    parameters: [],
                },
                {
                    name: 'pending-history',
                    httpmethod: 'GET',
                    parameters: [],
                },
                {
                    name: 'dashboard',
                    httpmethod: 'GET',
                    parameters: [],
                },
                {
                    name: 'open-bids',
                    httpmethod: 'GET',
                    parameters: [
                        {
                            name: 'offset',
                            type: Number,
                            optional: false,
                            description: 'Paginate by nth offset',
                        },
                    ],
                },
                {
                    name: 'revealing-bids',
                    httpmethod: 'GET',
                    parameters: [
                        {
                            name: 'offset',
                            type: Number,
                            optional: false,
                            description: 'Paginate by nth offset',
                        },
                    ],
                },
                {
                    name: 'lost-bids',
                    httpmethod: 'GET',
                    parameters: [
                        {
                            name: 'offset',
                            type: Number,
                            optional: false,
                            description: 'Paginate by nth offset',
                        },
                    ],
                },
                {
                    name: 'domains/transferred',
                    httpmethod: 'GET',
                    parameters: [
                        {
                            name: 'offset',
                            type: Number,
                            optional: false,
                            description: 'Paginate by nth offset',
                        },
                        {
                            name: 'sortKey',
                            type: String,
                            optional: true,
                            description: 'acquiredAt',
                        },
                        {
                            name: 'sortDirection',
                            type: String,
                            optional: true,
                            description: 'asc or desc',
                        },
                        {
                            name: 'limit',
                            type: Number,
                            optional: true,
                            description: 'Limit output',
                        },
                    ],
                },
                {
                    name: 'domains/listed',
                    httpmethod: 'GET',
                    parameters: [
                        // ?
                        {
                            name: 'offset',
                            type: Number,
                            optional: false,
                            description: 'Paginate by nth offset',
                        },
                        {
                            name: 'sortKey',
                            type: String,
                            optional: true,
                            description: 'acquiredAt',
                        },
                        {
                            name: 'sortDirection',
                            type: String,
                            optional: true,
                            description: 'asc or desc',
                        },
                        {
                            name: 'limit',
                            type: Number,
                            optional: true,
                            description: 'Limit output',
                        },
                    ],
                },
                {
                    name: 'domains/not-listed',
                    httpmethod: 'GET',
                    parameters: [
                        {
                            name: 'offset',
                            type: Number,
                            optional: false,
                            description: 'Paginate by nth offset',
                        },
                        {
                            name: 'sortKey',
                            type: String,
                            optional: true,
                            description: 'acquiredAt',
                        },
                        {
                            name: 'sortDirection',
                            type: String,
                            optional: true,
                            description: 'asc or desc',
                        },
                        {
                            name: 'limit',
                            type: Number,
                            optional: true,
                            description: 'Limit output',
                        },
                    ],
                },
            ],
        },
        {
            name: 'marketplace',
            methods: [
                {
                    name: '{{domain}}/history',
                    httpmethod: 'GET',
                    parameters: [
                        {
                            name: 'domain',
                            type: String,
                            optional: false,
                            description: '',
                        },
                    ],
                },
                {
                    name: '{{domain}}/list',
                    httpmethod: 'POST',
                    parameters: [
                        {
                            name: 'domain',
                            type: String,
                            optional: false,
                            description: '',
                        },
                        {
                            name: 'amount',
                            type: String,
                            optional: false,
                            description: 'N/A',
                        },
                        {
                            name: 'asset',
                            type: String,
                            optional: false,
                            description: 'Valid inputs: [HNS]',
                        },
                        {
                            name: 'description',
                            type: String,
                            optional: true,
                            description: "Default: ''; 10,000 character max",
                        },
                    ],
                },
                {
                    name: '{{domain}}/cancel',
                    httpmethod: 'POST',
                    parameters: [
                        {
                            name: 'domain',
                            type: String,
                            optional: false,
                            description: '',
                        },
                    ],
                },
                {
                    name: '{{domain}}/buynow',
                    httpmethod: 'POST',
                    parameters: [
                        {
                            name: 'domain',
                            type: String,
                            optional: false,
                            description: '',
                        },
                    ],
                },
            ],
        },
        {
            name: 'dns',
            methods: [
                {
                    // Get Settings
                    name: 'domains/{{domain}}',
                    httpmethod: 'GET',
                    parameters: [
                        {
                            name: 'domain',
                            type: String,
                            optional: false,
                            description: '',
                        },
                    ],
                },
                {
                    // Change Settings
                    name: 'domains/{{domain}}:put',
                    httpmethod: 'PUT',
                    parameters: [
                        {
                            name: 'domain',
                            type: String,
                            optional: false,
                            description: '',
                        },
                        {
                            name: 'records',
                            type: Object,
                            optional: false,
                            description:
                                'Record[] { ENUM type, STRING host, STRING value, INTEGER ttl }',
                        },
                    ],
                },
                {
                    name: 'domains/{{domain}}/advanced',
                    httpmethod: 'PUT',
                    parameters: [
                        {
                            name: 'domain',
                            type: String,
                            optional: false,
                            description: '',
                        },
                        {
                            name: 'rawNameState',
                            type: String,
                            optional: false,
                            description: 'Hex of DNS records',
                        },
                    ],
                },
                {
                    // Get Settings
                    name: 'domains/{{domain}}/nameserver',
                    httpmethod: 'GET',
                    parameters: [
                        {
                            name: 'domain',
                            type: String,
                            optional: false,
                            description: '',
                        },
                    ],
                },
                {
                    // Change Settings
                    name: 'domains/{{domain}}/nameserver',
                    httpmethod: 'PUT',
                    parameters: [
                        {
                            name: 'domain',
                            type: String,
                            optional: false,
                            description: '',
                        },
                        {
                            name: 'records',
                            type: Object,
                            optional: false,
                            description:
                                'The records you want set. Keep in mind that when a new record is set, every record with the same host and type will be removed and replaced with the new record',
                        },
                        {
                            name: 'deleteRecords',
                            type: Object,
                            optional: false,
                            description:
                                'DeleteRecord[] { ENUM type, STRING host } 	The record sets that you want to delete. This will remove all records with the specified host and type',
                        },
                    ],
                },
            ],
        },
        {
            name: 'account',
            methods: [
                {
                    name: '/',
                    httpmethod: 'GET',
                    parameters: [
                        {
                            name: 'timestamp',
                            type: Number,
                            optional: false,
                            description: '',
                        },
                        {
                            name: 'receiveWindow',
                            type: Number,
                            optional: true,
                            description: '',
                        },
                    ],
                },
                {
                    name: 'limits',
                    httpmethod: 'GET',
                    parameters: [
                        {
                            name: 'timestamp',
                            type: Number,
                            optional: false,
                            description: '',
                        },
                        {
                            name: 'receiveWindow',
                            type: Number,
                            optional: true,
                            description: '',
                        },
                    ],
                },
                {
                    name: 'log',
                    httpmethod: 'GET',
                    parameters: [
                        {
                            name: 'accountName',
                            type: String,
                            optional: false,
                            description: 'idk, default is "unlocked"',
                        },
                        {
                            name: 'limit',
                            type: Number,
                            optional: false,
                            description: 'Limit of result',
                        },
                    ],
                },
            ],
        },
        {
            name: 'trade',
            methods: [
                {
                    name: '/',
                    httpmethod: 'GET',
                    parameters: [
                        {
                            name: 'symbol',
                            type: String,
                            optional: false,
                            description: '',
                        },
                        {
                            name: 'tradeId',
                            type: Number,
                            optional: true,
                            description:
                                'Trade id to fetch from. Default gets most recent trades.',
                        },
                        {
                            name: 'limit',
                            type: Number,
                            optional: true,
                            description: 'Default 100; max 1000',
                        },
                        {
                            name: 'receiveWindow',
                            type: Number,
                            optional: true,
                            description: '',
                        },
                        {
                            name: 'timestamp',
                            type: Number,
                            optional: false,
                            description: '',
                        },
                    ],
                },
                {
                    name: 'account',
                    httpmethod: 'GET',
                    parameters: [
                        {
                            name: 'symbol',
                            type: String,
                            optional: false,
                            description: '',
                        },
                        {
                            name: 'tradeId',
                            type: Number,
                            optional: true,
                            description:
                                'Trade id to fetch from. Default gets most recent trades.',
                        },
                        {
                            name: 'limit',
                            type: Number,
                            optional: true,
                            description: 'Default 100; max 1000',
                        },
                        {
                            name: 'receiveWindow',
                            type: Number,
                            optional: true,
                            description: '',
                        },
                        {
                            name: 'timestamp',
                            type: Number,
                            optional: false,
                            description: '',
                        },
                    ],
                },
                {
                    name: 'order',
                    httpmethod: 'GET',
                    parameters: [
                        {
                            name: 'symbol',
                            type: String,
                            optional: false,
                            description: '',
                        },
                        {
                            name: 'orderId',
                            type: Number,
                            optional: true,
                            description: 'OrderId to get the trades for.',
                        },
                        {
                            name: 'receiveWindow',
                            type: Number,
                            optional: true,
                            description: '',
                        },
                        {
                            name: 'timestamp',
                            type: Number,
                            optional: false,
                            description: '',
                        },
                    ],
                },
            ],
        },
        {
            name: 'ticker',
            methods: [
                {
                    name: 'day',
                    httpmethod: 'GET',
                    parameters: [
                        {
                            name: 'symbol',
                            type: String,
                            optional: false,
                            description: '',
                        },
                    ],
                },
                {
                    name: 'book',
                    httpmethod: 'GET',
                    parameters: [
                        {
                            name: 'symbol',
                            type: String,
                            optional: false,
                            description: '',
                        },
                    ],
                },
                {
                    name: 'price',
                    httpmethod: 'GET',
                    parameters: [
                        {
                            name: 'symbol',
                            type: String,
                            optional: false,
                            description: '',
                        },
                    ],
                },
                {
                    name: 'supply',
                    httpmethod: 'GET',
                    parameters: [
                        {
                            name: 'symbol',
                            type: String,
                            optional: false,
                            description: '',
                        },
                    ],
                },
                {
                    name: 'klines',
                    httpmethod: 'GET',
                    parameters: [
                        {
                            name: 'symbol',
                            type: String,
                            optional: false,
                            description: '',
                        },
                        {
                            name: 'interval',
                            type: Object,
                            optional: false,
                            description: '',
                        },
                        {
                            name: 'startTime',
                            type: Number,
                            optional: true,
                            description: 'Inclusive',
                        },
                        {
                            name: 'endTime',
                            type: Number,
                            optional: true,
                            description: 'Inclusive',
                        },
                        {
                            name: 'limit',
                            type: Number,
                            optional: true,
                            description: 'Default 100; max 1000.',
                        },
                    ],
                },
            ],
        },
        {
            name: 'depth',
            methods: [
                {
                    name: '/',
                    httpmethod: 'GET',
                    parameters: [
                        {
                            name: 'symbol',
                            type: String,
                            optional: false,
                            description: '',
                        },
                        {
                            name: 'limit',
                            type: Number,
                            optional: true,
                            description:
                                'Default 100; max 1000. Valid limits:[5, 50, 100, 500, 1000]',
                        },
                    ],
                },
            ],
        },
        {
            name: 'order',
            methods: [
                {
                    name: '/',
                    httpmethod: 'GET',
                    parameters: [
                        {
                            name: 'symbol',
                            type: String,
                            optional: false,
                            description: '',
                        },
                        {
                            name: 'orderId',
                            type: Number,
                            optional: false,
                            description: 'Buy or sell etc',
                        },
                        {
                            name: 'timestamp',
                            type: Number,
                            optional: false,
                            description: '',
                        },
                        {
                            name: 'receiveWindow',
                            type: Number,
                            optional: true,
                            description: '',
                        },
                    ],
                },
                {
                    name: '/:post',
                    httpmethod: 'POST',
                    parameters: [
                        {
                            name: 'symbol',
                            type: String,
                            optional: false,
                            description: '',
                        },
                        {
                            name: 'side',
                            type: Object,
                            optional: false,
                            description: 'Buy or sell etc',
                        },
                        {
                            name: 'type',
                            type: Object,
                            optional: false,
                            description: '	Limit or market etc',
                        },
                        {
                            name: 'quantity',
                            type: Number,
                            optional: false,
                            description: '',
                        },
                        {
                            name: 'price',
                            type: Number,
                            optional: true,
                            description: 'Required for limit orders',
                        },
                        {
                            name: 'timestamp',
                            type: Number,
                            optional: false,
                            description: '',
                        },
                        {
                            name: 'receiveWindow',
                            type: Number,
                            optional: true,
                            description: '',
                        },
                    ],
                },
                {
                    name: '/:delete',
                    httpmethod: 'DELETE',
                    parameters: [
                        {
                            name: 'symbol',
                            type: String,
                            optional: false,
                            description: '',
                        },
                        {
                            name: 'orderId',
                            type: Number,
                            optional: false,
                            description: 'Buy or sell etc',
                        },
                        {
                            name: 'timestamp',
                            type: Number,
                            optional: false,
                            description: '',
                        },
                        {
                            name: 'receiveWindow',
                            type: Number,
                            optional: true,
                            description: '',
                        },
                    ],
                },
                {
                    name: 'open',
                    httpmethod: 'GET',
                    parameters: [
                        {
                            name: 'symbol',
                            type: String,
                            optional: false,
                            description: '',
                        },
                        {
                            name: 'timestamp',
                            type: Number,
                            optional: false,
                            description: '',
                        },
                        {
                            name: 'receiveWindow',
                            type: Number,
                            optional: true,
                            description: '',
                        },
                    ],
                },
                {
                    name: 'all',
                    httpmethod: 'GET',
                    parameters: [
                        {
                            name: 'symbol',
                            type: String,
                            optional: false,
                            description: '',
                        },
                        {
                            name: 'orderId',
                            type: Number,
                            optional: true,
                            description: 'Greater than or equal to 0.',
                        },
                        {
                            name: 'limit',
                            type: Number,
                            optional: true,
                            description: 'Default 100; max 1000.',
                        },
                        {
                            name: 'timestamp',
                            type: Number,
                            optional: false,
                            description: '',
                        },
                        {
                            name: 'receiveWindow',
                            type: Number,
                            optional: true,
                            description: '',
                        },
                    ],
                },
            ],
        },
        {
            name: 'deposit',
            methods: [
                {
                    name: 'address',
                    httpmethod: 'POST',
                    parameters: [
                        {
                            name: 'asset',
                            type: String,
                            optional: false,
                            description: '',
                        },
                        {
                            name: 'timestamp',
                            type: Number,
                            optional: false,
                            description: '',
                        },
                        {
                            name: 'receiveWindow',
                            type: Number,
                            optional: true,
                            description: '',
                        },
                    ],
                },
                {
                    name: 'history',
                    httpmethod: 'GET',
                    parameters: [
                        {
                            name: 'asset',
                            type: String,
                            optional: false,
                            description: '',
                        },
                        {
                            name: 'startTime',
                            type: Number,
                            optional: true,
                            description: '',
                        },
                        {
                            name: 'endTime',
                            type: Number,
                            optional: true,
                            description: '',
                        },
                        {
                            name: 'timestamp',
                            type: Number,
                            optional: false,
                            description: '',
                        },
                        {
                            name: 'receiveWindow',
                            type: Number,
                            optional: true,
                            description: '',
                        },
                    ],
                },
            ],
        },
        {
            name: 'withdraw',
            methods: [
                {
                    name: '/',
                    httpmethod: 'POST',
                    parameters: [
                        {
                            name: 'asset',
                            type: String,
                            optional: false,
                            description: '',
                        },
                        {
                            name: 'address',
                            type: String,
                            optional: false,
                            description: '',
                        },
                        {
                            name: 'amount',
                            type: Number,
                            optional: false,
                            description: '',
                        },
                        {
                            name: 'timestamp',
                            type: Number,
                            optional: false,
                            description: '',
                        },
                        {
                            name: 'receiveWindow',
                            type: Number,
                            optional: true,
                            description: '',
                        },
                    ],
                },
                {
                    name: 'history',
                    httpmethod: 'GET',
                    parameters: [
                        {
                            name: 'asset',
                            type: String,
                            optional: false,
                            description: '',
                        },
                        {
                            name: 'startTime',
                            type: Number,
                            optional: true,
                            description: '',
                        },
                        {
                            name: 'endTime',
                            type: Number,
                            optional: true,
                            description: '',
                        },
                        {
                            name: 'timestamp',
                            type: Number,
                            optional: false,
                            description: '',
                        },
                        {
                            name: 'receiveWindow',
                            type: Number,
                            optional: true,
                            description: '',
                        },
                    ],
                },
            ],
        },
    ],
    enums: {
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
    },
};

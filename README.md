# NameBaseJS `1.1.0`

Promise based namebase.io API wrapper for my application Black Mamba.

## Examples of some methods and results you should expect

#### nb.Call(interface, method, httpmethod, parameters, disableVersion, disableApi, disableOffset) `Returns: Promise`

```javascript
const nb = new (require('namebasejs'))({ Session: 'SESSION_KEY' });
// Base function to call directly to NameBase
nb.Call('user', 'open-bids', 'GET', { offset: 0 }, true)
    .then(({ data, status, rawheaders }) => {
        if (data.success) {
            console.log(data);
        }
    })
    .catch((e) => console.error(e));
```

#### nb.User.Self() `Returns: Promise`

```javascript
{
  serverTime: 1610237284223,
  email: 'email@email.com',
  segmentUuid: '28431023-29c0-4cb8-0f02-f92cd4fd5b6q',
  custodian: 'us',
  hns_balance: '1277956591',
  usd_balance: '0',
  verificationStatus: 'VERIFIED',
  canLinkBank: true,
  canUseConsumerHnsBtc: false,
  canUseConsumerBtcHns: true,
  canUseConsumerHnsUsd: true,
  canUseConsumerUsdHns: true,
  canUseProExchange: false,
  fullName: 'FULL NAME',
  isNewYork: false
}
```

#### nb.User.Dashboard() `Returns: Promise`

```javascript
 {
  success: true,
  height: 49788,
  messages: [],
  ongoingBids: { totalCount: 3, highlights: [ [Object], [Object] ] },
  revealingBids: { totalCount: 292, highlights: [ [Object], [Object] ] },
  watchlist: { totalCount: 126, highlights: [ [Object], [Object] ] },
  userDomains: { totalCount: 2, highlights: [ [Object], [Object] ] },
  lockedHns: '1321611785'
}
```

#### nb.User.Domains({ offset, sortKey, sortDirection, limit }) `Returns: Promise`

```javascript
{
  success: true,
  currentHeight: 49788,
  domains: [
    {
      name: 'bitch',
      renewalBlock: 143286,
      upToDate: true,
      numberViews: 11,
      usesOurNameservers: true
    },
  ],
  totalCount: 1
}
```

#### nb.User.TransferredDomains({ offset, sortKey, sortDirection, limit }) `Returns: Promise`

```javascript
{
  success: true,
  currentHeight: 61643,
  transferred: []
}
```

#### nb.User.ListedDomains() `Returns: Promise`

```javascript
{
  success: true,
  currentHeight: 49788,
  domains: [
    {
      name: 'bitch',
      amount: '35000000',
      asset: 'HNS',
      renewalBlock: 143286,
      upToDate: true
    }
  ]
}
```

#### nb.User.MFA() `Returns: Promise`

```javascript
{
  success: true,
  hasSetUpMfa: true
}
```

#### nb.User.Offers.Received({ offset, sortKey, sortDirection }) `Returns: Promise`

```javascript
{
  success: true,
  totalCount: 1,
  domains: [
    {
      domain: 'slutty',
      highestCurrentOffer: '1.000000',
      numberNegotiations: 2,
      isUnseen: false,
      domainOwnerId: 'FYSZJ4zOxSmUcFmYkHdksA'
    },
  ]
}
```

#### nb.User.Offers.Sent({ offset, sortKey, sortDirection }) `Returns: Promise`

```javascript
{
  success: true,
  totalCount: 1,
  domains: [
    {
      domain: 'biggiesmalls',
      highestCurrentOffer: '1.000000',
      isUnseen: true,
      domainOwnerId: 'be2wvMltQeW42WzMXMGSDQ'
    }
  ]
}
```

#### nb.User.Offers.Notification() `Returns: Promise`

```javascript
{
  success: true,
  isUnseen: true
}
```

#### nb.User.Bids.Open(offset) `Returns: Promise`

```javascript
{
  success: true,
  height: 61647,
  openBids: []
}
```

#### nb.User.Bids.Lost(offset) `Returns: Promise`

```javascript
{
  success: true,
  height: 61647,
  lostBids: [
    { domain: 'baldhead', data: [Object] },
  ]
}
```

#### nb.User.Bids.Revealing(offset) `Returns: Promise`

```javascript
{
  success: true,
  height: 61647,
  revealingBids: []
}
```

#### nb.Account.Self({ receiveWindow, timestamp }) `Returns: Promise`

```javascript
{
  makerFee: 0,
  takerFee: 10,
  canTrade: false,
  balances: [
    {
      asset: 'HNS',
      unlocked: '1.000000',
      lockedInOrders: '0.000000',
      canDeposit: true,
      canWithdraw: false
    },
    {
      asset: 'BTC',
      unlocked: '0.00000000',
      lockedInOrders: '0.00000000',
      canDeposit: false,
      canWithdraw: false
    }
  ]
}
```

#### nb.Account.Limits({ receiveWindow, timestamp }) `Returns: Promise`

```javascript
{
  startTime: 1617266355034,
  endTime: 1617352754034,
  withdrawalLimits: [
    {
      asset: 'HNS',
      totalWithdrawn: '0.000000',
      withdrawalLimit: '0.000000'
    },
    {
      asset: 'BTC',
      totalWithdrawn: '0.00000000',
      withdrawalLimit: '0.00000000'
    }
  ]
}
```

#### nb.Account.Log() `Returns: Promise`

```javascript
{
  success: true,
  currency: 'hns',
  entries: [
    {
      continuationId: 'ffffffffffffffffffffffffffffffff',
      label: 'registerBid',
      labelData: [Object],
      amount: '31000001',
      createdAt: '2021-03-07T05:53:24.816Z',
      path: '/domain-manager/DOMAIN'
    },
  ]
}
```

#### nb.Account.Deposit.Address({ asset, timestamp, receiveWindow }) `Returns: Promise`

```javascript
{
  address: 'hs1q4tasjv2l2hdrhq0yjff5c4d5st6q9q0dss49sr',
  asset: 'HNS',
  success: true
}
```

#### nb.Account.Deposit.History({ asset, startTime, endTime, timestamp, receiveWindow }) `Returns: Promise`

```javascript
[];
```

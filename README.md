# NameBaseJS `1.1.4`

Promise based [namebase.io](https://namebase.io) API wrapper

# Usage

```
npm install namebasejs --save
```

This wrapper covers up to 90% of the visible endpoints on namebase currently. Submit an issue or PR to fill in the ones I'm missing.

You can get your session from the network tab of Inspect Element under `namebase-main`. Copy everything after the `=`. Although, you don't need to instantiate `namebasejs` with a session, you can also use the local login which will store the session from your login in `_auth`.

_NOTE:_ Currently NameBase is returning `auth0` headers to prevent you from using their API too frequently. If you don't keep track of these, they'll block your IP from being able to access NameBase. Headers added by `auth0` are `x-ratelimit-limit`, `x-ratelimit-remaining` and `x-ratelimit-reset` you can read more about it [here](https://auth0.com/docs/troubleshoot/customer-support/operational-policies/rate-limit-policy).

```javascript
// Email and Password
const nb = new (require('namebasejs'))();

nb.Auth.Login({ Email: 'email@email.com', Password: 'password' })
    .then(({ data, status, rawheaders, session }) => {
        // This is the only function that returns 'session'
        console.log('My current session: ', session);
    })
    .then(() => {
        nb.User.Self().then(({ data }) => {
            console.log('Current HNS Balance: ', data.hns_balance / 1000000); // convert little to big
        });
    })
    .catch((e) => console.error(e));
```

```javascript
// With session
const nb = new (require('namebasejs'))({
    Session: '%sYOURSESSIONTOKENHERE',
});

nb.User.Self().then(({ data }) => {
    console.log('Current HNS Balance: ', data.hns_balance / 1000000); // convert little to big
});
```

```javascript
// With API Keys
const nb = new (require('namebasejs'))({
    aKey: '1dXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' // 64 Character Access Key
    sKey: 'a2XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' // 64 Character Secret Key
});

// API Keys will restrict the endpoints available to you.
// It only allows the endpoints of:
// - Account
// - Marketplace
// - Trade
// - DNS
// - Ticker
// - a few Domain endpoints

nb.Account.Self().then(({ data }) => {
    const assetHNS = data.balances.find(b => b.asset === 'HNS');

    console.log('Current HNS Balance: ', assetHNS.unlocked);
    console.log('Order Locked HNS Balance: ', assetHNS.lockedInOrders);
});
```

Any parameter with a `?` should be considered optional.

## Testing with Jest

-   Clone repository: `https://github.com/ImSeaWorld/namebasejs.git`
-   `npm install`
-   `npm run test`

## Result

This should be handled as a result from `axios`. We're not using axios for simplicity, but we love axios and use it in other projects! For familiarity sake, it's kept to the same standard.

All methods return `Promise({data, status, rawHeaders})`, the example above is how EVERY method is returned.

## Auth

-   `nb.Auth.Login({ Email, Password, Token })`
-   `nb.Auth.Logout()`

#### Auth.API

-   `nb.Auth.API.Keys()`
-   `nb.Auth.API.Create(name)`
-   `nb.Auth.API.Delete(AccessKey)`

## User

-   `nb.User.Self()`
-   `nb.User.Dashboard()` -- Deprecated by NameBase
-   `nb.User.Wallet()` - `1.1.2`
-   `nb.User.DomainSummary()` - `1.1.2`
-   `nb.User.Messages()` - `1.1.2`
-   `nb.User.ReferralStats(limit?)` - `1.1.2`
-   `nb.User.PendingHistory()`
-   `nb.User.Domains({ offset?, sortKey?, sortDirection?, limit? })`
-   `nb.User.TransferredDomains({ offset, sortKey, sortDirection, limit })`
-   `nb.User.ListedDomains(offset?, limit?)`
-   `nb.User.MFA()`

#### User.Offers

-   `nb.User.Offers.Sent({ offset?, sortKey?, sortDirection? })`
-   `nb.User.Offers.Received({ offset?, sortKey?, sortDirection? })`
-   `nb.User.Offers.Notification()`

#### User.Offers.Inbox - `1.1.2`

-   `nb.User.Offers.Inbox.Received()` - `1.1.2`

#### User.Bids

-   `nb.User.Bids.Open(offset?)`
-   `nb.User.Bids.Lost(offset?)`
-   `nb.User.Bids.Revealing(offset?)`

## Account

-   `nb.Account.Log({ accountName?, limit? })`
-   [`nb.Account.Self({ receiveWindow?, timestamp? })`](https://github.com/namebasehq/api-documentation/blob/master/rest-api.md#account-information)
-   [`nb.Account.Limits({ receiveWindow?, timestamp? })`](https://github.com/namebasehq/api-documentation/blob/master/rest-api.md#account-withdrawal-limits)

#### Account.Deposit

-   [`nb.Account.Deposit.Address({ asset?, timestamp?, receiveWindow? })`](https://github.com/namebasehq/api-documentation/blob/master/rest-api.md#deposit-address)
-   [`nb.Account.Deposit.History({ asset?, startTime, endTime, timestamp?, receiveWindow? })`](https://github.com/namebasehq/api-documentation/blob/master/rest-api.md#deposit-history)

#### Account.Withdraw

-   [`nb.Account.Withdraw.Asset({ asset?, address, amount, timestamp?, receiveWindow? })`](https://github.com/namebasehq/api-documentation/blob/master/rest-api.md#withdraw)
-   [`nb.Account.Withdraw.History({ asset?, startTime, endTime, timestamp?, receiveWindow? })`](https://github.com/namebasehq/api-documentation/blob/master/rest-api.md#withdraw-history)

## Auction

-   `nb.Auction.Bid(domain, bid, blind)`

## Marketplace

-   `nb.Marketplace.Domain(domain)`
-   `nb.Marketplace.Bid(domain, hnsAmount)` - `1.1.3`
-   [`nb.Marketplace.History(domain)`](https://github.com/namebasehq/api-documentation/blob/master/marketplace-api.md#domain-sale-history)
-   [`nb.Marketplace.List(domain, amount, description, asset?)`](https://github.com/namebasehq/api-documentation/blob/master/marketplace-api.md#list-name--update-listing)
-   [`nb.Marketplace.CancelListing(domain)`](https://github.com/namebasehq/api-documentation/blob/master/marketplace-api.md#cancel-listing)
-   [`nb.Marketplace.BuyNow(domain)`](https://github.com/namebasehq/api-documentation/blob/master/marketplace-api.md#purchase-name)

## Trade

-   [`nb.Trade.History({ symbol?, timestamp?, receiveWindow?, limit? })`](https://github.com/namebasehq/api-documentation/blob/master/rest-api.md#trade-lookup)
-   [`nb.Trade.Account({ timestamp?, receiveWindow? })`](https://github.com/namebasehq/api-documentation/blob/master/rest-api.md#account-trade-list)
-   [`nb.Trade.Depth({ symbol?, limit? })`](https://github.com/namebasehq/api-documentation/blob/master/rest-api.md#order-book)

#### Trade.Order

-   [`nb.Trade.Order.Get({ symbol?, orderId, receiveWindow?, timestamp? })`](https://github.com/namebasehq/api-documentation/blob/master/rest-api.md#order-trade-list)
-   [`nb.Trade.Order.New({ symbol?, side, type, quantity, price, receiveWindow?, timestamp? })`](https://github.com/namebasehq/api-documentation/blob/master/rest-api.md#new-order)
-   [`nb.Trade.Order.All({ symbol?, orderId, limit?, receiveWindow?, timestamp? })`](https://github.com/namebasehq/api-documentation/blob/master/rest-api.md#all-orders)
-   [`nb.Trade.Order.Open({ symbol?, receiveWindow?, timestamp? })`](https://github.com/namebasehq/api-documentation/blob/master/rest-api.md#current-open-orders)
-   [`nb.Trade.Order.Delete({ symbol?, orderId, receiveWindow?, timestamp? })`](https://github.com/namebasehq/api-documentation/blob/master/rest-api.md#cancel-order)

## DNS

-   [`nb.DNS.Get(domain)`](https://github.com/namebasehq/api-documentation/blob/master/dns-settings-api.md#get-settings)
-   [`nb.DNS.Set(domain, records)`](https://github.com/namebasehq/api-documentation/blob/master/dns-settings-api.md#change-settings)
-   [`nb.DNS.AdvancedSet(domain, rawNameState)`](https://github.com/namebasehq/api-documentation/blob/master/dns-settings-api.md#change-settings-advanced)
-   [`nb.DNS.NameServers(domain)`](https://github.com/namebasehq/api-documentation/blob/master/dns-settings-api.md#get-settings-1)
-   [`nb.DNS.SetNameServers(domain, records, deleteRecords)`](https://github.com/namebasehq/api-documentation/blob/master/dns-settings-api.md#change-settings-1)

## Fiat

-   `nb.Fiat.Accounts()`
-   `nb.Fiat.Transfers()`

## Ticker

-   [`nb.Ticker.Day(symbol?)`](https://github.com/namebasehq/api-documentation/blob/master/rest-api.md#24hr-ticker-price-change-statistics)
-   [`nb.Ticker.Book(symbol?)`](https://github.com/namebasehq/api-documentation/blob/master/rest-api.md#symbol-order-book-ticker)
-   [`nb.Ticker.Price(symbol?)`](https://github.com/namebasehq/api-documentation/blob/master/rest-api.md#symbol-price-ticker)
-   [`nb.Ticker.Supply(asset?)`](https://github.com/namebasehq/api-documentation/blob/master/rest-api.md#circulating-supply-ticker)
-   [`nb.Ticker.Klines({ symbol?, interval?, startTime?, endTime?, limit? })`](https://github.com/namebasehq/api-documentation/blob/master/rest-api.md#kline-data)

## Domains

-   `nb.Domains.Popular(offset?)`
-   `nb.Domains.RecentlyWon(offset?)`
-   `nb.Domains.EndingSoon(offset?)`
-   `nb.Domains.Anticipated(offset?)` -- Deprecated
-   [`nb.Domains.Sold(offset?, sortKey?, sortDirection?)`](https://github.com/namebasehq/api-documentation/blob/master/marketplace-api.md#all-sale-history)
-   [`nb.Domains.Marketplace(offset?, sortKey?, sortDirection?, onlyPuny?, onlyIdnaPuny?, onlyAlternativePuny?, ...moreArgs?)`](https://github.com/namebasehq/api-documentation/blob/master/marketplace-api.md#marketplace-listings)

## Gift

-   `nb.Gift(recipientEmail, senderName, note).SLD(domain)`
-   `nb.Gift(recipientEmail, senderName, note).TLD(tld)`

## Misc

-   `nb.Domain(Domain)`
-   `nb.WatchDomain(Domain)`

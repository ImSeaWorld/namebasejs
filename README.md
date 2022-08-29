# NameBaseJS `1.2.0`

Promise based [namebase.io](https://namebase.io) API wrapper

# Usage

```
npm install namebasejs --save
```

This wrapper covers up to 90% of the visible endpoints on namebase currently. Submit an issue or PR to fill in the ones I'm missing.

You can get your session from the network tab of Inspect Element under `namebase-main`. Copy everything after the `=`. Although, you don't need to instantiate `namebasejs` with a session, you can also use the local login which will store the session from your login in `_auth_session` which can be gotten from the api `namebasejs.session` at any time.

_NOTE:_ Currently NameBase is returning `auth0` headers to prevent you from using their API too frequently. 

`1.2.0` - Added handling for `auth0` headers, this can be disabled if it's not working correctly or you want to handle everything yourself. You can read more about `auth0` headers [here](https://auth0.com/docs/policies/rate-limit-policy).
Disable `auth0` like so(after instantiation of `namebasejs`): `namebasejs.auth0 = false;`
This doesn't stop you from using the API, it just doesn't handle the `auth0` headers for you. It will still keep track of the `auth0` headers and are available at `namebasejs.auth0_headers`.

## Example: Login using email & password
```javascript
import NameBaseJS from "namebasejs";

const namebasejs = new NameBaseJS();

namebasejs.auth.login('email', 'password')
    .then(({ data, status, headers, session }) => {
        // This is the only function that returns 'session'
        console.log('My current session: ', session);

        if (status === 200) {
            console.log('Logged in successfully!');
            
            namebasejs.user.self().then(({ data }) => {
                console.log('Current HNS Balance: ', data.hns_balance / 1000000); // convert little to big
            });
        }
    })
    .catch(console.error);
```

## Example: Login using session
```javascript
import NameBaseJS from "namebasejs";

const namebasejs = new NameBaseJS({session: 'SESSION_TOKEN'});

namebasejs.user.self().then(({ data }) => {
    console.log('Current HNS Balance: ', data.hns_balance / 1000000); // convert little to big
});
```

## Example: Login using Access and Secret keys
```javascript
import NameBaseJS from "namebasejs";

const namebasejs = new NameBaseJS({
    aKey: '1dXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', // 64 Character Access Key
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

namebasejs.account.self().then(({ data }) => {
    const assetHNS = data.balances.find(b => b.asset === 'HNS');

    console.log('Current HNS Balance: ', assetHNS.unlocked);
    console.log('Order Locked HNS Balance: ', assetHNS.lockedInOrders);
});
```

## Testing with Jest [Broken Currently]

-   Clone repository: `https://github.com/ImSeaWorld/namebasejs.git`
-   `npm install`
-   `npm run test`

## Result

We're now using [Axios](https://www.npmjs.com/package/axios)! This means we can now be used in the browser and NodeJS! Referring to the [Axios](https://www.npmjs.com/package/axios) documentation, the response schema is as follows:

```javascript
{
    data: {}, // The response that was provided by the API
    status: 200, // HTTP status code from the server response
    statusText: 'OK', // HTTP status message from the server response
    headers: {}, // The headers that the server responded with
    config: {}, // The config that was provided to `axios` for the request
    request: {} // The request that generated this response
}
```

All methods return `AxiosPromise`, the example above is how EVERY method is returned.

Any parameter with a `?` should be considered optional.

## NameBaseJS

-   `namebasejs({ session?: string, aKey?: string, sKey?: string })` - Constructor
-   `namebasejs.axios` - The instance of `axios` used for requests.
-   `namebasejs.auth0` - Boolean to enable/disable `auth0` headers. Default: `true`
-   `namebasejs.auth0_headers` - The `auth0` object populated by the headers that are returned from the server. This does include `now()` function to get the current time(unix).
-   `namebasejs.receive_window` - The receive window for timed requests. Default: `10000`(ms)
-   `namebasejs.enums` - The enums used for the API.
-   `namebasejs.session` - The session token used for requests. Default: `null`
-   `namebasejs.auth_key` - The access key used for requests. Set with colon delimited access and secret key! Default: `null`
-   `namebasejs.request(_interface, method, paylod?, ...args?)` - The request method used for all requests. This is the method that handles the `auth0` headers. This method is not meant to be used directly, but is exposed for advanced usage.
-   `namebasejs.timedRequest(_interface, method, payload?, ...args?)` - The timed request method used for all requests that require a `receive_window`. This method is not meant to be used directly, but is exposed for advanced usage.
-   `namebasejs.account` - The [account interface](#account).
-   `namebasejs.auction` - The [auction interface](#auction).
-   `namebasejs.auth` - The [auth interface](#auth).
-   `namebasejs.dns` - The [dns interface](#dns).
-   `namebasejs.domain` - `1.2.0` The [domain interface](#domain---120).
-   `namebasejs.domains` - The [domains interface](#domains).
-   `namebasejs.fiat` - The [fiat interface](#fiat).
-   `namebasejs.marketplace` - The [marketplace interface](#marketplace).
-   `namebasejs.ticker` - The [ticker interface](#ticker).
-   `namebasejs.trade` - The [trade interface](#trade).
-   `namebasejs.user` - The [user interface](#user).

## Account

-   [`account.self()`](https://github.com/namebasehq/api-documentation/blob/master/rest-api.md#account-information) - Get current account
-   [`account.limits()`](https://github.com/namebasehq/api-documentation/blob/master/rest-api.md#account-withdrawal-limits) - Account limitations set by NameBase
-   `account.log(accountName?, limit?)` - No idea what this is 
-   [`account.depositAddress({ asset?, timestamp?, receiveWindow? })`](https://github.com/namebasehq/api-documentation/blob/master/rest-api.md#deposit-address)
-   [`account.depositHistory({ asset?, startTime, endTime, timestamp?, receiveWindow? })`](https://github.com/namebasehq/api-documentation/blob/master/rest-api.md#deposit-history)
-   [`account.withdraw({ asset?, address, amount, timestamp?, receiveWindow? })`](https://github.com/namebasehq/api-documentation/blob/master/rest-api.md#withdraw)
-   [`account.withdrawHistory({ asset?, startTime, endTime, timestamp?, receiveWindow? })`](https://github.com/namebasehq/api-documentation/blob/master/rest-api.md#withdraw-history)

## Auction

-   `auction.bid(domain, bidAmount, blindAmount)` - Bid on a domain

## Auth

-   `auth.login(email, password, token?)` - Login using email, password and 2fa token if enabled
-   `auth.logout()` - Logout of current session
-   `auth.apiKeys()` - Get all API Keys
-   `auth.apiKeyCreate(name)` - Create an API Key
-   `auth.apiKeyDelete(accessKey)` - Delete an API Key

## DNS

-   [`dns.get(domain)`](https://github.com/namebasehq/api-documentation/blob/master/dns-settings-api.md#get-settings)
-   [`dns.set(domain, records)`](https://github.com/namebasehq/api-documentation/blob/master/dns-settings-api.md#change-settings)
-   [`dns.advanced(domain, rawNameState)`](https://github.com/namebasehq/api-documentation/blob/master/dns-settings-api.md#change-settings-advanced)
-   [`dns.nameServers(domain)`](https://github.com/namebasehq/api-documentation/blob/master/dns-settings-api.md#get-settings-1)
-   [`dns.setNameServers(domain, records, deleteRecords)`](https://github.com/namebasehq/api-documentation/blob/master/dns-settings-api.md#change-settings-1)

## Domain - `1.2.0`

-   `domain.get(domain)` - `1.2.0` Get domain info
-   `domain.watch(domain)` - `1.2.0` Watch a domain for updates(toggles)
-   `domain.giftSLD(domain, recipientEmail, senderName, note)` - `1.2.0` Gift a domain to a friend
-   `domain.giftTLD(domain, recipientEmail, senderName, note)` - `1.2.0` Gift a domain to a friend

## Domains

-   `domains.popular(offset?)`
-   `domains.recentlyWon(offset?)`
-   `domains.endingSoon(offset?)`
-   [`domains.sold(offset?, sortKey?, sortDirection?)`](https://github.com/namebasehq/api-documentation/blob/master/marketplace-api.md#all-sale-history)
-   [`domains.marketplace(offset?, sortKey?, sortDirection?, onlyPuny?, onlyIdnaPuny?, onlyAlternativePuny?, ...moreArgs?)`](https://github.com/namebasehq/api-documentation/blob/master/marketplace-api.md#marketplace-listings)

## Fiat

-   `fiat.accounts()`
-   `fiat.transfers()`

## Marketplace

-   [`marketplace.list(domain, amount, description, asset?)`](https://github.com/namebasehq/api-documentation/blob/master/marketplace-api.md#list-name--update-listing) - List a domain for sale
-   `marketplace.domain(domain)` - Get marketplace listing
-   [`marketplace.history(domain)`](https://github.com/namebasehq/api-documentation/blob/master/marketplace-api.md#domain-sale-history) - Get marketplace history
-   `marketplace.offer(domain, buyOfferAmount)` - `1.1.3` Make an offer on a domain
-   [`marketplace.cancelListing(domain)`](https://github.com/namebasehq/api-documentation/blob/master/marketplace-api.md#cancel-listing)
-   [`marketplace.buyNow(domain)`](https://github.com/namebasehq/api-documentation/blob/master/marketplace-api.md#purchase-name)

## Ticker

-   [`ticker.day(symbol?)`](https://github.com/namebasehq/api-documentation/blob/master/rest-api.md#24hr-ticker-price-change-statistics)
-   [`ticker.book(symbol?)`](https://github.com/namebasehq/api-documentation/blob/master/rest-api.md#symbol-order-book-ticker)
-   [`ticker.price(symbol?)`](https://github.com/namebasehq/api-documentation/blob/master/rest-api.md#symbol-price-ticker)
-   [`ticker.supply(asset?)`](https://github.com/namebasehq/api-documentation/blob/master/rest-api.md#circulating-supply-ticker)
-   [`ticker.klines(symbol?, interval?, startTime?, endTime?, limit?)`](https://github.com/namebasehq/api-documentation/blob/master/rest-api.md#kline-data)

## Trade

-   [`trade.history(symbol?, limit?)`](https://github.com/namebasehq/api-documentation/blob/master/rest-api.md#trade-lookup)
-   [`trade.account()`](https://github.com/namebasehq/api-documentation/blob/master/rest-api.md#account-trade-list)
-   [`trade.depth(symbol?, limit?)`](https://github.com/namebasehq/api-documentation/blob/master/rest-api.md#order-book)
-   [`trade.orders(symbol?, orderId, limit?)`](https://github.com/namebasehq/api-documentation/blob/master/rest-api.md#all-orders)
-   [`trade.getOrder(symbol?, orderId)`](https://github.com/namebasehq/api-documentation/blob/master/rest-api.md#order-trade-list)
-   [`trade.newOrder(symbol?, side, type, quantity, price)`](https://github.com/namebasehq/api-documentation/blob/master/rest-api.md#new-order)
-   [`trade.deleteOrder(symbol?, orderId)`](https://github.com/namebasehq/api-documentation/blob/master/rest-api.md#cancel-order)
-   [`trade.openOrders(symbol?)`](https://github.com/namebasehq/api-documentation/blob/master/rest-api.md#current-open-orders)

## User

-   `user.self()` - Get current user
-   `user.wallet()` - `1.1.2`
-   `user.domainSummary()` - `1.1.2` Domain summary dashboard widget
-   `user.messages()` - `1.1.2`
-   `user.referralStats(limit?)` - `1.1.2` Referral stats dashboard widget
-   `user.pendingHistory()` - Pending history dashboard widget
-   `user.domains(offset?, sortKey?, sortDirection?, limit?)` - Unlisted domains
-   `user.transferredDomains(offset?, sortKey?, sortDirection?, limit?)` - Domain transfer history
-   `user.listedDomains(offset?, limit?)` - Domains listed for sale
-   `user.mfa()` - Check if multifactor authentication is enabled
-   `user.offersSent(offset?, sortKey?, sortDirection?)`
-   `user.offersReceived(offset?, sortKey?, sortDirection?)`
-   `user.offersNotifications()` - Offer notification widget
-   `user.openBids(offset?)` - Open bids on active auctions
-   `user.lostBids(offset?)` - Lost bids on ended auctions
-   `user.revealingBids(offset?)` - Bids that are currently in reveal
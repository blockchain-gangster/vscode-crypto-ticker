# cc-prices

Welcome to cc-prices, a Visual Studio Code extension that allows you to keep an eye on cryptocurrency prices as you code!

### Default Settings

The default settings provide a set of basic tickers for BTC, ETH and LTC. The current prices are displayed in USDT with colors based on the 24HOUR period.

![Example](https://github.com/robertcalvert/vscode-crypto-ticker/raw/master/images/default.png)

### Customization

This extension uses [Binance's public market data](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints) to retrieve the current cryptocurrency prices, which needs no API key. A ticker works for any _symbol_ and _currency_ that Binance trades as a pair, such as BTC and USDT for BTCUSDT. A currency of USD is treated as USDT.

You can fully customize your tickers using the cc-prices extension settings.

```javascript
// Specify the refresh interval in seconds
"cc-prices.interval": 60,

// Specify the opening period: the last HOUR, the last 24HOUR, or the DAY since midnight UTC
"cc-prices.period": "24HOUR",

// Customize your high and low colors to suite your status bar
"cc-prices.higherColor": "lightgreen",
"cc-prices.lowerColor": "coral",

// Customize your tickers
"cc-prices.tickers": [
    {
        // The base cryptocurrency symbol
        "symbol": "BTC",

        // The comparison currency symbol
        "currency": "EUR",

        // Create a custom ticker template
        "template": "{symbol} {price} {percent}"
    },
    {
        // You can even compare cryptocurrencies
        "symbol": "ETH",
        "currency": "BTC"
    },
    {
        // Uses the default currency, USDT
        "symbol": "DOGE"
    }
]
```

These example settings create the following tickers:

![Example](https://github.com/robertcalvert/vscode-crypto-ticker/raw/master/images/custom.png)

### Template Tags

You can use tags within your ticker template to customize the output as needed.

```javascript
"template": "{symbol} {price}" // The default template
```

The following tags are available to use:

| Tag     | Description                                                |
| ------- | ---------------------------------------------------------- |
| symbol  | The cryptocurrency symbol                                  |
| price   | The current cryptocurrency price                           |
| open    | The opening price for the given period                     |
| high    | The highest price since the period opened                  |
| low     | The lowest price since the period opened                   |
| change  | The difference between the opening price and current price |
| percent | The change as a percent                                    |

## License

[MIT](LICENSE.md)

// Copyright (c) Robert Calvert. Licensed under the MIT license.
// See LICENSE file in the project root for full license information.

import * as vscode from "vscode";

// the Binance public market data URL for each opening period
const urls: { [period: string]: string } = {
  HOUR: "https://data-api.binance.vision/api/v3/ticker?windowSize=1h&symbol=",
  "24HOUR": "https://data-api.binance.vision/api/v3/ticker/24hr?symbol=",
  DAY: "https://data-api.binance.vision/api/v3/ticker/tradingDay?symbol=",
};

// the US dollar stablecoins, whose prices are shown as dollars
const dollars = ["USDT", "USDC", "FDUSD"];

// a ticker definition from the configuration
export interface Definition {
  symbol: string;
  currency?: string;
  template?: string;
}

// the extension configuration
export interface Configuration {
  interval: number;
  onlyRefreshWhenFocused: boolean;
  period: string;
  higherColor: string;
  lowerColor: string;
  tickers: Definition[];
}

// the price statistics returned by the service
interface Statistics {
  lastPrice: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  priceChange: string;
  priceChangePercent: string;
}

// represents a ticker object
export class Ticker {
  // the tickers status bar item
  item: vscode.StatusBarItem;

  // the definition properties
  symbol: string;
  currency: string;
  pair: string;
  template: string;

  // the configuration properties
  period: string;
  higherColor: string;
  lowerColor: string;

  // the price formatter for the currency
  formatter: Intl.NumberFormat;

  // construct a new ticker based on a ticker definition
  constructor(definition: Definition, priority: number) {
    // set the definition properties
    this.item = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left,
      priority,
    );
    this.symbol = definition.symbol;
    this.currency = (definition.currency || "USDT").toUpperCase();
    this.template = definition.template || "{symbol} {price}";

    // use Tether for US dollars, as Binance's US dollar pairs are thinly traded
    if (this.currency === "USD") {
      this.currency = "USDT";
    }

    // the Binance trading pair, such as BTCUSDT
    this.pair = `${this.symbol}${this.currency}`.toUpperCase();

    // set the configuration properties
    const configuration = vscode.workspace
      .getConfiguration()
      .get("cc-prices") as Configuration;
    this.period = configuration.period;
    this.higherColor = configuration.higherColor;
    this.lowerColor = configuration.lowerColor;

    // format prices in the currency, showing US dollar stablecoins as dollars
    const options: Intl.NumberFormatOptions = {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    };
    try {
      const currency = dollars.includes(this.currency) ? "USD" : this.currency;
      this.formatter = new Intl.NumberFormat(undefined, {
        ...options,
        style: "currency",
        currency,
        currencyDisplay: "narrowSymbol",
      });
    } catch {
      // fall back to a plain number when the currency isn't a currency code
      this.formatter = new Intl.NumberFormat(undefined, options);
    }

    // handle the first refresh call
    this.refresh();
  }

  // dispose of the ticker
  dispose() {
    // hide and dispose the status bar item
    this.item.hide();
    this.item.dispose();
  }

  // refresh the ticker
  refresh() {
    (async () => {
      try {
        // get the service URL for the period, defaulting to the last 24 hours
        const url = (urls[this.period] || urls["24HOUR"]) + this.pair;

        // call the service, failing on an error status, and parse the response
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(
            `Request failed with status ${response.status}: ${url}`,
          );
        }
        const object = (await response.json()) as Statistics;

        // get the required values
        const price: string = this.format(object.lastPrice);
        const open: string = this.format(object.openPrice);
        const high: string = this.format(object.highPrice);
        const low: string = this.format(object.lowPrice);
        const percent: number = parseFloat(object.priceChangePercent);
        const change: string = this.format(object.priceChange);

        // set the status bar item text using the template
        this.item.text = this.template
          .replace("{symbol}", this.symbol)
          .replace("{price}", price)
          .replace("{open}", open)
          .replace("{high}", high)
          .replace("{low}", low)
          .replace("{change}", change)
          .replace(
            "{percent}",
            `${percent >= 0 ? "+" : ""}${percent.toFixed(2)}%`,
          );

        // set the status bar item colour based on the percent change
        this.item.color = percent < 0 ? this.lowerColor : this.higherColor;

        // make sure the status bar item is visible
        this.item.show();
      } catch (error) {
        // log the error and hide the status bar item
        console.log(error.message);
        this.item.hide();
      }
    })();
  }

  // format a price in the ticker's currency
  format(value: string): string {
    return this.formatter.format(parseFloat(value));
  }
}

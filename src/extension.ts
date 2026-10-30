// Copyright (c) Robert Calvert. Licensed under the MIT license.
// See LICENSE file in the project root for full license information.

import * as vscode from "vscode";
import { type Configuration, Ticker } from "./ticker";

// the tickers array
let tickers: Array<Ticker>;

// the refresh interval
let interval: NodeJS.Timeout | undefined;

// the minimum refresh interval in seconds
const minimumInterval = 10;

// this method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
  // construct the extension
  construct();

  // construct the extension again if its configuration changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration("cc-prices")) {
        construct();
      }
    }),
  );
}

// construct the extension
function construct() {
  // clear the interval if we already have one
  if (interval !== undefined) {
    clearInterval(interval);
  }

  // dispose of the tickers if we already have an array
  if (tickers !== undefined) {
    tickers.forEach((ticker) => {
      ticker.dispose();
    });
  }

  // create a new ticker array
  tickers = [] as Ticker[];

  // get the ticker definitions from the configuration
  const configuration = vscode.workspace
    .getConfiguration()
    .get("cc-prices") as Configuration;
  const definitions = configuration.tickers;

  // create and add the tickers to the array
  definitions.forEach((definition, i) => {
    tickers.push(new Ticker(definition, definitions.length - i));
  });

  // create the interval and call refresh every x seconds, but no more often than the minimum
  const seconds = Math.max(
    Number(configuration.interval) || 0,
    minimumInterval,
  );
  interval = setInterval(() => refresh(configuration), seconds * 1000);
}

// refresh the tickers
function refresh(configuration: Configuration) {
  // exit early when refreshing is not required
  if (configuration.onlyRefreshWhenFocused && !vscode.window.state.focused) {
    return;
  }

  // iterate over the tickers and refresh
  tickers.forEach((ticker) => {
    ticker.refresh();
  });
}

// this method is called when your extension is deactivated
export function deactivate() {
  // dispose of the tickers
  tickers.forEach((ticker) => {
    ticker.dispose();
  });
}

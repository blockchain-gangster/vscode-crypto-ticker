# Change Log

All notable changes to the "cc-prices" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2026-10-31

### Changed

- Prices now come from Binance's public market data, which needs no API key
- The default currency is now USDT, and a currency of USD is treated as USDT
- The HOUR period is now the last hour rather than since the hour began
- The extension now starts once vscode has finished starting up, rather than delaying startup
- Renamed to cc-prices, so the settings now begin with `cc-prices.` instead of `crypto-ticker.`

### Removed

- The `apiKey` setting and the ticker `exchange` property

### Fixed

- Unrelated settings changes no longer trigger a refresh of every ticker
- The refresh interval can no longer be set below 10 seconds

## [1.3.0] - 2022-02-19

### Added

- Support for Trusted Workspaces
- A new setting to limit refreshing to only when vscode has focus

### Change

- Updated the dependencies
- The default exchange is now implicitly defined by the API

## [1.2.0] - 2020-02-04

### Added

- Support for [cryptocompare.com](https://min-api.cryptocompare.com/documentation) API keys

## [1.1.0] - 2019-08-28

### Changed

- Positive percent gains are now prefixed with a plus sign

## [1.0.0] - 2019-08-22

- Initial release

var UIconfig = require('../vue/dist/UIconfig');
var rootCfg = require('../../config');

var config = {};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                          GENERAL SETTINGS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

config.silent = false;
config.debug = true;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                       CONFIGURING TRADING ADVICE
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

config.tradingAdvisor = {};

config.candleWriter = {
  enabled: false,
};

config.backtestResultExporter = {
  enabled: false,
  writeToDisk: false,
  data: {
    stratUpdates: false,
    roundtrips: true,
    stratCandles: true,
    trades: true,
  },
};

config.childToParent = {
  enabled: false,
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                       CONFIGURING ADAPTER
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// configurable in the UIconfig
config.adapter = UIconfig.adapter;

config.sqlite = {
  path: 'plugins/sqlite',
  version: 0.1,
  dataDirectory: 'history',
  journalMode: require('../isWindows.js') ? 'PERSIST' : 'WAL',
  dependencies: [
    {
      module: 'sqlite3',
      version: '5.1.7',
    },
  ],
};

// Postgres adapter example config (please note: requires postgres >= 9.5):
config.postgresql = {
  path: 'plugins/postgresql',
  version: 0.1,
  connectionString: 'postgres://user:pass@localhost:5432', // if default port
  database: null, // if set, we'll put all tables into a single database.
  schema: 'public',
  dependencies: [
    {
      module: 'pg',
      version: '7.4.3',
    },
  ],
};

// Mongodb adapter, requires mongodb >= 3.3 (no version earlier tested)
config.mongodb = {
  path: 'plugins/mongodb',
  version: 0.1,
  connectionString: 'mongodb://mongodb/gekko', // connection to mongodb server
  dependencies: [
    {
      module: 'mongojs',
      version: '2.4.0',
    },
  ],
};

config.adviceWriter = {
  enabled: false,
  muteSoft: true,
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                       CONFIGURING BACKTESTING
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Note that these settings are only used in backtesting mode, see here:
// @link: https://github.com/askmike/gekko/blob/stable/docs/Backtesting.md

config.backtest = {
  daterange: 'scan',
  batchSize: 50,
};

config.importer = {
  daterange: {
    // NOTE: these dates are in UTC
    from: '2016-06-01 12:00:00',
  },
};

/**
 * PPO indicator & momentum indicator: RSI, or TSI, or UO) settings required to support
 * backtesting 'varPPO' strategy via the UI as these settings are not provided by the UI
 *
 * Inherit root config but allow override here to target backtesting only
 *
 * 'varPPO' strategy uses one of the momentum indicators but adjusts the thresholds
 * when PPO is bullish or bearish
 */

function isNonEmptyObject(thing) {
  return (
    thing != null &&
    typeof thing === 'object' &&
    !Array.isArray(thing) &&
    Object.keys(thing)
  );
}

if (isNonEmptyObject(rootCfg)) {
  if (isNonEmptyObject(rootCfg.PPO)) config.PPO = rootCfg.PPO;
  if (isNonEmptyObject(rootCfg.RSI)) config.RSI = rootCfg.RSI;
  if (isNonEmptyObject(rootCfg.TSI)) config.TSI = rootCfg.TSI;
  if (isNonEmptyObject(rootCfg.UO)) config.UO = rootCfg.UO;
}

// PPO settings:
config.PPO = {
  // EMA weight (α)
  // the higher the weight, the more smooth (and delayed) the line
  short: 12,
  long: 26,
  signal: 9,
  // the difference between the EMAs (to act as triggers)
  thresholds: {
    down: -0.025,
    up: 0.025,
    // How many candle intervals should a trend persist
    // before we consider it real?
    persistence: 2,
  },
};

// RSI settings:
config.RSI = {
  interval: 14,
  thresholds: {
    low: 30,
    high: 70,
    // How many candle intervals should a trend persist
    // before we consider it real?
    persistence: 1,
  },
};

// TSI settings:
config.TSI = {
  short: 13,
  long: 25,
  thresholds: {
    low: -25,
    high: 25,
    // How many candle intervals should a trend persist
    // before we consider it real?
    persistence: 1,
  },
};

// Ultimate Oscillator Settings
config.UO = {
  first: {
    weight: 4,
    period: 7,
  },
  second: {
    weight: 2,
    period: 14,
  },
  third: {
    weight: 1,
    period: 28,
  },
  thresholds: {
    low: 30,
    high: 70,
    // How many candle intervals should a trend persist
    // before we consider it real?
    persistence: 1,
  },
};

module.exports = config;

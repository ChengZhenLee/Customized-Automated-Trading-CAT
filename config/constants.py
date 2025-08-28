DIVIDER1 = '/'
DIVIDER2 = '-'
STRATEGY_PREFIX = "strat"
SIGNAL_PREFIX = "sig"

DATA_SETTINGS_FILE = "config/data_settings.json"
KEYS_FILE = "config/keys.json"
DATA_CSV = "data/data.csv"

TRADER_SETTINGS_FILE = "config/trader_settings.json"
SIGNALS_SETTINGS_FILE = "config/signals.json"
STRATEGIES_SETTINGS_FILE = "config/strategies.json"

BT_DATA_FORMAT = {
    "dtformat":("%Y-%m-%d %H:%M:%S%z"),
    "datetime":1,
    "open":2,
    "high":3,
    "low":4,
    "close":5,
    "openinterest":-1
}

DATAFRAME_FORMAT = ["timestamp", "open", "high", "low", "close", "volume"]
DATAFRAME_RENAME = {"timestamp": "datetime"}

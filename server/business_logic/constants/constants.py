DIVIDER1 = '/'
DIVIDER2 = '-'
STRATEGY_PREFIX = "strat"
SIGNAL_PREFIX = "sig"

KEYS_FILE = "keys.json"

DATA_CSV = "data.csv"

TRADER_SETTINGS_FILE = "trader_settings.json"
DATA_SETTINGS_FILE = "data_settings.json"
SIGNALS_SETTINGS_FILE = "signals.json"
STRATEGIES_SETTINGS_FILE = "strategies.json"

LOG_FILE = "results.txt"

PLOT_FILE = "plot.png"

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

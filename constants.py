DIVIDER = '/'

DATA_SETTINGS_FILE = "json/data.json"
KEYS_FILE = "json/keys.json"
DATA_CSV = "data.csv"

TRADER_SETTINGS_FILE = "json/trader_settings.json"
SIGNALS_SETTINGS_FILE = "json/signals.json"
STRATEGIES_SETTINGS_FILE = "json/strategies.json"

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

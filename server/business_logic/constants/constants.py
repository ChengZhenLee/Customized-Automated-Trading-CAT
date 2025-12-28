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


# Ensure that KEYS_FILE file exists and is populated from the .env
import os
import json
from dotenv import load_dotenv

load_dotenv()

def ensure_keys_file():
    file_path = os.path.join(os.getcwd(), KEYS_FILE)
    alpaca_api_key = os.getenv("ALPACA_API_KEY")
    alpaca_secret_key = os.getenv("ALPACA_SECRET_KEY")

    if alpaca_api_key and alpaca_secret_key:
        alpaca_keys = {
            "ALPACA_API_KEY": alpaca_api_key,
            "ALPACA_SECRET_KEY": alpaca_secret_key,
        }

        try:
            with open(file_path, 'w') as outFile:
                json.dump(alpaca_keys, outFile, indent=4)
        except Exception as e:
            print(f"Warning: Could not write keys.json: {e}")
        
    return file_path

ensure_keys_file()
from constants import *
from utilities.parser import *
from utilities.alpaca_api_handler import AlpacaAPIHandler


class SettingsLoader():
    def load_all_settings():
        return {
            "data_generator_settings": {
                "data_settings": DataSettingsParser.parse_data_settings_from_file(DATA_SETTINGS_FILE),
                "alpaca_keys": AlpacaAPIHandler.parse_alpaca_keys_from_file(KEYS_FILE)
            },

            "backtester_settings":{
                "signals": SignalParser.parse_signal_file(SIGNALS_SETTINGS_FILE),
                "strategies": StrategyParser.parse_strategies_from_file(STRATEGIES_SETTINGS_FILE),
                "trader_settings": TraderSettingsParser.parse_settings_from_file(TRADER_SETTINGS_FILE),
                "data_csv": DATA_CSV,
                "bt_data_format": BT_DATA_FORMAT,
            }
        }
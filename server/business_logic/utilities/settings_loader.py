from datetime import datetime
from business_logic.constants.constants import BT_DATA_FORMAT
from business_logic.utilities.parser import *
from business_logic.utilities.alpaca_api_handler import AlpacaAPIHandler
from business_logic.utilities.log_and_message import LoggerLoader


class SettingsLoader():
    def load_all_settings(paths):
        return {
            "data_generator_settings": {
                "data_settings": DataSettingsParser.parse_data_settings_from_file(paths["data_settings"]),
                "alpaca_keys": AlpacaAPIHandler.parse_alpaca_keys_from_file(paths["keys"])
            },

            "backtester_settings":{
                "signals": SignalParser.parse_signal_file(paths["signals"]),
                "strategies": StrategyParser.parse_strategies_from_file(paths["strategies"]),
                "trader_settings": TraderSettingsParser.parse_settings_from_file(paths["trader_settings"]),
                "data_csv": paths["data"],
                "bt_data_format": BT_DATA_FORMAT,
                "logger": LoggerLoader.setup_logger(paths["log"]),
                "plot_file": paths["plot"]
            }
        }
    
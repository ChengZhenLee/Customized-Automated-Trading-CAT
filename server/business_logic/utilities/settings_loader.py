from datetime import datetime
from business_logic.config.constants import *
from business_logic.utilities.parser import *
from business_logic.utilities.alpaca_api_handler import AlpacaAPIHandler
from business_logic.utilities.log_and_message import LoggerLoader
from business_logic.utilities.plot import Plot


class SettingsLoader():
    def load_all_settings():
        timestamp = SettingsLoader._get_timestamp()

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
                "logger": LoggerLoader.setup_logger(timestamp),
                "plot_file": Plot.get_plot_filename(timestamp)
            }
        }
    
    def _get_timestamp():
        timestamp = datetime.now().strftime(BT_DATA_FORMAT["dtformat"])
        timestamp = timestamp.replace(" ", "-")
        timestamp = timestamp.replace(":", "-")

        return timestamp
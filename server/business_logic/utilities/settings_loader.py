from datetime import datetime
from business_logic.constants.constants import *
from business_logic.utilities.parser import *
from business_logic.utilities.alpaca_api_handler import AlpacaAPIHandler
from business_logic.utilities.log_and_message import LoggerLoader
from business_logic.utilities.dirs_and_files import DirsFiles


class SettingsLoader():
    def load_all_settings(task_dir):
        timestamp = SettingsLoader._get_timestamp()
        paths = DirsFiles.build_paths(task_dir, timestamp)

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
    
    def _get_timestamp():
        timestamp = datetime.now().strftime(BT_DATA_FORMAT["dtformat"])
        timestamp = timestamp.replace(" ", "-")
        timestamp = timestamp.replace(":", "-")

        return timestamp
    
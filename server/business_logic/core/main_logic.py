from core.backtester import Backtester
from utilities.data_generator import DataGenerator
import os
from utilities.settings_loader import SettingsLoader

def main_logic():
    settings = SettingsLoader.load_all_settings()

    data_generator_settings = settings["data_generator_settings"]
    backtester_settings = settings["backtester_settings"]

    if not os.path.exists(backtester_settings["data_csv"]):
        DataGenerator.generate_data_csv(csv_filename=backtester_settings["data_csv"], **data_generator_settings)

    backtester = Backtester(**backtester_settings)

    result = backtester.run_backtest()

if __name__ == "__main__":
    main_logic()


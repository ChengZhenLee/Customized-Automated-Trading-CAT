from business_logic.core.backtester import Backtester
from business_logic.utilities.data_generator import DataGenerator
from business_logic.utilities.settings_loader import SettingsLoader
import os
import uuid

class MainLogic():
    def run(task_dir):
        # Load the settings from this task_dir
        settings = SettingsLoader.load_all_settings(task_dir)

        data_generator_settings = settings["data_generator_settings"]
        backtester_settings = settings["backtester_settings"]

        if not os.path.exists(backtester_settings["data_csv"]):
            DataGenerator.generate_data_csv(csv_filename=backtester_settings["data_csv"], **data_generator_settings)

        backtester = Backtester(**backtester_settings)

        result = backtester.run_backtest()
        
if __name__ == "__main__":
    MainLogic.run("backtest_runs/test")


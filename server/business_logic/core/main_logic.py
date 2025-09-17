from datetime import datetime
import os
import uuid
from business_logic.core.backtester import Backtester
from business_logic.utilities.data_generator import DataGenerator
from business_logic.utilities.settings_loader import SettingsLoader
from business_logic.utilities.dirs_and_files import DirsFiles
from business_logic.constants.constants import BT_DATA_FORMAT

class MainLogic():
    def run(task_dir):
        # Build the directory and paths used to store all data
        paths = DirsFiles.build_paths(task_dir)

        # Load the settings from these paths
        settings = SettingsLoader.load_all_settings(paths)

        data_generator_settings = settings["data_generator_settings"]
        backtester_settings = settings["backtester_settings"]

        if not os.path.exists(backtester_settings["data_csv"]):
            DataGenerator.generate_data_csv(csv_filename=backtester_settings["data_csv"], **data_generator_settings)
            
        # Setup and run the backtester
        backtester = Backtester(**backtester_settings)

        backtester.run_backtest()
        
        return paths


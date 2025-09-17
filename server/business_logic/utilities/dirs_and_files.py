import os
from business_logic.constants.constants import *

class DirsFiles():
    def build_paths(task_dir):
        paths = {}
        
        data_dir = DirsFiles.create_dir(task_dir, DATA_DIR)
        log_dir = DirsFiles.create_dir(task_dir, LOG_DIR)
        plot_dir = DirsFiles.create_dir(task_dir, PLOT_DIR)
        
        paths["data_settings"] = DirsFiles.make_path(task_dir, DATA_SETTINGS_FILE)
        paths["keys"] = KEYS_FILE
        paths["signals"] = DirsFiles.make_path(task_dir, SIGNALS_SETTINGS_FILE)
        paths["strategies"] = DirsFiles.make_path(task_dir, STRATEGIES_SETTINGS_FILE)
        paths["trader_settings"] = DirsFiles.make_path(task_dir, TRADER_SETTINGS_FILE)
        paths["data"] = DirsFiles.make_path(data_dir, DATA_CSV)
        paths["log"] = DirsFiles.make_path(log_dir, LOG_FILE)
        paths["plot"] = DirsFiles.make_path(plot_dir, PLOT_FILE)
        
        return paths
    
    def make_path(directory, name):
        return os.path.join(directory, name)
    
    def create_dir(task_dir, directory):
        new_dir = os.path.join(task_dir, directory)
        os.makedirs(new_dir, exist_ok=True)
        return new_dir
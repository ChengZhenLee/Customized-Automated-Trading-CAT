import os
from backend.constants import *

class DirsFiles():
    def create_task_dir(task_id):
        task_dir = os.path.join(RUNS_DIR, task_id)
        os.makedirs(task_dir, exist_ok=True)
        return task_dir
    
    def create_abs_path(project_root, name):
        return os.path.join(project_root, name)
        
    def build_paths(task_dir):
        paths = {}
        paths["trader_settings"] = os.path.join(task_dir, TRADER_SETTINGS_FILE)
        paths["data_settings"] = os.path.join(task_dir, DATA_SETTINGS_FILE)
        paths["signals"] = os.path.join(task_dir, SIGNALS_FILE)
        paths["strategies"] = os.path.join(task_dir, STRATEGIES_FILE)
        
        return paths
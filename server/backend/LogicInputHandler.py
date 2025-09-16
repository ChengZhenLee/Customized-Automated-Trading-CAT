from backend.constants import (LOGIC_CONFIG_FOLDER, LOGIC_TRADER_SETTINGS, LOGIC_DATA_SETTINGS,
                        LOGIC_SIGNALS, LOGIC_STRATEGIES)
import json
import os

class LogicInputHandler():
    def input_to_logic(config):
        paths = LogicInputHandler._build_paths()
        
        for key in config.keys():
            LogicInputHandler._write_settings_to_file(config[key], paths[key])
        
        
    def _build_paths():
        paths = {}
        paths["trader_settings"] = os.path.join(LOGIC_CONFIG_FOLDER, LOGIC_TRADER_SETTINGS)
        paths["data_settings"] = os.path.join(LOGIC_CONFIG_FOLDER, LOGIC_DATA_SETTINGS)
        paths["signals"] = os.path.join(LOGIC_CONFIG_FOLDER, LOGIC_SIGNALS)
        paths["strategies"] = os.path.join(LOGIC_CONFIG_FOLDER, LOGIC_STRATEGIES)
        
        return paths
    
    def _write_settings_to_file(settings, file_name):
        input = {}
        
        for key in settings.keys():
            input[key.upper()] = settings[key]
            
        with open(file_name, 'w') as file:
            json.dump(input, file, indent=4)
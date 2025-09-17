import json

class LogicInputHandler():
    def input_to_logic(paths, config):
        for key in config.keys():
            LogicInputHandler._write_settings_to_file(config[key], paths[key])
    
    def _write_settings_to_file(settings, file_name):
        input = {}
        
        for key in settings.keys():
            input[key.upper()] = settings[key]
            
        with open(file_name, 'w') as file:
            json.dump(input, file, indent=4)
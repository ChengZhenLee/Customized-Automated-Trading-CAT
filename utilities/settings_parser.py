import json

class SettingsParser():
    def parse_settings_from_file(filename):
        try:
            with open(filename, "r") as inFile:
                config = json.load(inFile)
        except FileNotFoundError as e:
            print("File not found error: {}".format(e))
        
        return SettingsParser.parse_settings_config(config)
    
    def parse_settings_config(config):
        settings = {}

        settings["starting_cash"] = config["STARTING_CASH"]
        settings["commission"] = config["COMMISSION"]
        settings["optimize"] = config["OPTIMIZE"]
        settings["plot"] = config["PLOT"]
        settings["size"] = config["SIZE"]

        return settings

import json
from strategies import STRATEGY_MAP
from utilities.validator import Validator

class StrategySelector():
    def select_strategy_from_file(filename):
        try:
            with open(filename, "r") as strategiesFile:
                config = json.load(strategiesFile)
        except FileNotFoundError as e:
            print("File not found error: {}".format(e))
        
        return StrategySelector.select_strategy_from_config(config)
    
    def select_strategy_from_config(config):
        strategy_name = config["STRATEGY_NAME"]

        Validator.validate_strategy(strategy_name)

        return STRATEGY_MAP[strategy_name]



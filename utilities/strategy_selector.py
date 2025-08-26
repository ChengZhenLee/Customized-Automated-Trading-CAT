import json
from strategies import STRATEGY_MAP
from utilities.validator import Validator

class StrategySelector():
    def select_strategies_from_file(filename):
        try:
            with open(filename, "r") as strategiesFile:
                config = json.load(strategiesFile)
        except FileNotFoundError as e:
            print("File not found error: {}".format(e))
        
        return StrategySelector.select_strategies_from_config(config)
    
    def select_strategies_from_config(config):
        selected_strategies = {"selected_strategies": []}
        strategy_names = config["STRATEGY_NAME"]

        Validator.validate_strategy(strategy_names)

        for strategy_name in strategy_names:
            selected_strategies["selected_strategies"].append(STRATEGY_MAP[strategy_name])

        return selected_strategies




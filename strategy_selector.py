import json
from dynamic_strategy import *


strategy_map = {
    "sma": SMAStrategy,
}


def validate_params(strategy_name, strategy_params):
    strategy_class = strategy_map[strategy_name]

    if not strategy_class:
        raise ValueError("Strategy {} not found".format(strategy_name))
    
    required_params = set(strategy_class.required_params)
    provided_params = set(strategy_params.keys())

    if not required_params.issubset(provided_params):
        missing_params = required_params - provided_params
        raise ValueError("Missing required parameters for {}: {}".format(strategy_name, ", ".join(missing_params)))
    
    return True


try:
    with open("strategy.json", "r") as inFile:
        strategy = json.load(inFile)
except FileNotFoundError as e:
    print("File not found error: {}".format(e))

strategy_name = strategy["name"]
strategy_params = strategy["params"]

try:
    validate_params(strategy_name, strategy_params)
    strategy_class = strategy_map[strategy_name]
except ValueError as e:
    print("Validation error: {}".format(e))
import json
from strategy_map import strategy_map


def validate_params(strategy_name, strategy_params, optimize_params):
    strategy_class = strategy_map[strategy_name]

    if not strategy_class:
        raise ValueError("Strategy {} not found".format(strategy_name))
    
    required_params = set(strategy_class.required_params)
    provided_params = set(strategy_params.keys())
    provided_optimize_params = set(optimize_params.keys())

    if not required_params.issubset(provided_params):
        missing_params = required_params - provided_params
        raise ValueError("Missing required parameters for {}: {}".format(strategy_name, ", ".join(missing_params)))
    elif not required_params.issubset(provided_optimize_params):
        missing_params = required_params - provided_optimize_params
        raise ValueError("Missing required parameters for optimization for {}: {}".format(strategy_name, ", ".join(missing_params)))
    
    return True


try:
    with open("json/strategy.json", "r") as strategyFile:
        strategy = json.load(strategyFile)
except FileNotFoundError as e:
    print("File not found error: {}".format(e))

strategy_name = strategy["name"]
strategy_params = strategy["params"]
optimize_params = strategy["optimize_params"]

try:
    validate_params(strategy_name, strategy_params, optimize_params)
    strategy_class = strategy_map[strategy_name]
except ValueError as e:
    print("Validation error: {}".format(e))


# TODO: ability to have multiple name in strategy["name"]. for each name, validate the strategy class and its parameters
# for multiple strategies, combine together into a larger strategy. change the other strategies to only output signals.
# this larger strategy (consisting of one or more strategies), will perform the actual buy and sell
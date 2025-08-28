from trading_logic.signals import SIGNAL_MAP
from trading_logic.strategies import STRATEGY_MAP

class Validator():
    def validate_signal_params(signal_names, all_signal_params, all_signal_optimize_params):
        for signal_name in signal_names:
            signal_class = SIGNAL_MAP[signal_name]
            if not signal_class:
                raise ValueError("Signal {} not found".format(signal_name))
            
            required_params = set(getattr(signal_class, "required_params", []))
            
            given_params = set(all_signal_params.get(signal_name, {}).keys())
            if not required_params.issubset(given_params):
                missing_params = required_params - given_params
                raise ValueError("Signal {} missing parameters {}".format(signal_name, missing_params))
            
            given_optimize_params = set(all_signal_optimize_params.get(signal_name, {}).keys())
            if not required_params.issubset(given_optimize_params):
                missing_params = required_params - given_optimize_params
                raise ValueError("Signal {} missing parameters {} for optimization".format(signal_name, missing_params))
            
            
            
    def validate_strategy_params(strategy_names, all_strategy_params, all_strategy_optimize_params):
        for strategy_name in strategy_names:
            strategy_class = STRATEGY_MAP[strategy_name]
            if not strategy_class:
                raise ValueError("Strategy {} not found".format(strategy_name))
            
            required_params = set(getattr(strategy_class, "required_params", []))

            given_params = set(all_strategy_params.get(strategy_name, {}).keys())
            if not required_params.issubset(given_params):
                missing_params = required_params - given_params
                raise ValueError("Strategy {} missing parameters {}".format(strategy_name, missing_params))
            
            given_optimize_params = set(all_strategy_optimize_params.get(strategy_name, {}).keys())
            if not required_params.issubset(given_optimize_params):
                missing_params = required_params - given_optimize_params
                raise ValueError("Strategy {} missing parameters {} for optimization".format(strategy_name, missing_params))
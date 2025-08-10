from signals import SIGNAL_MAP
from strategies import STRATEGY_MAP

class Validator():
    def validate_signal_params(signal_names, all_signal_params, all_signal_optimize_params):
        for signal_name in signal_names:
            signal_class = SIGNAL_MAP[signal_name]
            if not signal_class:
                raise ValueError("Signal {} not found".format(signal_name))

            given_params = set(all_signal_params[signal_name].keys())
            given_optimize_params = set(all_signal_optimize_params[signal_name].keys())
            required_params = set(signal_class.required_params)
            if not given_params.issubset(required_params):
                missing_params = required_params - given_params
                raise ValueError("Signal {} missing parameters {}".format(signal_name, missing_params))
            elif not given_optimize_params.issubset(required_params):
                missing_params = required_params - given_params
                raise ValueError("Signal {} missing parameters {} for optimization".format(signal_name, missing_params))
        
    def validate_strategy(strategy_name):
        if strategy_name not in STRATEGY_MAP.keys():
            raise ValueError("Strategy {} not found".format(strategy_name))
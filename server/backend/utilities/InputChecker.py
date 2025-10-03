from backend.utilities.AlpacaApiHandler import AlpacaApiHandler
from backend.constants.constants import *
from backend.utilities.ErrorMessages import ErrorMessages as em

class InputChecker():
    def check_inputs(configs):
        trader_settings = configs.get("trader_settings")
        data_settings = configs.get("data_settings")
        signals = configs.get("signals")
        strategies = configs.get("strategies")
        
        # Check if all data are present
        required_keys = {"trader_settings", "data_settings", "signals", "strategies"}
        present_keys = {key for key in required_keys if configs.get(key) is not None}
        
        missing = required_keys - present_keys
        if missing:
            return em.missing_keys(list(missing))
        
        # Check if the trader_settings are all valid
        is_valid, msg = InputChecker.check_trader_settings(trader_settings)
        if not is_valid:
            return msg
        
        # Check if the data_settings are valid
        is_valid, msg = InputChecker.check_data_settings(data_settings)
        
        optimize = trader_settings["optimize"]
        
        # Check if the signal inputs are valid
        is_valid, msg = InputChecker.check_signals(signals, optimize)
        if not is_valid:
            return msg
        
        # Check if the strategy inputs are valid
        is_valid, msg = InputChecker.check_strategies(strategies, optimize)
        if not is_valid:
            return msg
        
        return None
            
    def check_trader_settings(trader_settings):
        # Check if all data are present
        input_settings = set(trader_settings.keys())
        master_settings = set(TRADER_SETTINGS_STRUCTURE.keys())
        if not input_settings == master_settings:
            return False, em.keys_mismatch(input_settings, master_settings)

        # Check each param
        for param, value in trader_settings.items():
            expected_type = TRADER_SETTINGS_STRUCTURE.get(param)

            # Check for numeric types, as ints are compatible with floats
            if expected_type is float:
                if not InputChecker._is_acceptable_type(value, (int, float)):
                    return False, em.type_mismatch(param, "int or float", type(value).__name__)
            else:
                if not InputChecker._is_acceptable_type(value, expected_type):
                    return False, em.type_mismatch(param, expected_type.__name__, type(value).__name__)

            # Check if they are only positive numbers
            if (expected_type is int or expected_type is float) and value < 0:
                return False, em.invalid_value(param, "value must be non-negative")
            
        return True, None

    def check_data_settings(data_settings):
        # Check if all data are present
        input_keys = set(data_settings.keys())
        master_keys = set(DATA_SETTINGS_STRUCTURE.keys())
        if not input_keys == master_keys:
            return False, em.keys_mismatch(input_keys, master_keys)
        
        for param, value in data_settings.items():
            expected_type = DATA_SETTINGS_STRUCTURE.get(param)
            
            # If the value is a dict
            if InputChecker._is_acceptable_type(expected_type, dict):
                if not InputChecker._is_acceptable_type(value, dict):
                    return False, em.type_mismatch(param, dict.__name__, type(value).__name__)

                # Check if the keys match
                input_nested_keys = set(value.keys())
                master_nested_keys = set(expected_type.keys())
                if not input_nested_keys == master_nested_keys:
                    return False, em.keys_mismatch(input_nested_keys, master_nested_keys)
                
                # Check the datatype for each value in the dict
                for nested_param, nested_expected_type in expected_type.items():
                    nested_value = value.get(nested_param)
                    if not InputChecker._is_acceptable_type(nested_value, nested_expected_type):
                        return False, em.type_mismatch(nested_param, nested_expected_type.__name__, type(nested_value).__name__)
            
            else:
                if not InputChecker._is_acceptable_type(value, expected_type):
                    return False, em.type_mismatch(param, expected_type.__name__, type(value).__name__)

        # If the structure and datatypes are correct, perform the API specific check
        return AlpacaApiHandler.check_alpaca_data_settings(data_settings)

    def check_signals(signals, optimize):
        signal_names = signals.get("signal_names")
        all_signal_params_key = "all_signal_optimize_params" if optimize else "all_signal_params"
        all_signal_params = signals.get(all_signal_params_key)

        # Check if all the data are present
        if signal_names is None:
            return False, em.missing_keys(["signal_names"])

        if all_signal_params is None:
            return False, em.missing_keys([all_signal_params_key])

        # Check if the signal_names are valid
        input_signal_names = set(signal_names)
        master_signal_names = SIGNALS_STRUCTURE.get("signal_names", set())
        if not input_signal_names.issubset(master_signal_names):
            return False, em.invalid_value("signal_names", "Contains one or more unsupported signals")

        # Check if the given signal_names match the given all_signal_params
        input_all_signal_params = set(all_signal_params.keys())
        if not input_signal_names == input_all_signal_params:
            return False, em.keys_mismatch(input_signal_names, input_all_signal_params)

        # Fetch the master reference for all parameters
        master_params_ref = SIGNALS_STRUCTURE.get(all_signal_params_key)

        for signal_name, params in all_signal_params.items():
            # Get the specific schema for the specific signal
            signal_schema = master_params_ref.get(signal_name)

            # Check if it is a valid schema and all the parameters are present
            if not signal_schema:
                return False, em.invalid_value(signal_name, "This signal is not in the master reference")

            input_params = set(params.keys())
            master_params = set(signal_schema.keys())
            if not input_params == master_params:
                return False, em.keys_mismatch(input_params, master_params)

            # Check the data type for each parameter
            for param, value in params.items():
                expected_type = signal_schema.get(param)

                if InputChecker._is_acceptable_type(expected_type, list):
                    if not InputChecker._is_acceptable_type(value, list):
                        return False, em.type_mismatch(param, "list", type(value).__name__)
                    
                    for item in value:
                        if not InputChecker._is_acceptable_type(item, expected_type[0]):
                            return False, em.type_mismatch(f"item in {param}", expected_type[0].__name__, type(item).__name__)
                        
                else:
                    if not InputChecker._is_acceptable_type(value, expected_type):
                        return False, em.type_mismatch(param, expected_type.__name__, type(value).__name__)
        
        return True, None

    def check_strategies(strategies, optimize):
        strategy_names = strategies.get("strategy_names")
        all_strategy_params_key = "all_strategy_optimize_params" if optimize else "all_strategy_params"
        all_strategy_params = strategies.get(all_strategy_params_key)

        # Check if all the data are present
        if strategy_names is None:
            return False, em.missing_keys(["strategy_names"])
        
        if all_strategy_params is None:
            return False, em.missing_keys([all_strategy_params_key])

        # Check if the strategy_names are valid
        input_names = set(strategy_names)
        master_names = STRATEGIES_STRUCTURE.get("strategy_names")
        if not input_names.issubset(master_names):
            return False, em.invalid_value("strategy_names", "containing one or more unsupported strategies")

        # Fetch the master reference for strategy parameters
        master_params_ref = STRATEGIES_STRUCTURE.get(all_strategy_params_key)
        
        # Determine which strategies must be present in all_strategy_params
        required_strategies = set(master_params_ref.keys()).intersection(set(strategy_names))

        # Check if all_strategy_params contain these required strategies
        input_strategy_with_params = set(all_strategy_params.keys())
        if not required_strategies == set(all_strategy_params.keys()):
            return False, em.keys_mismatch(input_strategy_with_params, required_strategies)

        for strategy_name, params in all_strategy_params.items():
            # Fetch the schema for a specific strategy
            strategy_schema = master_params_ref.get(strategy_name)

            # Check if the schema exists and all the parameters are present
            if not strategy_schema:
                return False, em.invalid_value(strategy_name, "This strategy is not in the master reference")
            
            input_params = set(params.keys())
            master_params = set(strategy_schema.keys())
            if not input_params == master_params:
                return False, em.keys_mismatch(input_params, master_params)

            # Check if the data types match
            for param, value in params.items():
                expected_type = strategy_schema.get(param)

                # if the expected_type is a list, check the types in the list
                if InputChecker._is_acceptable_type(expected_type, list):
                    if not InputChecker._is_acceptable_type(value, list):
                        return False, em.type_mismatch(param, "list", type(value).__name__)
                    
                    for item in value:
                        if not InputChecker._is_acceptable_type(item, expected_type[0]):
                            return False, em.type_mismatch(f"item in {param}", expected_type[0].__name__, type(item).__name__)
                            
                else:
                    if not InputChecker._is_acceptable_type(value, expected_type):
                        return False, em.type_mismatch(param, expected_type.__name__, type(value).__name__)

        return True, None
    
    def _is_acceptable_type(value, expected_type):
        if expected_type is float:
            return isinstance(value, (int, float))
        
        elif expected_type is int:
            return isinstance(value, int)
        
        else:
            return isinstance(value, expected_type)
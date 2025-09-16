from business_logic.config.constants import DIVIDER1, DIVIDER2, STRATEGY_PREFIX, SIGNAL_PREFIX

class SignalParameterManager():
    def serialize_signals(signal_names, all_signal_params):
        signals = {}

        for signal_name in signal_names:
            for param, value in all_signal_params[signal_name].items():
                key = "{}{}{}".format(signal_name, DIVIDER1, param)
                signals[key] = value
            
        return signals

    def deserialize_signals(signals):
        signal_names = []
        all_signal_params = {}

        for key, value in signals.items():
            split_key = key.split(DIVIDER1)
            signal_name = split_key[0]
            param = split_key[1]

            if signal_name not in signal_names:
                signal_names.append(signal_name)

            if signal_name not in all_signal_params.keys():
                all_signal_params[signal_name] = {}

            all_signal_params[signal_name][param] = value

        return (signal_names, all_signal_params)


class StrategyParameterManager():
    def serialize_strategies(strategy_names, all_strategy_params):
        strategies = {}

        for strategy_name in strategy_names:
            if strategy_name not in all_strategy_params.keys():
                strategies[strategy_name] = "None"
                continue
            for param, value in all_strategy_params[strategy_name].items():
                key = "{}{}{}".format(strategy_name, DIVIDER1, param)
                strategies[key] = value

        return strategies

    def deserialize_strategies(strategies):
        strategy_names = []
        all_strategy_params = {}

        for key, value in strategies.items():
            split_key = key.split(DIVIDER1)
            strategy_name = split_key[0]

            if strategy_name not in strategy_names:
                strategy_names.append(strategy_name)

            if len(split_key) > 1:
                param = split_key[1]
                if strategy_name not in all_strategy_params.keys():
                    all_strategy_params[strategy_name] = {}
                all_strategy_params[strategy_name][param] = value
            else:
                if value == "None":
                    all_strategy_params[strategy_name] = {}

        return (strategy_names, all_strategy_params)
    

class BacktesterParameterManager():
    def serialize_backtester_parameters(strategy_params, signal_params):
        backtester_params = {}

        for key, value in strategy_params.items():
            backtester_params["{}{}{}".format(STRATEGY_PREFIX, DIVIDER2, key)] = value
        for key, value in signal_params.items():
            backtester_params["{}{}{}".format(SIGNAL_PREFIX, DIVIDER2, key)] = value

        return backtester_params
    
    def deserialize_backtester_parameters(backtester_params):
        strategy_params = {}
        signal_params = {}

        for key, value in backtester_params.items():
            split_key = key.split(DIVIDER2)
            prefix = split_key[0]
            param_key = split_key[1]

            if prefix == STRATEGY_PREFIX:
                strategy_params[param_key] = value
            elif prefix == SIGNAL_PREFIX:
                signal_params[param_key] = value

        return (strategy_params, signal_params)
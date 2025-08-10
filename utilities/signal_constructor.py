from constants import OPTIMIZED_SIGNAL_DIVIDER

class SignalConstructor():
    def construct_signals(signal_names, all_signal_params):
        signals = {}
        signals["signal_names"] = signal_names
        signals["all_signal_params"] = all_signal_params

        return signals

    def construct_signals_optimize(signal_names, all_signal_optimize_params):
        signals_optimize = {}

        for signal_name in signal_names:
            for param, value in all_signal_optimize_params[signal_name].items():
                key = "{}{}{}".format(signal_name, OPTIMIZED_SIGNAL_DIVIDER, param)
                signals_optimize[key] = value
        
        return signals_optimize


    def deconstruct_signals_optimize(signals_optimize):
        signals = {}
        signal_names = []
        all_signal_params = {}

        for key, value in signals_optimize.items():
            split_key = key.split(OPTIMIZED_SIGNAL_DIVIDER)
            signal_name = split_key[0]
            param = split_key[1]

            if signal_name not in signal_names:
                signal_names.append(signal_name)

            if signal_name not in all_signal_params.keys():
                all_signal_params[signal_name] = {}

            all_signal_params[signal_name][param] = value

        signals["signal_names"] = signal_names
        signals["all_signal_params"] = all_signal_params

        return signals
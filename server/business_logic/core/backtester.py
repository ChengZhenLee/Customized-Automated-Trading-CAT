import backtrader as bt
from utilities.parameter_manager import SignalParameterManager, StrategyParameterManager, BacktesterParameterManager
from trading_logic.strategies import CombinedStrategy

class Backtester():
    def __init__(self, signals, strategies, trader_settings, data_csv, bt_data_format, logger, plot_file):
        self._initialize_signals_strategies(signals, strategies)
        self._initialize_data(data_csv, bt_data_format)
        self._initialize_trader(trader_settings)
        self._include_logger_in_input(logger)
        self.plot_file = plot_file

    def _initialize_signals_strategies(self, signals, strategies):
        (signal_names, all_signal_params, all_signal_optimize_params) = signals
        (strategy_names, all_strategy_params, all_strategy_optimize_params) = strategies

        signals_single = SignalParameterManager.serialize_signals(signal_names, all_signal_params)
        signals_optimize = SignalParameterManager.serialize_signals(signal_names, all_signal_optimize_params)
        strategy_single = StrategyParameterManager.serialize_strategies(strategy_names, all_strategy_params)
        strategy_optimize = StrategyParameterManager.serialize_strategies(strategy_names, all_strategy_optimize_params)

        self.input_single = BacktesterParameterManager.serialize_backtester_parameters(strategy_single, signals_single)
        self.input_optimize = BacktesterParameterManager.serialize_backtester_parameters(strategy_optimize, signals_optimize)
    
    def _initialize_data(self, data_csv, data_csv_format):
        self.data = bt.feeds.GenericCSVData(
            dataname=data_csv,
            dtformat=data_csv_format["dtformat"],
            datetime=data_csv_format["datetime"],
            open=data_csv_format["open"],
            high=data_csv_format["high"],
            low=data_csv_format["low"],
            close=data_csv_format["close"],
            openinterest=data_csv_format["openinterest"]
        )
    
    def _initialize_trader(self, trader_settings):
        self.cerebro = bt.Cerebro()
        self.cerebro.broker.setcash(trader_settings["starting_cash"])
        self.cerebro.broker.setcommission(trader_settings["commission"])
        self.cerebro.addsizer(bt.sizers.FixedSize, stake=trader_settings["size"])

        self.cerebro.adddata(self.data)

        self.optimize = trader_settings["optimize"]
        self.plot = trader_settings["plot"]

    def _include_logger_in_input(self, logger):
        self.input_single["logger"] = logger
        self.input_optimize["logger"] = logger
    
    def run_backtest(self):
        if self.optimize:
            self.cerebro.optstrategy(CombinedStrategy, **(self.input_optimize))
        else:
            self.cerebro.addstrategy(CombinedStrategy, **(self.input_single))
        
        result = self.cerebro.run()

        self.plot_backtester()

        return result
    
    def plot_backtester(self):
        if self.plot and not self.optimize:
            plt_fig = self.cerebro.plot()[0][0]
            plt_fig.savefig(self.plot_file)

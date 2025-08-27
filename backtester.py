import backtrader as bt
from strategies import CombinedStrategy

class Backtester():
    def __init__(self, signals, strategies, trader_settings, data_csv, bt_data_format):
        self.initialize_signals_strategies(signals, strategies)
        self.initialize_data(data_csv, bt_data_format)
        self.initialize_trader(trader_settings)

    def initialize_signals_strategies(self, signals, strategies):
        (signals_single, signals_optimize) = signals
        self.input_single = {**strategies, **signals_single}
        self.input_optimize = {"selected_strategies": [strategies["selected_strategies"]], **signals_optimize}
    
    def initialize_data(self, data_csv, data_csv_format):
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
    
    def initialize_trader(self, trader_settings):
        self.cerebro = bt.Cerebro()
        self.cerebro.broker.setcash(trader_settings["starting_cash"])
        self.cerebro.broker.setcommission(trader_settings["commission"])
        self.cerebro.addsizer(bt.sizers.FixedSize, stake=trader_settings["size"])

        self.cerebro.adddata(self.data)

        self.optimize = trader_settings["optimize"]
        self.plot = trader_settings["plot"]
    
    def run_backtest(self):
        if self.optimize:
            self.cerebro.optstrategy(CombinedStrategy, **(self.input_optimize))
        else:
            self.cerebro.addstrategy(CombinedStrategy, **(self.input_single))

        self.plot_backtester()
        
        return self.cerebro.run()
    
    def plot_backtester(self):
        if self.plot and not self.optimize:
            self.cerebro.plot()
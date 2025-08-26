import backtrader as bt
from utilities.signal_parser import SignalParser
from utilities.strategy_selector import StrategySelector
from utilities.settings_parser import SettingsParser
from strategies import CombinedStrategy

#TODO: refactor using settings_parser and data.py file, then move all to a main file
settings = SettingsParser.parse_settings_from_file("json/trader_settings.json")

data = bt.feeds.GenericCSVData(
    dataname="data.csv",
    dtformat=("%Y-%m-%d %H:%M:%S%z"),
    datetime=1,
    open=2,
    high=3,
    low=4,
    close=5,
    openinterest=-1
)

(signals_single, signals_optimize) = SignalParser.parse_signal_file("json/signals.json")
selected_strategies = StrategySelector.select_strategies_from_file("json/strategies.json")
input_single = {**selected_strategies, **signals_single}
input_optimize = {"selected_strategies": [selected_strategies["selected_strategies"]], **signals_optimize}


if __name__ == "__main__":
    cerebro = bt.Cerebro()

    cerebro.broker.setcash(starting_cash)

    cerebro.broker.setcommission(commission=commission)
    
    cerebro.addsizer(bt.sizers.FixedSize, stake=size)

    cerebro.adddata(data)

    if optimize:
        cerebro.optstrategy(CombinedStrategy, **input_optimize)
    else:
        cerebro.addstrategy(CombinedStrategy, **input_single)
    
    results = cerebro.run()
    
    if plot and not optimize:
        cerebro.plot()

# TODO: refactor this file into classes and functions
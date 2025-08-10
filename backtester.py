import backtrader as bt
from utilities.signal_parser import SignalParser
from utilities.strategy_selector import StrategySelector
from strategies import *
import json

try:
    with open("json/trader_settings.json", "r") as inFile:
        settings = json.load(inFile)
except FileNotFoundError as e:
    print("File not found error: {}".format(e))

starting_cash = settings["STARTING_CASH"]
commission = settings["COMMISSION"]
optimize = settings["OPTIMIZE"]
plot = settings["PLOT"]
size = settings["SIZE"]

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

(signals, signals_optimize) = SignalParser.parse_signal_file("json/signals.json")
strategy = StrategySelector.select_strategy_from_file("json/strategies.json")


if __name__ == "__main__":
    cerebro = bt.Cerebro()

    cerebro.broker.setcash(starting_cash)

    cerebro.broker.setcommission(commission=commission)
    
    cerebro.addsizer(bt.sizers.FixedSize, stake=size)

    cerebro.adddata(data)

    if optimize:
        cerebro.optstrategy(DynamicStrategyOptimize, **signals_optimize)
    else:
        cerebro.addstrategy(strategy, **signals)
    
    results = cerebro.run()
    
    if plot and not optimize:
        cerebro.plot()


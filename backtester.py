import backtrader as bt
from signal_parser import signals, signals_optimize
from dynamic_strategy import DynamicStrategy, DynamicStrategyOptimize
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


if __name__ == "__main__":
    cerebro = bt.Cerebro()

    cerebro.broker.setcash(starting_cash)

    cerebro.broker.setcommission(commission=commission)
    
    cerebro.addsizer(bt.sizers.FixedSize, stake=size)

    cerebro.adddata(data)

    if optimize:
        cerebro.optstrategy(DynamicStrategyOptimize, **signals_optimize)
    else:
        cerebro.addstrategy(DynamicStrategy, **signals)
    
    results = cerebro.run()
    
    if plot:
        cerebro.plot()


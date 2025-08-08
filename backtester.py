import backtrader as bt
from strategy_selector import strategy_class, strategy_params, optimize_params
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
        cerebro.optstrategy(strategy_class, **optimize_params)
    else:
        cerebro.addstrategy(strategy_class, **strategy_params)
    
    results = cerebro.run()
    
    if plot:
        cerebro.plot()


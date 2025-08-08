import backtrader as bt
import datetime
from strategies import TestStrategy

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

    cerebro.adddata(data)

    strats = cerebro.optstrategy(TestStrategy, maperiod=range(10,30))

    cerebro.broker.setcash(1000000)

    cerebro.broker.setcommission(commission=0.001)

    cerebro.addsizer(bt.sizers.FixedSize, stake=10)

    print("Starting value {:.2f}".format(cerebro.broker.getvalue()))

    cerebro.run()

    print("End value {:.2f}".format(cerebro.broker.getvalue()))
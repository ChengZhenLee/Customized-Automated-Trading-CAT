import backtrader as bt

# Create a Stratey
class TestStrategy(bt.Strategy):

    params = (
        ("maperiod", 15),
        ("doprint", False),
    )

    def log(self, txt, dt=None, doprint=False):
        ''' Logging function for this strategy'''
        if doprint:
            dt = dt or self.datas[0].datetime.date(0)
            print('%s, %s' % (dt.isoformat(), txt))

    def __init__(self):
        self.dataclose = self.datas[0].close
        self.order = None
        self.sma = bt.indicators.SimpleMovingAverage(self.datas[0], period=self.params.maperiod)

    def notify_order(self, order):
        if order.status in [order.Submitted, order.Accepted]:
            return
        
        if order.status in [order.Completed]:
            if order.isbuy():
                self.log("BUY EXECUTED {:.2f}".format(self.dataclose[0]))
            if order.issell():
                self.log("SELL EXECUTED {:.2f}".format(self.dataclose[0]))
            
            self.bar_executed = len(self)
        
        elif order.status in [order.Canceled, order.Margin, order.Rejected]:
            self.log("Order Canceled/Margin/Rejected")
        
        self.order = None

    def notify_trade(self, trade):
        if not trade.isclosed:
            return
        
        self.log("OPERATION PROFIT, GROSS {:.2f}, NET {:.2f}".format(trade.pnl, trade.pnlcomm))

    def next(self):
        self.log("Close {:.2f}".format(self.dataclose[0]))

        if self.order:
            return

        if not self.position and self.dataclose[0] > self.sma[0]:
            self.log("BUY CREATE {:.2f}".format(self.dataclose[0]))
            self.order = self.buy()

        elif self.dataclose[0] < self.sma[0]:
            self.log("SELL CREATE {:.2f}".format(self.dataclose[0]))
            self.order = self.sell()

    def stop(self):
        if self.position:
            self.close()
        self.log("MA period {:.2f}, Ending Value: {:.2f}".format(self.params.maperiod, self.broker.getvalue()), doprint=True)
        

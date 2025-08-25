from signals import SIGNAL_MAP

class Logger():
    def log(txt, dt=None):
        if dt:
            print("{}: {}".format(dt.isoformat(), txt))
        else:
            print(txt)


class MessageCreater():
    def create_order_creation_message(price, mode):
        if mode == "buy":
            message = "📈 BUY CREATE: "
        elif mode == "sell":
            message = "📉 SELL CREATE: "
        message += "{:.2f}".format(price)
        
        return message
    
    def create_order_executed_message(price=None, mode=""):
        if mode == "buy":
            message = "🟢 BUY EXECUTED: "
        elif mode == "sell":
            message = "🔴 SELL EXECUTED: "
        else:
            return "❌Order Canceled/Margin/Rejected"
        
        message += "{:.2f}".format(price)
        return message
    
    def create_trade_result_message(pnl, pnlcomm):
        message = "💲 OPERATION PROFIT: "
        message += "GROSS {:.2f}, ".format(pnl)
        message += "NET {:.2f}".format(pnlcomm)

        return message

    def create_final_result_message(signals, final_value):
        message = ""
        for signal in signals:
            message += "=" * 30 + "\n"
            signal_name = [key for key, val in SIGNAL_MAP.items() if isinstance(signal, val)][0]
            message += "{}\n".format(signal_name)
            for param in signal.required_params:
                message += "{}: {:.2f}\n".format(param, getattr(signal.params, param))
            message += "=" *30 + "\n"
        message += "✨ Final Value: {:.2f}".format(final_value)

        return message
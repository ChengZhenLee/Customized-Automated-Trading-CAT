from alpaca.data.historical import StockHistoricalDataClient
from alpaca.data.requests import StockBarsRequest
from alpaca.data.timeframe import TimeFrame
from datetime import datetime
import json
import pandas as pd

with open("config.json", 'r') as inFile:
    config = json.load(inFile)

alpaca_api_key = config["ALPACA_API_KEY"]
alpaca_secret_key = config["ALPACA_SECRET_KEY"]
symbols_to_trade = config["SYMBOLS_TO_TRADE"]
start_time = config["START_TIME"]
end_time = config["END_TIME"]

client = StockHistoricalDataClient(alpaca_api_key, alpaca_secret_key)

request_params = StockBarsRequest(
    symbol_or_symbols="AAPL",
    timeframe=TimeFrame.Day,
    start=datetime(start_time["year"], start_time["month"], start_time["day"]),
    end=datetime(end_time["year"], end_time["month"], end_time["day"])
)

stock_bars = client.get_stock_bars(request_params)

# Convert bars to dataframe and process it
df = stock_bars.df
df.reset_index(inplace=True)
df = df[["timestamp", "open", "high", "low", "close", "volume"]]
df.rename(columns={"timestamp": "datetime"}, inplace=True)
df.to_csv("data.csv")
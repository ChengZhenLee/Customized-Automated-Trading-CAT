from alpaca.data.historical import StockHistoricalDataClient
from alpaca.data.requests import StockBarsRequest
from alpaca.data.timeframe import TimeFrame
from datetime import datetime
import json

#TODO: refactor and implement a main.file
# try:
#     with open("json/data.json", 'r') as dataFile:
#         data = json.load(dataFile)
# except FileNotFoundError as e:
#     print("File not found error: {}".format(e))

# symbols_to_trade = data["SYMBOLS_TO_TRADE"]
# timeframe = data["TIMEFRAME"]
# start_time = data["START_TIME"]
# end_time = data["END_TIME"]

# try:
#     with open("json/keys.json") as keysFile:
#         keys = json.load(keysFile)
# except FileNotFoundError as e:
#     print("File not found error: {}".format(e))

# alpaca_api_key = keys["ALPACA_API_KEY"]
# alpaca_secret_key = keys["ALPACA_SECRET_KEY"]

# client = StockHistoricalDataClient(alpaca_api_key, alpaca_secret_key)

# request_params = StockBarsRequest(
#     symbol_or_symbols=symbols_to_trade,
#     timeframe=getattr(TimeFrame, timeframe),
#     start=datetime(start_time["year"], start_time["month"], start_time["day"]),
#     end=datetime(end_time["year"], end_time["month"], end_time["day"])
# )

# stock_bars = client.get_stock_bars(request_params)

# Convert bars to dataframe and process it
# df = stock_bars.df
# df.reset_index(inplace=True)
# df = df[["timestamp", "open", "high", "low", "close", "volume"]]
# df.rename(columns={"timestamp": "datetime"}, inplace=True)
# df.to_csv("data.csv")

class DataSettingsParser():
    def parse_data_settings_from_file(filename):
        try:
            with open("json/data.json", 'r') as dataFile:
                config = json.load(dataFile)
        except FileNotFoundError as e:
            print("File not found error: {}".format(e))

        return DataSettingsParser.parse_data_settings_config(config)
    
    def parse_data_settings_config(config):
        data_settings = {}

        data_settings["symbols_to_trade"] = config["SYMBOLS_TO_TRADE"]
        data_settings["timeframe"] = config["TIMEFRAME"]
        data_settings["start_time"] = config["START_TIME"]
        data_settings["end_time"] = config["END_TIME"]

        return data_settings
    

class AlpacaAPIHandler():
    def get_alpaca_keys_from_file(filename):
        alpaca_keys = {}

        try:
            with open("json/keys.json") as keysFile:
                config = json.load(keysFile)
        except FileNotFoundError as e:
            print("File not found error: {}".format(e))

        alpaca_keys["alpaca_api_key"] = config["ALPACA_API_KEY"]
        alpaca_keys["alpaca_secret_key"] = config["ALPACA_SECRET_KEY"]

        return alpaca_keys
    
    def fetch_alpaca_stock_bars_data(alpaca_keys, data_settings):
        client = StockHistoricalDataClient(alpaca_keys["alpaca_api_key"],
                                           alpaca_keys["alpaca_secret_key"])
        
        request_params = StockBarsRequest(
            symbol_or_symbols=data_settings["symbols_to_trade"],
            timeframe=getattr(TimeFrame, data_settings["timeframe"]),
            start=datetime(data_settings["start_time"]["year"], 
                           data_settings["start_time"]["month"], 
                           data_settings["start_time"]["day"]),
            end=datetime(data_settings["end_time"]["year"], 
                         data_settings["end_time"]["month"], 
                         data_settings["end_time"]["day"])
        )

        return client.get_stock_bars(request_params)
    
    def convert_alpaca_stock_bars_to_dataframe(bars_data):
        df = bars_data.df
        df.reset_index(inplace=True)
        df = df[["timestamp", "open", "high", "low", "close", "volume"]]
        df.rename(columns={"timestamp": "datetime"}, inplace=True)


class DataGenerator():
    def generate_data_csv(data_settings_filename, alpaca_keys_filename, csv_filename):
        data_settings = DataSettingsParser.parse_data_settings_from_file(data_settings_filename)
        alpaca_keys = AlpacaAPIHandler.get_alpaca_keys_from_file(alpaca_keys_filename)
        alpaca_stock_bars = AlpacaAPIHandler.fetch_alpaca_stock_bars_data(alpaca_keys, data_settings)
        dataframe = AlpacaAPIHandler.convert_alpaca_stock_bars_to_dataframe(alpaca_stock_bars)

        dataframe.to_csv(csv_filename)
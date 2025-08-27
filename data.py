from constants import DATAFRAME_FORMAT, DATAFRAME_RENAME
from utilities.alpaca_api_handler import AlpacaAPIHandler

class DataGenerator():
    def generate_data_csv(csv_filename, data_settings, alpaca_keys):
        dataframe = DataGenerator._fetch_stock_data_as_dataframe(alpaca_keys, data_settings)
        dataframe.to_csv(csv_filename)

    def _fetch_stock_data_as_dataframe(alpaca_keys, data_settings):
        alpaca_stock_bars = AlpacaAPIHandler.fetch_alpaca_stock_bars_data(alpaca_keys, data_settings)
        return DataGenerator._convert_alpaca_stock_bars_to_dataframe(alpaca_stock_bars)
        
    def _convert_alpaca_stock_bars_to_dataframe(bars_data):
        df = bars_data.df
        df.reset_index(inplace=True)
        df = df[DATAFRAME_FORMAT]
        df.rename(columns=DATAFRAME_RENAME, inplace=True)
        return df
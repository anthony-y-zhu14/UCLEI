import scrapper
import json
import os
from datetime import datetime
database_filename = '../database/stock_url.json'


class Stock:
    def __init__(self, stock_name):
        self.name = stock_name
        self.symbol = ''
        self.market = ''
        self.percentage = 0
        self.quote = 0
        self.prev_close = 0
        self.open = 0
        self.daily_range = ''
        self.annual_range = ''
        self.volume = 0
        self.average_volume = 0
        self.stock_page = ''
        self.time_updated = str(datetime.now(tz=None))


    def update_info(self):
        file_size = os.path.getsize(database_filename)
        if file_size == 0:
            self.stock_page = scrapper.get_url(self.name)
        else:
            with open(database_filename, 'r') as f:
                stock_url_data = json.load(f)
                if self.name in stock_url_data:
                    self.stock_page = stock_url_data[self.name]
                else:
                    self.stock_page = scrapper.get_url(self.name)
        scrapper.update_stock_info(self)

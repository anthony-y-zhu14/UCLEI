import json
import stock
import asyncio
import threading


def update_database(database_path, url_path):
    stock_symbol_list = list(json_read(url_path).keys())
    stock_list = []
    data = {}
    for symbol in stock_symbol_list:
        stock_list.append(stock.Stock(symbol))
    for s in stock_list:
        t = threading.Thread(target=scrap, args=(s, data,))
        t.start()
       
                 

    with open(database_path, "w+") as database:
        json.dump(data, database, indent=4)

def scrap(s, data):
    s.update_info()
    data[s.symbol] = s.__dict__
    print("Fetching Data: " + data[s.symbol]["name"])   

def update_url(json_filename, stocks):
    json_url_data = json_read(json_filename)
    if not stocks:
        return
    else:
        for s in stocks:
            json_url_data[s.symbol] = s.stock_page
            json_url_data[s.name] = s.stock_page
    with open(json_filename, "w+") as database:
        json.dump(json_url_data, database, indent=4)

def json_read(file_name):
    with open(file_name) as f_in:
        return json.load(f_in)

def json_sort(file_name):
    sorted_obj = {}
    original_obj = json_read(file_name)
    for key in sorted(original_obj):
        sorted_obj[key] = original_obj[key]
    with open(file_name, "w+") as database:
        json.dump(sorted_obj, database, indent=4)

def main():
    data_path = "../../server/database/stocks/data_real.json"
    url_path = "../../server/database/stocks/stock_url.json"
    update_database(data_path, url_path)
    json_sort(url_path)

if __name__ == "__main__":
    main()

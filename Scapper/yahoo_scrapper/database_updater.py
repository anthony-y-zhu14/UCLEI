import json
import stock


def update_database(database_path, url_path):
    stock_symbol_list = list(json_read(url_path).keys())
    stock_list = []
    data = {}
    for symbol in stock_symbol_list:
        stock_list.append(stock.Stock(symbol))
    for s in stock_list:
        s.update_info()
        data[s.name] = s.__dict__
        print("Fetching Data: ")
        print(data[s.name])
        print("\n")

    with open(database_path, "w+") as database:
        json.dump(data, database, indent=4)

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
    data_path = "../../app/database/stocks/data.json"
    url_path = "../../app/database/stocks/stock_url.json"
    update_database(data_path, url_path)
    json_sort(url_path)

if __name__ == "__main__":
    main()

import json
import stock


def update_database(database_path):
    stock_symbol_list = list(json_read("stock_url.json").keys())
    stock_list = []
    data = {}
    for symbol in stock_symbol_list:
        stock_list.append(stock.Stock(symbol))
    for s in stock_list:
        s.update_info()
        data[s.name] = s.__dict__
        print("Updating: ")
        print(data[s.name])
        print("\n")

    with open(database_path, "w+") as database:
        json.dump(data, database, indent=4)


def update_url(json_filename: object, stocks: object) -> object:
    json_url_data = json_read(json_filename)
    if not stocks:
        pass
    else:
        for s in stocks:
            json_url_data[s.symbol] = s.stock_page
            # json_url_data[s.name] = s.stock_page
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


if __name__ == "__main__":
    json_sort("stock_url.json")
    update_database("../database/data.json")

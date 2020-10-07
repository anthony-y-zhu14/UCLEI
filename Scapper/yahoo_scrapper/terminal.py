import database_updater
import stock


# just a tester for now, plan to write the stock info into a json file so the front end will be able to extract info
def add(stock_name):
    s = stock_finder(stock_name)
    if s not in stock_list:
        stock_list.append(s)
    else:
        pass


def stock_finder(stock_name):
    print("-----searching-----")
    s = stock.Stock(stock_name)
    s.update_info()
    print("success!")
    print_stock_info(s)
    if input("Is the info correct? Y/N  ").capitalize() == "Y":
        return s
    else:
        stock_finder(input("\nEnter a new search name: "))


def print_stock_info(s):
    print()
    print("\nYour search result: ")
    print(s.stock_page)
    print(s.name)
    print("Market: " + s.market)
    print("Quote: $" + s.quote)
    print("Ticket Symbol: " + s.symbol)
    print("Change: " + s.percentage)
    print("Previous Close: " + s.prev_close)
    print("Daily Range: $" + s.daily_range)
    print("52wk Range: $" + s.annual_range)
    print("Volume: " + s.volume)
    print("Average Volume: " + s.average_volume)

    print()


stock_list = []
add(input("Enter a stock symbol or name: "))
database_updater.update_url("stock_url.json", stock_list)

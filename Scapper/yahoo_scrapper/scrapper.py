from selenium import webdriver
import requests
from bs4 import BeautifulSoup
import time


# take a stock name or symbol and find the url of that stock
def get_url(search_term):
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument("--headless")
    search_url = 'https://ca.finance.yahoo.com/'
    driver_path = "../chromedriver/chromedriver.exe"
    browser = webdriver.Chrome(driver_path, options=chrome_options)
    browser.get(search_url)
    search_box = browser.find_element_by_id('yfin-usr-qry')
    search_box.send_keys(search_term)
    search_box.submit()
    time.sleep(2)
    result_url = browser.current_url
    browser.quit()
    return result_url


def update_stock_info(s):
    response = requests.get(s.stock_page)
    soup = BeautifulSoup(response.text, 'html.parser')
    soup.prettify()
    s.quote = soup.find_all(
        'div', {'class': 'My(6px) Pos(r) smartphone_Mt(6px)'})[0].find_all('span')[0].text
    # print(soup.find(
    #     'h1', {'class': 'D(ib)'}).text)
    # s.name = soup.find(
    #     'h1', {'class': 'D(ib)'}).text.split('-')[1][1:]
    # s.symbol = soup.find(
    #     'h1', {'class': 'D(ib)'}).text.split('-')[0][:-1]
    s.name = soup.find(
        'h1', {'class': 'D(ib)'}).text.split('(')[0][:-1]
    s.symbol = soup.find(
        'h1', {'class': 'D(ib)'}).text.split('(')[1][:-1]
    s.percentage = soup.find_all(
        'div', {'class': 'My(6px) Pos(r) smartphone_Mt(6px)'})[0].find_all('span')[1].text
    s.prev_close = soup.find_all(
        'td', {'class': 'Ta(end) Fw(600) Lh(14px)'})[0].text
    s.open = soup.find_all(
        'td', {'class': 'Ta(end) Fw(600) Lh(14px)'})[1].text
    s.daily_range = soup.find_all(
        'td', {'class': 'Ta(end) Fw(600) Lh(14px)'})[4].text
    s.annual_range = soup.find_all(
        'td', {'class': 'Ta(end) Fw(600) Lh(14px)'})[5].text
    s.volume = soup.find_all(
        'td', {'class': 'Ta(end) Fw(600) Lh(14px)'})[6].text
    s.average_volume = soup.find_all(
        'td', {'class': 'Ta(end) Fw(600) Lh(14px)'})[7].text
    s.market = soup.find_all(
        'div', {'class': 'C($tertiaryColor) Fz(12px)'})[0].find_all('span')[0].text

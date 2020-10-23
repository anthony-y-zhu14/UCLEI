# UCLEI---Stock-Trading-Platform-Sandbox

UCLEI is a stock trading simulation website that provides a safe, easy-to-use sandbox environment for users to experience how stock market trading works.
Simply create an account and you will be welcomed to the website and free to explore the excitement of stocking trading without consequence!
However, do be careful, press the wrong button, you could lose everything...

## Installation

To ensure a proper installation please verfiy that your system has Node.js, npm, and Express installed correctly. 
For more instructions on this please refer to: https://nodejs.org/en/.

To use the app:
```bash
 clone this repo (if you downloaded this as a zip, extract and cd to the extracted folder).
 cd to /UCLEI---Stock-Trading-Platform-Sandbox/app/server
 run: node server.js
 navigate to http://127.0.0.1:3000/
 use the following login credentials: 
    user: jerry137
    password: 123456

Happy trading :-)

```
## Files

```bash
└───UCLEI---Stock-Trading-Platform-Sandbox
|
│   index.html
│   readme.md
│
├───css
│   │   account.css
│   │   account.css.map
│   │   account.scss
│   │   dashboard.css
│   │   header.css
│   │   market.css
│   │   sidenav.css
│   │   styles.css
│   │   trading.css
│   │   trading.css.map
│   │   trading.scss
│   │
│   └───dist
│           trading.css
│
├───database
│   ├───stocks
│   │       data.json
│   │       stock_url.json
│   │
│   └───users
│           user.json
│
├───html
│       account.html
│       dashboard.html
│       market.html
│       trading.html
│
├───js
│   │   account.js
│   │   login.js
│   │   market.js
│   │   marketNews.js
│   │   modal.js
│   │   myChart.js
│   │   news.js
│   │   trading.js
│   │   transferFund.js
│   │
│   └───dist
│           market.dev.js
│           marketNews.dev.js
│           news.dev.js
│           trading.dev.js
│           transferFund.dev.js
│
└───server
    │   package-lock.json
    │   server.js
    │
    ├───dist
    │       server.dev.js
    │
    └───node_modules

```

## Usage

Use for practicing and having fun only, despite of using real market data, balance changes during the usage of the website are not real.
Therefore, any monetary loss or gain occurred are not materialized thus are not available for withdrawn.  

## Additional Functionality

- Included a Web Scrapper to scrape market data from Yahoo Finance and store them in the local database storage.
- Market News cards fetch news based on user-selected queries related to stocks. The market news is fetched using JS, JSON, and the GNews API. 
- Stock charts are displayed using the chart.js library

## Libraries Used
- Font Awesome (https://fontawesome.com)
- Chart.js (https://www.chartjs.org)

## Contributing
Contributor:

```bash
Joseph Malovic
Anthony Y. Zhu
```

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

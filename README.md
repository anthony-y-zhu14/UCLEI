# UCLEI---Stock-Trading-Platform-Sandbox

UCLEI is a stock trading simulation website that provides a safe, easy-to-use sandbox environment for users to experience how stock market trading works.
Simply create an account and you will be welcomed to the website and free to explore the excitement of stocking trading without consequence!
However, do be careful, press the wrong button, you could lose everything...

## Installation

To ensure a proper installation please verify that your system has Node.js, npm, react-app, and Express installed correctly. For more instructions on this please refer to: https://nodejs.org/en/ and https://reactjs.org/.

<h3>Locally:</h3>
If running locally you will also need to do the following:

git clone https://github.com/anthony-y-zhu14/UCLEI---Stock-Trading-Platform-Sandbox

```bash
cd /UCLEI---Stock-Trading-Platform-Sandbox/app/server/server
npm install
npm install UUID
npm install cookie-parser
npm install express-session
cd /UCLEI---Stock-Trading-Platform-Sandbox/app/react-app
npm install
```

Once you have completed the above steps you will have to run
(we recommend having two terminal instances open):
```bash
cd /UCLEI---Stock-Trading-Platform-Sandbox/app/server/server
node server.js
cd /UCLEI---Stock-Trading-Platform-Sandbox/app/react-app
npm start
```

navigate to http://127.0.0.1:3000/
and use the any of the following login credentials:
<ul>
   <li> user: jerry137 password: 123456 </li>
   <li> user: morty137 password: 123456 </li>
   <li> user: rick137 password: 123456 </li>
</ul>

Happy trading :-)

## Files

```bash
UCLEI---Stock-Trading-Platform-Sandbox
├── Project Spec
│   ├── COMP2406-F20-Stock-Broker-Project.pdf
│   ├── Changelog.txt
│   ├── Project-Check-In-3-Expectations.pdf
│   ├── Screenshot 2020-09-20 162534.png
│   ├── check-in2.txt
│   └── symbols.txt
├── README.md
├── Scapper
│   ├── chromedriver
│   │   ├── chromedriver
│   │   └── chromedriver.exe
│   └── yahoo_scrapper
│       ├── __pycache__
│       │   ├── scrapper.cpython-38.pyc
│       │   └── stock.cpython-38.pyc
│       ├── database_updater.py
│       ├── scrapper.py
│       ├── stock.py
│       └── terminal.py
├── linechartbackup.js
├── package-lock.json
├── react-app
│   ├── README.md
│   ├── debug.log
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   └── robots.txt
│   └── src
│       ├── App.js
│       ├── components
│       │   ├── Button.js
│       │   ├── ChartGrid.js
│       │   ├── Container.js
│       │   ├── Grid.js
│       │   ├── GridList.js
│       │   ├── Header.js
│       │   ├── Linechart.js
│       │   ├── Menu.js
│       │   ├── Modal.js
│       │   ├── NewsList.js
│       │   ├── OutlinedCard.js
│       │   ├── SideNav.js
│       │   ├── StockInfo.js
│       │   ├── UncontrolledLottie.js
│       │   ├── Watchlist.js
│       │   ├── card.js
│       │   ├── css
│       │   │   ├── Account.css
│       │   │   ├── SideNav.css
│       │   │   ├── Styles.css
│       │   │   └── Trading.css
│       │   ├── fourohone.js
│       │   ├── images
│       │   │   ├── 401.json
│       │   │   └── lf30_editor_gucsxhof.json
│       │   ├── nmodal.js
│       │   └── pages
│       │       ├── Account.js
│       │       ├── Dashboard.js
│       │       ├── Login.js
│       │       ├── Market.js
│       │       ├── Register.js
│       │       ├── StoreFront.js
│       │       ├── Trading.js
│       │       └── traBackup.js
│       ├── index.css
│       ├── index.js
│       └── reportWebVitals.js
├── server
│   ├── database
│   │   ├── orders
│   │   │   ├── openBuyOrders.json
│   │   │   ├── openSellOrders.json
│   │   │   └── order.txt
│   │   ├── stocks
│   │   │   ├── data.json
│   │   │   └── stock_url.json
│   │   └── users
│   │       └── users.json
│   |
│   └── server
│       ├── package-lock.json
│       └── server.js
└── timecapsule
```

## Usage

Use for practicing and having fun only, despite of using real market data, balance changes during the usage of the website are not real.
Therefore, any monetary loss or gain occurred are not materialized thus are not available for withdrawn.  

## Additional Functionality

- Included a Web Scrapper to scrape market data from Yahoo Finance and store them in the local database storage.
- Market News cards fetch news based on user-selected queries related to stocks. The market news is fetched using JS, JSON, and the GNews API.
- Stock charts are displayed using the chart.js library

## Libraries & Frameworks Used
- Font Awesome (https://fontawesome.com)
- Chart.js (https://www.chartjs.org)
- Material UI (https://material-ui.com/)
- Lottie (https://lottiefiles.com/)
- React

## Contributing
Contributor:

```bash
Joseph Malovic
Anthony Y. Zhu
```
All animations used are credited to: https://lottiefiles.com/

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

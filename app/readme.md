 ## README (Frontend Documentation) 
The app folder contains all front end work for the UCLEI stock trading platform. The following directories seperate the files into HTML, CSS, and JS. 
This readme provides insight into what each document contains and its functionality. 
 
 ## Files
 ```bash  
   ───app
       │   .DS_Store
       │   index.html
       │   readme.md
       │
       ├───css
       │       account.css
       │       dashboard.css
       │       header.css
       │       market.css
       │       sidenav.css
       │       styles.css
       │       trading.css
       │       trading.css.map
       │       trading.scss
       │
       ├───html
       │       account.html
       │       dashboard.html
       │       market.html
       │       trading.html
       │
       └───js
               login.js
               myChart.js
               news.js
               modal.js
```

 ## File Descriptions 
 
File Name | Type | File Info
------------ | ------------- | -------------
/app/index.html | html | Includes the landing page for Uclei. Provides a login form for the user.
/css/styles.css | css | Styling for index.html. Includes styling of login buttons and forms.
/css/account.css | css | Styling for account.html. Includes drop down forms and animations for user account changes. 
/css/dashboard.css | css | Styling for dashboard.html. Market news styling and chart styling.
/css/header.css | css | Styling for the header found on each page 
/css/market.css | css | Styling for market.html
/css/sidenav.css | css | Styling for the sidenav found on each page, includes styling for the "add funds" modal.
/css/trading.css.map | css | maps the trading.scss to trading.css 
/css/trading.css | css | provides styling for trading.html 
/css/trading.scss | scss | scss mapped to trading.css
/html/account.html | html | Includes asset allocation charts, current holdings container.
/html/dashboard.html | html | Includes JS charts, market news using GNews API and a quick account view for the user.
/html/market.html | html | Provides a watchlist for the user, charts using chart.js for viewing of stocks, quick add buttons, and market news using GNews API 
/html/trading.html | html | Allows user to buy and sell stocks. 
/js/login.js | javascript | Provides JS for handling the login of a user and redirect to the dashboard.html
/js/myChart.js | javascript | Future home of the handling of charts and graphs in our app. Currently the JS is found in script tags in the dashboard.html and market.html pages
/js/news.js | javascript | JS for fetching market news from GNews API and displaying the content on dashboard.html and market.html pages 
/js/modal.js | javascript | JS for handling the modal popup and blurred background affects (CSS found in the sidenav.css file) 

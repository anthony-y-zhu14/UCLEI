Program Author:

         name:   Joseph Malovic
    student #:   101132519

  Source Files:

   readme.txt:   A simple readme including information on the author,
                 purpose of the program, and compilation instructions

    server.js:   The js file containing the express backend
   cards.json:   The JSON database of cards
     home.pug:   The home page of the app
     card.pug:   The page generated for each card to display

Compilation & Use:

   To compile:
   1. Unzip the file
   2. Open your terminal
   3. cd to the unzipped directory
   4. npm install
   5. npm install express
   6. node server.js
   7. navigate to port 3002

       Purpose: (Tutorial 5)

       Objectives
       ● Add a template engine to an existing HTTP server
       ● Create templates capable of accepting data and producing corresponding HTML

       Write-up:

       I began using Express to make an API that retrieves card info from the JSON file. To do this I used file reader (for reading the JSON) and
       JSON.parse to properly parse through the data. My server has several get requests for when the user interacts with HTML elements (a tags) which call
       the get request for the given card and its id. Then, I have the backend search for the given ID in the JSON file and return a rendered HTML page
       with the appropriate information.

       The above is very useful for my Stock project as I will be using the same sort of set up. Currently I have an express backend with a react front end.
       I also have a JSON file with stock data that I want to use when a user searches for a particular stock. This tutorial taught me exactly how I could achieve this.
       First, I will have a GET request in my server that opens the JSON file with file reader module. The get request will take a param of the searched stock's ticker symbol.
       The server will search the file for the ticker and return the given stock information. The client can then view all of the stock information.

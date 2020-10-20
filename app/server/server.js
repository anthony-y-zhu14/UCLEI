const http = require('http');
const fs = require("fs"); //reads files
const express = require('express');
const path = require('path');
const app = express();

// let users = fs.readFile("../database/user.json");
const users = {
    username: "jerry137", 
    password : "123456",

    name: "Jerry Smith",
    UID: "c117",
    watchlist: {},
    ownedStock: {},
    activity: {},
    account: {
        accountName: "TFSA",
        cashBalance: "2000",
        investmentBalance: "0"
    },
    balanceGrowth: "-20%"

};
console.log(users);

app.use(express.static(path.join(__dirname, '../')));

app.get('/', (request, response) => {
    console.log(request.url);
    if(request.url === "/" || request.url === "../index") {
        fs.readFile("../index.html", function(err, data){
            if(err) {
                response.statusCode = 500;
                response.write("Server error.");
                response.end();
                return;
            }
            response.statusCode = 200;
            response.setHeader("Content-Type", "text/html");
            response.write(data);
            response.end();
        });
    }

    else if(request.url === "/dashboard" || request.url === "../dashboard") {
        fs.readFile("../dashboard.html", function(err, data){
            if(err) {
                response.statusCode = 500;
                response.write("Server error.");
                response.end();
                return;
            }
            response.statusCode = 200;
            response.setHeader("Content-Type", "text/html");
            response.write(data);
            response.end();
        });
    }

    else if(request.url === "/account" || request.url === "../account") {
        fs.readFile("../account.html", function(err, data){
            if(err) {
                response.statusCode = 500;
                response.write("Server error.");
                response.end();
                return;
            }
            response.statusCode = 200;
            response.setHeader("Content-Type", "text/html");
            response.write(data);
            response.end();
        });
    }

    else if(request.url === "/market" || request.url === "../market") {
        fs.readFile("../market.html", function(err, data){
            if(err) {
                response.statusCode = 500;
                response.write("Server error.");
                response.end();
                return;
            }
            response.statusCode = 200;
            response.setHeader("Content-Type", "text/html");
            response.write(data);
            response.end();
        });
    }
    
    else if(request.url === "/trading" || request.url === "../trading") {
        fs.readFile("../trading.html", function(err, data){
            if(err) {
                response.statusCode = 500;
                response.write("Server error.");
                response.end();
                return;
            }
            response.statusCode = 200;
            response.setHeader("Content-Type", "text/html");
            response.write(data);
            response.end();
        });
    }
    else if(request.url === "/getBalance") {
        let data = users.account.cashBalance;
        response.statusCode = 200;
		response.setHeader("Content-Type", "application/JSON");
        response.write(data);
        response.end();
    }
});

// app.get('/getBalance', (request, response) => {
//     console.log(request.url);
//         fs.readFile("../index.html", function(err, data){
//             if(err) {
//                 response.statusCode = 500;
//                 response.write("Server error.");
//                 response.end();
//                 return;
//             }
//             response.statusCode = 200;
//             response.setHeader("Content-Type", "text/html");
//             response.write(data);
//             response.end();
//     });

app.post('/authentication', (request, response) => {
    let data = "";
    request.on('data', (chunk) => {
        data = JSON.parse(chunk);            
    });

    request.on('end', () => {
    let username = data.username;
    let password = data.password;
    console.log(username);
    console.log(password);
    authenticate(username, password);
    });

    function authenticate(username, password) {      
        if(users.username === username && users.password === password) {
            console.log("Authenticated");
            response.write("/html/dashboard.html");
        }
        else { 
            response.write("false");
            console.log("Invalid.");         
        }
    }
 });

 app.post('/updateBalance', (request, response) => {
    let data = "";
    request.on('data', (chunk) => {
        data = JSON.parse(chunk);            
    });

    request.on('end', () => {
    users.account.cashbalance = data;
    console.log(users);
    });
});

app.listen(3000);
console.log('Server running at http://127.0.0.1:3000/');
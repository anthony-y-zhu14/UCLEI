const http = require('http');
const fs = require("fs"); //reads files
const express = require('express');
const path = require('path');
const app = express();

// let users = fs.readFile("../database/user.json");
let users = {"username": "John123", "password" : "123456"};
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
});

app.post('/', (request, response) => {
    console.log("foo");
    if(request.url === "/authentication") {
        let data = "";
        request.on('data', (chunk) => {
            data = JSON.parse(chunk);            
        });

    request.on('end', () => {
        let username = data.username;
        let password = data.password;
        console.log("bar");
        authenticate(username, password);
        });
    }

    function authenticate(username, password) {      
        console.log("foo");   
        if(users.username === username && users.password === password) {
            console.log("Authenticated");
            response.write("http://127.0.0.1:3001/html/dashboard.html");
        }
        else { 
            response.write("false");
            console.log("Invalid.");         
        }
    }
 });

app.listen(3001);
console.log('Server running at http://127.0.0.1:3001/');
"use strict";

var http = require('http');

var fs = require("fs"); //reads files


var express = require('express');

var path = require('path');

var app = express(); // let users = fs.readFile("../database/user.json");

var users = {
  "username": "John123",
  "password": "123456"
};
console.log(users);
app.use(express["static"](path.join(__dirname, '../')));
app.get('/', function (request, response) {
  console.log(request.url);

  if (request.url === "/" || request.url === "../index") {
    fs.readFile("../index.html", function (err, data) {
      if (err) {
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
  } else if (request.url === "/dashboard" || request.url === "../dashboard") {
    fs.readFile("../dashboard.html", function (err, data) {
      if (err) {
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
  } else if (request.url === "/account" || request.url === "../account") {
    fs.readFile("../account.html", function (err, data) {
      if (err) {
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
  } else if (request.url === "/market" || request.url === "../market") {
    fs.readFile("../market.html", function (err, data) {
      if (err) {
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
  } else if (request.url === "/trading" || request.url === "../trading") {
    fs.readFile("../trading.html", function (err, data) {
      if (err) {
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
app.post('/authentication', function (request, response) {
  if (request.url === "/authentication") {
    var data = "";
    request.on('data', function (chunk) {
      data = JSON.parse(chunk);
    });
    request.on('end', function () {
      var username = data.username;
      var password = data.password;
      console.log(username);
      console.log(password);
      authenticate(username, password);
    });
  }

  function authenticate(username, password) {
    if (users.username === username && users.password === password) {
      console.log("Authenticated");
      response.write("/html/dashboard.html");
    } else {
      response.write("false");
      console.log("Invalid.");
    }
  }
});
app.listen(3001);
console.log('Server running at http://127.0.0.1:3001/');
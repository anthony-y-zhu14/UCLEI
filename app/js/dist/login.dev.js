"use strict";

function loadHome() {
  var contentDiv;
  return regeneratorRuntime.async(function loadHome$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          contentDiv = document.getElementById("content");
          _context.next = 3;
          return regeneratorRuntime.awrap(fetchHtmlAsText('./html/dashboard.html'));

        case 3:
          contentDiv.innerHTML = _context.sent;

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
}

function fetchHtmlAsText() {
  var response;
  return regeneratorRuntime.async(function fetchHtmlAsText$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          url = loadHome();
          _context2.next = 3;
          return regeneratorRuntime.awrap(fetch(url));

        case 3:
          response = _context2.sent;
          _context2.next = 6;
          return regeneratorRuntime.awrap(response.text());

        case 6:
          return _context2.abrupt("return", _context2.sent);

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function sendLoginInfo() {
  var form = {
    username: document.getElementsByClassName("text-field-email"),
    password: document.getElementsByClassName("text-field-password"),
    submit: document.getElementById("button-focus")
  };
  var formData = {
    "username": form.username.innerHTML,
    "password": form.password.innerHTML
  };
  form.submit.addEventListener("click", function () {
    var request = new XMLHttpRequest();
    var url = "some url";
    request.open("post", url);
    request.setRequestHeader("Content-Tyoe", "multipart/form-data");
    var data = JSON.stringify(formData);
    request.send(dataData);
  });
}
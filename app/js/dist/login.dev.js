"use strict";

function sendLoginInfo() {
  console.log("Fooo");
  var username = document.getElementById("username");
  var password = document.getElementById("password");
  var formData = {
    "username": username.value,
    "password": password.value
  };
  var request = new XMLHttpRequest();
  var url = "/authentication";
  request.open("post", url);
  request.setRequestHeader("Content-Type", "multipart/form-data");
  var data = JSON.stringify(formData);
  request.send(data);

  if (request.responseText == "false") {
    handleBadLogin();
  } else {
    var newUrl = request.responseText;
    window.location = newUrl;
  }
}

function handleBadLogin() {
  var parent = document.getElementById("button-focus");
  var message = document.createElement("div");
  message.innerHTML = "Invaild username / password, please try again.";
  message.style.color = "red";
  parent.appendChild(message);
}

document.getElementById("button-focus").addEventListener("click", sendLoginInfo);
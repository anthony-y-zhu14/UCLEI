function sendLoginInfo() {
  console.log("Fooo");
  let username = document.getElementById("username");
  let password = document.getElementById("password");
  let formData = {"username": username.value, "password": password.value};
  let request = new XMLHttpRequest();
  let url = "/authentication";
  request.open("post", url);
  request.setRequestHeader("Content-Type", "multipart/form-data");
  let data = JSON.stringify(formData);
  request.send(data);

  if (request.responseText == "false") {
    handleBadLogin();
  }
  else {
    let newUrl = request.responseText;
    window.location = newUrl;
  }
}

function handleBadLogin() {
  let parent = document.getElementById("button-focus");
  let message = document.createElement("div");
  message.innerHTML = "Invaild username / password, please try again.";
  message.style.color = "red";
  parent.appendChild(message);
}

document.getElementById("button-focus").addEventListener("click", sendLoginInfo);
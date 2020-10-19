function getLoginInfo() {
  console.log("Fooo");
  let username = document.getElementById("username");
  let password = document.getElementById("password");
  let formData = {"username": username.value, "password": password.value};
  sendLoginInfo(formData);
}

function sendLoginInfo(formData) {
  let request = new XMLHttpRequest();
  let url = "/authentication";

  request.open("post", url);
  request.setRequestHeader("Content-Type", "multipart/form-data");
  let data = formData;
  request.send(JSON.stringify(data));

  request.onreadystatechange = function () {    
    if (request.responseText == "false") {        
      handleBadLogin();
    }
    else {
      let newUrl = request.responseText;
      console.log(newUrl);
      if(newUrl != "") {
        window.location = newUrl;
      }
    }
  }
}

function handleBadLogin() {
  let message = document.getElementById("response-text"); 
  message.innerHTML = "Invaild username / password";
  message.style.background = "#35363C";
  message.style.fontSize = "16px";
  message.style.color = "red";
  message.style.border = "1px solid red";
  message.style.width = "30%";
  message.style.height = "2.5em";
  message.style.marginLeft = "15%";
  message.style.textAlign = "center";  
}

document.getElementById("button-focus").addEventListener("click", getLoginInfo);

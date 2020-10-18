
async function loadHome() {
  const contentDiv = document.getElementById("content");
  contentDiv.innerHTML = await fetchHtmlAsText('./html/dashboard.html');
}

async function fetchHtmlAsText() {
  url = loadHome();
  const response = await fetch(url);
  return await response.text();
}

function sendLoginInfo(){
  const form = {
    username: document.getElementsByClassName("text-field-email"),
    password: document.getElementsByClassName("text-field-password"),
    submit: document.getElementById("button-focus")
  }; 

  let formData = {"username": form.username.innerHTML, "password": form.password.innerHTML};

  form.submit.addEventListener("click", function(){
    let request = new XMLHttpRequest();
    let url = "some url";
    request.open("post", url);
    request.setRequestHeader("Content-Tyoe", "multipart/form-data");
    let data = JSON.stringify(formData);
    request.send(dataData);    
  });
}
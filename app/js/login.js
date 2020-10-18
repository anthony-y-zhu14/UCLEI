
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

  form.submit.addEventListener("click", function(){
    const request = new XMLHttpRequest();
    
  });
}
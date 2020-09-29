
async function loadHome() {
  const contentDiv = document.getElementById("content");
  contentDiv.innerHTML = await fetchHtmlAsText('./html/dashboard.html');
}

async function fetchHtmlAsText() {
  url = loadHome();
  const response = await fetch(url);
  return await response.text();
}

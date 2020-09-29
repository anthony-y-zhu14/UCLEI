function fetchNews() {
  let date = new Date();
  let today = date.toISOString().slice(0,10);
  let query = "Stocks";
  getData(today, query);
}

async function getData(today, query) {
  let url = 'https://gnews.io/api/v4/search?' +
            `q=${query}&` +
            `from=${today}&` +
            'country=us&' +
            'token=9413f702be9d4fcf334d0ce66270875a';

  let response = await fetch(url);
  let data = await response.json();

  displayNews(data);
}

function displayNews(data) {
  let newsItems = document.getElementById("news-items");

  for(let i = 0; i < 4; i++) {
    let link = document.createElement("a");
    let div = document.createElement("div");
    let tDiv = document.createElement("div");
    let image = document.createElement("img");
    let title = document.createElement("div");
    let desc = document.createElement("div");
    let source = document.createElement("div");

    link.href = data["articles"][i].url;
    link.id = "news-link";
    image.src = data["articles"][i].image;
    title.innerHTML = data["articles"][i].title;
    desc.innerHTML = data["articles"][i].description;
    source.innerHTML = data["articles"][i].source.name;

    div.className = "news-item";
    source.id = "news-source";
    tDiv.className = "text-container";
    desc.id = "news-desc";
    image.className = "news-icon";
    image.id = "image-container";
    title.id = "news-title";
    link.target = "_blank";

    div.appendChild(image);
    tDiv.appendChild(title);
    tDiv.appendChild(source);
    tDiv.appendChild(desc);
    div.appendChild(tDiv);
    link.appendChild(div);
    newsItems.appendChild(link);
  }
}

export const getNews = async (e) => {
  let date = new Date();
  let today = date.toISOString().slice(0,10);
  let query = "Stocks";

  let url = 'https://gnews.io/api/v4/search?' +
            `q=${query}&` +
            `from=${today}&` +
            'country=us&' +
            'token=9413f702be9d4fcf334d0ce66270875a';

  const response = await fetch(url);
  // const response = {articles: [
  //   {
  //       "source": {
  //           "id": null,
  //           "name": "Forbes"
  //       },
  //       "author": "Matthew Spoke, Contributor, \n Matthew Spoke, Contributor\n https://www.forbes.com/sites/mattspoke/",
  //       "title": "Blockchains And The Ownership Economy",
  //       "description": "Blockchain’s ability to distribute economic value in new ways is poised to spur adoption of the ownership economy. Could this lead to greater financial equality?",
  //       "url": "https://www.forbes.com/sites/mattspoke/2020/10/27/blockchains-and-the-ownership-economy/",
  //       "urlToImage": "https://thumbor.forbes.com/thumbor/fit-in/1200x0/filters%3Aformat%28jpg%29/https%3A%2F%2Fspecials-images.forbesimg.com%2Fimageserve%2F5f98607c4219482c545514c4%2F0x0.jpg",
  //       "publishedAt": "2020-10-27T18:02:48Z",
  //       "content": "As stated in my last article, blockchain creates new ways to distribute economic value. Why is this significant? We live in a world in which content, and the technology with which we consume that con… [+7166 chars]"
  //   },
  //   {
  //       "source": {
  //           "id": null,
  //           "name": "Letstalkbitcoin.com"
  //       },
  //       "author": "adam@letstalkbitcoin.com (The LTB Network), The LTB Network",
  //       "title": "Citizen Bitcoin - Danny Diekroeger: From Baseball to Bitcoin",
  //       "description": "Danny Diekroger is a software engineer at CashApp and Bitgo before that. He has been writing some great threads educating about how bitcoin works and why we need it. He's working on compiling those into a short book. In this one we get into Danny's background…",
  //       "url": "https://letstalkbitcoin.com/blog/post/citizen-bitcoin-danny-diekroeger?utm_source=feedburner&utm_medium=feed&utm_campaign=Feed%3A+TheDailyBitcoinShow+%28Let%27s+Talk+Bitcoin+Network+Feed%29",
  //       "urlToImage": "https://letstalkbitcoin.com/files/blogs/8999-371e85a5dc259566f07f22d659708b984f85c87228c10bdbf2ce3097335d3040.jpg",
  //       "publishedAt": "2020-10-27T18:02:00Z",
  //       "content": "Click to download audio version\r\nDanny Diekroger is a software engineer at CashApp and Bitgo before that. He has been writing some great threads educating about how bitcoin works and why we need it. … [+296 chars]"
  //   },
  //   {
  //       "source": {
  //           "id": null,
  //           "name": "PRNewswire"
  //       },
  //       "author": null,
  //       "title": "A Comprehensive Discussion at Offshorecorptalk.com Reveals Anonymous Cryptocurrencies",
  //       "description": "NICOSIA, Cyprus, Oct. 27, 2020 /PRNewswire/ -- Worldwide: It is true that bitcoin has been acclaimed for its better security than the conventional currencies. Whether the need is for keeping personal transactions private, running a business, or hiding transac…",
  //       "url": "https://www.prnewswire.com/news-releases/a-comprehensive-discussion-at-offshorecorptalkcom-reveals-anonymous-cryptocurrencies-301160960.html",
  //       "urlToImage": "https://www.prnewswire.com/content/dam/prnewswire/common/prn_facebook_sharing_logo.jpg",
  //       "publishedAt": "2020-10-27T18:01:00Z",
  //       "content": "NICOSIA, Cyprus, Oct. 27, 2020 /PRNewswire/ -- Worldwide: It is true that bitcoin has been acclaimed for its better security than the conventional currencies. Whether the need is for keeping personal… [+2784 chars]"
  //   }
  // ]}
  // const data = await response.json();
  const data = await response.json();
  console.log(data);
}

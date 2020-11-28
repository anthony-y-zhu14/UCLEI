import React from 'react';
import { withStyles } from "@material-ui/core/styles";
import MediaCard from './card.js';

const styles = {
  newsDiv: {
    width: 100
  }
};

class NewsList extends React.Component {
  constructor(props) {
    super(props);
    console.log(props)
    this.state = {
      data: ({

      "status": "ok",
      "totalResults": 3683,
      "articles": [
          {
              "source": {
                  "id": null,
                  "name": "CoinDesk"
              },
              "author": "Jaspreet Kalra",
              "title": "Casa Rolls Out ‘Bank-to-Wallet’ Bitcoin-Buying Services for US Customers",
              "description": "The cryptocurrency custody startup announced on Thursday that users will now be able to buy bitcoin (BTC) on the Casa app using their bank accounts.",
              "url": "https://www.coindesk.com/casa-rolls-out-bank-to-wallet-bitcoin-buying-service-for-us-customers",
              "image": "https://static.coindesk.com/wp-content/uploads/2020/05/shutterstock_728420089-1200x628.jpg",
              "publishedAt": "2020-10-29T15:00:43Z",
              "content": null
          },
          {
              "source": {
                  "id": null,
                  "name": "Network World"
              },
              "author": "Mark Dargin, Mark Dargin",
              "title": "'Credible threat': How to protect networks from ransomware",
              "description": "(Editor’s note, Oct. 29, 2020: With the FBI and US Department of Homeland Security recently warning of credible cyberthreats to healthcare facilities including ransomware, it’s a good time to review the steps outlined in this article that enterprises can take…",
              "url": "https://www.networkworld.com/article/3218708/how-to-protect-your-network-from-ransomware-attacks.html",
              "image": "https://images.techhive.com/images/article/2017/02/ransomware-100710984-large.jpg",
              "publishedAt": "2020-10-29T14:53:00Z",
              "content": "(Editors note, Oct. 29, 2020: With the FBI and US Department of Homeland Security recently warning of credible cyberthreats to healthcare facilities including ransomware, its a good time to review th… [+6659 chars]"
          },
          {
              "source": {
                  "id": null,
                  "name": "BusinessLine"
              },
              "author": "S Kalyanasundaram",
              "title": "Crypto mustn’t have currency",
              "description": "RBI is right in wanting it banned as it has no sovereign backing",
              "url": "https://www.thehindubusinessline.com/opinion/crypto-mustnt-have-currency/article32974094.ece",
              "image": "https://www.thehindubusinessline.com/opinion/h9kasr/article32974093.ece/ALTERNATES/LANDSCAPE_615/BL30THINKBITCOIN",
              "publishedAt": "2020-10-29T14:20:02Z",
              "content": "Over the past one month the price of Bitcoin, the most popular among cryptocurriences, has surged around 35 per cent to touch $13,150. Analysts expect it to touch $20,000 by mid-March 2021.\r\nIn India… [+4139 chars]"
          },
          {
              "source": {
                  "id": null,
                  "name": "Cointelegraph"
              },
              "author": "Cointelegraph By Michaël van de Poppe",
              "title": "Up or down? These Bitcoin price levels hint at the next move from $13K",
              "description": "Bitcoin price action has turned sideways amid fears of potential Coronavirus lockdowns across Europe establishing some clearly-defined support and resistance levels around $13K.",
              "url": "https://cointelegraph.com/news/up-or-down-these-bitcoin-price-levels-hint-at-the-next-move-from-13k",
              "image": "https://s3.cointelegraph.com/uploads/2020-10/ca751e98-9db8-456f-8e5b-5aac5bb2be5e.jpg",
              "publishedAt": "2020-10-29T14:07:57Z",
              "content": "Bitcoin (BTC) price has had a tremendous month as the price rallied from $10,500 to $13,800. However, in recent days, momentum is slowing amid rising coronavirus fears. Bitcoins price dropped from $1… [+3667 chars]"
          }
        ]})
    };
  };

  componentDidMount() {
    this.getNews()
      .then(res => this.setState({ data : res}))
      .catch (err => console.log(err))
  }

  getNews = async (err) => {
    let date = new Date();
    let today = date.toISOString().slice(0,10);
    let query = "Stocks";

    let url = 'https://gnews.io/api/v4/search?' +
                `q=${query}&` +
                `from=${today}&` +
                'country=us&' +
                'token=9413f702be9d4fcf334d0ce66270875a';

    const response = await fetch(url);
    const body = await response.json();

    if(response.status !== 200) {
      throw Error(body.message)
    }
    console.log(body);
    return body;
  };

  render() {
    const { classes } = this.props;

    if(!this.state.data) {
      return (
        <h1>Loading...</h1>
      )
    }
    return (
      <React.Fragment>
        {this.state.data.articles.map(articles => (
          <MediaCard className={classes.newsDiv} articleImg={articles.image} articleSource={articles.source.name} articleDesc={articles.title} articleLink={articles.url}/>
        ))}
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(NewsList);

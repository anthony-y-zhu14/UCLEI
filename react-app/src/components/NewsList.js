import React from 'react';

class NewsList extends React.Component {
  constructor(props) {
    super(props);
    console.log(props)
    this.state = {
      data: undefined
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
    if(!this.state.data) {
      return (
        <h1>Loading...</h1>
      )
    }
    return (
      <React.Fragment>
      {this.state.data.articles.map(articles => (
        <div>
          <h6>{articles.title}</h6>
          <p>{articles.source.name}</p>
          <li>{articles.description}</li>
        </div>
      ))}
    </React.Fragment>
    )
  }
}

export default NewsList;

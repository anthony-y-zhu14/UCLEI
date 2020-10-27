// import React from "react";
// import { Container, Header } from "semantic-ui-react";
// import { getNews } from './NewsItems.js'

// class GridList extends React.Component {
//   constructor(props){
//     super(props);
//     this.state = {
//       articles: [],
//       apiError: ""
//     }
//   }

//   componentDidMount = async (e) => {
//     try {
//       this.setState({ loading: true });
//       const response = getNews();
//       console.log(response.articles);

//       this.setState({
//         articles: response.articles,
//       });

//     } catch (e) {
//       this.setState({ apiError: "Could not find any articles" });
//     }
//     this.setState({ loading: false });
//   };

//   render() {

//     const {
//      articles,
//      apiError
//     } = this.state;

//     console.log(this.state);

//     return (
//       <Container>
//       <h1>{articles}</h1>
//       </Container>

//     );
//   }
// }

// export default GridList;

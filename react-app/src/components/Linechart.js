import React from "react";
import PropTypes from 'prop-types';
import Chart from "chart.js";
import { LinearProgress } from '@material-ui/core';


class LineChart extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          stockData: this.props.cData,
          query: window.location.href.slice(29),

      };
  }
  componentDidUpdate() {
    if (this.props.onChange) {
      this.props.onChange(this.state);
    }
  }

  componentDidMount() {
    console.log(this.props.stockData);
    // this.setState({stockData: this.props.cData});

    const ctx = document.getElementById("marketChart");
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: [1,2,3,4],
        datasets: [
          {
            label: "Past 4 Days",
            data: [this.state.stockData.prev_close, this.state.stockData.open, this.state.stockData.historical[0],this.state.stockData.historical[1]],
            backgroundColor: '#6C9FF8',
            borderColor: '#35363C',
            borderWidth: 1
          }
        ]
      }
    });
    console.log(this.state.stockData)
  }

  render() {


    // if(!this.props.cData) {
    //   return (
    //     <div>
    //     <h5>   Loading   </h5>
    //     <LinearProgress/>
    //     </div>
    //   );
    // }
      return (
        <div className="App">
        <h1>{this.state.query}</h1>
        <p>{this.state.stockData.quote}</p>
        <canvas id="marketChart"/>
        </div>
      );
    }
  }




//   useEffect(() => {
//     setData(cData);
//     console.log(cData);
//     if(cdata) {
//       // let data = getData('TSLA');
//
//     return (
//       <div className="App">
//         <canvas id="marketChart"/>
//       </div>
//     );
//
//
// }
//
// }

export default LineChart;

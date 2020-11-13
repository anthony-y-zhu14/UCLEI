import React from "react";
import PropTypes from 'prop-types';
import Chart from "chart.js";
import { LinearProgress } from '@material-ui/core';


class LineChart extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          stockData: undefined,
      };
  }

  componentDidMount() {
    this.setState({stockData: this.props.cData});
    console.log(this.props.cData)
  }

  render() {

    // const ctx = document.getElementById("marketChart");
    //     new Chart(ctx, {
    //       type: 'line',
    //       data: {
    //         labels: [1,2],
    //         datasets: [
    //           {
    //             label: "Week",
    //             data: [1,2],
    //             backgroundColor: '#6C9FF8',
    //             borderColor: '#35363C',
    //             borderWidth: 1
    //           }
    //         ]
    //       }
    //     });


    if(!this.state.stockData) {
      return (
        <div>
        <h5>   Loading   </h5>
        <LinearProgress/>
        </div>
      );
    }
      return (
        <div className="App">
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

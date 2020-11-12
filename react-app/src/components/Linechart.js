import React, { useEffect } from "react";
import Chart from "chart.js";

export default function LineChart({ticker}) {

//   const getData = async (ticker, Error) => {
//
//     let query = ticker;
//     let key = '26904eef524b54f1c39af626561d7002'
//
//     let xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function() {
//     if (this.readyState == 4 && this.status == 200) {
//        // Typical action to be performed when the document is ready:
//        let body = xhttp.responseText;
//        console.log(body);
//        return body;
//     }
// };
//       xhttp.open("GET", 'http://api.marketstack.com/v1/eod?access_key=26904eef524b54f1c39af626561d7002&symbols=AAPL');
//       xhttp.send();

    // //   let url = `http://api.marketstack.com/v1/eod/?access_key=${key}`
    // //
    // // const response = await fetch(url);
    // // const body = await response.json();
    //
    // if(response.status !== 200) {
    //   console.log('Error getting data')
    // }

  // };

  const readStock = async (event) => {
    //should be get request with query param as id
    const response = await fetch(`/stock-data?search=${ticker}`);
    const body = await response.json();
    if (response.status !== 200) {
      throw Error(body.message)
    }
    console.log(body)
  }

  useEffect(() => {
    // let data = getData('TSLA');
    const ctx = document.getElementById("marketChart");
    new Chart(ctx, {
      type: 'line',
      data: {
        labels:  [],
        datasets: [
          {
            label: "Week",
            data: [],
            backgroundColor: '#6C9FF8',
            borderColor: '#35363C',
            borderWidth: 1
          }
        ]
      }
    });
  });
  return (
    <div className="App">
      <h1 onClick={readStock}>{ticker}</h1>
      <canvas id="marketChart"/>
    </div>
  );
}

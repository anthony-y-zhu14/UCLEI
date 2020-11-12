import React, { useEffect } from "react";
import Chart from "chart.js";

export default function LineChart({ticker}) {

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

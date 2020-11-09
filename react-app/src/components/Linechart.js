import React, { useEffect } from "react";
import Chart from "chart.js";

export default function LineChart() {
  useEffect(() => {
    const ctx = document.getElementById("marketChart");
    new Chart(ctx, {
      type: 'line',
      data: {
        labels:  ['9AM', '10AM', '12PM', '2PM', '4PM'],
        datasets: [
          {
            label: "Today",
            data: [11130.62, 11209.82, 11058.33, 11137.76, 11075.02],
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
      <canvas id="marketChart"/>
    </div>
  );
}

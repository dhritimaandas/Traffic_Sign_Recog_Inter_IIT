import React from "react";
import { Line } from "react-chartjs-2";

export default class FLineChart extends React.Component {
  render() {
    const fData = {
      labels: Array.from(Array(this.props.loss_p["train"].length).keys()),
      datasets: [
        {
          label: "Training F1 Score",
          fill: false,
          lineTension: 0.5,
          backgroundColor: "rgba(75,192,192,1)",
          borderColor: "blue",
          borderWidth: 2,
          data: this.props.f1_p["train"],
        },
        {
          label: "Valiadation F1 Score",
          fill: false,
          lineTension: 0.5,
          backgroundColor: "rgba(75,192,192,1)",
          borderColor: "red",
          borderWidth: 2,
          data: this.props.f1_p["val"],
        },
      ],
    };
    return (
      <Line
        data={fData}
        options={{
          title: {
            display: true,
            text: "Training and Validation F1 Score",
            fontSize: 15,
          },
          legend: {
            display: true,
            position: "top",
          },
          maintainAspectRatio: false,
          responsive: true,
          // scales: {
          //     xAxes: [{
          //         gridLines: {
          //             color: "rgba(0, 0, 0, 0)",
          //         }
          //     }],
          //     yAxes: [{
          //         gridLines: {
          //             color: "rgba(0, 0, 0, 0)",
          //         }
          //     }]
          // }
        }}
      />
    );
  }
}

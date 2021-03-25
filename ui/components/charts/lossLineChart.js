import React from "react";
import { Line } from "react-chartjs-2";

export default class LossLineChart extends React.Component {
  render() {
    const lossData = {
      labels: Array.from(Array(this.props.loss_p["train"].length).keys()),
      datasets: [
        {
          label: "Training Loss",
          fill: false,
          lineTension: 0.5,
          backgroundColor: "rgba(75,192,192,1)",
          borderColor: "blue",
          borderWidth: 2,
          data: this.props.loss_p["train"],
        },
        {
          label: "Validation Loss",
          fill: false,
          lineTension: 0.5,
          backgroundColor: "rgba(75,192,192,1)",
          borderColor: "red",
          borderWidth: 2,
          data: this.props.loss_p["val"],
        },
      ],
    };
    return (
      <Line
        data={lossData}
        options={{
          title: {
            display: true,
            text: "Training and Validation Loss",
            fontSize: 15,
            borderColor: "red",
          },
          legend: {
            display: true,
            position: "top",
          },
          maintainAspectRatio: false,
          responsive: true,
        }}
      />
    );
  }
}

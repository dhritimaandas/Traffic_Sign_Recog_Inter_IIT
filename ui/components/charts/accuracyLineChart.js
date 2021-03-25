import React from "react";
import { Line } from "react-chartjs-2";

export default class AccuracyLineChart extends React.Component {
  render() {
    const accData = {
      labels: Array.from(Array(this.props.loss_p["train"].length).keys()),
      datasets: [
        {
          label: "Training Accuracy",
          fill: false,
          lineTension: 0.5,
          backgroundColor: "rgba(75,192,192,1)",
          borderColor: "blue",
          borderWidth: 2,
          data: this.props.acc_p["train"],
        },
        {
          label: "Validation Accuracy",
          fill: false,
          lineTension: 0.5,
          backgroundColor: "rgba(75,192,192,1)",
          borderColor: "red",
          borderWidth: 2,
          data: this.props.acc_p["val"],
        },
      ],
    };

    return (
      <Line
        data={accData}
        options={{
          title: {
            display: true,
            text: "Training and Validation Accuracy",
            fontSize: 15,
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

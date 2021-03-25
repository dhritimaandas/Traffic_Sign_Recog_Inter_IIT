import React from "react";
import { Bubble } from "react-chartjs-2";

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default class TSNE extends React.Component {
  render() {
    var x = new Array(49);
    for (let i = 0; i < x.length; i++) x[i] = new Array();

    for (let i = 0; i < this.props.labels.length; i++) {
      x[this.props.labels[i]].push({
        x: this.props.points[i][0],
        y: this.props.points[i][1],
        r: Math.floor(Math.random() * 2 + 1),
      });
    }
    var dataSet = new Array();

    for (let i = 0; i < x.length; i++) {
      dataSet.push({
        label: "" + i,
        data: x[i],
        borderColor: getRandomColor(),
        pointRadius: 3,
        pointHoverRadius: 8,
      });
    }

    return (
      <Bubble
        data={{ datasets: dataSet }}
        options={{
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: "T-SNE Data",
            fontSize: 15,
          },
          maintainAspectRatio: false,
          responsive: true,
        }}
      />
    );
  }
}

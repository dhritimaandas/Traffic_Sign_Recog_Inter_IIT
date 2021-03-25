import React from "react";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default class HeatMap extends React.Component {
  constructor(props) {
    super(props);

    var dataSet = new Array();

    for (let i = 0; i < this.props.matrix.length; i++) {
      dataSet.push({
        name: "" + (i + 1),
        data: this.props.matrix[i],
      });
    }

    this.state = {
      series: dataSet,
      options: {
        chart: {
          height: 350,
          type: "heatmap",
        },
        dataLabels: {
          enabled: false,
        },
        colors: ["#008FFB"],
        title: {
          text: "Confusion Matrix",
        },
      },
    };
  }

  render() {
    return (
      <>
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="heatmap"
          height={520}
        />
      </>
    );
  }
}

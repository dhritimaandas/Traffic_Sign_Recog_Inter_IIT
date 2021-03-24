import React from 'react';
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
  });

var y_pred = [0, 1, 42, 5, 32, 40, 11, 19, 22, 37]
var y_true = [0, 0, 42, 1, 32, 35, 11, 19, 21, 37]

var matrix = new Array(48).fill(1).map(() => new Array(48).fill(1));

for(var i=0;i<y_pred.length;i++)
    matrix[y_pred[i]][y_true[i]] +=1

var dataSet = new Array();

for(let i=0 ; i<matrix.length; i++){

    dataSet.push({
        name : ''+(i+1),
        data : matrix[i]
    })

}

export default class HeatMap extends React.Component{

    constructor(props){
        super(props);

        this.state = {

            series : dataSet,
            options: {
                chart: {
                height: 350,
                type: 'heatmap',
                },
                dataLabels: {
                enabled: false
                },
                colors: ["#008FFB"],
                title: {
                text: 'Confusion Matrix'
                },
            },
            
        };
    }

    render(){

        return(

            <ReactApexChart options={this.state.options} series={this.state.series} type="heatmap" height={300} />

        )

    }

} 
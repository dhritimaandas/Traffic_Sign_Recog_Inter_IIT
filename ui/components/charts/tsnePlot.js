import React from 'react';
import { Points , labels } from '../tsne_data.json';
import { Scatter } from "react-chartjs-2";

var x = new Array(49); 

for(let i=0 ; i<x.length; i++) x[i] = new Array();

for(let i=0; i<labels.length; i++){

    x[labels[i]].push({x:Points[i][0], y:Points[i][1]});

}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

var dataSet = new Array();

for(let i=0 ; i<x.length; i++){

    dataSet.push({
        label : ''+i,
        data : x[i],
        borderColor:getRandomColor(),
        pointRadius : 3,
        pointHoverRadius : 8,
    })

}

const data = {
        datasets : dataSet
    }

export default class TSNE extends React.Component {

    render(){

        return(

            <Scatter data={data} />

        )

    }

} 
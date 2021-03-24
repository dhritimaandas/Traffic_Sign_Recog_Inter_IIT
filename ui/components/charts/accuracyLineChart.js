import React from 'react';
import { Line } from 'react-chartjs-2';
import {acc_p, loss_p} from '../data.json';


const accData = {
    labels: Array.from(Array(loss_p["train"].length).keys()),
     datasets: [
        {
            label: 'Training Accuracy',
            fill: false,
            lineTension: 0.5,
            backgroundColor: 'rgba(75,192,192,1)',
            borderColor: 'blue',
            borderWidth: 2,
            data: acc_p["train"]
        },
        {
            label: 'Validation Accuracy',
            fill: false,
            lineTension: 0.5,
            backgroundColor: 'rgba(75,192,192,1)',
            borderColor: 'red',
            borderWidth: 2,
            data: acc_p["val"]
        }
    ]
}

export default class AccuracyLineChart extends React.Component{

    render(){

        return(

            <Line 
                data={accData}
                options={{
                    title:{
                    display:true,
                    text:'Training and Validation Accuracy',
                    fontSize:15
                    },
                    legend:{
                    display:true,
                    position:'top'
                    },
                    maintainAspectRatio : false,
                    responsive: true,
                }}
            />

        )

    }

}
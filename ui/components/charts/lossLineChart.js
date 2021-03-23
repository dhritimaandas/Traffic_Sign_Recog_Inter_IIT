import React from 'react';
import { Line } from 'react-chartjs-2';
import {loss_p, valid_acc} from '../data.json';

const lossData = {
    labels: Array.from(Array(loss_p["train"].length).keys()),
    datasets: [
       {
           label: 'Training Loss',
           fill: false,
           lineTension: 0.5,
           backgroundColor: 'rgba(75,192,192,1)',
           borderColor: 'blue',
           borderWidth: 2,
           data: loss_p["train"],
       },
       {
           label: 'Validation Loss',
           fill: false,
           lineTension: 0.5,
           backgroundColor: 'rgba(75,192,192,1)',
           borderColor: 'red',
           borderWidth: 2,
           data: loss_p["val"],  
       }
   ]
}

export default class LossLineChart extends React.Component{

    render(){

        return (

            <Line
                data={lossData}
                options={{
                    title:{
                    display:true,
                    text:'Training and Validation Loss',
                    fontSize:15,
                    borderColor:"red"
                    },
                    legend:{
                    display:true,
                    position:'top',
                    }
                }}
            />

        )

    }

}
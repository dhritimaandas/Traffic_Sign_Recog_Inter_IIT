import React from "react";
import {loss_p, acc_p, f1_p, valid_acc} from "./data";
import {Col, Row, Container} from "react-bootstrap";
import { Line } from 'react-chartjs-2';
// import ApexCharts from "apexcharts";

// Radial Bar Code (DialPlot)

// var options = {  
//     chart: {
//         height: 350,
//         type: 'radialBar',
//     },
//     series: [70],
//     labels: ['Progress'],
//   }

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

const fData = {
    labels: Array.from(Array(loss_p["train"].length).keys()),
     datasets: [
        {
            label: 'Training F1 Score',
            fill: false,
            lineTension: 0.5,
            backgroundColor: 'rgba(75,192,192,1)',
            borderColor: 'blue',
            borderWidth: 2,
            data: f1_p["train"]
        },
        {
            label: 'Valiadation F1 Score',
            fill: false,
            lineTension: 0.5,
            backgroundColor: 'rgba(75,192,192,1)',
            borderColor: 'red',
            borderWidth: 2,
            data: f1_p["val"]
        }
    ]
}

export default class PredictionChart extends React.Component {

    // chart = new ApexCharts(document.querySelector("#chart"), options);

    render() {

        return (
            <Container>
                <Row>
                    <Col md={6}>
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
                    </Col>
                    <Col md={6}>
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
                            }
                        }}
                     />
                    </Col>
                    <Col md={6}>
                        <Line 
                        data={fData}
                        options={{
                            title:{
                            display:true,
                            text:'Training and Validation F1 Score',
                            fontSize:15
                            },
                            legend:{
                            display:true,
                            position:'top'
                            },
                            scales: {   // Hode Grid in Plot
                                xAxes: [{
                                    gridLines: {
                                        color: "rgba(0, 0, 0, 0)",
                                    }
                                }],
                                yAxes: [{
                                    gridLines: {
                                        color: "rgba(0, 0, 0, 0)",
                                    }   
                                }]
                            }
                        }}
                        />
                    </Col>
                    <Col md={6}>
                    {/* <svg viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="90" cy="90" r="40" fill="none" stroke="#000000" stroke-width="10" stroke-dasharray="251.68,502.4" stroke-linecap="round"/>
                    </svg> */}
                    
                        {/* <div id="chart"></div> */}
                    </Col>
                </Row>
            </Container>
        )
    }

}
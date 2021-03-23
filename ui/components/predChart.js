import React from "react";
import {loss_p, acc_p, f1_p, valid_acc} from "./data";
import {Col, Row, Container} from "react-bootstrap";
import { Line } from 'react-chartjs-2';
import ReactApexChart from "react-apexcharts";

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

    constructor(props) {
        super(props);

        this.state = {
        
          series: [100.0*valid_acc],
          options: {
            chart: {
              height: 350,
              type: 'radialBar',
              toolbar: {
                show: true
              }
            },
            plotOptions: {
              radialBar: {
                startAngle: -135,
                endAngle: 225,
                 hollow: {
                  margin: 0,
                  size: '70%',
                  background: '#fff',
                  image: undefined,
                  imageOffsetX: 0,
                  imageOffsetY: 0,
                  position: 'front',
                  dropShadow: {
                    enabled: true,
                    top: 3,
                    left: 0,
                    blur: 4,
                    opacity: 0.24
                  }
                },
                track: {
                  background: '#fff',
                  strokeWidth: '67%',
                  margin: 0, // margin is in pixels
                  dropShadow: {
                    enabled: true,
                    top: -3,
                    left: 0,
                    blur: 4,
                    opacity: 0.35
                  }
                },
            
                dataLabels: {
                  show: true,
                  name: {
                    offsetY: -10,
                    show: true,
                    color: '#888',
                    fontSize: '17px'
                  },
                  value: {
                    formatter: function(val) {
                      return parseInt(val);
                    },
                    color: '#111',
                    fontSize: '36px',
                    show: true,
                  }
                }
              }
            },
            fill: {
              type: 'gradient',
              gradient: {
                shade: 'dark',
                type: 'horizontal',
                shadeIntensity: 0.5,
                gradientToColors: ['#ABE5A1'],
                inverseColors: true,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100]
              }
            },
            stroke: {
              lineCap: 'round'
            },
            labels: ['Validation Accuracy'],
          },
        
        };

        this.stateTwo = {
        
            series: [100.0*acc_p["train"][acc_p["train"].length-1]],
            options: {
              chart: {
                height: 350,
                type: 'radialBar',
                toolbar: {
                  show: true
                }
              },
              plotOptions: {
                radialBar: {
                  startAngle: -135,
                  endAngle: 225,
                   hollow: {
                    margin: 0,
                    size: '70%',
                    background: '#fff',
                    image: undefined,
                    imageOffsetX: 0,
                    imageOffsetY: 0,
                    position: 'front',
                    dropShadow: {
                      enabled: true,
                      top: 3,
                      left: 0,
                      blur: 4,
                      opacity: 0.24
                    }
                  },
                  track: {
                    background: '#fff',
                    strokeWidth: '67%',
                    margin: 0, // margin is in pixels
                    dropShadow: {
                      enabled: true,
                      top: -3,
                      left: 0,
                      blur: 4,
                      opacity: 0.35
                    }
                  },
              
                  dataLabels: {
                    show: true,
                    name: {
                      offsetY: -10,
                      show: true,
                      color: '#888',
                      fontSize: '17px'
                    },
                    value: {
                      formatter: function(val) {
                        return parseInt(val);
                      },
                      color: '#111',
                      fontSize: '36px',
                      show: true,
                    }
                  }
                }
              },
              fill: {
                type: 'gradient',
                gradient: {
                  shade: 'dark',
                  type: 'horizontal',
                  shadeIntensity: 0.5,
                  gradientToColors: ['#ABE5A1'],
                  inverseColors: true,
                  opacityFrom: 1,
                  opacityTo: 1,
                  stops: [0, 100]
                }
              },
              stroke: {
                lineCap: 'round'
              },
              labels: ['Training Accuracy'],
            },
          
          
          };

          this.stateThree = {
          
            series: [{
              name: 'Metric1',
              data: [1,2,3,4,5]
            },
            {
              name: 'Metric2',
              data: [1,2,3,4,5]
            }
            ],
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
                text: 'HeatMap Chart (Single color)'
              },
            },
          
          
          };


        } 

    render() {

        return (
            <Container>
                <Row>
                    <Col md={7} style={{ boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
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
                    <Col md={12} style={{ boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
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
                    <Col md={12} style={{ boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
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
                            scales: {   
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
                    <Col md={12} style={{ boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
                        <ReactApexChart options={this.state.options} series={this.state.series} type="radialBar" height={350} />
                    </Col>
                    <Col md={12} style={{ boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
                        <ReactApexChart options={this.stateTwo.options} series={this.stateTwo.series} type="radialBar" height={350} />
                    </Col>
                    <Col md={12} style={{ boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
                        <ReactApexChart options={this.stateThree.options} series={this.stateThree.series} type="heatmap" height={350} />
                    </Col>
                </Row>
            </Container>
        )
    }

}
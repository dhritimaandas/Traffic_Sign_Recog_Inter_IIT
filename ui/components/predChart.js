import React from "react";
import {Col, Row, Container} from "react-bootstrap";
import LossLineChart from '../components/charts/lossLineChart'
import AccuracyLineChart from '../components/charts/accuracyLineChart';
import FLineChart from '../components/charts/f1LineChart';
import ValidationAccuracyRadial from '../components/charts/validationAccuracyRadial';
import TrainingAccuracyRadial from '../components/charts/trainingAccuracyRadial';
// import HeatMap from '../components/charts/heatMap';
import { makeStyles } from '@material-ui/core/styles';
import HeatMap from './charts/heatMap'
const useStyles = makeStyles({
  root: {
    boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    margin:8,
  }
});

const PredictionChart = () => {
    const classes = useStyles();
    return (
        <Container>
            <Row>
                <Col md={12} className={classes.root}><LossLineChart/></Col> {/* Loss */}
                <Col md={12} className={classes.root}><AccuracyLineChart/></Col> {/* Accuracy */}
                <Col md={12} className={classes.root}><FLineChart/></Col> {/* F1 Score */}
                <Col><ValidationAccuracyRadial/></Col>
                <Col><TrainingAccuracyRadial/></Col>
                <Col><HeatMap/></Col>
            </Row>
        </Container>
    )
}

export default PredictionChart;
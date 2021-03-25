import React, { Component } from 'react'
import { DropzoneArea } from 'material-ui-dropzone'
import { Container } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { Card, CardImg, CardBody, CardTitle, CardSubtitle, Row, Col } from 'reactstrap';
import axios from '../utils/axios'

import classesNames from '../data/classNames'

const Predictions = (props) => {
  return (
    <Row>
      <Col lg="4" md="6" sm="12">
        <Card>
          <CardImg top height="300px" src={URL.createObjectURL(props.images)} alt="Card image cap" />
          <CardBody>
            <CardTitle tag="h5"><b>Predicted Class:</b> ({classesNames[props.predictions.pred]})</CardTitle>
            <CardSubtitle tag="h6" className="mb-2 text-muted">Confidence: {props.predictions.confidence * 100 + '%'}</CardSubtitle>
          </CardBody>
        </Card>
      </Col>
      <Col lg="4" md="6" sm="12">
        <Card>
          <CardImg src={'data:image/jpg;base64,' + props.predictions.saliency_map} alt="Saliency map" />
        </Card>
      </Col>
    </Row>
  )
}

class DropzoneAreaExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      predictions: null,
      images: null
    };
  }
  handleChange(files) {
    this.setState({
      files: files
    });
  }

  submitHandler = () => {
    let form_data = new FormData();
    form_data.append('file', this.state.files[0]);
    axios
      .post("predict", form_data)
      .then(res => {
        this.setState({ predictions: res.data, images: this.state.files[0] })

      })
      .catch((e) => {
        alert('Some Error Occured');
      });
  }

  render() {
    return (
      <Container>
        <h3><b>Please Upload a Single Image to predict</b></h3>
        <br />
        <DropzoneArea
          onChange={this.handleChange.bind(this)}
          showPreviews={false}
        />
        <br />
        <Button
          variant="contained"
          color="primary"
          startIcon={<CloudUploadIcon />}
          onClick={this.submitHandler}
        >
          Predict
      </Button >
        <br />
        <br />
        <h3><b>Predictions</b></h3>
        {this.state.predictions ? <Predictions images={this.state.images} predictions={this.state.predictions} /> : <h5>No predictions</h5>}
      </Container>

    )
  }
}

export default DropzoneAreaExample;
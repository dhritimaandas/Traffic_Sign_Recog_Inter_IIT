import React, { Component } from "react";
import { DropzoneArea } from "material-ui-dropzone";
import { Container } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { CardColumns, Card, Row, Col } from "react-bootstrap";
import axios from "../utils/axios";

import classesNames from "../data/classNames";

const Predictions = (props) => {
  return (
    <Row>
      <Row>
        <Col sm={6}>
          <Card className="imageCards">
            <Card.Img
              variant="top"
              src={URL.createObjectURL(props.images)}
              alt="User Uploaded Image"
            />
            <Card.Body>
              <Card.Title>
                <b>Predicted Class:</b> ({classesNames[props.predictions.pred]})
              </Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                Confidence: {props.predictions.confidence * 100 + "%"}
              </Card.Subtitle>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6}>
          <Card className="imageCards saliency">
            <Card.Img
              variant="top"
              src={"data:image/jpg;base64," + props.predictions.saliency_map}
              alt="Saliency Map"
            />
            <Card.Body>
              <Card.Title>Saliency Map</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Row>
  );
};

class DropzoneAreaExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      predictions: null,
      images: null,
    };
  }
  handleChange(files) {
    this.setState({
      files: files,
    });
  }

  submitHandler = () => {
    let form_data = new FormData();
    form_data.append("file", this.state.files[0]);

    axios
      .post("predict", form_data)
      .then((res) => {
        console.log("ssssssssssssssss", res.response);
        this.setState({ predictions: res.data, images: this.state.files[0] });
      })
      .catch((e) => {
        alert("Some Error Occured");
      });
  };

  render() {
    return (
      <Container>
        <h3>
          <b>Please Upload a Single Image to predict</b>
        </h3>
        <br />
        <DropzoneArea
          onChange={this.handleChange.bind(this)}
          showPreviews={false}
          filesLimit={1}
        />
        <br />
        <Button
          variant="contained"
          color="primary"
          startIcon={<CloudUploadIcon />}
          onClick={this.submitHandler}
          disabled={this.state.files.length == 0}
        >
          Predict
        </Button>
        <br />
        <br />
        <h3 className="pb-3">
          <b>Predictions</b>
        </h3>
        {this.state.predictions ? (
          <Predictions
            images={this.state.images}
            predictions={this.state.predictions}
          />
        ) : (
          <h5>No predictions</h5>
        )}
      </Container>
    );
  }
}

export default DropzoneAreaExample;

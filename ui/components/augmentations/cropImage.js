import { Form, Container, Modal, Col, Row, Button } from "react-bootstrap";
import Image from "next/image";
import React from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { getStateProperty } from "../../data/ourRedux";

class CropImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      src: this.props.imgsrc,
      crop: {
        unit: "%",
        width: 100,
        height: 100,
        //aspect: 16 / 9,
      },
    };
  }

  onImageLoaded = (image) => (this.imageRef = image);
  onCropComplete = (crop) => this.makeClientCrop(crop);
  onCropChange = (crop, percentCrop) => this.setState({ crop });
  changeIndex = (index) => this.setState({ src: index });

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        "newFile.png"
      );
      this.setState({ croppedImageUrl });
    }
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error("Canvas is empty");
          return;
        }
        // blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, "image/png");
    });
  }

  render() {
    return (
      <div>
        <OnPropChange
          changable={this.props.imgsrc}
          setChange={this.changeIndex.bind(this)}
        />
        <Modal
          show={this.props.show}
          onHide={this.props.handleClose}
          centered
          size="md"
        >
          <Modal.Header closeButton>
            <Modal.Title>Crop Image</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Col sm={6} className="text-center">
                  <p className="lead">Original Image</p>
                  <div className="App">
                    {getStateProperty("images")[this.state.src] && (
                      <ReactCrop
                        src={getStateProperty("images")[this.state.src][0]}
                        crop={this.state.crop}
                        ruleOfThirds
                        onImageLoaded={this.onImageLoaded}
                        onComplete={this.onCropComplete}
                        onChange={this.onCropChange}
                      />
                    )}
                  </div>
                  {/* <Image src="/brain.jpg" alt="Picture of the author" width={300} height={300} /> */}
                </Col>
                <Col sm={6} className="text-center">
                  <p className="lead">Cropped Image</p>
                  {/* <Image src="/brain.jpg" alt="Picture of the author" width={300} height={300} /> */}
                  {this.state.croppedImageUrl && (
                    <img
                      alt="Cropped Image"
                      style={{ maxWidth: "100%" }}
                      src={this.state.croppedImageUrl}
                    />
                  )}
                </Col>
              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.props.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.close}>
              Add
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

const OnPropChange = ({ changable, setChange }) => {
  React.useEffect(() => {
    setChange(changable);
  }, [changable]);
  return null;
};

export default CropImage;

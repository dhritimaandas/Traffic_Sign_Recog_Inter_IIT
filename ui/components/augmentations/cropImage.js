import { Container, Modal, Col, Row, Button } from "react-bootstrap";
import React from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { getStateProperty, updateState } from "../../data/ourRedux";

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
  onCropChange = (crop) => this.setState({ crop });
  changeIndex = (index) =>
    this.setState({ src: index, crop: { unit: "%", width: 100, height: 100 } });

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = this.getCroppedImg(
        this.imageRef,
        crop,
        "newFile.png"
      );
      this.setState({ croppedImageUrl });
    }
  }

  getCroppedImg(image, crop) {
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
    return canvas.toDataURL("image/jpeg");
  }

  addCropping = () => {
    var arr = getStateProperty("images");
    arr[this.state.src] = [this.state.croppedImageUrl, arr[this.state.src][1]];
    updateState("images", arr);

    this.props.handleClose();
  };

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
                        src={URL.createObjectURL(
                          getStateProperty("files")[this.state.src][0]
                        )}
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
            <Button variant="primary" onClick={this.addCropping}>
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

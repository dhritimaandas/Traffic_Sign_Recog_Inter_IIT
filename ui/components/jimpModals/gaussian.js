import { useState } from "react";
import { Container, Form, Modal, Col, Row, Button } from "react-bootstrap";
import Image from "next/image";
import Jimp from "jimp";

export default function AugmentationModal({
  show,
  handleClose,
  augmentation,
  allAugs,
  setAllAugs,
}) {
  const [image, setImage] = useState("/brain.jpg");
  const [gauss, setGaussian] = useState(0);

  const augmentImage = async () => {
    await Jimp.read("/brain.jpg").then(function (img) {
      const val = parseInt(gauss) || 1;
      img.gaussian(val).getBase64(Jimp.AUTO, function (err, src) {
        setImage(src);
      });
    });
  };
  return (
    <Modal show={show} onHide={handleClose} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title>Gaussian</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <Col sm={6} className="text-center">
              <p className="lead">Original Image</p>
              <Image
                src="/brain.jpg"
                alt="Picture of the author"
                width={300}
                height={300}
              />
            </Col>
            <Col sm={6} className="text-center">
              <p className="lead">Augmented Image</p>
              <Image
                src={image}
                alt="Picture of the author"
                width={300}
                height={300}
              />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col className="text-center">
              <p class="font-weight-lighter text-left">
                Select a value between 0 to 20.
              </p>
              <Form className="text-center">
                <Row>
                  <Col sm={7}>
                    <Form.Group controlId="formBasicRange">
                      <Form.Control
                        type="number"
                        value={gauss}
                        min="0"
                        max="20"
                        onChange={(e) => setGaussian(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={5}>
                    <Button onClick={() => augmentImage()}>
                      Set Gaussian Blur Radius
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            let newDict = { ...allAugs };
            if (gauss != "0")
              newDict[augmentation.label] = {
                status: true,
                value: parseInt(gauss),
              };
            else delete newDict[augmentation.label];
            setAllAugs(newDict);
            handleClose();
          }}
        >
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

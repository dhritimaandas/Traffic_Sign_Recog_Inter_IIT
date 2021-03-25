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
  const [angle, setAngle] = useState(0);

  const augmentImage = () => {
    Jimp.read("/brain.jpg").then(function (img) {
      const ang = parseInt(angle) || 0;
      img.rotate(ang).getBase64(Jimp.AUTO, function (err, src) {
        setImage(src);
      });
    });
  };
  return (
    <Modal show={show} onHide={handleClose} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title>Rotate Image</Modal.Title>
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
                Select an angle between 0 to 360 degrees.
              </p>
              <Form className="text-center">
                <Row>
                  <Col sm={8}>
                    <Form.Group controlId="formBasicRange">
                      <Form.Control
                        type="number"
                        value={angle}
                        min="0"
                        max="360"
                        onChange={(e) => setAngle(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={4}>
                    <Button onClick={() => augmentImage()}>Set Angle</Button>
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
            if (angle != "0")
              newDict[augmentation.label] = {
                status: true,
                value: parseInt(angle),
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

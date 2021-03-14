import { useEffect, useState } from "react";
import { Container, Modal, Col, Row, Button } from "react-bootstrap";
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
  const [grayscale, setGrayscale] = useState(false);

  useEffect(() => {
    Jimp.read("/brain.jpg").then(function (img) {
      if (grayscale) img = img.grayscale();
      img.getBase64(Jimp.AUTO, function (err, src) {
        setImage(src);
      });
    });
  }, [grayscale]);
  return (
    <Modal show={show} onHide={handleClose} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title>Apply Grayscale</Modal.Title>
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
              <Button
                variant="warning"
                className="ml-2"
                onClick={() => setGrayscale(!grayscale)}
              >
                Toggle Grayscale
              </Button>
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
            newDict[augmentation.label] = true;
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

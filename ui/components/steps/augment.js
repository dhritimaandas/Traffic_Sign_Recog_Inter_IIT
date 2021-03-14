import { useEffect, useState } from "react";
import { Form, Container, Modal, Col, Row, Button } from "react-bootstrap";
import Select from "react-select";
import Image from "next/image";
import Chip from "@material-ui/core/Chip";
import Jimp from "jimp";
import fs from "fs";

const augmentationOptions = [
  { value: 0, label: "Flip", augments: "Horizontal, Vertical" },
  { value: 1, label: "Crop", augments: "0% Minimum Zoom, 40% Maximum Zoom" },
  { value: 3, label: "Blur", augments: "Up to 1.5px" },
];

export default function Augment() {
  const [augs, setAugs] = useState({
    Flip: true,
    Crop: true,
    Blur: false,
  });
  const [selected, setSelected] = useState();

  const handleChange = (augment) => {
    setSelected(augment);
  };

  const handleDelete = (augmentationKey) => {
    let newDict = { ...augs };
    newDict[augmentationKey] = false;
    setAugs(newDict);
  };

  const [showModal, setShow] = useState(false);
  const handleClose = () => setShow(false);

  return (
    <Container className="py-3" style={{ minHeight: "50vh" }}>
      <AugmentationModal
        allAugs={augs}
        setAllAugs={setAugs}
        augmentation={selected || ""}
        show={showModal}
        handleClose={handleClose}
      />
      <Col>
        <h5>Add Augmentations</h5>
        <Row className="pt-3">
          <Col md={6}>
            <Select
              options={augmentationOptions}
              value={selected}
              onChange={handleChange}
            />
          </Col>
          <Col md={6}>
            <Button
              onClick={() => setShow(true)}
              variant="dark"
              disabled={selected == null}
            >
              Add
            </Button>
          </Col>
        </Row>
      </Col>
      <Col className="mt-3">
        <h5>Selected Augmentations</h5>
        <Row className="pt-3">
          <Col>
            {Object.keys(augs).map((current) => {
              if (augs[current] == true)
                return (
                  <Chip
                    className="mx-1"
                    label={current}
                    onDelete={() => handleDelete(current)}
                    color="primary"
                  />
                );
            })}
          </Col>
        </Row>
      </Col>
    </Container>
  );
}

const AugmentationModal = ({
  show,
  handleClose,
  augmentation,
  allAugs,
  setAllAugs,
}) => {
  const [image, setImage] = useState("");

  useEffect(() => {
    Jimp.read("brain.jpg").then(function (img) {
      img.brightness(-0.5).getBase64(Jimp.AUTO, function (err, src) {
        setImage(src);
      });
    });
  }, []);
  return (
    <Modal show={show} onHide={handleClose} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title>{augmentation.label} Image</Modal.Title>
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
            <Col lg={3} />
            <Col lg={6}>
              <Form className="text-center">
                <Form.Group controlId="formBasicRange">
                  <Form.Control type="range" />
                  <Form.Label>Select an Value</Form.Label>
                </Form.Group>
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
            newDict[augmentation.label] = true; // update with value
            setAllAugs(newDict);
            handleClose();
          }}
        >
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

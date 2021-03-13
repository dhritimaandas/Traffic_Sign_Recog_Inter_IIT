import { useState } from "react";
import { Form, Container, Modal, Col, Row, Button } from "react-bootstrap";
import Select from "react-select";
import Image from "next/image";
import Chip from "@material-ui/core/Chip";

const preprocessingOptions = [
  { value: 0, label: "Grayscale" },
  { value: 1, label: "Contrast" },
  { value: 2, label: "Tile" },
  { value: 3, label: "Resize" },
];

export default function Augment() {
  const [augs, setAugs] = useState([
    "Preprocessing 1",
    "Preprocessing 2",
    "Preprocessing 3",
  ]);
  const [selected, setSelected] = useState();

  const handleChange = (augment) => {
    setSelected(augment);
  };
  const handleDelete = (e) =>
    setAugs(augs.filter((preprocessing) => preprocessing != e));
  const [showModal, setShow] = useState(false);
  const handleClose = () => setShow(false);

  return (
    <Container className="py-3" style={{ minHeight: "50vh" }}>
      <AugmentationModal
        preprocessing={selected || ""}
        show={showModal}
        handleClose={handleClose}
      />
      <Col>
        <h5>Add Preprocessing Steps</h5>
        <Row className="pt-3">
          <Col md={6}>
            <Select
              options={preprocessingOptions}
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
        <h5>Selected Steps</h5>
        <Row className="pt-3">
          <Col>
            {augs.map((current) => (
              <Chip
                className="mx-1"
                label={current}
                onDelete={() => handleDelete(current)}
                color="primary"
              />
            ))}
          </Col>
        </Row>
      </Col>
    </Container>
  );
}

const AugmentationModal = ({ show, handleClose, preprocessing }) => {
  return (
    <Modal show={show} onHide={handleClose} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title>Add {preprocessing.label}</Modal.Title>
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
                src="/brain.jpg"
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
        <Button variant="primary" onClick={handleClose}>
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

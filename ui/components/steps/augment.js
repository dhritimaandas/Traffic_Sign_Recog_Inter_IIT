import { useEffect, useState, lazy } from "react";
import { Form, Container, Modal, Col, Row, Button } from "react-bootstrap";
import Select from "react-select";
import Image from "next/image";
import Chip from "@material-ui/core/Chip";
import Jimp from "jimp";
import { updateState, getStateProperty,getState } from "../../data/ourRedux";
import Preprocess from "./preprocess";
import FlipModal from "../jimpModals/flip";
import RotateModal from "../jimpModals/rotate";
import BrightnessModal from "../jimpModals/brightness";
import ContrastModal from "../jimpModals/contrast";
import GrayscaleModal from "../jimpModals/grayscale";
import BlurModal from "../jimpModals/blur";
import GaussianModal from "../jimpModals/gaussian";
import OpacityModal from "../jimpModals/opacity";
import InvertModal from "../jimpModals/invert";

const augmentationOptions = [
  { value: 0, label: "Flip" },
  { value: 1, label: "Rotate" },
];

export default function Augment() {
  const [augs, setAugs] = useState(getStateProperty("augmentations"));
  const [selected, setSelected] = useState();
  const [modalName, setModalName] = useState();
  const [showModal, setShow] = useState(false);
  const handleClose = () => setShow(false);

  useEffect(() => {
    updateState("augmentations", augs); //Update the augmentations
  }, [augs]);

  const handleChange = (augment) => {
    setSelected(augment);
  };

  const handleDelete = (augmentationKey) => {
    let newDict = { ...augs };
    delete newDict[augmentationKey];
    setAugs(newDict);
  };
console.log(getState())
  return (
    <Container className="py-3" style={{ minHeight: "50vh" }}>
      {modalName == "Flip" ? (
        <FlipModal
          allAugs={augs}
          setAllAugs={setAugs}
          augmentation={selected || ""}
          show={showModal}
          handleClose={handleClose}
        />
      ) : modalName == "Rotate" ? (
        <RotateModal
          allAugs={augs}
          setAllAugs={setAugs}
          augmentation={selected || ""}
          show={showModal}
          handleClose={handleClose}
        />
      ) : null}
      <Container>
        <p>
          Select the augmentations and preprocessings you want to apply on the
          whole existing dataset.
        </p>
      </Container>
      <Preprocess />
      <Col className="mt-3">
        <hr />
        <h5 className="pt-3">Add Augmentations</h5>
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
              onClick={() => {
                setShow(true);
                setModalName(selected.label);
              }}
              variant="dark"
              disabled={selected == null}
            >
              Add
            </Button>
          </Col>
        </Row>
      </Col>
      {Object.keys(augs).length ? (
        <Col className="mt-3">
          <h6>
            <u>Selected Augmentations</u>
          </h6>
          <Row className="pt-3">
            <Col>
              {Object.keys(augs).map((current) => {
                if (augs[current] && augs[current].status == true)
                  return (
                    <Chip
                      key={current}
                      className="mx-1"
                      label={
                        current + ": " + JSON.stringify(augs[current].value)
                      }
                      onDelete={() => handleDelete(current)}
                      color="primary"
                    />
                  );
              })}
            </Col>
          </Row>
        </Col>
      ) : null}
    </Container>
  );
}

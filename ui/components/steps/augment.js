import { useEffect, useState, lazy } from "react";
import { Form, Container, Modal, Col, Row, Button } from "react-bootstrap";
import Select from "react-select";
import Image from "next/image";
import Chip from "@material-ui/core/Chip";
import Jimp from "jimp";
import { updateState } from "../../data/ourRedux";

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
  { value: 2, label: "Brightness" },
  { value: 3, label: "Contrast" },
  { value: 4, label: "Grayscale" },
  { value: 5, label: "Invert Colors" },
  { value: 6, label: "Blur" },
  { value: 7, label: "Gaussian" },
  { value: 8, label: "Opacity" },
];

export default function Augment() {
  const [augs, setAugs] = useState({});
  const [selected, setSelected] = useState();
  const [modalName, setModalName] = useState();
  const handleChange = (augment) => {
    setSelected(augment);
  };

  const handleDelete = (augmentationKey) => {
    let newDict = { ...augs };
    delete newDict[augmentationKey];
    setAugs(newDict);
  };

  const [showModal, setShow] = useState(false);
  const handleClose = () => setShow(false);

  updateState("augmentations", augs); //Update the augmentations

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
      ) : modalName == "Brightness" ? (
        <BrightnessModal
          allAugs={augs}
          setAllAugs={setAugs}
          augmentation={selected || ""}
          show={showModal}
          handleClose={handleClose}
        />
      ) : modalName == "Contrast" ? (
        <ContrastModal
          allAugs={augs}
          setAllAugs={setAugs}
          augmentation={selected || ""}
          show={showModal}
          handleClose={handleClose}
        />
      ) : modalName == "Grayscale" ? (
        <GrayscaleModal
          allAugs={augs}
          setAllAugs={setAugs}
          augmentation={selected || ""}
          show={showModal}
          handleClose={handleClose}
        />
      ) : modalName == "Blur" ? (
        <BlurModal
          allAugs={augs}
          setAllAugs={setAugs}
          augmentation={selected || ""}
          show={showModal}
          handleClose={handleClose}
        />
      ) : modalName == "Gaussian" ? (
        <GaussianModal
          allAugs={augs}
          setAllAugs={setAugs}
          augmentation={selected || ""}
          show={showModal}
          handleClose={handleClose}
        />
      ) : modalName == "Opacity" ? (
        <OpacityModal
          allAugs={augs}
          setAllAugs={setAugs}
          augmentation={selected || ""}
          show={showModal}
          handleClose={handleClose}
        />
      ) : modalName == "Invert Colors" ? (
        <InvertModal
          allAugs={augs}
          setAllAugs={setAugs}
          augmentation={selected || ""}
          show={showModal}
          handleClose={handleClose}
        />
      ) : null}
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
      <Col className="mt-3">
        <h5>Selected Augmentations</h5>
        <Row className="pt-3">
          <Col>
            {Object.keys(augs).length
              ? Object.keys(augs).map((current) => {
                  if (augs[current].status == true)
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
                })
              : "No Augmentations Added"}
          </Col>
        </Row>
      </Col>
    </Container>
  );
}

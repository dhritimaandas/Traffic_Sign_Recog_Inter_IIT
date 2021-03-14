import { useEffect, useState } from "react";
import { Form, Container, Modal, Col, Row, Button } from "react-bootstrap";
import Select from "react-select";
import Image from "next/image";
import Chip from "@material-ui/core/Chip";
import Jimp from "jimp";
import fs from "fs";
import FlipModal from "../jimpModals/flip";
import RotateModal from "../jimpModals/rotate";
import BrightnessModal from "../jimpModals/brightness";
import ContrastModal from "../jimpModals/contrast";
import GrayscaleModal from "../jimpModals/grayscale";

const augmentationOptions = [
  { value: 0, label: "Flip", augments: "Horizontal, Vertical" },
  { value: 1, label: "Rotate", augments: "0% Minimum Zoom, 40% Maximum Zoom" },
  { value: 2, label: "Brightness", augments: "Up to 1.5px" },
  { value: 3, label: "Contrast", augments: "Up to 1.5px" },
  { value: 3, label: "Grayscale", augments: "Up to 1.5px" },
  { value: 3, label: "Invert Colors", augments: "Up to 1.5px" },
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
    newDict[augmentationKey] = false;
    setAugs(newDict);
  };

  const [showModal, setShow] = useState(false);
  const handleClose = () => setShow(false);

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
                  if (augs[current] == true)
                    return (
                      <Chip
                        className="mx-1"
                        label={current}
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

import { useEffect, useState } from "react";
import { Form, Container, Modal, Col, Row, Button } from "react-bootstrap";
import Select from "react-select";
import Chip from "@material-ui/core/Chip";
import { updateState, getStateProperty } from "../../data/ourRedux";
import BrightnessModal from "../jimpModals/brightness";
import ContrastModal from "../jimpModals/contrast";
import GrayscaleModal from "../jimpModals/grayscale";
import BlurModal from "../jimpModals/blur";
import GaussianModal from "../jimpModals/gaussian";
import OpacityModal from "../jimpModals/opacity";
import InvertModal from "../jimpModals/invert";

const availableSteps = [
  { value: 2, label: "Brightness" },
  { value: 3, label: "Contrast" },
  { value: 4, label: "Grayscale" },
  { value: 5, label: "Invert Colors" },
  { value: 6, label: "Blur" },
  { value: 7, label: "Gaussian" },
  { value: 8, label: "Opacity" },
];

export default function PreprocessComponent() {
  const [steps, setSteps] = useState(getStateProperty("preprocessing"));
  console.log(steps, "ddddddddddd", getStateProperty("preprocessing"));
  const [selected, setSelected] = useState();
  const [modalName, setModalName] = useState();
  const [showModal, setShow] = useState(false);
  const handleClose = () => setShow(false);

  useEffect(() => {
    updateState("preprocessing", steps); //Update the preprocessings
  }, [steps]);

  const handleChange = (augment) => {
    setSelected(augment);
  };

  const handleDelete = (step) => {
    let newDict = { ...steps };
    delete newDict[step];
    setSteps(newDict);
  };

  return (
    <>
      {modalName == "Brightness" ? (
        <BrightnessModal
          allAugs={steps}
          setAllAugs={setSteps}
          augmentation={selected || ""}
          show={showModal}
          handleClose={handleClose}
        />
      ) : modalName == "Contrast" ? (
        <ContrastModal
          allAugs={steps}
          setAllAugs={setSteps}
          augmentation={selected || ""}
          show={showModal}
          handleClose={handleClose}
        />
      ) : modalName == "Grayscale" ? (
        <GrayscaleModal
          allAugs={steps}
          setAllAugs={setSteps}
          augmentation={selected || ""}
          show={showModal}
          handleClose={handleClose}
        />
      ) : modalName == "Blur" ? (
        <BlurModal
          allAugs={steps}
          setAllAugs={setSteps}
          augmentation={selected || ""}
          show={showModal}
          handleClose={handleClose}
        />
      ) : modalName == "Gaussian" ? (
        <GaussianModal
          allAugs={steps}
          setAllAugs={setSteps}
          augmentation={selected || ""}
          show={showModal}
          handleClose={handleClose}
        />
      ) : modalName == "Opacity" ? (
        <OpacityModal
          allAugs={steps}
          setAllAugs={setSteps}
          augmentation={selected || ""}
          show={showModal}
          handleClose={handleClose}
        />
      ) : modalName == "Invert Colors" ? (
        <InvertModal
          allAugs={steps}
          setAllAugs={setSteps}
          augmentation={selected || ""}
          show={showModal}
          handleClose={handleClose}
        />
      ) : null}

      <Col>
        <h5 className="pt-3">Add Preprocessing Steps</h5>
        <Row className="pt-3">
          <Col md={6}>
            <Select
              options={availableSteps}
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
      {Object.keys(steps).length ? (
        <Col className="mt-3">
          <h6>
            <u>Selected Preprocessing Steps</u>
          </h6>
          <Row className="pt-3">
            <Col>
              {Object.keys(steps).map((current) => {
                if (steps[current] && steps[current].status == true)
                  return (
                    <Chip
                      key={current}
                      className="mx-1"
                      label={
                        current + ": " + JSON.stringify(steps[current].value)
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
    </>
  );
}

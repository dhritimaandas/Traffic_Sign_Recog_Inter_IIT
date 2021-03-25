import { useEffect, useState } from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import Select from "react-select";
import Chip from "@material-ui/core/Chip";
import { updateState, getStateProperty, getState } from "../../data/ourRedux";
import FlipModal from "../jimpModals/flip";
import RotateModal from "../jimpModals/rotate";

const augmentationOptions = [
  { value: 0, label: "Flip" },
  { value: 1, label: "Rotate" },
];

export default function Augment() {
  const [augs, setAugs] = useState(getStateProperty("newags"));
  const [selected, setSelected] = useState();
  const [modalName, setModalName] = useState();
  const [showModal, setShow] = useState(false);
  const handleClose = () => setShow(false);

  useEffect(() => {
    updateState("newags", augs); //Update the augmentations
  }, [augs]);

  const handleChange = (augment) => {
    setSelected(augment);
  };

  const handleDelete = (augmentationKey) => {
    let newDict = { ...augs };
    delete newDict[augmentationKey];
    setAugs(newDict);
  };
  
  return (
    <Container className="py-3">
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

      <div className="mt-3">
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
      </div>
      {Object.keys(augs).length ? (
        <div className="mt-3">
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
        </div>
      ) : null}
    </Container>
  );
}

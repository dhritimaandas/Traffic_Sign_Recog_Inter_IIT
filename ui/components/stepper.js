import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import AddImage from "./steps/addImage";
import Confirm from "./Confirmation";
import Augment from "./steps/augment";
import Preprocess from "./steps/preprocess";
import {
  Row,
  Col,
  Container,
  Spinner,
  CardColumns,
  Card,
} from "react-bootstrap";
import CropImage from "./augmentations/cropImage";
import {
  resetState,
  preprocessImages,
  getState,
  getStateProperty,
} from "../data/ourRedux";

import PredictionChart from "./predChart";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
}));

function getSteps() {
  return [
    "Add New Images to the Dataset",
    "Preprocessing and Augmentations on Existing Dataset",
  ];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      // return <AddImage />;
      return [
        <AddImage />,
        <PredictionChart />
      ]
    case 1:
      return <Augment />;
    default:
      return "Unknown step";
  }
}

const HorizontalLinearStepper = (props) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const steps = getSteps();

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    if (activeStep == 0 && !getStateProperty("images").length)
      alert("Add Images to Proceeed!");
    else setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
    resetState();
  };

  props = { handleReset };
  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Container>
              <div className="pt-3">
                <PreprocessedImages />
              </div>
              <Typography className={classes.instructions}>
                All the steps are completed. Do you want to reset all your
                progress or Confirm?
              </Typography>
              <Row>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleBack}
                  className={classes.button}
                >
                  Back
                </Button>

                <Button
                  onClick={handleReset}
                  className={classes.button}
                  color="secondary"
                  variant="contained"
                >
                  Reset
                </Button>
                <Confirm open={props.pop} display={props.openBox} />
              </Row>
            </Container>
          </div>
        ) : (
          <div>
            <Container>
              <Typography className={classes.instructions}>
                {getStepContent(activeStep)}
              </Typography>
              <div>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  className={classes.button}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  className={classes.button}
                >
                  Next
                </Button>
              </div>
            </Container>
          </div>
        )}
      </div>
    </div>
  );
};
export default HorizontalLinearStepper;

import classNames from "../data/classNames";
const PreprocessedImages = () => {
  const [images, setImages] = React.useState([]);
  React.useEffect(() => {
    preprocessImages(400).then((arr) => setImages(arr));
  }, getState());

  return (
    <div>
      <Typography className="lead my-3 pb-3">
        Below are the preprocessed and augmented images produced for the given
        input.
      </Typography>
      {!images.length ? (
        <Container>
          <Col className="text-center">
            <Spinner animation="grow" />
            <p>Loading</p>
          </Col>
        </Container>
      ) : (
        <CardColumns>
          {images.map((img) => (
            <Col>
              <Card className="imageCards">
                <Card.Img variant="top" src={img[0]} />
                <Card.Body>
                  <Card.Text>Class {classNames[img[1]]}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </CardColumns>
      )}
    </div>
  );
};

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import { Container,Row,Col,Button,Modal } from 'react-bootstrap';
import './stepper'

const useStyles = makeStyles({
  root: {
    width: 300,
    margin: "auto",
    padding:20
  }
});

function valuetext(value) {
  return `${value}`;
}

const RangeSlider = (props) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(50);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    // props.splithandler(value[0],value[1]-value[0],100-value[1]);
    props.splithandler(value,100-value);
  };

  // var splitValues = [value[1],100-value[1]];

  // var splitValues = [value[0],value[1]-value[0],100-value[1]];

  return (
    <div className={classes.root}>
      <Typography id="discrete-slider" gutterBottom>
       <Container>
           <Row>
               <Col style={{ textAlign:"center" }} xs={6} md={6}>
                    Train <br></br>
                    {value}
               </Col>
               <Col style={{ textAlign:"center" }} xs={6} md={6}>
                   Validation <br></br>
                   {100-value}
               </Col>
           </Row>
       </Container>
      </Typography>
      <Slider
        // value={value}
        // onChange={handleChange}
        // valueLabelDisplay="auto"
        // aria-labelledby="range-slider"
        // getAriaValueText={valuetext}

        defaultValue={50}
        getAriaValueText={valuetext}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        onChange={handleChange}
        step={1}
        min={0}
        max={100}
      />
    </div>
  );
}

export default RangeSlider

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import { Container,Row,Col,Button,Modal } from 'react-bootstrap';
import './stepper'

const useStyles = makeStyles({
  root: {
    width: 300,
    // display:"none"
    margin: "auto",
    padding:20
  }
});

function valuetext(value) {
  return `${value}`;
}

const RangeSlider = (props) => {
  const classes = useStyles();
  const [value, setValue] = React.useState([0, 50]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [slider, setSlider] = React.useState(false);

  const openSlider = () => {
    setSlider(true);
  };

  const closeSlider = () => {
    setSlider(false);
  }

  props = {slider,setSlider};

  var splitValues = [value[0],value[1]-value[0],100-value[1]];

  return (
    <div className={classes.root}>
      <Typography id="range-slider" gutterBottom>
       <Container>
           <Row>
               <Col md={4}>
                    Train <br></br>
                    {value[0]}
               </Col>
               <Col md={4}>
                   Valid <br></br>
                   {value[1]-value[0]}
               </Col>
               <Col md={4}>
                   Test <br></br>
                   {100-value[1]}
               </Col>
           </Row>
       </Container>
      </Typography>
      <Slider
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        getAriaValueText={valuetext}
      />
    </div>
  );
}

export default RangeSlider
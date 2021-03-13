import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import RangeSlider from './Balance';
import HorizontalLinearStepper from './stepper'

const Confirm = (props) => {

  const [pop, setOpen] = React.useState(false);

  const openBox = () => {
    setOpen(true);
  };

  const closeBox = () => {
    setOpen(false);
    document.querySelector(".mainBtn").style.display="none";
  }

  const showSlider = () => {
      document.getElementById("slider").style.display="block";
  }

  const checkValue = () => {
      var arr = document.getElementsByName("choice");
      arr[0].checked?showSlider():closeBox();
  }

  props = {pop,openBox};

  return (
    <div>
      <Button onClick={openBox} className="mainBtn">Balance the Dataset</Button>
      <Dialog
        open={pop}
        display={openBox}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Balance the Dataset"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you wish to  balance the Dataset ? 
          </DialogContentText>
          <input style={{ margin:10 }} type="radio" value="Yes" name="choice" /> Yes
          <input style={{ margin:10 }} type="radio" value="No" name="choice" /> No
          <Button style={{ 'float':'right' }} onClick={checkValue}>Submit</Button>
          <div id="slider" style={{"display":"none"}}><RangeSlider/></div>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleReset} color="primary">
            Confirm
          </Button>
          <Button onClick={closeBox} color="primary" autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Confirm;
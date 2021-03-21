import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import RangeSlider from './Balance';
import {withRouter} from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import {updateState, getState,sendBackend} from '../data/ourRedux';
import Loader from "react-loader-spinner";
// import HorizontalLinearStepper from './stepper'


class Confirm extends Component {

  state = {
    pop: false,
    balanceDataset: false,
    datasetSplit: {
      // train: 0,
      // validate: 50,
      // test: 50
      train: 50,
      validate: 50,
    }
  }

  openBox = () => {
    this.setState({
      pop: true
    })
  };

  closeBox = () => {
    this.setState({
      pop: false
    })
  };

  // changeSplitHandler = (train, validate, test) => {
    changeSplitHandler = (train, validate) => {
    const newSplits = {
      train,
      validate,
      // test
    }
    this.setState({
      datasetSplit: newSplits
    })
  }


  formSubmitHandler = () => {
    var arr = document.getElementsByName("choice");
    var balance = arr[0].checked;

    // console.log(this.state)
    this.setState({
      balanceDataset: balance
    })
    updateState("balance", balance); //Update balance bool in the main data object
    updateState("dataSplits", this.state.datasetSplit); //Update the dataset splits in the main data object
    console.log(getState());

    sendBackend();

    document.getElementById("loaderCircle").style.display="block";
    this.closeBox();

   this.props.router.push('/dashboard');
  }

  render() {
    const pop = this.state.pop;
    return (
      <div>

       {/* Loader */}
        <div id="loaderCircle" style = {{ position:"fixed", top:0, bottom:0, left:0, right:0, zIndex:50000, backgroundColor:"rgba(0,0,0,0.9)", display:"none" }} >
          <Loader style={{ position: 'absolute', left: '50%', top: '50%',
                  transform: 'translate(-50%, -50%)' }} type="Puff" color="#00BFFF" height={100} width={100}/>
        </div>

        <Button onClick={this.openBox} className="mainBtn" color="primary" variant="contained">Confirm</Button>
        <Dialog
          open={pop}
          display={this.openBox}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Balance the Dataset"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Do you wish to  balance the Dataset ?
            <input style={{ margin: 8 }} type="radio" value={true} name="choice" /> Yes
            <input style={{ margin: 8 }} type="radio" value={false} name="choice" defaultChecked/> No
            </DialogContentText>
            <div id="slider" ><RangeSlider splithandler={this.changeSplitHandler}/></div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.formSubmitHandler} variant="contained" color="primary">
              Confirm
            </Button>
            <Button onClick={this.closeBox} variant="contained" color="secondary" autoFocus>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withRouter(Confirm);
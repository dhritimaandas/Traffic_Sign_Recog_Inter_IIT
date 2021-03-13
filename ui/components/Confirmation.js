import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const Confirm = (props) => {

  const [pop, setOpen] = React.useState(false);

  const openBox = () => {
    setOpen(true);
  };

  const closeBox = () => {
    setOpen(false);
    document.querySelector(".mainBtn").style.display="none";
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
        <DialogTitle id="alert-dialog-title">{"Balance the Dataset?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you wish to  balance the Dataset
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeBox} color="primary">
            Balance
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
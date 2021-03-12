import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import AugmentationsList from "./AugmentationsList";

function rand() {
    return Math.round(Math.random() * 20) - 10;
  }
  
  function getModalStyle() {
    const top = 50 
    const left = 50 
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
      
    
    };
  }


const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(10),
    },
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function AugmentationSec() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h3 id="simple-modal-title" style={{padding:20,}}>Augmentation Options</h3>
      <AugmentationsList />
    </div>
  );


  return (
    <div className={classes.root}>
        <h2>Augmentation Options</h2>
      <Button variant="contained" style={{fontSize:20,marginTop:30,width:"100%"}} onClick={handleOpen}>+ Add Augmentation Step</Button>
      <div >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        style={{fontSize:22,marginLeft: "auto",marginRight: "auto"}}
        
      >
        {body}
      </Modal>
      </div>
    </div>
  );
}
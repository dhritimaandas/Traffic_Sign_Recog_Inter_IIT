import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';


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
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));
  

  export default function SimpleModal(props) {
    const classes = useStyles();
    // getModalStyle is not a pure function, we roll the style only on the first render
    const modalStyle = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
  
    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    const {
        buttonLabel,
        className,
        modaltitle,
        body
      } = props;
      

      const body = (
        <div style={modalStyle} className={classes.paper}>
          <h3 id="simple-modal-title" style={{padding:20,}}>modaltitle</h3>
          {props.children}
        </div>
      );

      

    return (
      <div>
        <button type="button" onClick={handleOpen}>
          {buttonLabel}
        </button>
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
    );
  }
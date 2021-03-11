import React from 'react';
import Modalfun from './modal';
import { Button } from 'react-bootstrap';
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const Auglist = (props)=>{
    let {
        title,
        subtitle,
      } = props;
      
      const [disp, setDisp] = useState("block");

      const divStyle ={
        width:500,
        height:150,
        padding:20,
        margin:30,
        borderColor: 'black',
        borderStyle: "dashed",
        borderWidth: "medium",
        borderCollapse: "collapse",
        display: disp
    
    }

    const removeAug = ()=>{
        setDisp("None");
    }
     
    return(
        <div style={{...divStyle}}>
            <h2>{title}</h2>
            <p>{subtitle}</p>
            <div style ={{display: 'flex',alignItems: 'center', marginTop: 20}}>
            <Modalfun buttonLabel="Edit" modaltitle={title}/>
            <Button color="danger" style={{marginLeft: 10}} onClick={removeAug}>Remove</Button>
            </div>
        </div>

    )
}

export default Auglist;
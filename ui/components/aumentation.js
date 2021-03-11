import React from 'react';
import Auglist from './auglist'

const Augumentation = (props) => {

    //const augnames = props
    const augnames = ["Flip","Crop", "Rotate", "Blur"]


    return(
        <div style={{marginTop:80,marginLeft:300,}}>
        <h1>Augmentation Options</h1>
        <div>{
        augnames.map(name => <Auglist title={name}/>)
        }
        </div>
        </div>
    )

}

export default Augumentation;

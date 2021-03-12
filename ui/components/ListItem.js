import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


export default function ListItemFunc(props) {
    

return(
    <ListItem onClick={()=>props.handleClick}>
                  <ListItemText
                    primary= {props.title}
                    secondary= {props.subtitle}                     
                    key = {props.value} />               
    </ListItem>
)
}
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItemFunc from "./ListItem";


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}));

const augnames = [
    {   value : 0,
        title: "Flip",
        subtitle: "Horizontal, Vertical"
    },
    {   value : 1,
        title: "Crop",
        subtitle: "0% Minimum Zoom, 40% Maximum Zoom"
    },
    {   value : 2,
        title: "Rotate",
        subtitle: "Between -15° and +15°"
    },
    {   value : 3,
        title: "Blur",
        subtitle: "Up to 1.5px"
    },
]

export default function AugmentationsList() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
          <div className={classes.demo}>
            <List >{
            augnames.map(name => <ListItemFunc title={name.title} subtitle={name.subtitle} key={name.value}/>)
            }</List>
          </div>
          
          </div>
    
  );
}

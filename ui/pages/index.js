import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import NavBar from '../components/navbar/Navbar';
import Stepper from '../components/stepper';
import Title from '../components/steps/dynamic_title';
// import Head from 'next/head';
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

export default function Home() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <div className={classes.root}>
      <Title/>
      <CssBaseline />
      <NavBar />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
         <Stepper />
        </Container>
      </main>
    </div>
  );
}        
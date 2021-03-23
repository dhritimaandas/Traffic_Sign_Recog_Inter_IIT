import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Deposits from "../components/stats/Deposits";
import Orders from "../components/stats/Orders";
import { Row } from "react-bootstrap";
import Copyright from "../components/Copyright";
import NavBar from "../components/navbar/Navbar";

import Title from "../components/steps/dynamic_title";

import LossLineChart from "../components/charts/lossLineChart";
import AccuracyLineChart from "../components/charts/accuracyLineChart";
import FLineChart from "../components/charts/f1LineChart";
import ValidationAccuracyRadial from "../components/charts/validationAccuracyRadial";
import TrainingAccuracyRadial from "../components/charts/trainingAccuracyRadial";
import HeatMap from "../components/charts/heatMap";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
}));

export default function Dashboard() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper);

  return (
    <div className={classes.root} style={{}}>
      <Title />
      <CssBaseline />
      <NavBar />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12} md={7}>
              <Paper className={classes.paper}>
                <LossLineChart />
              </Paper>
            </Grid>

            {/* Recent Deposits */}
            <Grid item xs={12} md={5}>
              <Paper className={fixedHeightPaper}>
                <ValidationAccuracyRadial />
              </Paper>
            </Grid>
            <Grid item xs={12} md={7}>
              <Paper className={fixedHeightPaper}>
                <AccuracyLineChart />
              </Paper>
            </Grid>
            <Grid item xs={12} md={4} lg={5}>
              <Paper className={fixedHeightPaper}>
                <TrainingAccuracyRadial />
              </Paper>
            </Grid>
            {/* Recent Orders */}
            <Grid item xs={12} >
              <Paper className={classes.paper}>
                <FLineChart />
              </Paper>
            </Grid>
          </Grid>
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
}

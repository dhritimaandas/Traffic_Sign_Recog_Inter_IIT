import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Copyright from "../components/Copyright";
import NavBar from "../components/navbar/Navbar";
import dynamic from "next/dynamic";
import Typography from "@material-ui/core/Typography";
import Title from "../components/steps/dynamic_title";
import LossLineChart from "../components/charts/lossLineChart";
import AccuracyLineChart from "../components/charts/accuracyLineChart";
import HeatMap from "../components/charts/heatMap";
import FLineChart from "../components/charts/f1LineChart";
import ValidationAccuracyRadial from "../components/charts/validationAccuracyRadial";
import TrainingAccuracyRadial from "../components/charts/trainingAccuracyRadial";
import {Image} from 'react-bootstrap';
const Select = dynamic(() => import("react-select"), {
  ssr: false,
});

const augmentationOptions = [
  { value: 0, label: "Base Model" },
  { value: 1, label: "Latest Model" },
];

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
  const [selected, setSelected] = React.useState();

  const handleChange = (augment) => {
    setSelected(augment);
  };
  return (
    <div className={classes.root}>
      <Title />
      <CssBaseline />
      <NavBar />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" style={{ paddingTop: "2rem" }}>
          <Typography variant="h4">Model Statistics</Typography>
          <hr />
        </Container>
        <Container maxWidth="lg" style={{ paddingBottom: "2rem" }}>
          <Typography variant="h6" style={{ marginBottom: "1em" }}>
            Select the model for the metrics
          </Typography>
          <Select
            id="modelSelector"
            options={augmentationOptions}
            value={selected}
            onChange={handleChange}
          />
        </Container>

        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper className={fixedHeightPaper}>
                <TrainingAccuracyRadial />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className={fixedHeightPaper}>
                <ValidationAccuracyRadial />
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper className={classes.paper}>
                <div className="graphContainer">
                  <HeatMap />
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className={classes.paper}>
                <div className="gcr" >
                  <Image src="/tsne.png" fluid />
                  </div>
              </Paper>
            </Grid>

            <Grid item xs={12} >
              <Paper className={classes.paper}>
                <div className="accGraphContainer">
                  <AccuracyLineChart />
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className={classes.paper}>
                <div className="graphContainer">
                  <LossLineChart />
                </div>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper className={fixedHeightPaper}>
                <div className="graphContainer">
                  <FLineChart />
                </div>
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

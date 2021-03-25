import React, { useEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import NavBar from "../components/navbar/Navbar";
import dynamic from "next/dynamic";
import Typography from "@material-ui/core/Typography";
import Title from "../components/steps/dynamic_title";
import { fetchModels } from "../context/database";
import { Spinner } from "react-bootstrap";
const Select = dynamic(() => import("react-select"), { ssr: false });
const LossLineChart = dynamic(() =>
  import("../components/charts/lossLineChart")
);
const AccuracyLineChart = dynamic(() =>
  import("../components/charts/accuracyLineChart")
);
const FLineChart = dynamic(() => import("../components/charts/f1LineChart"));
const ValidationAccuracyRadial = dynamic(() =>
  import("../components/charts/validationAccuracyRadial")
);
const TrainingAccuracyRadial = dynamic(() =>
  import("../components/charts/trainingAccuracyRadial")
);
const HeatMap = dynamic(() => import("../components/charts/confusionMatrix"));
const TSNE = dynamic(() => import("../components/charts/tsnePlot"));

export default function Dashboard() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper);
  const [selected, setSelected] = React.useState();
  const [models, setModels] = React.useState({});

  useEffect(() => {
    fetchModels(setModels);
  }, []);

  console.log(models, "s");
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
        {Object.keys(models).length ? (
          <>
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
                    <TrainingAccuracyRadial
                      acc_p={models[Object.keys(models)[0]].model_metrics.acc_p}
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper className={fixedHeightPaper}>
                    <ValidationAccuracyRadial
                      accuracy={
                        models[Object.keys(models)[0]].model_metrics.valid_acc
                      }
                    />
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper className={classes.paper}>
                    <div className="accGraphContainer">
                      <AccuracyLineChart
                        acc_p={
                          models[Object.keys(models)[0]].model_metrics.acc_p
                        }
                        loss_p={
                          models[Object.keys(models)[0]].model_metrics.loss_p
                        }
                      />
                    </div>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper className={classes.paper}>
                    <div className="tsneContainer">
                      <TSNE
                        points={
                          models[Object.keys(models)[0]].model_metrics.Points
                        }
                        labels={
                          models[Object.keys(models)[0]].model_metrics.labels
                        }
                      />
                    </div>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <div className="heatMapContainer">
                      <HeatMap />
                    </div>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper className={classes.paper}>
                    <div className="graphContainer">
                      <LossLineChart
                        valid_acc={
                          models[Object.keys(models)[0]].model_metrics.valid_acc
                        }
                        loss_p={
                          models[Object.keys(models)[0]].model_metrics.loss_p
                        }
                      />
                    </div>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper className={fixedHeightPaper}>
                    <div className="graphContainer">
                      <FLineChart
                        loss_p={
                          models[Object.keys(models)[0]].model_metrics.loss_p
                        }
                        f1_p={models[Object.keys(models)[0]].model_metrics.f1_p}
                      />
                    </div>
                  </Paper>
                </Grid>
              </Grid>
            </Container>
          </>
        ) : (
          <Container maxWidth="lg" className="text-center">
            <Spinner animation="border" />
          </Container>
        )}
      </main>
    </div>
  );
}

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

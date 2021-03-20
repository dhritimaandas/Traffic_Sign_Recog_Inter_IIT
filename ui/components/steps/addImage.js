import React, { Component, useEffect } from "react";
import { DropzoneDialog } from "material-ui-dropzone";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import ImageTiles from "../imageTiles";
import { updateState, getStateProperty } from "../../data/ourRedux";
import { Container } from "react-bootstrap";
import Preprocess from "../addImage/preprocess";
import Augment from "../addImage/augment";

const styles = (theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
});

const Observer = ({ value, didUpdate }) => {
  useEffect(() => {
    didUpdate(value);
  }, [value]);
  return null;
};

class DropzoneDialogExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      class: "",
      files: getStateProperty("files"),
      images: getStateProperty("images"),
    };
  }

  handleClose() {
    this.setState({
      open: false,
    });
  }

  handleChange = (event) => {
    this.setState({
      class: event.target.value,
    });
  };

  handleSave(files) {
    //Saving files to state for further use and closing Modal.
    const filesNew = files.map((file) => {
      var reader = new FileReader();
      var url = reader.readAsDataURL(file);
      // console.log(file);
      // console.log(url);
      return [file, this.state.class];
    });
    const filesOld = this.state.files;
    const filesNewState = filesNew.concat(filesOld);

    this.setState({
      files: filesNewState,
      open: false,
    });
    updateState("files", filesNewState);
  }

  async updateImages(files) {
    var array = files.map(async (el) => [await toBase64(el[0]), el[1]]);
    const carray = await Promise.all(array);
    this.setState({
      images: carray,
    });
  }

  handleOpen() {
    this.setState({
      open: true,
    });
  }

  render() {
    updateState("images", this.state.images);
    if (this.state.files.length)
      console.log(
        "AAA",
        this.state.files[0][0],
        toBase64(this.state.files[0][0])
      );
    console.log(this.state.files);
    const { classes } = this.props;
    console.log(this.state.images);
    return (
      <Grid style={{ minHeight: "50vh" }}>
        <Observer
          value={this.state.files}
          didUpdate={this.updateImages.bind(this)}
        />

        <Grid container justify="center" alignItems="center">
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-helper-label">
              Class Name
            </InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={this.state.class}
              onChange={this.handleChange.bind(this)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={"Class 1"}>Class One</MenuItem>
              <MenuItem value={"Class 2"}>Class Two</MenuItem>
              <MenuItem value={"Class 3"}>Class Three</MenuItem>
            </Select>
            <FormHelperText>
              Select a class for the images you are going to add
            </FormHelperText>
          </FormControl>
          <Button
            disabled={this.state.class === ""}
            variant="contained"
            color="primary"
            onClick={this.handleOpen.bind(this)}
          >
            Add Image
          </Button>
          <DropzoneDialog
            open={this.state.open}
            onSave={this.handleSave.bind(this)}
            acceptedFiles={["image/jpeg", "image/png", "image/bmp"]}
            showPreviews={true}
            maxFileSize={500000000}
            onClose={this.handleClose.bind(this)}
          />
        </Grid>
        <Container>
          <div style={{ margin: "40px 0px" }}>
            <h4 style={{ marginBottom: "20px" }}>Images Uploaded</h4>
            {this.state.files.length === 0 ? (
              <p>No images</p>
            ) : (
              <ImageTiles tileData={this.state.images} />
            )}
          </div>
        </Container>
        <Preprocess />
        <Augment />
      </Grid>
    );
  }
}

export default withStyles(styles)(DropzoneDialogExample);

const toBase64 = async (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

// New added images
// Augmentations
// Preprocessing steps
// Data splits
// Balance the dataset
import axios from "../utils/axios";
import Jimp from "jimp";

let state = {
  files: [],
  images: [], //All the new added images and their classes
  dataSplits: {
    train: 100,
    validate: 0,
  }, //Train test validate splits
  augmentations: {}, //All the augmentations
  preprocessing: {}, //All the preprocessings
  newpps: {}, //new data preprocessings
  newags: {}, // Augmetations
  ppi: [], // preprocessed images
  balance: false, //Do you want to balance the dataset? No by default
};

const resetState = () => {
  state = {
    files: [],
    images: [], //All the new added images and their classes
    dataSplits: {
      train: 100,
      validate: 0,
    }, //Train test validate splits
    augmentations: {}, //All the augmentations
    preprocessing: {}, //All the preprocessings
    newpps: {}, //new data preprocessings
    newags: {},
    ppi: [], // preprocessed images
    balance: false, //Do you want to balance the dataset? No by default
  };
};
const updateState = (property, value) => {
  state[property] = value;
  return state;
};

const getState = () => state;
const getStateProperty = (property) => state[property];

const preprocessImages = async (size) => {
  var newImages = [];

  for (let i = 0; i < state.images.length; i++) {
    let e = state.images[i];
    const url = e[0];
    const itsClass = e[1];

    var image = await Jimp.read(url);
    image = image.resize(size, size);

    Object.keys(state.newpps).map((e) => {
      if (state.newpps[e].status) {
        if (e == "Brightness")
          image = image.brightness(state.newpps[e].value / 100);
        else if (e == "Contrast")
          image = image.contrast(state.newpps[e].value / 100);
        else if (e == "Grayscale") image = image.grayscale();
        else if (e == "Invert Colors") image = image.invert();
        else if (e == "Blur") image = image.blur(state.newpps[e].value);
        else if (e == "Gaussian") image = image.gaussian(state.newpps[e].value);
        else if (e == "Opacity")
          image = image.opacity(state.newpps[e].value / 100);
      }
    });

    newImages.push([await image.getBase64Async(Jimp.MIME_JPEG), itsClass]);

    Object.keys(state.newags).map(async (e) => {
      if (state.newags[e].status) {
        if (e == "Rotate") image = image.rotate(state.newags[e].value);
        else if (e == "Flip") {
          var horizontal = state.newags[e].value.includes("Horizontal");
          var vertical = state.newags[e].value.includes("Vertical");
          image = image.flip(horizontal, vertical);
        }
      }
      newImages.push([await image.getBase64Async(Jimp.MIME_JPEG), itsClass]);
    });
  }

  return newImages;
};

const sendBackend = async (callback) => {
  const data = {
    images: await preprocessImages(32),
    split: state.dataSplits.validate,
    augmentations: state.newags,
    preprocessing: state.newpps,
    balance: state.balance,
  };

  axios.post("train", data).then(
    (result) => {
      callback();
      console.log(result)
    },
    (e) => {
      if (e.response) alert("Error!", e.response.data);
      else alert("Some Error Occurred! Redirecting...");
      callback();
    }
  );
};

module.exports = {
  updateState,
  getState,
  getStateProperty,
  preprocessImages,
  sendBackend,
  resetState,
};

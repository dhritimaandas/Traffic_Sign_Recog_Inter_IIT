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
    test: 0,
    validate: 0,
  }, //Train test validate splits
  augmentations: {}, //All the augmentations
  preprocessing: {}, //All the preprocessings
  newpps: {}, //new data preprocessings
  newags: {},
  ppi: [], // preprocessed images
  balance: false, //Do you want to balance the dataset? No by default
};

const updateState = (property, value) => {
  state[property] = value;
  return state;
};

const getState = () => state;
const getStateProperty = (property) => state[property];

const preprocessImages = async () => {
  const convert = async (url) => {
    var image = await Jimp.read(url);
    image = image.resize(32, 32);
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

    Object.keys(state.newags).map((e) => {
      if (state.newags[e].status) {
        if (e == "Rotate") image = image.rotate(state.newags[e].value);
        else if (e == "Flip") {
          var horizontal = state.newags[e].value.includes("Horizontal");
          var vertical = state.newags[e].value.includes("Vertical");
          image = image.flip(horizontal, vertical);
        }
      }
    });
    return await image.getBase64Async(Jimp.AUTO);
  };

  const newImages = state.images.map(async (element) => [
    await convert(element[0]),
    element[1],
  ]);

  return await Promise.all(newImages);
};

const sendBackend = async () => {
  data = { split: state.dataSplits, images: await preprocessImages() };
  axios.post("train", data).then(
    (result) => {
      console.log(result);
    },
    (e) => {
      console.log(e);
    }
  );
};

module.exports = {
  updateState,
  getState,
  getStateProperty,
  preprocessImages,
  sendBackend,
};

// Test
// const newDir = {
//   train: 50,
//   test: 50,
//   valid: 0
// }

// console.log(updateState("dataSplits", newDir));
// console.log(getState())

const PreprocessedImageObserver = () => {
  useEffect(() => {
    preprocessImages(state.images);
  }, [state.newpps]);
  return null;
};

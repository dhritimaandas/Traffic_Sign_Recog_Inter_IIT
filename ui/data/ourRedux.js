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

const PreprocessedImageObserver = () => {
  useEffect(() => {
    preprocessImages(state.images);
  }, [state.newpps]);
  return null;
};

/*

const preprocessImages = () => {
	var finalImages 
  state.images.map(async (el) => [await toBase64(el[0]), el[1]]);

  var array = files.map(async (el) => [await toBase64(el[0]), el[1]]);
  const carray = await Promise.all(array);
  this.setState({
    images: carray,
  });



  for (let i = 0; i < state.images.length; i++) {
    
    Jimp.read().then(function (img) {
      const val = Math.max(parseInt(blur), 1);
      img.blur(val).getBase64(Jimp.AUTO, function (err, src) {
        setImage(src);
      });
    });
  }

  console.log(state.newpps);
};


*/

const updateState = (property, value) => {
  state[property] = value;
  return state;
};

const getState = () => {
  return state;
};
const getStateProperty = (property) => {
  return state[property];
};

const sendBackend = () => {
  console.log(state.images);
  // BAckend must work to uncomment
  // console.log({ images: state.images[0][0] })
  axios.post("yash", { images: state.images })
  .then(res => {
    console.log(res)
  }).catch(e => {
    console.log(e)
  })
};

module.exports = {
  updateState,
  getState,
  getStateProperty,
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

// New added images
// Augmentations
// Preprocessing steps
// Data splits
// Balance the dataset

let state = {
  images: [], //All the new added images and their classes
  dataSplits: {
    train: 100,
    test: 0,
    validate: 0
  }, //Train test validate splits
  augmentations : {}, //All the augmentations
  preprocessing : {}, //All the preprocessings
  balance: false, //Do you want to balance the dataset? No by default
};

const updateState = (property, value) => {
  state[property] = value
  
  return state
}

const getState = () => {
  return state;
}

module.exports = {
  updateState: updateState,
  getState: getState
}


// Test
// const newDir = {
//   train: 50,
//   test: 50,
//   valid: 0
// }

// console.log(updateState("dataSplits", newDir));
// console.log(getState())
import { loadFirebase } from "./firebase";
// Firebase instance
const firebase = loadFirebase();

export const uploadHandler = (
  files // Expects an array of files from the event.target.files
  // of file input html along with their classes
  // Type: [{file: File, class: String}]
) => {
  // Initialize firebase storage
  const storage = firebase.storage();
  // List to store file paths inside Firebase Storage
  var filePaths = [];
  let promises = [];

  for (let i = 0; i < files.length; i++) {
    // Create a reference for the image file
    // TODO: Change folder name as per the requirement
    const reference = storage.ref(
      "newImages/" + // folder name
        files[i].class + //class folder
        "/" +
        files[i].file.name // file name
    );
    promises.push(
      reference
        .put(files[i].file) // Upload the file
        .then(() => {
          filePaths.push(reference.fullPath); // Store the file path in an array
        })
    );
  }

  // Single Promise for all files
  Promise.all(promises)
    .then(() => console.log("DONE"))
    .catch(() => alert("Some Error Occurred"));
  return filePaths;
};

import { loadFirebase } from "./firebase";
// Firebase instance
const firebase = loadFirebase();

export const uploadHandler = (
  files // Expects an array of files from the event.target.files of file input html
) => {
  // Initialize firebase storage
  const storage = firebase.storage();
  // List to store file paths inside Firebase Storage
  var filePaths = [];

  // Single Promise for all files
  Promise.all(
    // Iterate through all the Files and upload one by one under single promise
    files.map(
      (
        file // File object
      ) => {
        // Create a reference for the image file
        // TODO: Change folder name as per the requirement
        const reference = storage.ref(
          "testimages/" + // folder name
            file.name // file name
        );

        reference
          .put(file) // Upload the file
          .then(() => {
            filePaths.push(reference.fullPath); // Store the file path in an array
          });
      }
    )
  ).then(() => console.log("DONE"));
  return filePaths;
};

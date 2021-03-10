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
      "testImages/" + // folder name
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

export const downHandler = (num) => {
  let imgpaths = [];

  const storage = firebase.storage();
  // Create a reference under which you want to list
var listRef = storage.ref("testImages/" + num);

// Find all the prefixes and items.

listRef.listAll()
  .then((res) => {
    res.prefixes.forEach((folderRef) => {
      // All the prefixes under listRef.
      // You may call listAll() recursively on them.
      //console.log(folderRef);
    });
    res.items.forEach((itemRef) => {
      // All the items under listRef.
     // paths.push(itemRef.fullPath)
    
     storage.ref().child(itemRef.fullPath).getDownloadURL()   //we r fetching urls by the path in firebase
  .then((url) => { imgpaths.push(url) })
  .catch((error) => {
    // Handle any errors
  });

    });

  }).catch((error) => {
    // Uh-oh, an error occurred!
  });

  Promise.all(imgpaths)
    .then(() => console.log("DONE"))
    .catch(() => alert("Some Error Occurred"));
console.log(imgpaths);
  return imgpaths;
  
}

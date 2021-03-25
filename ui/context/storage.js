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
  Promise.all(promises).catch(() => alert("Some Error Occurred"));
  return filePaths;
};

export const downloadHandler = async () => {
  let imgpaths = [];
  const storage = firebase.storage();
  const data = {};

  try {
    // TODO: Change json name to appropriate one
    const jsonRef = storage.ref("testImages/a.json");
    const jsonUrl = await jsonRef.getDownloadURL();
    data.json = jsonUrl;
  } catch (err) {
    if (err == "storage/object-not-found") data.json = null;
  }

  // Folders inside the main folder
  var folder = storage.ref("testImages/");
  folder.listAll().then((subfolders) => {
    subfolders.prefixes.forEach(async (folderRef) => {
      const images = await folderRef.listAll();
      images.items.forEach(async (image) => {
        const url = await image.getDownloadURL();
        imgpaths.push(url);
      });
    });
  });

  await Promise.all(imgpaths)
    .catch(() => alert("Some Error Occurred"));

  data.images = imgpaths;
  return data;
};

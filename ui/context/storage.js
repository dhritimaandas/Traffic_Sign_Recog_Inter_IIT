import { loadFirebase } from "./firebase";

const firebase = loadFirebase();

export const uploadHandler = (files) => {
  const storage = firebase.storage();
  var fullPaths = [];
  for (let i = 0; i < files.length; i++) {
    console.log("sss ", files[i].name);
    const reference = storage.ref("testimages/" + files[i].name);

    reference.put(files[i]).then(() => {
      console.log("Done");
      fullPaths.push(reference.fullPath);
    });
  }
  return fullPaths;
};

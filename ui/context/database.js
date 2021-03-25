import { loadFirebase } from "./firebase";

export const fetchModels = async (setFunction) => {
  const firebase = loadFirebase();
  var database = firebase.database();
  /*
  const results = await database.ref("models").get();
  setFunction(results.toJSON());
  */
 const ref = database.ref("models");
  ref.on('value', (snapshot) => {
    const data = snapshot.val();
    setFunction(data)
  });
  
  


  
};

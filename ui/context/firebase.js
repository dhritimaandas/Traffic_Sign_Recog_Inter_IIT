import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/storage";
import "firebase/database"

var firebaseConfig = {
  apiKey: "AIzaSyCaoxPJoGQtfw7FPUo8jsyigxJRCqW37Kk",
  authDomain: "interiit-ui.firebaseapp.com",
  databaseURL: "https://interiit-ui-default-rtdb.firebaseio.com",
  projectId: "interiit-ui",
  storageBucket: "interiit-ui.appspot.com",
  messagingSenderId: "89989048018",
  appId: "1:89989048018:web:6c45fde555f4323cd7af0b",
  measurementId: "G-YB3G1L3DJF",
};

// Initialize Firebase
export const loadFirebase = () => {
  if (typeof window !== "undefined") {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
      firebase.analytics();
    }
    return firebase;
  }
};

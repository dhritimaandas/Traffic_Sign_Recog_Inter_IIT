import pyrebase
import pickle

#Firebase configuration dictionary
firebaseConfig = {
  apiKey: "AIzaSyCaoxPJoGQtfw7FPUo8jsyigxJRCqW37Kk",
  authDomain: "interiit-ui.firebaseapp.com",
  projectId: "interiit-ui",
  storageBucket: "interiit-ui.appspot.com",
  messagingSenderId: "89989048018",
  appId: "1:89989048018:web:6c45fde555f4323cd7af0b",
  measurementId: "G-YB3G1L3DJF",
}

#Initialize firebase connection
firebase = pyrebase.initialize_app(firebaseConfig)
#Initialize firebase database
db = firebase.database()

def save_model_to_db(model, modelMetrics):
  #Pickle the model
  pickled_model = pickle.dumps(model)

  #new model json
  model_info = {'model': pickled_model, 'model_metrics':modelMetrics, 'created_time': time.time()}

  #Push the json to the database
  db.child("models").push(model_info)

  return model_info

def load_latest_model_from_db():
  latest_model = db.child("models").limit_to_last(1).get()  
  pickled_model = latest_model['model']

  return pickle.loads(pickled_model)
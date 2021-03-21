import pyrebase
import pickle
import time

#Firebase configuration dictionary
from config.firebaseConfig import firebaseConfig

#Initialize firebase connection
firebase = pyrebase.initialize_app(firebaseConfig)
#Initialize firebase database and srorage
db = firebase.database()
storage = firebase.storage()

# Model file is stored in storage and its name and date and metrics in the database
# when we want to fetch the latest model just fetch the latest model name from database and download that file from the storage

def test_db():
  model_info = {'model': 'hello', 'value': '1'}
  db.child('test').push(model_info)
  return 'hello'

#Uploads base model to db and storage. Always has id 0. Make sure database and storage are empty before using it.
def upload_base_model():
  #new model json
  model_info = {'modelId': 0, 'model_metrics':{}, 'created_time': time.time()}
  #Push the json to the database
  db.child("models").push(model_info)
  storage.child('models/0.pt').put('models/baseModel.pt')
  return 'Uploaded base model'

#Returns the ID of latest model present in the database
def get_latest_model():
  all_models = db.child("models").get()
  latest_model = None
  for model in all_models.each():
    latest_model = model.val()
  return latest_model['modelId']

#Downloads the latest model from storage in the downloads folder. Name of file in storage is the id_of_latest_model.pt
def load_latest_model_from_db():
  latest_model_id = get_latest_model()
  latest_model_name = 'models/'+str(latest_model_id)+'.pt'
  try:
    f = open('models/downloads/'+str(latest_model_id)+'.pt')
    print(latest_model_name + ' already saved in memory')
    f.close()
  except IOError:
    storage.child(latest_model_name).download('.','models/downloads/'+str(latest_model_id)+'.pt')
    print(latest_model_name + ' downloaded latest model')
  
  return latest_model_id

#Saves a new Model to database and storage
def save_model_to_db(modelId, modelMetrics):
  #new model json
  model_info = {'modelId': modelId, 'model_metrics':{}, 'created_time': time.time()}
  #Push the json to the database
  db.child("models").push(model_info)
  storage.child('models/'+str(modelId)+'.pt').put('models/downloads'+str(modelId)+'.pt')
  return 'Uploaded base model'
  return model_info
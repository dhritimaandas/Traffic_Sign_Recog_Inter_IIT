import sys
sys.path.insert(1, '/home/mainak/Documents/Robotics/Inter IIT/Traffic_Sign_Recog_Inter_IIT/backend')

from flask import Flask
from flask_cors import CORS
from flask_restful import reqparse, abort, Api, Resource
import werkzeug
from router.home import Home
from router.predict import PredictImage
from router.train import TrainImages
# import json, time
# import pickle
# from PIL import Image
# import sys
# import base64
# import copy
# from db import test_db, upload_base_model, load_latest_model_from_db, save_model_to_db

app = Flask(__name__)
api = Api(app)
CORS(app, origins=['*'])
app.config['SECRET_KEY'] = 'disable the web security'
app.config['CORS_HEADERS'] = 'Content-Type'


# argument parsing
parser = reqparse.RequestParser()
parser.add_argument("event")
parser.add_argument('file', type=werkzeug.datastructures.FileStorage, location=['json','form','files'])
parser.add_argument('images',type=list, location=['json'], action='append')
parser.add_argument("labels")
parser.add_argument("split")


api.add_resource(Home, '/yash')
api.add_resource(PredictImage, '/predict')
api.add_resource(TrainImages, '/train')

if __name__ == "__main__":
    app.run(debug=True)

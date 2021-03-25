import sys
sys.path.insert(1, '/home/mainak/Documents/Robotics/Inter IIT/Traffic_Sign_Recog_Inter_IIT/backend')

from flask import Flask
from flask_cors import CORS
from flask_restful import reqparse, abort, Api, Resource
import werkzeug
from router.home import Home
from router.predict import PredictImage
from router.train import TrainImages

app = Flask(__name__)
api = Api(app)
CORS(app, origins=['*'])
app.config['SECRET_KEY'] = 'disable the web security'
app.config['CORS_HEADERS'] = 'Content-Type'


api.add_resource(Home, '/upload')
api.add_resource(PredictImage, '/predict')
api.add_resource(TrainImages, '/train')

if __name__ == "__main__":
    app.run(debug=True)

from flask import Flask
from flask_restful import reqparse, abort, Api, Resource
import pickle
import numpy as np
from db import load_latest_model_from_db
from PIL import Image
import sys
import torch
from torch.autograd import Variable
from torchvision import transforms
sys.path.insert(1, '/gtsrb_base_model/engine/')
from model import TrafficSignNet


app = Flask(__name__)
api = Api(app)

# argument parsing
parser = reqparse.RequestParser()
parser.add_argument("event")
parser.add_argument("images")
parser.add_argument("labels")

DEVICE = torch.device("cpu")



class PredictImage(Resource):
    def get(self):
        args = parser.parse_args()
        image = Image.open(args['images'])
        model = TrafficSignNet()
        model = self.load_model('/43_classes.pt', model)# To be edited with load_model_from_pkl
        pred_label, pred_label_proba = self.predict_image(image, model)
        output_pred = {'pred': pred_label, 'confidence': pred_label_proba}
        return output_pred

    def load_image(self, image, size=(32, 32)):
        trans = transforms.Compose([transforms.Resize(size), transforms.ToTensor()])
        trans_image = trans(image).float()
        trans_image = Variable(trans_image, requires_grad = True)
        return trans_image
    
    def predict_image(self, image, model):
        model.eval()
        torch_image = self.load_image(image)
        with torch.no_grad():
            output = model(torch_image)
            _, pred = torch.max(output, 1)
            pred_proba = output[pred]
        return pred, pred_proba
    
    def load_model(self, checkpoint_path, model):
        checkpoint = torch.load(checkpoint_path, DEVICE)
        model.load_state_dict(checkpoint['state_dict'])
        return model

class TrainImages(Resource):
    def get(self):
        pass

api.add_resource(PredictImage, '/predict')
api.add_resource(TrainImages, '/train')

if __name__ == "__main__":
    app.run(debug=True)
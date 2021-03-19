from flask import Flask
from flask_cors import CORS
from flask_restful import reqparse, abort, Api, Resource
import pickle
import numpy as np
import pandas as pd
from db import load_latest_model_from_db
from PIL import Image
import sys
import copy
import torch
from torch.autograd import Variable
from torchvision import transforms
sys.path.insert(1, '../gtsrb_base_model/engine/')
sys.path.insert(1, '../gtsrb_base_model/utils/')
from model import TrafficSignNet
from dataloader import preprocess, GTSRB
from app_utils import ValidationError as VE
from train import train_model
from torchvision import transforms
from torch import nn, optim
from tools import save_ckp
from sklearn.model_selection import train_test_split
import werkzeug

app = Flask(__name__)
api = Api(app)
CORS(app, origins=['*'])
app.config['SECRET_KEY'] = 'disable the web security'
app.config['CORS_HEADERS'] = 'Content-Type'


# argument parsing
parser = reqparse.RequestParser()
parser.add_argument("event")
parser.add_argument('file', type=werkzeug.datastructures.FileStorage, location='files')
parser.add_argument('images', location=['json'])
parser.add_argument("labels")
parser.add_argument("split")

from torch.utils.tensorboard import SummaryWriter

EPOCHS = 10
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(DEVICE)
LR = 0.001
BATCH_SIZE = 4


class PredictImage(Resource):
    def get(self):
        args = parser.parse_args()
        image = Image.open(args['file'])
        output_pred = self.result(image)
        # print(output_pred)
        return output_pred
        
    def result(self, img):
        # print(image)
        model = TrafficSignNet()
        model = self.load_model('./43_classes.pt', model)# To be edited with load_model_from_pkl
        # print(model)
        pred_label, pred_label_proba = self.predict_image(img, model)
        output_pred = {'pred': pred_label, 'confidence': pred_label_proba}
        return output_pred

    def load_image(self, image, size=(32, 32)):
        trans = transforms.Compose([transforms.Resize(size), transforms.ToTensor()])
        trans_image = trans(image).float()
        trans_image = Variable(trans_image, requires_grad = True)
        trans_image=trans_image.unsqueeze(0)
        print("Shape:", trans_image)
        return trans_image
    
    def predict_image(self, image, model):
        model.eval()
        torch_image = self.load_image(image)
        with torch.no_grad():
            output = model(torch_image)
            print("hello_output:", output[0])
            print("output_size: ", output.size())
            _, pred = torch.max(output, 1)
            pred_proba = output[0][pred]
        return int(pred.numpy()), float(pred_proba.numpy())
    
    def load_model(self, checkpoint_path, model):
        checkpoint = torch.load(checkpoint_path, DEVICE)
        model.load_state_dict(checkpoint['state_dict'])
        return model

class TrainImages(Resource):
    def __init__(self):
        self.batch_size = 4
        self.dim = 3
    def post(self):
        args = parser.parse_args()
        images = args["images"]
        # print(images)
        labels = args["labels"]
        split = args["split"]
        images, labels = self.prepare_data(images, labels)
        self.check_exp(images, labels, split)
        val_acc = self.train(images, labels, split, self.batch_size)
        return val_acc

    def prepare_data(self, images, labels):
        ###### To be done ###### 
        #### convert images to a list of numpy arrays and labels to a list of integers ####
        return images, labels

    def check_exp(self, images, labels, split): ### custom value error function
        if len(images)!=len(labels):
            raise VE(400, msg="Number of images is not equal to number of labels")
        if len(np.array(images[0]).shape)!=3:
            raise VE(400, msg="Dimension of an image should be 3")
        if split > 1 or split < 0:
            raise VE(400, msg="validation split must be less than 1 and greater than 0")
        return
        
    def train(self, images, labels, split, batch_size):
        dataset_sizes,dataloaders = preprocess(images, labels, ratio=split,batch_size=batch_size)
        model = TrafficSignNet()
        ### change path accordingly
        model = self.load_model('/content/43_classes.pt', model)# To be edited with load_model_from_pkl
        criterion = nn.CrossEntropyLoss()
        optimizer = optim.Adam(model.parameters(), lr=LR)

        final_model, best_acc = train_model(model,criterion,optimizer,dataloaders,dataset_sizes)

        checkpoint = {
                'epoch': EPOCHS,
                'valid_acc': best_acc,
                'state_dict': model.state_dict(),
                'optimizer': optimizer.state_dict(),
            }
        ### change path accordingly
        checkpoint_path = "/content/43_classes_1.pt"
        save_ckp(checkpoint, checkpoint_path)
        return {'valid_acc': best_acc}
    
    def load_model(self, checkpoint_path, model):
        checkpoint = torch.load(checkpoint_path, DEVICE)
        model.load_state_dict(checkpoint['state_dict'])
        model.train()
        return model

class Home(Resource):
    def get(self):
        # args = parser.parse_args()
        # # print(request)
        # images = args["images"]
        # print(images)
        return 'Hello World! Yash daddy here!',200
    def post(self):
        args = parser.parse_args()
        # print(request)
        images = args["images"]
        print(images)
        return "hello"

api.add_resource(Home, '/yash')
api.add_resource(PredictImage, '/predict')
api.add_resource(TrainImages, '/train')

if __name__ == "__main__":
    app.run(debug=True)
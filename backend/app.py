from flask import Flask
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
sys.path.insert(1, '/gtsrb_base_model/engine/')
sys.path.insert(1, '/gtsrb_base_model/utils/')
from model import TrafficSignNet
from dataloader import preprocess, GTSRB
from app_utils import create_dataframe
from train import train_model
from torchvision import transforms
from torch import nn, optim
from tools import save_ckp
from sklearn.model_selection import train_test_split

app = Flask(__name__)
api = Api(app)

# argument parsing
parser = reqparse.RequestParser()
parser.add_argument("event")
parser.add_argument("images")
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
        args = parser.parse_args()
        images = args["images"]
        labels = args["labels"]
        split = args["split"]
        df = create_dataframe(images, labels)
        dataset_sizes,dataloaders = preprocess(df,ratio=split,batch_size=BATCH_SIZE)
        model = TrafficSignNet()
        model = self.load_model('/43_classes.pt', model)# To be edited with load_model_from_pkl
        criterion = nn.CrossEntropyLoss()
        optimizer = optim.Adam(model.parameters(), lr=LR)

        final_model, best_acc = train_model(model,criterion,optimizer,dataloaders,dataset_sizes)

        checkpoint = {
                'epoch': EPOCHS,
                'valid_acc': best_acc,
                'state_dict': model.state_dict(),
                'optimizer': optimizer.state_dict(),
            }
        checkpoint_path = "/content/drive/MyDrive/competitions/bosh-inter-iit/model3.pt"
        save_ckp(checkpoint, checkpoint_path)
        return {'valid_acc': best_acc}
    
    def load_model(self, checkpoint_path, model):
        checkpoint = torch.load(checkpoint_path, DEVICE)
        model.load_state_dict(checkpoint['state_dict'])
        return model


api.add_resource(PredictImage, '/predict')
api.add_resource(TrainImages, '/train')

if __name__ == "__main__":
    app.run(debug=True)
from flask_restful import Resource
import sys

import torch
from PIL import Image
from torchvision import transforms
from torch.autograd import Variable
import torch.nn.functional as F
from utils.trafficSignNet import TrafficSignNet
from db import load_latest_model_from_db
from config.appConfig import *
from utils.plotcm import salience

DEVICE = torch.device("cpu")

class PredictImage(Resource):
    def post(self):
        args = parser.parse_args()
        image = Image.open(args['file']).convert('RGB')
        output_pred = self.result(image)
        return output_pred
        
    def result(self, img):
        model = TrafficSignNet()
        latestModelId = load_latest_model_from_db()
        model = self.load_model('models/downloads/'+str(latestModelId)+'.pt', model)
        pred_label, pred_label_proba = self.predict_image(img, model)
        saliency_map = salience(model, img)
        output_pred = {'pred': pred_label, 'confidence': round(pred_label_proba,4), 'saliency_map': saliency_map} 
        return output_pred
    
    def predict_image(self, image, model):
        model.eval()
        torch_image = load_image(image)
        with torch.no_grad():
            output = model(torch_image)
            _, pred = torch.max(output, 1)
            output = F.softmax(output)
            pred_proba = output[0][pred]
        return int(pred.numpy()), float(pred_proba.numpy())
    
    def load_model(self, checkpoint_path, model):
        checkpoint = torch.load(checkpoint_path, DEVICE)
        model.load_state_dict(checkpoint['state_dict'])
        return model

def load_image(image, size=(32, 32)):
    trans = transforms.Compose([
        transforms.Resize(size), 
        transforms.ToTensor(),
        transforms.Normalize([0.3401, 0.3120, 0.3212],[0.2725, 0.2609, 0.2669]),
        ])
    trans_image = trans(image).float()
    trans_image = Variable(trans_image, requires_grad = True)
    trans_image=trans_image.unsqueeze(0)
    return trans_image
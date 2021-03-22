from flask_restful import Resource

import torch
from PIL import Image
from torchvision import transforms
from torch.autograd import Variable

from utils.trafficSignNet import TrafficSignNet
from db import load_latest_model_from_db
from config.appConfig import *

DEVICE = torch.device("cpu")

class PredictImage(Resource):
    def post(self):
        args = parser.parse_args()
        image = Image.open(args['file'])
        # print(image)
        output_pred = self.result(image)
        # print(output_pred)
        return output_pred
        
    def result(self, img):
        # print(image)
        model = TrafficSignNet()
        #Uncomment the commented code in next to next line and delete 0 for using database
        #Commented to reduce the number of requests to database
        latestModelId = 0 #load_latest_model_from_db()
        model = self.load_model('models/downloads/'+str(latestModelId)+'.pt', model)
        # print(model)
        pred_label, pred_label_proba = self.predict_image(img, model)
        output_pred = {'pred': pred_label, 'confidence': pred_label_proba}
        return output_pred

    def load_image(self, image, size=(32, 32)):
        trans = transforms.Compose([transforms.Resize(size), transforms.ToTensor()])
        trans_image = trans(image).float()
        trans_image = Variable(trans_image, requires_grad = True)
        trans_image=trans_image.unsqueeze(0)
        # print("Shape:", trans_image)
        return trans_image
    
    def predict_image(self, image, model):
        model.eval()
        torch_image = self.load_image(image)
        with torch.no_grad():
            output = model(torch_image)
            # print("hello_output:", output[0])
            # print("output_size: ", output.size())
            _, pred = torch.max(output, 1)
            pred_proba = output[0][pred]
        return int(pred.numpy()), float(pred_proba.numpy())
    
    def load_model(self, checkpoint_path, model):
        checkpoint = torch.load(checkpoint_path, DEVICE)
        model.load_state_dict(checkpoint['state_dict'])
        return model
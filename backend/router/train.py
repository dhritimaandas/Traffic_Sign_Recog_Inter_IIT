import base64

import torch
import numpy as np
import cv2
from torch import nn, optim

from config.appConfig import *
from app_utils import ValidationError as VE
from utils.preprocess import preprocess
from utils.trafficSignNet import TrafficSignNet
from utils.trainModel import train_model
from utils.saveCheckpoint import save_ckp
from db import load_latest_model_from_db, save_model_to_db

class TrainImages(Resource):
    def __init__(self):
        self.batch_size = 4
        self.dim = 3
        self.split = 0.2
    def post(self):
        args = parser.parse_args()
        images = args["images"]
        # print(images)
        images, labels = self.prepare_data(images)
        self.check_exp(images, labels, self.split)
        val_acc = self.train(images, labels, self.split, self.batch_size)
        return val_acc

    def prepare_data(self, images):
        array_imgs = []
        labels = []
        for pair in images:
            im_bytes = base64.b64decode(pair[0].split(',')[1])
            im_arr = np.frombuffer(im_bytes, dtype=np.uint8)  # im_arr is one-dim Numpy array
            img = cv2.imdecode(im_arr, flags=cv2.IMREAD_COLOR)

            array_imgs.append(img)
            labels.append(pair[1])
        return array_imgs, labels

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
        #Uncomment the commented code in next to next line and delete 0 for using database
        #Commented to reduce the number of requests to database
        latestModelId = 0 #load_latest_model_from_db()
        model = self.load_model('models/downloads/'+str(latestModelId)+'.pt', model)
        criterion = nn.CrossEntropyLoss()
        optimizer = optim.Adam(model.parameters(), lr=LR)

        final_model, best_acc = train_model(model,criterion,optimizer,dataloaders,dataset_sizes)

        checkpoint = {
                'epoch': EPOCHS,
                'valid_acc': best_acc,
                'state_dict': model.state_dict(),
                'optimizer': optimizer.state_dict(),
            }

        ### Can add a condition in which we want to upload the model like if new accuracy is better or something
        ### For now added the condition to be true replace that with apt conditions
        if True:
            newModelId = latestModelId + 1
            checkpointPath = 'models/downloads/'+str(newModelId)+'.pt'
            #Uncomment the next line if you want to start saving the models locally
            #save_ckp(checkpoint, checkpointPath)
            ###uncomment the next line when we want to work with databases
            #save_model_to_db(newModelId, {}) #Replace {} with model metrics

        return {'valid_acc': float(best_acc)}
    
    def load_model(self, checkpoint_path, model):
        checkpoint = torch.load(checkpoint_path, DEVICE)
        model.load_state_dict(checkpoint['state_dict'])
        model.train()
        return model
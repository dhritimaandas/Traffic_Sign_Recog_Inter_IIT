import base64
import sys
sys.path.insert(1, '/home/mainak/Documents/Robotics/Inter IIT/Traffic_Sign_Recog_Inter_IIT/backend')
import torch
import numpy as np
import cv2
import os
from PIL import Image
from torch import nn, optim
from router.predict import load_image
from config.appConfig import *
from flask_restful import Resource
from app_utils import ValidationError as VE
from utils.preprocess import preprocess
from utils.trafficSignNet import TrafficSignNet
from utils.trainModel import train_model
from utils.saveCheckpoint import save_ckp
from db import load_latest_model_from_db, save_model_to_db
from utils.tsne import fit_tsne
LR = 1e-5
DEVICE = torch.device('cpu') 

class TrainImages(Resource):
    def __init__(self):
        self.batch_size = 4
        self.dim = 3
        self.split = 0.2
    def post(self):
        args = parser.parse_args()
        images = args["images"]
        # print(images)
        images, labels = self.prepare_data(images, 48)
        #self.check_exp(images, labels, self.split)
        val_acc = self.train(images, labels, self.split, self.batch_size)
        return val_acc

    def prepare_data(self, images, num_classes, balance=True):
        array_imgs = []
        labels = []
        count = dict()
        for i in range(num_classes):
            count.update({str(i): 0})

        for pair in images:
            im_bytes = base64.b64decode(pair[0].split(',')[1])
            im_arr = np.frombuffer(im_bytes, dtype=np.uint8)  # im_arr is one-dim Numpy array
            img = cv2.imdecode(im_arr, flags=cv2.IMREAD_COLOR)
            img = cv2.resize(img , (32,32))

            array_imgs.append(img)
            labels.append(pair[1])
            count[str(int(pair[1]))] += 1
        if balance:
            num = np.max([np.max(list(count.values())), 10])
            for i in range(num_classes):
                bal_imgs, bal_labels = self.get_balance_data(i, abs(int(num-count[str(i)])))
                array_imgs+= bal_imgs
                labels+= bal_labels
        # print(len(array_imgs), len(labels))
        return array_imgs, labels

    def get_balance_data(self, class_id, num_im):
        ims = np.random.randint(0, 10, num_im)+(class_id*10)
        base_path = 'assets/train images/'+str(class_id)+'/'## needs to be modified
        bal_images = []
        bal_labels = []#list(np.ones(num_im)*class_id)
        for j in range(num_im):
            path = base_path+str(ims[j])+'.jpg'
            if os.path.isfile(path):
	            img = cv2.imread(path)
	            img = cv2.resize(img , (32,32))
	            #img = self.transform_image(img)
	            bal_images.append(img)
	            bal_labels.append(class_id)
        return bal_images, bal_labels

    def transform_image(self, img):
        pass

    def check_exp(self, images, labels, split): ### custom value error function
        if len(images)!=len(labels):
            raise VE(400, msg="Number of images is not equal to number of labels")
        if len(np.array(images[0]).shape)!=3:
            raise VE(400, msg="Dimension of an image should be 3")
        if split > 1 or split < 0:
            raise VE(400, msg="validation split must be less than 1 and greater than 0")
        return

    def train(self, images, labels, split, batch_size):
        dataset_sizes,dataloaders, val_images, val_labels = preprocess(images, labels, ratio=split,batch_size=batch_size)
        model = TrafficSignNet()
        #Uncomment the commented code in next to next line and delete 0 for using database
        #Commented to reduce the number of requests to database
        latestModelId = 0 #load_latest_model_from_db()
        model = self.load_model('models/downloads/'+str(latestModelId)+'.pt', model)
        criterion = nn.CrossEntropyLoss()
        optimizer = optim.Adam(model.parameters(), lr=LR)

        final_model, best_acc, epoch, loss_p, acc_p, f1_p, all_features, all_labels  = train_model(model,criterion,optimizer,dataloaders,dataset_sizes)

        tsne_features =  fit_tsne(all_features, all_labels)

        checkpoint = {
                'epoch': epoch,
                'valid_acc': best_acc,
                'state_dict': final_model.state_dict(),
                'optimizer': optimizer.state_dict(),
                'loss_p':loss_p,
                'acc_p':acc_p,
                'f1_p': f1_p,
            }
        
        val_preds = self.get_val_preds(final_model, val_images)
        ### Can add a condition in which we want to upload the model like if new accuracy is better or something
        ### For now added the condition to be true replace that with apt conditions
        if True:
            newModelId = latestModelId + 1
            checkpointPath = 'models/downloads/'+str(newModelId)+'.pt'
            #Uncomment the next line if you want to start saving the models locally
            save_ckp(checkpoint, checkpointPath)
            ###uncomment the next line when we want to work with databases
            train_info = {'epoch': epoch, 'valid_acc': best_acc, 'loss_p': loss_p, 'acc_p': acc_p, 'f1_p': f1_p, 'val_preds': val_preds, 'val_labels': val_labels, 'tsne_features': tsne_features}
            # save_model_to_db(newModelId, train_info) #Replace {} with model metrics

        return train_info
    
    def load_model(self, checkpoint_path, model):
        checkpoint = torch.load(checkpoint_path, DEVICE)
        model.load_state_dict(checkpoint['state_dict'])
        model.train()
        return model
    
    def get_val_preds(self, model, val_images):
        val_preds = []
        model.eval()
        for val_img in val_images:
            val_img = Image.fromarray(val_img).convert("RGB")
            val_img = load_image(val_img)
            with torch.no_grad():
                output = model(val_img)
                # print("hello_output:", output[0])
                # print("output_size: ", output.size())
                _, pred = torch.max(output, 1)
            val_preds.append(int(pred.numpy()))
        return val_preds


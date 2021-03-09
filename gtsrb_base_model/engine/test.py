import torch
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms
from torch import nn, optim

import pandas as pd
import os
from sklearn.metrics import f1_score, confusion_matrix, classification_report
import seaborn as sns
import matplotlib.pyplot as plt

import sys
sys.path.insert(1,'/content/gtsrb_inter_iit/engine/')
sys.path.insert(1,'/content/gtsrb_inter_iit/utils/')
from model import TrafficSignNet
from dataloader import preprocess
from tools import load_ckp

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def prep_csv(path, image_folder):
    df = pd.read_csv(path, sep=';')

    def append(x):
        return os.path.join(image_folder,x)
    df['Filename'] = df['Filename'].apply(append)

    df = df.rename(columns={'Filename':'path','ClassId':'label'})
    print(df.head)

    data_columns=['path','label']
    df.loc[:,data_columns].to_csv("gtsrb_test.csv")

def make_predictions(model,
                    dataloaders,
                    dataset_size):
    model.eval()

    running_corrects = 0
    all_preds = []
    all_labels = []

    for inputs, labels in dataloaders:
        inputs = inputs.to(DEVICE)
        labels = labels.to(DEVICE)

        with torch.no_grad():
            outputs = model(inputs)
            _, preds = torch.max(outputs,1)
        
        # print(preds,labels.data)
        running_corrects += torch.sum(preds == labels.data) 
        
        preds_on = preds.to('cpu').tolist()
        labels_on = labels.data.to('cpu').tolist()
        all_preds.extend(preds_on)
        all_labels.extend(labels_on)
    
    test_acc = running_corrects.double()/dataset_size
    F1_score = f1_score( all_labels, all_preds, zero_division=1, average='weighted')
    print(f"Test images: {dataset_size} Acc: {test_acc} F1 score: {F1_score}")

    print("Classification report")
    print(classification_report(all_labels, all_preds))

    plt.figure(figsize=(10,10))
    plot = sns.heatmap(confusion_matrix(all_labels, all_preds), annot = False)
    plt.savefig("confusion_mat_3.png")

if __name__ == "__main__":
    # prep_csv("/content/GTSRB/GT-final_test.csv","/content/GTSRB/Final_Test/Images")
    path = "/content/gtsrb_inter_iit/utils/gtsrb_train.csv"
    print(path)
    df = pd.read_csv(path)
    dataset_size ,dataloader = preprocess(df,test=True,batch_size=64)
    model = TrafficSignNet().to(DEVICE)
    optimizer = optim.Adam(model.parameters(),lr=0.001)
    model, _, _, _ = load_ckp("/content/drive/MyDrive/competitions/bosh-inter-iit/model3.pt", model, optimizer)
    make_predictions(model, dataloader, dataset_size)
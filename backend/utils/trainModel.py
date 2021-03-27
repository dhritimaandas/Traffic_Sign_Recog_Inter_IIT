import sys

from config.appConfig import *
import torch
import torchvision
from torch import nn, optim

from sklearn.model_selection import train_test_split
from sklearn.metrics import f1_score

import pandas as pd
from PIL import Image

import numpy as np
import time
import copy

from utils.saveCheckpoint import save_ckp
from utils.trafficSignNet import TrafficSignNet_

EPOCHS = 20
EARLY_EPOCHS = 15
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
LR = 1e-5
BATCH_SIZE = 64

if DEVICE == torch.device('cuda'):
    scaler = torch.cuda.amp.GradScaler()

def train_model(model, 
                criterion, 
                optimizer, 
                dataloaders,
                dataset_sizes, 
                scheduler=None):

    device = DEVICE
    num_epochs = EPOCHS
    model = model.to(device)

    since = time.time()

    best_model_wts = copy.deepcopy(model.state_dict())
    best_acc = 0.0

    loss_p = {'train':[],'val':[]}
    acc_p = {'train':[],'val':[]}
    f1_p = {'train':[],'val':[]}
    not_imp = 0
    for epoch in range(num_epochs):
        print('Epoch {}/{}'.format(epoch, num_epochs - 1))
        print('-' * 10)

        # Each epoch has a training and validation phase
        for phase in ['train', 'val']:
            if phase == 'train':
                model.train()  # Set model to training mode
            else:
                model.eval()   # Set model to evaluate mode

            running_loss = 0.0
            running_corrects = 0
            all_preds = []
            all_labels = []
            # Iterate over data.
            for inputs, labels in dataloaders[phase]:
                inputs = inputs.to(device)
                labels = labels.to(device)

                # zero the parameter gradients
                optimizer.zero_grad()

                # forward
                # track history if only in train
                with torch.set_grad_enabled(phase == 'train'):
                    outputs = model(inputs)
                    _, preds = torch.max(outputs, 1)
                    labels = labels.type(torch.LongTensor)
                    loss = criterion(outputs, labels)

                    # backward + optimize only if in training phase
                    if phase == 'train':
                        if DEVICE == torch.device('cpu'):
                            loss.backward()
                            optimizer.step()
                        else :
                            scaler.scale(loss).backward()
                            scaler.step(optimizer)
                            scaler.update()

                preds_on = preds.to('cpu').tolist()
                labels_on = labels.data.to('cpu').tolist()
                all_preds.extend(preds_on)
                all_labels.extend(labels_on)

                # statistics
                running_loss += loss.item() * inputs.size(0)
                running_corrects += torch.sum(preds == labels.data)

            epoch_loss = running_loss / dataset_sizes[phase]
            epoch_acc = running_corrects.double().item() / dataset_sizes[phase]
            F1_score = f1_score( all_labels, all_preds, zero_division=1, average='weighted')

            loss_p[phase].append(epoch_loss)
            acc_p[phase].append(epoch_acc)
            f1_p[phase].append(F1_score)

            if phase == 'train':
                if scheduler is not None:
                    scheduler.step()

            print('{} Loss: {:.4f} Acc: {:.4f}'.format(phase, epoch_loss, epoch_acc))

            # deep copy the model
            if phase == 'val' and epoch_acc > best_acc:
                not_imp = 0
                best_acc = epoch_acc
                best_model_wts = copy.deepcopy(model.state_dict())
               
            elif phase=='val' and epoch_acc <= best_acc:
                not_imp += 1

            if not_imp > EARLY_EPOCHS:
                break 

        if not_imp > EARLY_EPOCHS:
            break             
        print()

    model_ = TrafficSignNet_()
    model_ = model_.to(DEVICE)
    model_.load_state_dict(best_model_wts)
    model_.eval()

    features, all_labels , cnter = [], [], dict()
    
    for inputs, labels in dataloaders['train']:
        inputs = inputs.to(device)
        labels = labels.to(device)

        for img, labl in zip(inputs, labels):
            label = labl.item()
            if label in cnter.keys():
                if cnter[label] + 1 > 25:
                    continue
                else:
                    cnter[label]+=1

            else:
                cnter[label]=1

            outs = model_(torch.unsqueeze(img,0))[1] #for tsne
            features.extend(outs.to('cpu').tolist()) 
            all_labels.append(labl.data.to('cpu').tolist())


    time_elapsed = time.time() - since
    print('Training complete in {:.0f}m {:.0f}s'.format(
        time_elapsed // 60, time_elapsed % 60))
    print('Best val Acc: {:4f}'.format(best_acc))

    # load best model weights
    model.load_state_dict(best_model_wts)
    return model, best_acc, epoch, loss_p, acc_p, f1_p, features, all_labels
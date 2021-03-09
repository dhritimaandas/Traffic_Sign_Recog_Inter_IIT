import torch
import torchvision
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms
from torch import nn, optim

from sklearn.model_selection import train_test_split
import pandas as pd
from PIL import Image

import numpy as np
import time
import copy

import sys
sys.path.insert(1,'/content/gtsrb_inter_iit/engine/')
sys.path.insert(1,'/content/gtsrb_inter_iit/utils/')
from model import TrafficSignNet
from dataloader import preprocess
from tools import save_ckp

from torch.utils.tensorboard import SummaryWriter

EPOCHS = 100
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(DEVICE)
LR = 0.001
BATCH_SIZE = 128

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

    writer = SummaryWriter(
            f"runs/bs_{BATCH_SIZE}_LR_{LR}"
        )

    images, _ = next(iter(dataloaders['train']))
    writer.add_graph(model, images.to(device))
    # writer.close()

    step = 0

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
                    loss = criterion(outputs, labels)

                    # backward + optimize only if in training phase
                    if phase == 'train':
                        loss.backward()
                        optimizer.step()

                # statistics
                running_loss += loss.item() * inputs.size(0)
                running_corrects += torch.sum(preds == labels.data)

                if phase == 'train':
                    img_grid = torchvision.utils.make_grid(inputs)
                    writer.add_image("gtsrb_images", img_grid)
                    writer.add_histogram("fc2", model.fc2.weight)
                    writer.add_scalar("Training loss", loss, global_step=step)
                    step+=1
                print(f"running_loss {running_loss} running_corrects {running_corrects}")

            epoch_loss = running_loss / dataset_sizes[phase]
            epoch_acc = running_corrects.double() / dataset_sizes[phase]

            if phase == 'train':
                if scheduler is not None:
                    scheduler.step()
                
                writer.add_hparams(
                    {"lr": LR, "bsize": BATCH_SIZE},
                    {
                        "accuracy": epoch_acc,
                        "loss": epoch_loss,
                    },
                )

            print('{} Loss: {:.4f} Acc: {:.4f}'.format(
                phase, epoch_loss, epoch_acc))

            # deep copy the model
            if phase == 'val' and epoch_acc > best_acc:
                best_acc = epoch_acc
                best_model_wts = copy.deepcopy(model.state_dict())

        print()

    time_elapsed = time.time() - since
    print('Training complete in {:.0f}m {:.0f}s'.format(
        time_elapsed // 60, time_elapsed % 60))
    print('Best val Acc: {:4f}'.format(best_acc))

    # load best model weights
    model.load_state_dict(best_model_wts)
    return model, best_acc


if __name__ == "__main__":
    df = pd.read_csv("/content/gtsrb_inter_iit/utils/gtsrb_train.csv")
    dataset_sizes,dataloaders = preprocess(df,ratio=0.1,batch_size=BATCH_SIZE)
    model = TrafficSignNet()
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=LR)

    final_model, best_acc = train_model(model,criterion,optimizer,dataloaders,dataset_sizes)

    checkpoint = {
            'epoch': EPOCHS,
            'valid_acc': best_acc,
            'state_dict': model.state_dict(),
            'optimizer': optimizer.state_dict(),
        }
        
    # save checkpoint
    checkpoint_path = "/content/drive/MyDrive/competitions/bosh-inter-iit/model3.pt"
    save_ckp(checkpoint, checkpoint_path)
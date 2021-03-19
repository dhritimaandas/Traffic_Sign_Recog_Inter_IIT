from torch.utils.data import Dataset, DataLoader
from torchvision import transforms
import torch
from sklearn.model_selection import train_test_split
import pandas as pd
from PIL import Image

import numpy as np
import sys
sys.path.insert(1,'/content/gtsrb_inter_iit/utils')

from tools import calc_mean_std

class GTSRB(Dataset):
    def __init__(self, tensors, transform=None):
        #assert all(tensors[0].size(0) == tensor.size(0) for tensor in tensors)
        self.tensors = tensors
        self.transform = transform
    def __len__(self):
        return self.tensors[0].shape[0]
    def __getitem__(self, index):
        x = self.tensors[0][index]
        print(x.shape)
        x = Image.fromarray(x)

        if self.transform:
            x = self.transform(x)

        y = self.tensors[1][index]

        return x, y
    
def mean_std(df, ratio=0.2):
    df_train, _ = train_test_split(df,
                                    stratify=df['label'],
                                    test_size=ratio,
                                    random_state=42)
    train_transforms = transforms.Compose([
        transforms.Resize((32,32)),
        transforms.ToTensor(),
    ])

    train_dataset = GTSRB(dataframe=df_train, transforms=train_transforms)

    train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True, num_workers=4)

    mean, std = calc_mean_std(train_loader)
    return mean,std 

def preprocess(image_list, label_list, test=False ,ratio=0.2, batch_size = 64):

    num_classes = np.unique(label_list).shape[0]

    train_img_list, val_img_list, train_label_list, val_label_list = train_test_split(image_list,
                                        label_list,
                                        stratify=label_list,
                                        test_size=ratio,
                                        random_state=42)

    train_img_tensor = np.array(train_img_list).reshape((-1, 32, 32, 3))
    train_label_tensor = np.array(train_label_list)

    val_img_tensor = np.array(val_img_list).reshape((-1, 32, 32, 3))
    val_label_tensor = np.array(val_label_list)

    print(f"train imgs = {len(train_label_list)} val imgs = {len(val_label_list)}")
    df = {'train':(train_img_tensor, train_label_tensor),'val':(val_img_tensor, val_label_tensor)}

    # mean (tensor([0.3401, 0.3120, 0.3212]), std tensor([0.2725, 0.2609, 0.2669]))
    data_transforms = {
        "train": transforms.Compose([
            transforms.Resize((32,32)),
            transforms.ToTensor(),
            transforms.Normalize([0.3401, 0.3120, 0.3212],[0.2725, 0.2609, 0.2669]),
        ]),
        "val": transforms.Compose([
            transforms.Resize((32,32)),
            transforms.ToTensor(),
            transforms.Normalize([0.3401, 0.3120, 0.3212],[0.2725, 0.2609, 0.2669]),
        ])
    }


    img_dataset = {x: GTSRB(tensors=df[x], transform=data_transforms[x]) 
                for x in ['train','val']
            }

    dataset_sizes = {x: len(img_dataset[x]) for x in ['train','val']}

    dataloader = {x: DataLoader(img_dataset[x], batch_size=batch_size, shuffle=True, num_workers=2)
                for x in ['train','val']
            }

    return dataset_sizes, dataloader
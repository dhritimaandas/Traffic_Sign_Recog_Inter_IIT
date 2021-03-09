from torch.utils.data import Dataset, DataLoader
from torchvision import transforms

from sklearn.model_selection import train_test_split
import pandas as pd
from PIL import Image

import numpy as np
import sys
sys.path.insert(1,'/content/gtsrb_inter_iit/utils')

from tools import calc_mean_std

class GTSRB(Dataset):
    def __init__(self,
                dataframe,
                transforms = None):
        self.df = dataframe
        self.tf = transforms
    
    def __len__(self):
        return len(self.df)
    
    def __getitem__(self,index):
        x = Image.open(self.df.iloc[index]['path'])
        y = self.df.iloc[index]['label']

        if self.tf is not None:
            x = self.tf(x)

        return x,y
    
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

def preprocess(gtsrb, test=False ,ratio=0.2, batch_size = 64):

    if test:
        test_transforms = transforms.Compose([
            transforms.Resize((32,32)),
            transforms.ToTensor(),
            transforms.Normalize([0.3401, 0.3120, 0.3212],[0.2725, 0.2609, 0.2669]),
        ])

        test_dataset = GTSRB(dataframe=gtsrb, transforms=test_transforms)

        test_dataloader =  DataLoader(test_dataset, batch_size=batch_size, shuffle=True, num_workers=2)

        return len(test_dataset), test_dataloader

    num_classes = gtsrb['label'].nunique()

    df_train, df_val = train_test_split(gtsrb,
                                        stratify=gtsrb['label'],
                                        test_size=ratio,
                                        random_state=42)
    print(f"train imgs = {len(df_train)} val imgs = {len(df_val)}")
    df = {'train':df_train,'val':df_val}

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


    img_dataset = {x: GTSRB(dataframe=df[x], transforms=data_transforms[x]) 
                for x in ['train','val']
            }

    dataset_sizes = {x: len(img_dataset[x]) for x in ['train','val']}

    dataloader = {x: DataLoader(img_dataset[x], batch_size=batch_size, shuffle=True, num_workers=2)
                for x in ['train','val']
            }

    return dataset_sizes, dataloader
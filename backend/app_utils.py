import torch
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms

from sklearn.model_selection import train_test_split
import pandas as pd
# from pandas import Dataframe
from PIL import Image

import numpy as np
import sys


def create_dataframe(image_list, label_list):
    df_list = [image_list, label_list]
    df = pd.Dataframe(df_list).transpose()
    df.columns = ["image", "label"]
    return df_list


import torch
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms

from sklearn.model_selection import train_test_split
import pandas as pd
<<<<<<< HEAD
from pandas import DataFrame
=======
# from pandas import Dataframe
>>>>>>> b60c52fd03297d8e91e6ded97c1ec8662b04f1b3
from PIL import Image

import numpy as np
import sys


def create_dataframe(image_list, label_list):
    df_list = [image_list, label_list]
<<<<<<< HEAD
    df = DataFrame(df_list).transpose()
=======
    df = pd.Dataframe(df_list).transpose()
>>>>>>> b60c52fd03297d8e91e6ded97c1ec8662b04f1b3
    df.columns = ["image", "label"]
    return df_list

class Error(Exception):
    """Base class for other exceptions"""
    def __init__(self, http_status_code:int, *args, **kwargs):
        # If the key `msg` is provided, provide the msg string
        # to Exception class in order to display
        # the msg while raising the exception
        self.http_status_code = http_status_code
        self.kwargs = kwargs
        msg = kwargs.get('msg', kwargs.get('message'))
        if msg:
            args = (msg,)
            super().__init__(args)
        self.args = list(args)
        for key in kwargs.keys():
            setattr(self, key, kwargs[key])


class ValidationError(Error):
    """Should be raised in case of custom validations"""
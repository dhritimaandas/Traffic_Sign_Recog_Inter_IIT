import itertools
import numpy as np
import base64
import matplotlib.pyplot as plt
from torchvision import transforms
from config.appConfig import *
import torch

DEVICE = torch.device("cpu")

def transform_img(img):
    transform = transforms.Compose([
        transforms.Resize((32,32)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.3401, 0.3120, 0.3212], std=[0.2725, 0.2609, 0.2669]),
    ])
    return transform(img)

def salience(model,image):
    
    x = transform_img(image).unsqueeze(0)
    model.eval()
    x = x.to(DEVICE)
    x.requires_grad_(True)
    scores = model(x)
    score_max_index = scores.argmax()
    score_max = scores[0,score_max_index]
    score_max.backward(retain_graph=True)
    saliency, _ = torch.max(x.grad.data.abs(),dim=1)
    # code to plot the saliency map as a heatmap
    plt.matshow(saliency[0].cpu(), cmap=plt.cm.hot)
    plt.savefig('plots/salience.jpg')
    with open("plots/salience.jpg", "rb") as f:
        im_b64 = base64.b64encode(f.read())
    im_b64 = im_b64.decode("utf-8")
    return im_b64
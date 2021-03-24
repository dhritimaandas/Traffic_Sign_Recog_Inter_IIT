import itertools
import numpy as np
import base64
import matplotlib.pyplot as plt
from torchvision import transforms
from config.appConfig import *
import torch

DEVICE = torch.device("cpu")

def plot_confusion_matrix(cm, classes, normalize=False, title='Confusion matrix', cmap=plt.cm.Blues):
    if normalize:
        cm = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis]
        print("Normalized confusion matrix")
    else:
        print('Confusion matrix, without normalization')

    print(cm)
    plt.matshow(cm, interpolation='nearest', cmap=cmap)
    plt.title(title)
    plt.colorbar()
    tick_marks = np.arange(len(classes))
    plt.xticks(tick_marks, classes, rotation=45)
    plt.yticks(tick_marks, classes)

    fmt = '.2f' if normalize else 'd'
    thresh = cm.max() / 2.
    for i, j in itertools.product(range(cm.shape[0]), range(cm.shape[1])):
        plt.text(j, i, format(cm[i, j], fmt), horizontalalignment="center", color="white" if cm[i, j] > thresh else "black")

    plt.tight_layout()
    plt.ylabel('True label')
    plt.xlabel('Predicted label')
    plt.savefig('plots/confusion_matrix.jpg')
    with open("plots/salience.jpg", "rb") as f:
        im_b64 = base64.b64encode(f.read())
    return im_b64

def transform_img(img):
    transform = transforms.Compose([
        transforms.Resize((32,32)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.3401, 0.3120, 0.3212], std=[0.2725, 0.2609, 0.2669]),
        # transforms.Lambda(lambda x: x[None]),
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
    # print(score_max)
    saliency, _ = torch.max(x.grad.data.abs(),dim=1)
    # code to plot the saliency map as a heatmap
    plt.matshow(saliency[0].cpu(), cmap=plt.cm.hot)
    plt.savefig('plots/salience.jpg')
    with open("plots/salience.jpg", "rb") as f:
        im_b64 = base64.b64encode(f.read())
    im_b64 = im_b64.decode("utf-8")
    return im_b64
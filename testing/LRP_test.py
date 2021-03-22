import matplotlib as mpl
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
from mpl_toolkits.axes_grid1 import make_axes_locatable
from copy import deepcopy
import torch
from torch import nn
from torchvision import transforms
from torch.autograd import Variable
import cv2
from PIL import Image
import interpretation
import torch.nn.functional as F
from investigator import InnvestigateModel
DEVICE = torch.device("cpu")
NUM_CLASSES = 43  # GTSRB as 43 classes

class TrafficSignNet(nn.Module):
    def __init__(self):
        super(TrafficSignNet, self).__init__()
        self.stn = Stn()
        self.conv1 = nn.Conv2d(3, 100, 5)
        self.conv1_bn = nn.BatchNorm2d(100)
        self.pool = nn.MaxPool2d(2, 2)
        self.conv2 = nn.Conv2d(100, 150, 3)
        self.conv2_bn = nn.BatchNorm2d(150)
        self.conv3 = nn.Conv2d(150, 250, 1)
        self.conv3_bn = nn.BatchNorm2d(250)
        self.fc1 = nn.Linear(250 * 3 * 3, 350)
        self.fc1_bn = nn.BatchNorm1d(350)
        self.fc2 = nn.Linear(350, NUM_CLASSES)
        self.dropout = nn.Dropout(p=0.5)

    def forward(self, x):
        x = self.stn(x)
        x = self.pool(F.elu(self.conv1(x)))
        x = self.dropout(self.conv1_bn(x))
        x = self.pool(F.elu(self.conv2(x)))
        x = self.dropout(self.conv2_bn(x))
        x = self.pool(F.elu(self.conv3(x)))
        x = self.dropout(self.conv3_bn(x))
        x = x.view(-1, 250 * 3 * 3)
        x = F.elu(self.fc1(x))
        x = self.dropout(self.fc1_bn(x))
        x = self.fc2(x)
        return x


class Stn(nn.Module):
    def __init__(self):
        super(Stn, self).__init__()
        # Spatial transformer localization-network
        self.loc_net = nn.Sequential(
            nn.Conv2d(3, 50, 7),
            nn.MaxPool2d(2, 2),
            nn.ELU(),
            nn.Conv2d(50, 100, 5),
            nn.MaxPool2d(2, 2),
            nn.ELU()
        )
        # Regressor for the 3 * 2 affine matrix
        self.fc_loc = nn.Sequential(
            nn.Linear(100 * 4 * 4, 100),
            nn.ELU(),
            nn.Linear(100, 3 * 2)
        )
        # Initialize the weights/bias with identity transformation
        self.fc_loc[2].weight.data.zero_()
        self.fc_loc[2].bias.data.copy_(torch.tensor(
            [1, 0, 0, 0, 1, 0], dtype=torch.float))

    def forward(self, x):
        xs = self.loc_net(x)
        xs = xs.view(-1, 100 * 4 * 4)
        theta = self.fc_loc(xs)
        theta = theta.view(-1, 2, 3)

        grid = F.affine_grid(theta, x.size())
        x = F.grid_sample(x, grid)

        return x
def get_heatmaps(idx):
    image_tensor, label = X_holdout[idx], y_holdout[idx]
    image_tensor_LRP = torch.Tensor(image_tensor[None]).cuda(device)
    print("Running GB")
    rel_GB = run_guided_backprop(inn_model, image_tensor_LRP)
    print("Running LRP")
    AD_score, rel_LRP = run_LRP(inn_model, image_tensor_LRP)
    return rel_LRP.detach().numpy().squeeze(), rel_GB.squeeze()

def get_inn_model(check_point_path, model):
    check_point = torch.load(check_point_path, DEVICE)
    model.load_state_dict(check_point['state_dict'])
    model.eval()
    model = torch.nn.Sequential(model, torch.nn.Softmax(dim=1))
    inn_model = InnvestigateModel(model, lrp_exponent=1,
                                    method="b-rule",
                                    beta=0, epsilon=1e-6)
    inn_model.eval()
    return inn_model

def run_guided_backprop(net, image_tensor):
    return interpretation.guided_backprop(net, image_tensor, cuda=False, verbose=False, apply_softmax=False)

def run_LRP(inn_model, image_tensor, clss):
    return inn_model.innvestigate(in_tensor=image_tensor, rel_for_class=clss)

def plot_heat_map(net, image_tensor, num_class):
    evidence_for_class = []
    for i in range(num_class):
        model_prediction, input_relevance_values = run_LRP(net, image_tensor, i)
        evidence_for_class.append(input_relevance_values)
    evidence_for_class = np.array([elt.numpy() for elt in evidence_for_class])
    prediction = np.argmax(model_prediction.detach(), axis=1)
    fig, axes = plt.subplots(8, 7)
    vmin = np.percentile(evidence_for_class, 50)
    vmax = np.percentile(evidence_for_class, 99.9)
    axes[0, 3].imshow(image_tensor.numpy())
    axes[0, 3].set_title("Input")
    axes[0, 4].imshow(evidence_for_class[prediction], vmin=vmin,
                        vmax=vmax, cmap="hot")
    axes[0, 4].set_title("Pred. Evd.")
    for ax in axes[0]:
        ax.set_axis_off()
    for j, ax in enumerate(axes[1:].flatten()):
        im = ax.imshow(evidence_for_class[j], cmap="hot", vmin=vmin,
                        vmax=vmax)
        ax.set_axis_off()
        ax.set_title("Evd. " + str(j))
    fig.colorbar(im, ax=axes.ravel().tolist())
    plt.show()
def load_image(image, size=(32, 32)):
    trans = transforms.Compose([transforms.Resize(size), transforms.ToTensor()])
    trans_image = trans(image).float()
    trans_image = Variable(trans_image, requires_grad = True)
    trans_image = trans_image[None]
    print("Shape:", trans_image.size())
    return trans_image

if __name__=="__main__":
    model = TrafficSignNet()
    net = get_inn_model('testing/43_classes.pt', model)
    img = Image.open('testing/00000_00027.jpg')
    image_tensor = load_image(img, (32, 32))
    num_class = 43
    evidence_for_class = []
    for i in range(num_class):
        model_prediction, input_relevance_values = run_LRP(net, image_tensor, i)
        evidence_for_class.append(input_relevance_values)
    evidence_for_class = np.array([elt.numpy() for elt in evidence_for_class])
    prediction = np.argmax(model_prediction.detach(), axis=1)
    print("Prediction:", prediction)
    fig, axes = plt.subplots(8, 7)
    vmin = np.percentile(evidence_for_class, 50)
    vmax = np.percentile(evidence_for_class, 99.9)
    axes[0, 3].imshow(image_tensor.numpy())
    axes[0, 3].set_title("Input")
    axes[0, 4].imshow(evidence_for_class[prediction][0], vmin=vmin,
                        vmax=vmax, cmap="hot")
    axes[0, 4].set_title("Pred. Evd.")
    for ax in axes[0]:
        ax.set_axis_off()
    for j, ax in enumerate(axes[1:].flatten()):
        im = ax.imshow(evidence_for_class[j][0], cmap="hot", vmin=vmin,
                        vmax=vmax)
        ax.set_axis_off()
        ax.set_title("Evd. " + str(j))
    fig.colorbar(im, ax=axes.ravel().tolist())
    print("To be shown")
    plt.show()


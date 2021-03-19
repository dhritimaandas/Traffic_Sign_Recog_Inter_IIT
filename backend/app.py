from flask import Flask
from flask_cors import CORS
from flask_restful import reqparse, abort, Api, Resource
import pickle
import numpy as np
import pandas as pd
from db import load_latest_model_from_db
from PIL import Image
import sys
import base64
import copy
import torch
from torch.autograd import Variable
from torchvision import transforms
sys.path.insert(1, '../gtsrb_base_model/engine/')
sys.path.insert(1, '../gtsrb_base_model/utils/')
from app_utils import ValidationError as VE
from torchvision import transforms
from torch import nn, optim
from sklearn.model_selection import train_test_split
import werkzeug

app = Flask(__name__)
api = Api(app)
CORS(app, origins=['*'])
app.config['SECRET_KEY'] = 'disable the web security'
app.config['CORS_HEADERS'] = 'Content-Type'


# argument parsing
parser = reqparse.RequestParser()
parser.add_argument("event")
parser.add_argument('file', type=werkzeug.datastructures.FileStorage, location='files')
parser.add_argument('images', location=['json'])
parser.add_argument("labels")
parser.add_argument("split")

from torch.utils.tensorboard import SummaryWriter

EPOCHS = 10
DEVICE = torch.device("cpu")
print(DEVICE)
LR = 0.000001
BATCH_SIZE = 4


class PredictImage(Resource):
    def get(self):
        args = parser.parse_args()
        image = Image.open(args['file'])
        output_pred = self.result(image)
        # print(output_pred)
        return output_pred
        
    def result(self, img):
        # print(image)
        model = TrafficSignNet()
        model = self.load_model('./43_classes.pt', model)# To be edited with load_model_from_pkl
        # print(model)
        pred_label, pred_label_proba = self.predict_image(img, model)
        output_pred = {'pred': pred_label, 'confidence': pred_label_proba}
        return output_pred

    def load_image(self, image, size=(32, 32)):
        trans = transforms.Compose([transforms.Resize(size), transforms.ToTensor()])
        trans_image = trans(image).float()
        trans_image = Variable(trans_image, requires_grad = True)
        trans_image=trans_image.unsqueeze(0)
        print("Shape:", trans_image)
        return trans_image
    
    def predict_image(self, image, model):
        model.eval()
        torch_image = self.load_image(image)
        with torch.no_grad():
            output = model(torch_image)
            print("hello_output:", output[0])
            print("output_size: ", output.size())
            _, pred = torch.max(output, 1)
            pred_proba = output[0][pred]
        return int(pred.numpy()), float(pred_proba.numpy())
    
    def load_model(self, checkpoint_path, model):
        checkpoint = torch.load(checkpoint_path, DEVICE)
        model.load_state_dict(checkpoint['state_dict'])
        return model

class GTSRB(Dataset):
    """TensorDataset with support of transforms.
    """
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

class TrainImages(Resource):
    def __init__(self):
        self.batch_size = 4
        self.dim = 3
        self.split = 0.2
    def post(self):
        args = parser.parse_args()
        images = args["images"]
        # print(images)
        images, labels = self.prepare_data(images)
        self.check_exp(images, labels, self.split)
        val_acc = self.train(images, labels, self.split, self.batch_size)
        return val_acc

    def prepare_data(self, images):
        array_imgs = []
        labels = []
        for pair in images:
            im_bytes = base64.b64decode(pair[0])
            im_arr = np.frombuffer(im_bytes, dtype=np.uint8)  # im_arr is one-dim Numpy array
            img = cv2.imdecode(im_arr, flags=cv2.IMREAD_COLOR)

            array_imgs.append(img)
            labels.append(pair[1])
        return array_imgs, labels

    def check_exp(self, images, labels, split): ### custom value error function
        if len(images)!=len(labels):
            raise VE(400, msg="Number of images is not equal to number of labels")
        if len(np.array(images[0]).shape)!=3:
            raise VE(400, msg="Dimension of an image should be 3")
        if split > 1 or split < 0:
            raise VE(400, msg="validation split must be less than 1 and greater than 0")
        return

    def train(self, images, labels, split, batch_size):
        dataset_sizes,dataloaders = preprocess(images, labels, ratio=split,batch_size=batch_size)
        model = TrafficSignNet()
        ### change path accordingly
        model = self.load_model('/content/43_classes.pt', model)# To be edited with load_model_from_pkl
        criterion = nn.CrossEntropyLoss()
        optimizer = optim.Adam(model.parameters(), lr=LR)

        final_model, best_acc = train_model(model,criterion,optimizer,dataloaders,dataset_sizes)

        checkpoint = {
                'epoch': EPOCHS,
                'valid_acc': best_acc,
                'state_dict': model.state_dict(),
                'optimizer': optimizer.state_dict(),
            }
        ### change path accordingly
        checkpoint_path = "/content/43_classes_1.pt"
        save_ckp(checkpoint, checkpoint_path)
        return {'valid_acc': best_acc}
    
    def load_model(self, checkpoint_path, model):
        checkpoint = torch.load(checkpoint_path, DEVICE)
        model.load_state_dict(checkpoint['state_dict'])
        model.train()
        return model

def save_ckp(state, checkpoint_path):
    f_path = checkpoint_path
    torch.save(state, f_path)

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

class Home(Resource):
    def get(self):
        # args = parser.parse_args()
        # # print(request)
        # images = args["images"]
        # print(images)
        return 'Hello World! Yash daddy here!',200
    def post(self):
        args = parser.parse_args()
        # print(request)
        images = args["images"]
        print(images)
        return "hello"

api.add_resource(Home, '/yash')
api.add_resource(PredictImage, '/predict')
api.add_resource(TrainImages, '/train')

if __name__ == "__main__":
    app.run(debug=True)
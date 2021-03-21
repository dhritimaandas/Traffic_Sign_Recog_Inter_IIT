from flask_restful import reqparse
import torch
import werkzeug

parser = reqparse.RequestParser()
parser.add_argument("event")
parser.add_argument('file', type=werkzeug.datastructures.FileStorage, location=['json','form','files'])
parser.add_argument('images',type=list, location=['json'], action='append')
parser.add_argument("labels")
parser.add_argument("split")


EPOCHS = 10
DEVICE = torch.device("cpu")
# print(DEVICE)
LR = 0.000001
BATCH_SIZE = 4
NUM_CLASSES = 43  # GTSRB as 43 classes
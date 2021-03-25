from PIL import Image
from torch.utils.data import Dataset, DataLoader
from PIL import Image

class GTSRB(Dataset):
    """TensorDataset with support of transforms.
    """
    def __init__(self, tensors, transform=None):
        self.tensors = tensors
        self.transform = transform
    def __len__(self):
        return self.tensors[0].shape[0]
    def __getitem__(self, index):
        x = self.tensors[0][index]
        x = Image.fromarray(x).convert('RGB')
        if self.transform:
            x = self.transform(x)
        y = self.tensors[1][index]
        return x, y
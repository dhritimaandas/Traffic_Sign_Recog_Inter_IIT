import torch

def save_ckp(state, checkpoint_path):
    f_path = checkpoint_path
    torch.save(state, f_path)
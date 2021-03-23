import seaborn as sns
from sklearn.manifold import TSNE
import matplotlib.patheffects as PathEffects
import numpy as np
import matplotlib.pyplot as plt



def fit_tsne(features, labels):
    all_feat = np.array(features)
    labels = np.array(labels)

    num_classes = len(np.unique(labels))
    print(num_classes)
    palette = np.array(sns.color_palette("hls", num_classes))
    tsne=TSNE(n_components=2,random_state=0)

    final=tsne.fit_transform(all_feat)

    return final



import numpy as np
from keras.models import Model
from sklearn.ensemble import RandomForestClassifier
from model import load_model
from preprocess import load_and_preprocess

DATASET_PATH = "Dataset/test.csv"

def cnn_rf_predict(cnn_model, X):
    print("[INFO] Extracting CNN features...")
    extractor = Model(cnn_model.inputs, cnn_model.layers[-2].output)
    features = extractor.predict(X)

    labels = np.argmax(cnn_model.predict(X), axis=1)
    
    rf = RandomForestClassifier(n_estimators=200)
    rf.fit(features, labels)

    predictions = rf.predict(features)
    return predictions


if __name__ == "__main__":
    print("Running predict.py directly...")

    # 🔴 PREDICTION MODE
    X, _ = load_and_preprocess(DATASET_PATH, training=False)

    model = load_model()
    preds = cnn_rf_predict(model, X)

    print("===================================")
    print("Total Records:", len(preds))
    print("Energy Theft Detected:", int(sum(preds)))
    print("Normal Records:", len(preds) - int(sum(preds)))
    print("===================================")

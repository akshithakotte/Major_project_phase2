import numpy as np
import json
import os

from sklearn.metrics import (
    accuracy_score, precision_score,
    recall_score, f1_score, confusion_matrix
)
from tensorflow.keras.callbacks import EarlyStopping

from preprocess import load_and_preprocess
from model import build_cnn, save_model, build_random_forest

DATASET_PATH = "Dataset/ElectricityTheft.csv"


# =========================
# CNN TRAINING (UPGRADED)
# =========================
def train_cnn(X_train, X_test, y_train, y_test):
    print("[INFO] Starting CNN training...")

    model = build_cnn(X_train.shape[1])

    # 🔥 Early stopping to avoid overfitting
    early_stop = EarlyStopping(
        monitor='val_loss',
        patience=5,
        restore_best_weights=True
    )

    model.fit(
        X_train, y_train,
        validation_data=(X_test, y_test),
        epochs=50,
        batch_size=64,
        callbacks=[early_stop],
        verbose=1
    )

    save_model(model)

    # Evaluation
    y_true = np.argmax(y_test, axis=1)
    y_pred = np.argmax(model.predict(X_test), axis=1)

    acc = accuracy_score(y_true, y_pred)
    prec = precision_score(y_true, y_pred, average='macro')
    rec = recall_score(y_true, y_pred, average='macro')
    f1 = f1_score(y_true, y_pred, average='macro')
    cm = confusion_matrix(y_true, y_pred)

    print("\n========== CNN MODEL EVALUATION ==========")
    print(f"Accuracy  : {acc * 100:.2f}%")
    print(f"Precision : {prec * 100:.2f}%")
    print(f"Recall    : {rec * 100:.2f}%")
    print(f"F1 Score  : {f1 * 100:.2f}%")
    print("\nConfusion Matrix:")
    print(cm)
    print("=========================================\n")

    return model, acc, prec, rec, f1


# =========================
# RANDOM FOREST TRAINING
# =========================
def train_random_forest(X_train, X_test, y_train, y_test):
    print("[INFO] Starting Random Forest training...")

    # Flatten CNN input for RF
    X_train_rf = X_train.reshape(X_train.shape[0], X_train.shape[1])
    X_test_rf = X_test.reshape(X_test.shape[0], X_test.shape[1])

    y_train_rf = np.argmax(y_train, axis=1)
    y_test_rf = np.argmax(y_test, axis=1)

    rf_model = build_random_forest()
    rf_model.fit(X_train_rf, y_train_rf)

    y_pred = rf_model.predict(X_test_rf)

    acc = accuracy_score(y_test_rf, y_pred)
    prec = precision_score(y_test_rf, y_pred, average='macro')
    rec = recall_score(y_test_rf, y_pred, average='macro')
    f1 = f1_score(y_test_rf, y_pred, average='macro')
    cm = confusion_matrix(y_test_rf, y_pred)

    print("\n====== RANDOM FOREST MODEL EVALUATION ======")
    print(f"Accuracy  : {acc * 100:.2f}%")
    print(f"Precision : {prec * 100:.2f}%")
    print(f"Recall    : {rec * 100:.2f}%")
    print(f"F1 Score  : {f1 * 100:.2f}%")
    print("\nConfusion Matrix:")
    print(cm)
    print("===========================================\n")

    return rf_model, acc, prec, rec, f1

#save metrics
def save_metrics(cnn_metrics, rf_metrics):
    if not os.path.exists("metrics"):
        os.makedirs("metrics")

    metrics = {
        "CNN": {
            "accuracy": cnn_metrics[0],
            "precision": cnn_metrics[1],
            "recall": cnn_metrics[2],
            "f1_score": cnn_metrics[3]
        },
        "RandomForest": {
            "accuracy": rf_metrics[0],
            "precision": rf_metrics[1],
            "recall": rf_metrics[2],
            "f1_score": rf_metrics[3]
        }
    }

    with open("metrics/metrics.json", "w") as f:
        json.dump(metrics, f, indent=4)

    print("[INFO] Metrics saved to metrics/metrics.json")


# =========================
# RUN INDEPENDENTLY
# =========================
if __name__ == "__main__":
    print("Running train.py directly...\n")

    # 🔥 Load upgraded preprocessing
    X_train, X_test, y_train, y_test = load_and_preprocess(
        DATASET_PATH, training=True
    )

    # Train CNN
    cnn_model, cnn_acc, cnn_prec, cnn_rec, cnn_f1 = train_cnn(
        X_train, X_test, y_train, y_test
    )

    # Train Random Forest
    rf_model, rf_acc, rf_prec, rf_rec, rf_f1 = train_random_forest(
        X_train, X_test, y_train, y_test
    )

    save_metrics(
    [cnn_acc*100, cnn_prec*100, cnn_rec*100, cnn_f1*100],
    [rf_acc*100, rf_prec*100, rf_rec*100, rf_f1*100]
)


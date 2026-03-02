import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from tensorflow.keras.utils import to_categorical


def load_and_preprocess(csv_path, training=True, test_size=0.2):
    print("[INFO] Loading dataset...")
    dataset = pd.read_csv(csv_path)
    print("[INFO] Dataset loaded successfully")

    # Handle missing values
    dataset.fillna(0, inplace=True)

    # Encode client_id
    if 'client_id' in dataset.columns:
        le = LabelEncoder()
        dataset['client_id'] = le.fit_transform(dataset['client_id'].astype(str))

    # Drop date column if exists
    if 'creation_date' in dataset.columns:
        dataset.drop(['creation_date'], axis=1, inplace=True)

    # ---------------- TRAINING MODE ----------------
    if training and 'label' in dataset.columns:
        print("[INFO] Running in TRAINING MODE")

        # Separate features and labels
        X = dataset.drop('label', axis=1).values
        y = dataset['label'].astype('int').values

        # 🔥 Feature Scaling (CRITICAL FOR CNN)
        scaler = StandardScaler()
        X = scaler.fit_transform(X)

        # 🔥 Reshape for CNN (samples, timesteps, channels)
        X = X.reshape(X.shape[0], X.shape[1], 1)

        # 🔥 One-hot encode labels
        y = to_categorical(y)

        # Train-test split
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=42, stratify=y
        )

        print("[INFO] Preprocessing completed")
        print("[INFO] X_train shape:", X_train.shape)
        print("[INFO] X_test shape :", X_test.shape)
        print("[INFO] y_train shape:", y_train.shape)
        print("[INFO] y_test shape :", y_test.shape)

        return X_train, X_test, y_train, y_test

    # ---------------- PREDICTION MODE ----------------
    else:
        print("[INFO] Running in PREDICTION MODE")

        X = dataset.values

        scaler = StandardScaler()
        X = scaler.fit_transform(X)

        X = X.reshape(X.shape[0], X.shape[1], 1)

        print("[INFO] Preprocessing completed (PREDICTION MODE)")
        print("[INFO] Features shape:", X.shape)

        return X, None


# Run independently
if __name__ == "__main__":
    print("Running preprocess.py directly...")
    X_train, X_test, y_train, y_test = load_and_preprocess(
        "Dataset/ElectricityTheft.csv", training=True
    )

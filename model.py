from keras.models import Sequential, model_from_json
from keras.layers import Dense
import os

# =========================
# EXISTING CNN MODEL (UNCHANGED)
# =========================
def build_cnn(input_dim):
    print("[INFO] Building CNN model...")
    model = Sequential()
    model.add(Dense(256, input_dim=input_dim, activation='relu'))
    model.add(Dense(128, activation='relu'))
    model.add(Dense(2, activation='softmax'))

    model.compile(
        optimizer='adam',
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )

    print("[INFO] CNN Model Built Successfully")
    model.summary()
    return model


def save_model(model):
    if not os.path.exists("model"):
        os.makedirs("model")

    with open("model/model.json", "w") as f:
        f.write(model.to_json())
    model.save_weights("model/model.weights.h5")

    print("[INFO] Model saved to disk")


def load_model():
    print("[INFO] Loading saved CNN model...")
    with open("model/model.json", "r") as f:
        model = model_from_json(f.read())
    model.load_weights("model/model.weights.h5")
    print("[INFO] Model loaded successfully")
    return model


# =========================
# RANDOM FOREST MODEL (ADDED)
# =========================
from sklearn.ensemble import RandomForestClassifier

def build_random_forest():
    print("[INFO] Building Random Forest model...")
    rf_model = RandomForestClassifier(
        n_estimators=100,
        random_state=42
    )
    print("[INFO] Random Forest Model Built Successfully")
    print(rf_model)
    return rf_model


# =========================
# RUN DIRECTLY
# =========================
if __name__ == "__main__":
    print("Running model.py directly...\n")

    # CNN Summary
    cnn_model = build_cnn(10)

    print("\n----------------------------\n")

    # Random Forest Details
    rf_model = build_random_forest()

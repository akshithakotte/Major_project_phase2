"""
Model building and management for Electricity Theft Detection.
Contains CNN and Random Forest model architectures.
"""

import os
import logging
from typing import Tuple, Any
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
import tensorflow as tf
from tensorflow.keras.models import Sequential, model_from_json
from tensorflow.keras.layers import Dense, Conv1D, Flatten, Dropout, MaxPooling1D
from tensorflow.keras.callbacks import EarlyStopping

# Configure logging
logger = logging.getLogger(__name__)

# Suppress TensorFlow warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'


def build_cnn(input_dim: int) -> Sequential:
    """
    Build a CNN model for electricity theft detection.
    Uses Dense layers which work better for tabular data.
    
    Args:
        input_dim: Number of input features
    
    Returns:
        Compiled CNN model
    """
    logger.info("Building CNN model...")
    
    model = Sequential([
        Dense(256, input_shape=(input_dim,), activation='relu'),
        Dense(128, activation='relu'),
        Dense(64, activation='relu'),
        Dense(2, activation='softmax')
    ])
    
    model.compile(
        optimizer='adam',
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    logger.info("CNN Model Built Successfully")
    return model


def build_random_forest(n_estimators: int = 100) -> RandomForestClassifier:
    """
    Build a Random Forest model for electricity theft detection.
    
    Args:
        n_estimators: Number of trees in the forest
    
    Returns:
        Random Forest classifier
    """
    logger.info("Building Random Forest model...")
    
    rf_model = RandomForestClassifier(
        n_estimators=n_estimators,
        random_state=42,
        max_depth=20,
        min_samples_split=5,
        min_samples_leaf=2,
        n_jobs=-1
    )
    
    logger.info("Random Forest Model Built Successfully")
    return rf_model


def save_model(model: Sequential, model_dir: str = "model") -> bool:
    """
    Save a trained CNN model to disk.
    
    Args:
        model: Trained Keras model
        model_dir: Directory to save the model
    
    Returns:
        True if saved successfully, False otherwise
    """
    try:
        os.makedirs(model_dir, exist_ok=True)
        
        # Save model architecture
        model_json_path = os.path.join(model_dir, "model.json")
        with open(model_json_path, "w") as f:
            f.write(model.to_json())
        
        # Save model weights
        weights_path = os.path.join(model_dir, "model.weights.h5")
        model.save_weights(weights_path)
        
        logger.info(f"Model saved to {model_dir}")
        return True
    except Exception as e:
        logger.error(f"Failed to save model: {e}")
        return False


def load_model(model_dir: str = "model") -> Sequential:
    """
    Load a trained CNN model from disk.
    
    Args:
        model_dir: Directory containing the saved model
    
    Returns:
        Loaded Keras model
    
    Raises:
        FileNotFoundError: If model files don't exist
    """
    model_json_path = os.path.join(model_dir, "model.json")
    weights_path = os.path.join(model_dir, "model.weights.h5")
    
    if not os.path.exists(model_json_path):
        raise FileNotFoundError(f"Model JSON not found at {model_json_path}")
    if not os.path.exists(weights_path):
        raise FileNotFoundError(f"Model weights not found at {weights_path}")
    
    logger.info("Loading saved CNN model...")
    
    with open(model_json_path, "r") as f:
        model = model_from_json(f.read())
    
    model.load_weights(weights_path)
    logger.info("Model loaded successfully")
    
    return model


def train_cnn(
    X_train: np.ndarray,
    X_test: np.ndarray,
    y_train: np.ndarray,
    y_test: np.ndarray,
    model_dir: str = "model"
) -> Tuple[Sequential, dict]:
    """
    Train a CNN model.
    
    Args:
        X_train: Training features
        X_test: Testing features
        y_train: Training labels (one-hot encoded)
        y_test: Testing labels (one-hot encoded)
        model_dir: Directory to save the model
    
    Returns:
        Tuple of (trained model, metrics dict)
    """
    logger.info("Starting CNN training...")
    
    model = build_cnn(X_train.shape[1])
    
    # Early stopping to prevent overfitting
    early_stop = EarlyStopping(
        monitor='val_loss',
        patience=5,
        restore_best_weights=True,
        verbose=1
    )
    
    # Train the model
    history = model.fit(
        X_train, y_train,
        validation_data=(X_test, y_test),
        epochs=50,
        batch_size=64,
        callbacks=[early_stop],
        verbose=1
    )
    
    # Save the model
    save_model(model, model_dir)
    
    # Evaluate
    y_true = np.argmax(y_test, axis=1)
    y_pred = np.argmax(model.predict(X_test, verbose=0), axis=1)
    
    metrics = {
        "accuracy": float(accuracy_score(y_true, y_pred) * 100),
        "precision": float(precision_score(y_true, y_pred, average='macro') * 100),
        "recall": float(recall_score(y_true, y_pred, average='macro') * 100),
        "f1_score": float(f1_score(y_true, y_pred, average='macro') * 100),
        "confusion_matrix": confusion_matrix(y_true, y_pred).tolist()
    }
    
    logger.info("========== CNN MODEL EVALUATION ==========")
    logger.info(f"Accuracy  : {metrics['accuracy']:.2f}%")
    logger.info(f"Precision : {metrics['precision']:.2f}%")
    logger.info(f"Recall    : {metrics['recall']:.2f}%")
    logger.info(f"F1 Score  : {metrics['f1_score']:.2f}%")
    logger.info("=========================================")
    
    return model, metrics


def train_random_forest(
    X_train: np.ndarray,
    X_test: np.ndarray,
    y_train: np.ndarray,
    y_test: np.ndarray
) -> Tuple[RandomForestClassifier, dict]:
    """
    Train a Random Forest model.
    
    Args:
        X_train: Training features
        X_test: Testing features
        y_train: Training labels (one-hot encoded)
        y_test: Testing labels (one-hot encoded)
    
    Returns:
        Tuple of (trained model, metrics dict)
    """
    logger.info("Starting Random Forest training...")
    
    # Convert one-hot to class labels
    y_train_rf = np.argmax(y_train, axis=1)
    y_test_rf = np.argmax(y_test, axis=1)
    
    # Build and train
    rf_model = build_random_forest()
    rf_model.fit(X_train, y_train_rf)
    logger.info("Random Forest training completed")
    
    # Predict
    y_pred = rf_model.predict(X_test)
    
    metrics = {
        "accuracy": float(accuracy_score(y_test_rf, y_pred) * 100),
        "precision": float(precision_score(y_test_rf, y_pred, average='macro') * 100),
        "recall": float(recall_score(y_test_rf, y_pred, average='macro') * 100),
        "f1_score": float(f1_score(y_test_rf, y_pred, average='macro') * 100),
        "confusion_matrix": confusion_matrix(y_test_rf, y_pred).tolist()
    }
    
    logger.info("====== RANDOM FOREST MODEL EVALUATION ======")
    logger.info(f"Accuracy  : {metrics['accuracy']:.2f}%")
    logger.info(f"Precision : {metrics['precision']:.2f}%")
    logger.info(f"Recall    : {metrics['recall']:.2f}%")
    logger.info(f"F1 Score  : {metrics['f1_score']:.2f}%")
    logger.info("===========================================")
    
    return rf_model, metrics

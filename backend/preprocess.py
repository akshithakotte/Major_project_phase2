"""
Data preprocessing for Electricity Theft Detection.
Handles loading, cleaning, and preparing data for training and prediction.
"""

import os
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from tensorflow.keras.utils import to_categorical
import joblib
from typing import Tuple, Optional


# Paths for saved preprocessing objects
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "model")
SCALER_PATH = os.path.join(MODEL_DIR, "scaler.pkl")
LABEL_ENCODER_PATH = os.path.join(MODEL_DIR, "label_encoder.pkl")


def ensure_model_dir():
    """Create model directory if it doesn't exist."""
    os.makedirs(MODEL_DIR, exist_ok=True)


def load_and_preprocess(
    csv_path: str,
    training: bool = True,
    test_size: float = 0.2
) -> Tuple[np.ndarray, ...]:
    """
    Load and preprocess the dataset.
    
    Args:
        csv_path: Path to the CSV file
        training: Whether this is for training (True) or prediction (False)
        test_size: Fraction of data to use for testing (only for training)
    
    Returns:
        For training: (X_train, X_test, y_train, y_test)
        For prediction: (X, None)
    
    Raises:
        FileNotFoundError: If required files don't exist
        ValueError: If data format is invalid
    """
    print(f"[INFO] Loading dataset from {csv_path}...")
    
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Dataset not found: {csv_path}")
    
    # Load dataset
    try:
        dataset = pd.read_csv(csv_path)
    except Exception as e:
        raise ValueError(f"Failed to load CSV: {e}")
    
    print(f"[INFO] Dataset loaded: {dataset.shape[0]} rows, {dataset.shape[1]} columns")
    
    # Handle missing values
    dataset.fillna(0, inplace=True)
    
    # Drop date column if exists
    if 'creation_date' in dataset.columns:
        dataset.drop(['creation_date'], axis=1, inplace=True)
    
    # ---------------- TRAINING MODE ----------------
    if training and 'label' in dataset.columns:
        print("[INFO] Running in TRAINING MODE")
        
        # Encode client_id and save encoder
        if 'client_id' in dataset.columns:
            le = LabelEncoder()
            dataset['client_id'] = le.fit_transform(dataset['client_id'].astype(str))
            ensure_model_dir()
            joblib.dump(le, LABEL_ENCODER_PATH)
        
        # Separate features and labels
        X = dataset.drop('label', axis=1).values
        y = dataset['label'].astype('int').values
        
        # Feature Scaling
        scaler = StandardScaler()
        X = scaler.fit_transform(X)
        
        # Save scaler for prediction
        ensure_model_dir()
        joblib.dump(scaler, SCALER_PATH)
        
        # One-hot encode labels
        y = to_categorical(y)
        
        # Train-test split
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=42, stratify=y
        )
        
        print("[INFO] Preprocessing completed")
        print(f"[INFO] X_train shape: {X_train.shape}")
        print(f"[INFO] X_test shape: {X_test.shape}")
        
        return X_train, X_test, y_train, y_test
    
    # ---------------- PREDICTION MODE ----------------
    else:
        print("[INFO] Running in PREDICTION MODE")
        
        # Drop label column if it accidentally exists
        if 'label' in dataset.columns:
            dataset = dataset.drop('label', axis=1)
        
        # Use saved LabelEncoder for client_id
        if 'client_id' in dataset.columns:
            if not os.path.exists(LABEL_ENCODER_PATH):
                raise FileNotFoundError(
                    f"Label encoder not found. Train the model first."
                )
            le = joblib.load(LABEL_ENCODER_PATH)
            # Map unseen labels to -1 (unknown)
            dataset['client_id'] = dataset['client_id'].astype(str).apply(
                lambda x: le.transform([x])[0] if x in le.classes_ else -1
            )
        
        X = dataset.values.astype(np.float64)
        
        # Use the saved scaler
        if not os.path.exists(SCALER_PATH):
            raise FileNotFoundError(
                f"Scaler not found. Train the model first."
            )
        
        scaler = joblib.load(SCALER_PATH)
        X = scaler.transform(X)
        
        print(f"[INFO] Preprocessing completed. Features shape: {X.shape}")
        
        return X, None


def validate_csv_file(csv_path: str) -> Tuple[bool, str]:
    """
    Validate a CSV file for training or prediction.
    
    Args:
        csv_path: Path to the CSV file
    
    Returns:
        Tuple of (is_valid, error_message)
    """
    try:
        # Check if file exists
        if not os.path.exists(csv_path):
            return False, "File not found"
        
        # Try to load
        df = pd.read_csv(csv_path)
        
        # Check if empty
        if df.empty:
            return False, "CSV file is empty"
        
        # Check for required columns (at minimum we need some feature columns)
        if len(df.columns) < 2:
            return False, "CSV must have at least 2 columns"
        
        return True, "Valid"
    
    except pd.errors.EmptyDataError:
        return False, "CSV file is empty"
    except pd.errors.ParserError:
        return False, "Invalid CSV format"
    except Exception as e:
        return False, f"Validation error: {str(e)}"

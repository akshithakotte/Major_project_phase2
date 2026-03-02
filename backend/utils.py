"""
Utility functions for the Electricity Theft Detection backend.
Contains helper functions for file handling, validation, and metrics management.
"""

import os
import json
from typing import Dict, Any, Optional
from flask import jsonify


# Base directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.join(BASE_DIR, "Dataset")
MODEL_DIR = os.path.join(BASE_DIR, "model")
METRICS_DIR = os.path.join(BASE_DIR, "metrics")
GRAPHS_DIR = os.path.join(BASE_DIR, "graphs")


def ensure_directories():
    """Create necessary directories if they don't exist."""
    for directory in [DATASET_DIR, MODEL_DIR, METRICS_DIR, GRAPHS_DIR]:
        os.makedirs(directory, exist_ok=True)


def allowed_file(filename: str, allowed_extensions: list = None) -> bool:
    """
    Check if file has an allowed extension.
    
    Args:
        filename: Name of the file to check
        allowed_extensions: List of allowed extensions (default: ['csv'])
    
    Returns:
        True if file extension is allowed, False otherwise
    """
    if allowed_extensions is None:
        allowed_extensions = ['csv']
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions


def save_uploaded_file(file, filename: str) -> str:
    """
    Save an uploaded file to the dataset directory.
    
    Args:
        file: File object from request
        filename: Name to save the file as
    
    Returns:
        Path to the saved file
    """
    ensure_directories()
    filepath = os.path.join(DATASET_DIR, filename)
    file.save(filepath)
    return filepath


def load_metrics() -> Optional[Dict[str, Any]]:
    """
    Load metrics from the metrics.json file.
    
    Returns:
        Dictionary containing metrics or None if file doesn't exist
    """
    metrics_path = os.path.join(METRICS_DIR, "metrics.json")
    if not os.path.exists(metrics_path):
        return None
    
    with open(metrics_path, "r") as f:
        return json.load(f)


def save_metrics_to_file(metrics: Dict[str, Any]) -> bool:
    """
    Save metrics to the metrics.json file.
    
    Args:
        metrics: Dictionary containing metrics to save
    
    Returns:
        True if saved successfully, False otherwise
    """
    try:
        ensure_directories()
        metrics_path = os.path.join(METRICS_DIR, "metrics.json")
        with open(metrics_path, "w") as f:
            json.dump(metrics, f, indent=4)
        return True
    except Exception as e:
        print(f"[ERROR] Failed to save metrics: {e}")
        return False


def create_error_response(message: str, status_code: int = 400) -> tuple:
    """
    Create a standardized error response.
    
    Args:
        message: Error message
        status_code: HTTP status code
    
    Returns:
        Tuple of (jsonify response, status code)
    """
    return jsonify({"error": message}), status_code


def create_success_response(data: Dict[str, Any] = None, message: str = None) -> Dict[str, Any]:
    """
    Create a standardized success response.
    
    Args:
        data: Data to include in response
        message: Success message
    
    Returns:
        Dictionary containing success response
    """
    response = {"success": True}
    if message:
        response["message"] = message
    if data:
        response.update(data)
    return response


def check_models_trained() -> bool:
    """
    Check if models have been trained (model files exist).
    
    Returns:
        True if models exist, False otherwise
    """
    model_json = os.path.join(MODEL_DIR, "model.json")
    model_weights = os.path.join(MODEL_DIR, "model.weights.h5")
    return os.path.exists(model_json) and os.path.exists(model_weights)

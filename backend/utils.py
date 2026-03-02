"""
Utility functions for the Electricity Theft Detection backend.
Contains helper functions for file handling, validation, and metrics management.
"""

import os
import json
import logging
from datetime import datetime
from typing import Dict, Any, Optional
from flask import jsonify

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'app.log')),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Maximum file size (10 MB)
MAX_FILE_SIZE = 10 * 1024 * 1024


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
    logger.info("Directories ensured")


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


def check_file_size(file) -> bool:
    """
    Check if file size is within allowed limit.
    
    Args:
        file: File object from request
    
    Returns:
        True if file size is acceptable, False otherwise
    """
    file.seek(0, os.SEEK_END)
    size = file.tell()
    file.seek(0)
    return size <= MAX_FILE_SIZE


def save_uploaded_file(file, filename: str) -> str:
    """
    Save an uploaded file to the dataset directory.
    
    Args:
        file: File object from request
        filename: Name to save the file as
    
    Returns:
        Path to the saved file
    
    Raises:
        ValueError: If file size exceeds limit
    """
    if not check_file_size(file):
        raise ValueError(f"File size exceeds maximum limit of {MAX_FILE_SIZE / (1024*1024):.1f} MB")
    
    ensure_directories()
    filepath = os.path.join(DATASET_DIR, filename)
    file.save(filepath)
    logger.info(f"File saved: {filepath}")
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


def save_metrics_to_file(metrics: Dict[str, Any], version: str = None) -> bool:
    """
    Save metrics to the metrics.json file with optional versioning.
    
    Args:
        metrics: Dictionary containing metrics to save
        version: Optional version identifier for the model
    
    Returns:
        True if saved successfully, False otherwise
    """
    try:
        ensure_directories()
        
        # Add timestamp and version to metrics
        metrics['timestamp'] = datetime.now().isoformat()
        if version:
            metrics['version'] = version
        
        # Save current metrics
        metrics_path = os.path.join(METRICS_DIR, "metrics.json")
        with open(metrics_path, "w") as f:
            json.dump(metrics, f, indent=4)
        
        # Also save versioned copy
        version_str = version or datetime.now().strftime("%Y%m%d_%H%M%S")
        versioned_path = os.path.join(METRICS_DIR, f"metrics_v{version_str}.json")
        with open(versioned_path, "w") as f:
            json.dump(metrics, f, indent=4)
        
        logger.info(f"Metrics saved: {metrics_path} and {versioned_path}")
        return True
    except Exception as e:
        logger.error(f"Failed to save metrics: {e}")
        return False


def get_model_versions() -> list:
    """
    Get list of all saved model versions.
    
    Returns:
        List of version strings
    """
    versions = []
    if os.path.exists(METRICS_DIR):
        for filename in os.listdir(METRICS_DIR):
            if filename.startswith("metrics_v") and filename.endswith(".json"):
                version = filename.replace("metrics_v", "").replace(".json", "")
                versions.append(version)
    return sorted(versions, reverse=True)


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

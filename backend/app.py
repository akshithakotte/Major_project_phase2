"""
Flask backend for Electricity Theft Detection.
Provides API routes for training models and making predictions.
"""

import os
import sys
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

# Add backend directory to path for imports
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

from utils import (
    ensure_directories,
    allowed_file,
    save_uploaded_file,
    load_metrics,
    save_metrics_to_file,
    create_error_response,
    create_success_response,
    check_models_trained,
    DATASET_DIR,
    GRAPHS_DIR,
    METRICS_DIR
)
from preprocess import load_and_preprocess, validate_csv_file
from model import train_cnn, train_random_forest, load_model

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:8080", "http://127.0.0.1:8080", "http://localhost:5173", "http://127.0.0.1:5173"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["*"]
    }
})

# Ensure all directories exist
ensure_directories()


# ============================================
# HEALTH CHECK
# ============================================
@app.route("/health", methods=["GET"])
def health_check():
    """Check if backend is running and models are available."""
    return jsonify({
        "status": "healthy",
        "models_trained": check_models_trained(),
        "message": "Electricity Theft Detection API is running"
    })


@app.route("/", methods=["GET"])
def index():
    """Root endpoint with API info."""
    return jsonify({
        "message": "Electricity Theft Detection API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "train": "POST /train",
            "predict": "POST /predict",
            "metrics": "GET /metrics",
            "results": "GET /results"
        }
    })


# ============================================
# TRAINING ROUTE
# ============================================
@app.route("/train", methods=["POST"])
def train_route():
    """
    Train CNN and Random Forest models.
    
    Expects:
        - Form data with 'dataset' key containing CSV file
    
    Returns:
        JSON with training metrics for both models
    """
    # Check if file was uploaded
    if 'dataset' not in request.files:
        return create_error_response("No file provided. Use key 'dataset' in form-data.", 400)
    
    file = request.files['dataset']
    
    # Check if file has a name
    if file.filename == '':
        return create_error_response("No file selected", 400)
    
    # Validate file extension
    if not allowed_file(file.filename):
        return create_error_response("Invalid file type. Only CSV files are allowed.", 400)
    
    try:
        # Save the uploaded file
        filepath = save_uploaded_file(file, "training_data.csv")
        
        # Validate CSV content
        is_valid, error_msg = validate_csv_file(filepath)
        if not is_valid:
            return create_error_response(f"Invalid CSV: {error_msg}", 400)
        
        # Load and preprocess data
        X_train, X_test, y_train, y_test = load_and_preprocess(filepath, training=True)
        
        # Train CNN model
        cnn_model, cnn_metrics = train_cnn(X_train, X_test, y_train, y_test)
        
        # Train Random Forest model
        rf_model, rf_metrics = train_random_forest(X_train, X_test, y_train, y_test)
        
        # Prepare and save metrics
        metrics = {
            "CNN": cnn_metrics,
            "RandomForest": rf_metrics
        }
        save_metrics_to_file(metrics)
        
        return jsonify(create_success_response(
            data={"metrics": metrics},
            message="Training completed successfully"
        ))
    
    except FileNotFoundError as e:
        return create_error_response(f"File error: {str(e)}", 400)
    except ValueError as e:
        return create_error_response(f"Data error: {str(e)}", 400)
    except Exception as e:
        return create_error_response(f"Training failed: {str(e)}", 500)


@app.route("/train", methods=["GET"])
def train_info():
    """Provide info about the train endpoint."""
    return jsonify({
        "message": "Send POST request with form-data key 'dataset' to train models",
        "method": "POST",
        "required": {
            "dataset": "CSV file with features and 'label' column"
        }
    })


# ============================================
# PREDICTION ROUTE
# ============================================
@app.route("/predict", methods=["POST"])
def predict_route():
    """
    Run prediction on new data.
    
    Expects:
        - Form data with 'testdata' key containing CSV file
    
    Returns:
        JSON with prediction counts (total, theft, normal)
    """
    # Check if models are trained
    if not check_models_trained():
        return create_error_response(
            "Models not trained. Please train models first using POST /train", 
            400
        )
    
    # Check if file was uploaded
    if 'testdata' not in request.files:
        return create_error_response("No file provided. Use key 'testdata' in form-data.", 400)
    
    file = request.files['testdata']
    
    # Check if file has a name
    if file.filename == '':
        return create_error_response("No file selected", 400)
    
    # Validate file extension
    if not allowed_file(file.filename):
        return create_error_response("Invalid file type. Only CSV files are allowed.", 400)
    
    try:
        # Save the uploaded file
        filepath = save_uploaded_file(file, "test_data.csv")
        
        # Validate CSV content
        is_valid, error_msg = validate_csv_file(filepath)
        if not is_valid:
            return create_error_response(f"Invalid CSV: {error_msg}", 400)
        
        # Load and preprocess data
        X, _ = load_and_preprocess(filepath, training=False)
        
        # Load model and make predictions
        model = load_model()
        predictions = model.predict(X, verbose=0)
        preds = predictions.argmax(axis=1)
        
        # Calculate results
        total = int(len(preds))
        theft = int(preds.sum())
        normal = int(total - theft)
        
        return jsonify(create_success_response(
            data={
                "total": total,
                "theft": theft,
                "normal": normal
            },
            message="Prediction completed successfully"
        ))
    
    except FileNotFoundError as e:
        return create_error_response(f"File error: {str(e)}", 400)
    except ValueError as e:
        return create_error_response(f"Data error: {str(e)}", 400)
    except Exception as e:
        return create_error_response(f"Prediction failed: {str(e)}", 500)


@app.route("/predict", methods=["GET"])
def predict_info():
    """Provide info about the predict endpoint."""
    return jsonify({
        "message": "Send POST request with form-data key 'testdata' to run prediction",
        "method": "POST",
        "required": {
            "testdata": "CSV file with features (no label column needed)"
        },
        "note": "Models must be trained first using POST /train"
    })


# ============================================
# METRICS ROUTES
# ============================================
@app.route("/metrics", methods=["GET"])
def get_metrics():
    """
    Get training metrics.
    
    Returns:
        JSON with metrics for CNN and Random Forest models
    """
    metrics = load_metrics()
    
    if metrics is None:
        return create_error_response(
            "No metrics found. Train the models first using POST /train", 
            404
        )
    
    return jsonify(create_success_response(data={"metrics": metrics}))


@app.route("/results", methods=["GET"])
def get_results():
    """
    Alias for /metrics - Get training results.
    
    Returns:
        JSON with training results
    """
    metrics = load_metrics()
    
    if metrics is None:
        return create_error_response(
            "No results found. Train the models first using POST /train", 
            404
        )
    
    return jsonify(metrics)


# ============================================
# GRAPH ROUTE
# ============================================
@app.route("/graph/comparison", methods=["GET"])
def comparison_graph():
    """
    Get comparison graph image.
    
    Returns:
        PNG image comparing model performance
    """
    filename = "comparison_graph.png"
    path = os.path.join(GRAPHS_DIR, filename)
    
    if not os.path.exists(path):
        return create_error_response(
            "Graph not found. Train models first to generate comparison graphs.", 
            404
        )
    
    return send_from_directory(GRAPHS_DIR, filename)


# ============================================
# ERROR HANDLERS
# ============================================
@app.errorhandler(404)
def not_found(error):
    return create_error_response("Endpoint not found", 404)


@app.errorhandler(405)
def method_not_allowed(error):
    return create_error_response("Method not allowed", 405)


@app.errorhandler(500)
def internal_error(error):
    return create_error_response("Internal server error", 500)


# ============================================
# MAIN
# ============================================
if __name__ == "__main__":
    print("=" * 50)
    print("Electricity Theft Detection API")
    print("=" * 50)
    print(f"Health check: http://127.0.0.1:5000/health")
    print(f"API docs:     http://127.0.0.1:5000/")
    print("=" * 50)
    
    app.run(debug=True, host="127.0.0.1", port=5000)

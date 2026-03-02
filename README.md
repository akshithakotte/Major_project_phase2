# Electricity Theft Detection

A web-based system for detecting electricity theft using a **CNN** (convolutional neural network) and **Random Forest** ensemble. Users can upload labelled CSV data to train the models and unlabelled CSV data to run predictions. The app provides performance metrics, confusion matrices, and comparison graphs.

## Features

- **Model training**: Upload a training CSV to train both CNN and Random Forest models (normalization, label encoding, 80/20 stratified split, early stopping for CNN).
- **Performance metrics**: Accuracy, precision, recall, F1 score, and confusion matrices for both models.
- **Comparison graph**: Visual comparison of CNN vs Random Forest metrics.
- **Prediction**: Upload a test CSV to classify records as theft vs normal using the trained CNN.
- **Proposed System**: In-app methodology page describing preprocessing, training, evaluation, and deployment.

## Requirements

- Python 3.8+
- See `requirements.txt` for dependencies (Flask, TensorFlow/Keras, scikit-learn, pandas, matplotlib, joblib).

## Setup

1. **Clone or download** the project and open a terminal in the project root.

2. **Create a virtual environment** (recommended):
   ```bash
   python3 -m venv venv
   source venv/bin/activate   # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Prepare the dataset** (optional for first run):
   - Place your training CSV in a `Dataset` folder (e.g. `Dataset/ElectricityTheft.csv`).
   - Training CSV must include a `label` column (0 = normal, 1 = theft) and compatible features (e.g. `client_id`, `disrict`, `client_catg`, `region`; `creation_date` is dropped if present).

## How to Run

Start the Flask application:

```bash
python app.py
```

The app will open in your browser at `http://127.0.0.1:5000`. If it does not, open that URL manually.

- **Dashboard**: Upload training CSV → “Run Training Pipeline”; upload prediction CSV → “Predict Theft vs Normal”. View latest metrics and link to full results.
- **Training Results**: View accuracy/precision/recall/F1, confusion matrices (after a new training run), and the CNN vs RF comparison graph.
- **Proposed System**: Read the methodology (preprocessing, metrics, confusion matrix, deployment).

## Dataset Format

- **Training CSV**: Must contain a `label` column (0 or 1). Other columns are used as features; categorical columns (e.g. `client_id`) are label-encoded, and numeric features are standard-scaled. Rows with missing values are filled with 0.
- **Prediction CSV**: Same feature columns as training (no `label` column needed). The same scaler from the last training run is used. Train at least once before running prediction.

## Project Structure

```
├── app.py              # Flask app: routes, upload, train, predict, graph
├── train.py            # Training pipeline: CNN + Random Forest, save metrics + confusion matrices
├── model.py            # CNN and Random Forest model definitions, save/load
├── preprocess.py       # Load CSV, encode, scale, split, save scaler
├── graph.py            # Load metrics, plot comparison graph (Matplotlib Agg backend)
├── predict.py          # Standalone prediction script (optional)
├── requirements.txt
├── README.md
├── Dataset/            # Uploaded training/prediction CSVs (created automatically)
├── model/              # Saved model (model.json, model.weights.h5), scaler.pkl
├── metrics/            # metrics.json (accuracy, precision, recall, f1, confusion_matrix)
├── graphs/             # comparison_graph.png
└── templates/          # index.html, results.html, prediction.html, proposed_system.html
```

## License

Use for educational or project purposes as required.

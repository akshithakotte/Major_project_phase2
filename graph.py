import json
import os
import numpy as np
import matplotlib.pyplot as plt


def load_metrics():
    print("[INFO] Loading metrics from train.py output...")

    with open("metrics/metrics.json", "r") as f:
        metrics = json.load(f)

    return metrics


def plot_comparisons(metrics):
    cnn = metrics["CNN"]
    rf = metrics["RandomForest"]

    metric_names = ["accuracy", "precision", "recall", "f1_score"]
    labels = ["Accuracy", "Precision", "Recall", "F1 Score"]

    cnn_values = [cnn[m] for m in metric_names]
    rf_values = [rf[m] for m in metric_names]

    if not os.path.exists("graphs"):
        os.makedirs("graphs")

    x = np.arange(len(labels))
    width = 0.35

    # ---------------------------
    # Combined comparison graph
    # ---------------------------
    plt.figure(figsize=(10, 6))
    plt.bar(x - width/2, cnn_values, width, label="CNN")
    plt.bar(x + width/2, rf_values, width, label="Random Forest")

    plt.xticks(x, labels)
    plt.ylabel("Score (%)")
    plt.title("CNN vs Random Forest Performance Comparison")
    plt.legend()
    plt.tight_layout()

    plt.savefig("graphs/comparison_graph.png")
    plt.close()

    print("[INFO] Saved graphs/comparison_graph.png")

    # ---------------------------
    # Individual metric graphs
    # ---------------------------
    for i, label in enumerate(labels):
        plt.figure(figsize=(6, 4))
        plt.bar(["CNN", "Random Forest"],
                [cnn_values[i], rf_values[i]])

        plt.ylabel("Score (%)")
        plt.title(f"{label} Comparison")
        plt.tight_layout()

        filename = f"graphs/{label.lower().replace(' ', '_')}_comparison.png"
        plt.savefig(filename)
        plt.close()

        print(f"[INFO] Saved {filename}")

    print("[INFO] All graphs generated successfully.")


# =========================
# RUN INDEPENDENTLY
# =========================
if __name__ == "__main__":
    print("Running graph.py directly...\n")

    metrics = load_metrics()
    plot_comparisons(metrics)

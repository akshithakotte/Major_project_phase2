import { API_BASE_URL, buildApiUrl } from "./config";

// Demo mode: set VITE_DEMO_MODE=true to use mock data without backend
const IS_DEMO = import.meta.env.VITE_DEMO_MODE === "true";

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  confusion_matrix: number[][];
}

export interface TrainingMetrics {
  CNN: ModelMetrics;
  RandomForest: ModelMetrics;
}

export interface TrainResponse {
  message: string;
  metrics: TrainingMetrics;
}

export interface PredictionResult {
  total: number;
  theft: number;
  normal: number;
}

// Mock data from your actual metrics.json
const DEMO_METRICS: TrainingMetrics = {
  CNN: {
    accuracy: 96.98,
    precision: 97.39,
    recall: 96.56,
    f1_score: 96.90,
    confusion_matrix: [[1993, 7], [99, 1415]],
  },
  RandomForest: {
    accuracy: 94.71,
    precision: 94.60,
    recall: 94.60,
    f1_score: 94.60,
    confusion_matrix: [[1907, 93], [93, 1421]],
  },
};

function simulateDelay(ms = 2000): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function trainModel(file: File): Promise<TrainResponse> {
  if (IS_DEMO) {
    await simulateDelay(3000);
    return { message: "Training completed successfully (Demo Mode)", metrics: DEMO_METRICS };
  }

  const formData = new FormData();
  formData.append("dataset", file);

  const res = await fetch(buildApiUrl("/train"), {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Training failed");
  return res.json();
}

export async function runPrediction(file: File): Promise<PredictionResult> {
  if (IS_DEMO) {
    await simulateDelay(2000);
    // Simulate based on uploaded file size
    const lines = (await file.text()).split("\n").filter(Boolean);
    const total = Math.max(lines.length - 1, 0); // exclude header
    const theft = Math.round(total * 0.43); // ~43% theft rate from training data
    return { total, theft, normal: total - theft };
  }

  const formData = new FormData();
  formData.append("testdata", file);

  const res = await fetch(buildApiUrl("/predict"), {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Prediction failed");
  return res.json();
}

export async function fetchResults(): Promise<TrainingMetrics> {
  if (IS_DEMO) {
    await simulateDelay(500);
    return DEMO_METRICS;
  }

  const res = await fetch(buildApiUrl("/results"));
  if (!res.ok) throw new Error("Failed to fetch results");
  return res.json();
}

export function isDemoMode(): boolean {
  return IS_DEMO;
}

/**
 * Backend API Configuration
 * 
 * This file centralizes all backend API URL configuration.
 * The backend URL can be set via environment variable VITE_API_URL
 * or defaults to the local Flask development server.
 */

// Backend base URL - defaults to local Flask server
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

// API endpoints
export const ENDPOINTS = {
  TRAIN: "/train",
  PREDICT: "/predict",
  RESULTS: "/results",
  GRAPH_COMPARISON: "/graph/comparison",
} as const;

// Helper to build full API URLs
export function buildApiUrl(endpoint: string): string {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
}

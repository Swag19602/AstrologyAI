export interface KundaliDetails {
  name: string;
  dateOfBirth: string; // Format: YYYY-MM-DD
  timeOfBirth: string; // Format: HH:MM (24-hour format)
  placeOfBirth: string;
}

export interface PredictionResponse {
  predictions: string[];
  advice: string;
  compatibility: string;
}

export interface GeminiResponse {
  status: string;
  message: string;
  data: PredictionResponse;
}
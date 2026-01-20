import { Submission, Prediction } from '../types';

const SUBMISSION_KEY = 'traffic_investigator_submissions';
const PREDICTION_KEY = 'traffic_investigator_predictions';

export const saveSubmission = (seatNumber: string, group: 'A' | 'B' | 'CHALLENGE', content: string): void => {
  const existingData = localStorage.getItem(SUBMISSION_KEY);
  const submissions: Submission[] = existingData ? JSON.parse(existingData) : [];
  
  const newSubmission: Submission = {
    id: Date.now().toString(),
    seatNumber,
    group,
    content,
    timestamp: Date.now(),
  };

  submissions.push(newSubmission);
  localStorage.setItem(SUBMISSION_KEY, JSON.stringify(submissions));
};

export const getSubmissions = (): Submission[] => {
  const existingData = localStorage.getItem(SUBMISSION_KEY);
  return existingData ? JSON.parse(existingData) : [];
};

export const clearSubmissions = (): void => {
  localStorage.removeItem(SUBMISSION_KEY);
  localStorage.removeItem(PREDICTION_KEY);
};

// --- Prediction Services ---

export const savePrediction = (seatNumber: string, motorcycles: number, cars: number): void => {
  const existingData = localStorage.getItem(PREDICTION_KEY);
  const predictions: Prediction[] = existingData ? JSON.parse(existingData) : [];
  
  predictions.push({
    seatNumber,
    motorcycles,
    cars,
    timestamp: Date.now()
  });
  
  localStorage.setItem(PREDICTION_KEY, JSON.stringify(predictions));
};

export const getPredictions = (): Prediction[] => {
  const existingData = localStorage.getItem(PREDICTION_KEY);
  return existingData ? JSON.parse(existingData) : [];
};
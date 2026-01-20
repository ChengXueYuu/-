export enum ViewState {
  HOME = 'HOME',
  GROUP_A = 'GROUP_A',
  GROUP_B = 'GROUP_B',
  TEACHER = 'TEACHER',
  CHALLENGE = 'CHALLENGE', // New: Breakfast Problem
  SUMMARY = 'SUMMARY'      // New: AI Summary Card
}

export enum VehicleType {
  MOTORCYCLE = 'MOTORCYCLE', // 2 wheels
  CAR = 'CAR'                // 4 wheels
}

export interface ProblemData {
  totalVehicles: number;
  totalWheels: number;
}

export interface Submission {
  id: string;
  seatNumber: string;
  group: 'A' | 'B' | 'CHALLENGE';
  content: string;
  timestamp: number;
}

export interface Prediction {
  seatNumber: string;
  motorcycles: number;
  cars: number;
  timestamp: number;
}

export interface AnalysisSummary {
  text: string;
  generatedAt: number;
}
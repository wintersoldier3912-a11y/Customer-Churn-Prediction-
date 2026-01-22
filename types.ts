
export interface CustomerData {
  gender: string;
  SeniorCitizen: number;
  Partner: string;
  Dependents: string;
  tenure: number;
  PhoneService: string;
  MultipleLines: string;
  InternetService: string;
  OnlineSecurity: string;
  OnlineBackup: string;
  DeviceProtection: string;
  TechSupport: string;
  StreamingTV: string;
  StreamingMovies: string;
  Contract: string;
  PaperlessBilling: string;
  PaymentMethod: string;
  MonthlyCharges: number;
  TotalCharges: number;
}

export interface ChurnPrediction {
  probability: number;
  riskCategory: 'Low' | 'Medium' | 'High';
  drivers: {
    feature: string;
    impact: number;
    description: string;
  }[];
  explanation: string;
}

export enum TabType {
  DASHBOARD = 'DASHBOARD',
  PREDICTOR = 'PREDICTOR',
  METRICS = 'METRICS',
  PYTHON_CODE = 'PYTHON_CODE'
}

export interface Drug {
  id: number;
  name: string;
  category: string;
  dosageMg: number;
  sideEffects: string[];
}

export interface InteractionResult {
  drugA: string;
  drugB: string;
  riskLevel: "SAFE" | "MODERATE" | "HIGH" | "CRITICAL";
  severityScore: number;
  message: string;
}

export interface PrescriptionItem {
  drugId: number;
  doseMg: number;
  drugName?: string;
}

export interface Prescription {
  id?: number;
  patientName: string;
  doctorName: string;
  createdAt?: string;
  items: PrescriptionItem[];
  interactionSummary?: string;
}

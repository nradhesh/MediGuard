import axios from 'axios';
import { Drug, InteractionResult, Prescription } from '@/types/drug';

const DRUG_SERVICE_URL = 'http://localhost:9001';
const INTERACTION_SERVICE_URL = 'http://localhost:9002';
const PRESCRIPTION_SERVICE_URL = 'http://localhost:9003';

// Create axios instance with default config
const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response received
      console.error('Network Error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Drug Database Service
export const drugService = {
  getAllDrugs: () => apiClient.get<Drug[]>(`${DRUG_SERVICE_URL}/drugs`),
  getDrugById: (id: number) => apiClient.get<Drug>(`${DRUG_SERVICE_URL}/drugs/${id}`),
  createDrug: (drug: Omit<Drug, 'id'>) => apiClient.post<Drug>(`${DRUG_SERVICE_URL}/drugs`, drug),
  updateDrug: (id: number, drug: Omit<Drug, 'id'>) => 
    apiClient.put<Drug>(`${DRUG_SERVICE_URL}/drugs/${id}`, drug),
  deleteDrug: (id: number) => apiClient.delete<string>(`${DRUG_SERVICE_URL}/drugs/${id}`),
  bulkCreateDrugs: (drugs: Omit<Drug, 'id'>[]) => 
    apiClient.post<Drug[]>(`${DRUG_SERVICE_URL}/drugs/bulk`, drugs),
};

// Interaction Service
export const interactionService = {
  analyzeInteraction: (drugA: number, drugB: number) => 
    apiClient.get<InteractionResult>(
      `${INTERACTION_SERVICE_URL}/interactions/analyze?drugA=${drugA}&drugB=${drugB}`
    ),
  getHealth: () => apiClient.get<string>(`${INTERACTION_SERVICE_URL}/health`),
};

// Prescription Service
export const prescriptionService = {
  getAllPrescriptions: () => 
    apiClient.get<Prescription[]>(`${PRESCRIPTION_SERVICE_URL}/prescriptions`),
  getPrescriptionById: (id: number) => 
    apiClient.get<Prescription>(`${PRESCRIPTION_SERVICE_URL}/prescriptions/${id}`),
  createPrescription: (prescription: Omit<Prescription, 'id' | 'createdAt'>) => 
    apiClient.post<Prescription>(`${PRESCRIPTION_SERVICE_URL}/prescriptions`, prescription),
  updatePrescription: (id: number, prescription: Omit<Prescription, 'id' | 'createdAt'>) => 
    apiClient.put<Prescription>(`${PRESCRIPTION_SERVICE_URL}/prescriptions/${id}`, prescription),
  deletePrescription: (id: number) => 
    apiClient.delete<string>(`${PRESCRIPTION_SERVICE_URL}/prescriptions/${id}`),
  validatePrescription: (prescription: Omit<Prescription, 'id' | 'createdAt'>) => 
    apiClient.post<string>(`${PRESCRIPTION_SERVICE_URL}/prescriptions/validate`, prescription),
};

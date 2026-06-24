import { createContext, useContext, useState, useCallback } from "react";

const FormContext = createContext();

const initialState = {
  personalInfo: {
    fullName: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    phone: "",
    email: "",
    state: "",
    city: ""
  },
  additionalInfo: {
    height: "",
    heightUnit: "cm",
    weight: "",
    weightUnit: "kg",
    bloodPressure: "",
    bloodSugar: "",
    physicalActivityLevel: "",
    dietaryPreference: "",
    smokingStatus: "",
    alcoholConsumption: "",
    emergencyContactRelation: "",
    emergencyContactPhone: ""
  },
  medicalHistory: {
    allergies: [],
    allergiesText: "",
    currentMedications: "",
    existingConditions: [],
    existingConditionsText: "",
    pastSurgeries: ""
  },
  insurance: {
    provider: "",
    policyNumber: "",
    documents: []
  },
  healthRecords: {
    documents: [],
    notes: ""
  }
};

export const steps = [
  { id: "personalInfo", label: "Personal Details", path: "/", percentage: 10, time: "2-3 Minutes" },
  { id: "additionalInfo", label: "Additional Information", path: "/additional-info", percentage: 30, time: "2-3 Minutes" },
  { id: "medicalHistory", label: "Medical History", path: "/medical-history", percentage: 40, time: "2-3 Minutes" },
  { id: "insurance", label: "Insurance Information", path: "/insurance", percentage: 60, time: "2-3 Minutes" },
  { id: "healthRecords", label: "Health Records", path: "/health-records", percentage: 75, time: "2-3 Minutes" },
  { id: "review", label: "Review & Complete", path: "/review", percentage: 90, time: "2-3 Minutes" }
];

export function FormProvider({ children }) {
  const [formData, setFormData] = useState(initialState);
  const [currentStep, setCurrentStep] = useState(0);

  const updateFormData = useCallback((section, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((step) => {
    setCurrentStep(step);
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialState);
    setCurrentStep(0);
  }, []);

  const value = {
    formData,
    updateFormData,
    currentStep,
    nextStep,
    prevStep,
    goToStep,
    resetForm
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
}

export default FormContext;

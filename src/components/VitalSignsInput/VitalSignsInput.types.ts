export interface ValidationError {
  field: keyof VitalSigns;
  message: string;
}

/** Complete vital signs data model matching clinical requirements */
export interface VitalSigns {
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  temperature?: number;
  temperatureUnit?: "F" | "C";
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number;
  weightUnit?: "lb" | "kg";
  height?: number;
  heightUnit?: "in" | "cm";
  painLevel?: number; // 0–10
}

export interface VitalSignsInputProps {
  onChange: (vitals: VitalSigns) => void;
  initialValues?: Partial<VitalSigns>;
  requiredFields?: (keyof VitalSigns)[];
  onValidationError?: (errors: ValidationError[]) => void;
  disabled?: boolean;
  label?: string;
}

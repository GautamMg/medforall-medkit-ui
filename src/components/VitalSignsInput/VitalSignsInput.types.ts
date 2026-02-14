export interface VitalSigns {
    temperatureF?: number; // Fahrenheit
    heartRate?: number;    // bpm
    systolic?: number;     // mmHg
    diastolic?: number;    // mmHg
    spo2?: number;         // %
  }
  
  export interface VitalSignsInputProps {
    label?: string; // default: "Vital signs"
    value: VitalSigns;
    onChange: (next: VitalSigns) => void;
  
    disabled?: boolean;
  }
  
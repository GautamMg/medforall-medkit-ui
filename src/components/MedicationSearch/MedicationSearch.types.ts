export interface MedicationOption {
    id: string;
    name: string;          // e.g. "Amoxicillin"
    subtitle?: string;     // e.g. "500 mg capsule"
  }
  
  export interface MedicationSearchProps {
    label?: string;                 // default: "Medication"
    placeholder?: string;           // default: "Search medications"
    query: string;
    onQueryChange: (q: string) => void;
  
    results: MedicationOption[];
    loading?: boolean;
    emptyText?: string;             // default: "No results"
    onSelect: (med: MedicationOption) => void;
  }
  
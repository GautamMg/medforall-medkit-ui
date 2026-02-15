/** Full medication record matching clinical data requirements */
export interface Medication {
  id: string;
  brandName: string;
  genericName: string;
  strength: string;
  form: string; // tablet, capsule, injection, etc.
  controlledSubstance: boolean;
  requiresPriorAuth: boolean;
}

export interface MedicationSearchProps {
  onSelect: (medication: Medication) => void;
  /** Async search function; consumer is responsible for calling the API */
  searchFn: (query: string) => Promise<Medication[]>;
  /** Debounce delay in ms (default: 300) */
  debounceMs?: number;
  placeholder?: string;
  label?: string;
  /** Recently selected medications shown before a search is typed */
  recentSelections?: Medication[];
  /** Maximum number of results to display (default: 10) */
  maxResults?: number;
}

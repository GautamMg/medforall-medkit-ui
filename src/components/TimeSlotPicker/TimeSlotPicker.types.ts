export interface TimeSlot {
  id: string;
  startTime: Date;
  endTime: Date;
  available: boolean;
  /** For group appointments — shows remaining capacity */
  remainingCapacity?: number;
}

export interface TimeSlotPickerProps {
  date: Date;
  availableSlots: TimeSlot[];
  selectedSlot?: TimeSlot;
  onSelect: (slot: TimeSlot) => void;
  /** IANA timezone string, e.g. "America/New_York" */
  timezone: string;
  /** Duration of each slot in minutes */
  slotDuration: number;
  disabled?: boolean;
}

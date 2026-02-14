export interface TimeSlot {
    id: string;
    label: string;      // e.g. "10:30 AM"
    startISO: string;   // ISO string
    available: boolean;
  }
  
  export interface TimeSlotPickerProps {
    dateLabel: string;               // e.g. "Mon, Feb 12"
    timezoneLabel?: string;          // e.g. "ET"
    slots: TimeSlot[];
  
    value?: string;                  // selected slot id
    onChange?: (slotId: string) => void;
  }
  
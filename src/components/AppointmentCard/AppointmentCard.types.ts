export type AppointmentStatus =
  | "scheduled"
  | "checked-in"
  | "in-progress"
  | "completed"
  | "no-show"
  | "cancelled";

export type AppointmentType = "in-person" | "telehealth" | "phone";

/** Patient information shown on the card */
export interface Patient {
  name: string;
  avatar?: string;
  dateOfBirth: Date;
  mrn: string; // Medical Record Number
}

/** Core appointment data */
export interface Appointment {
  id: string;
  scheduledTime: Date;
  duration: number; // minutes
  type: AppointmentType;
  status: AppointmentStatus;
  reason: string;
}

/** Attending provider */
export interface Provider {
  name: string;
  specialty: string;
}

export interface AppointmentCardProps {
  patient: Patient;
  appointment: Appointment;
  provider?: Provider;
  onStatusChange?: (newStatus: AppointmentStatus) => void;
  onReschedule?: () => void;
  onCancel?: () => void;
}

export type AppointmentStatus = "scheduled" | "checked-in" | "in-progress" | "completed" | "cancelled";

export type AppointmentType = "in-person" | "telehealth";

export interface Patient {
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO: YYYY-MM-DD
}

export interface AppointmentCardProps {
  patient: Patient;
  appointmentType: AppointmentType;
  status: AppointmentStatus;
  appointmentTime: string; // display string; keep simple for now
  clinicName?: string;

  onViewDetails?: () => void;
  onReschedule?: () => void;
  onCancel?: () => void;
}
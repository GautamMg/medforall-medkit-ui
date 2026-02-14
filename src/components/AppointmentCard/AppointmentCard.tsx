import React, { useMemo, useState } from "react";
import styles from "./AppointmentCard.module.css";
import type { AppointmentCardProps, AppointmentStatus } from "./AppointmentCard.types";

function calcAge(dobISO: string): number {
  const dob = new Date(dobISO);
  if (Number.isNaN(dob.getTime())) return 0;

  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age -= 1;
  return Math.max(age, 0);
}

const STATUS_BADGE: Record<AppointmentStatus, { label: string; tone: "gray" | "blue" | "green" | "red" | "amber" }> = {
  "scheduled": { label: "Scheduled", tone: "blue" },
  "checked-in": { label: "Checked in", tone: "amber" },
  "in-progress": { label: "In progress", tone: "amber" },
  "completed": { label: "Completed", tone: "green" },
  "cancelled": { label: "Cancelled", tone: "red" }
};

export function AppointmentCard(props: AppointmentCardProps) {
  const {
    patient,
    appointmentType,
    status,
    appointmentTime,
    clinicName,
    onViewDetails,
    onReschedule,
    onCancel
  } = props;

  const [menuOpen, setMenuOpen] = useState(false);

  const age = useMemo(() => calcAge(patient.dateOfBirth), [patient.dateOfBirth]);
  const badge = STATUS_BADGE[status];

  return (
    <section className={styles.card} aria-label="Appointment card">
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <div className={styles.nameRow}>
            <h3 className={styles.name}>
              {patient.firstName} {patient.lastName}
            </h3>
            <span className={styles.meta}>• {age} yrs</span>
          </div>

          <div className={styles.subRow}>
            <span className={styles.time}>{appointmentTime}</span>
            {clinicName ? <span className={styles.meta}>• {clinicName}</span> : null}
          </div>
        </div>

        <div className={styles.rightHeader}>
          <span className={`${styles.badge} ${styles[`badge_${badge.tone}`]}`} aria-label={`Status: ${badge.label}`}>
            {badge.label}
          </span>

          <div className={styles.menuWrap}>
            <button
              type="button"
              className={styles.menuButton}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              Actions
            </button>

            {menuOpen ? (
              <div className={styles.menu} role="menu" aria-label="Appointment actions">
                <button type="button" role="menuitem" className={styles.menuItem} onClick={onViewDetails}>
                  View details
                </button>
                <button type="button" role="menuitem" className={styles.menuItem} onClick={onReschedule}>
                  Reschedule
                </button>
                <button type="button" role="menuitem" className={styles.menuItemDanger} onClick={onCancel}>
                  Cancel
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <div className={styles.body}>
        <div className={styles.row}>
          <span className={styles.label}>Type</span>
          <span className={styles.value}>{appointmentType === "telehealth" ? "Telehealth" : "In-person"}</span>
        </div>
      </div>
    </section>
  );
}

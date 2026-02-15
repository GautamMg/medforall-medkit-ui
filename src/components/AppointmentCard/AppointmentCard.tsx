import React, { useMemo, useState } from "react";
import styles from "./AppointmentCard.module.css";
import type { AppointmentCardProps, AppointmentStatus, AppointmentType } from "./AppointmentCard.types";

function calcAge(dob: Date): number {
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age -= 1;
  return Math.max(age, 0);
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

const STATUS_BADGE: Record<AppointmentStatus, { label: string; tone: "gray" | "blue" | "green" | "red" | "amber" | "orange" }> = {
  "scheduled":   { label: "Scheduled",   tone: "blue"   },
  "checked-in":  { label: "Checked in",  tone: "amber"  },
  "in-progress": { label: "In progress", tone: "orange" },
  "completed":   { label: "Completed",   tone: "green"  },
  "no-show":     { label: "No show",     tone: "gray"   },
  "cancelled":   { label: "Cancelled",   tone: "red"    },
};

const TYPE_ICON: Record<AppointmentType, string> = {
  "in-person":  "🏥",
  "telehealth": "📹",
  "phone":      "📞",
};

/**
 * AppointmentCard displays a single patient appointment summary with
 * status badge, appointment type icon, provider info, and action menu.
 */
export function AppointmentCard({
  patient,
  appointment,
  provider,
  onStatusChange,
  onReschedule,
  onCancel,
}: AppointmentCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const age = useMemo(() => calcAge(patient.dateOfBirth), [patient.dateOfBirth]);
  const badge = STATUS_BADGE[appointment.status];
  const typeIcon = TYPE_ICON[appointment.type];
  const typeLabel = appointment.type === "in-person" ? "In-person" : appointment.type === "telehealth" ? "Telehealth" : "Phone";

  function closeMenu() { setMenuOpen(false); }

  return (
    <section className={styles.card} aria-label={`Appointment for ${patient.name}`}>
      <header className={styles.header}>
        <div className={styles.patientInfo}>
          {patient.avatar ? (
            <img src={patient.avatar} alt="" className={styles.avatar} aria-hidden="true" />
          ) : (
            <div className={styles.avatarPlaceholder} aria-hidden="true">
              {patient.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className={styles.titleBlock}>
            <div className={styles.nameRow}>
              <h3 className={styles.name}>{patient.name}</h3>
              <span className={styles.meta}>{age} yrs</span>
            </div>
            <div className={styles.subRow}>
              <span className={styles.mrn}>MRN: {patient.mrn}</span>
            </div>
          </div>
        </div>

        <div className={styles.rightHeader}>
          <span
            className={`${styles.badge} ${styles[`badge_${badge.tone}`]}`}
            aria-label={`Status: ${badge.label}`}
          >
            {badge.label}
          </span>

          <div className={styles.menuWrap}>
            <button
              type="button"
              className={styles.menuButton}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label="Appointment actions"
              onClick={() => setMenuOpen((v) => !v)}
            >
              ⋯
            </button>

            {menuOpen && (
              <div className={styles.menu} role="menu" aria-label="Appointment actions">
                {onStatusChange && appointment.status === "scheduled" && (
                  <button
                    type="button"
                    role="menuitem"
                    className={styles.menuItem}
                    onClick={() => { onStatusChange("checked-in"); closeMenu(); }}
                  >
                    Check in
                  </button>
                )}
                {onReschedule && (
                  <button
                    type="button"
                    role="menuitem"
                    className={styles.menuItem}
                    onClick={() => { onReschedule(); closeMenu(); }}
                  >
                    Reschedule
                  </button>
                )}
                {onCancel && (
                  <button
                    type="button"
                    role="menuitem"
                    className={styles.menuItemDanger}
                    onClick={() => { onCancel(); closeMenu(); }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className={styles.body}>
        <div className={styles.row}>
          <span className={styles.label}>Time</span>
          <span className={styles.value}>{formatTime(appointment.scheduledTime)} · {appointment.duration} min</span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>Type</span>
          <span className={styles.value}>
            <span aria-hidden="true">{typeIcon} </span>
            {typeLabel}
          </span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>Reason</span>
          <span className={styles.value}>{appointment.reason}</span>
        </div>

        {provider && (
          <div className={styles.row}>
            <span className={styles.label}>Provider</span>
            <span className={styles.value}>{provider.name} · {provider.specialty}</span>
          </div>
        )}
      </div>
    </section>
  );
}

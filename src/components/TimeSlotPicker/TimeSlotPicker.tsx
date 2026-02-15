import React, { useMemo } from "react";
import styles from "./TimeSlotPicker.module.css";
import type { TimeSlot, TimeSlotPickerProps } from "./TimeSlotPicker.types";

function getHour(date: Date, timezone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hour12: false,
    timeZone: timezone,
  }).formatToParts(date);
  const h = parts.find((p) => p.type === "hour");
  return h ? parseInt(h.value, 10) : date.getHours();
}

function formatSlotTime(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: timezone,
  }).format(date);
}

function formatDateHeader(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: timezone,
  }).format(date);
}

function getTimezoneAbbr(timezone: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZoneName: "short",
    timeZone: timezone,
  }).formatToParts(new Date());
  return parts.find((p) => p.type === "timeZoneName")?.value ?? timezone;
}

type Group = "Morning" | "Afternoon" | "Evening";

function groupLabel(hour: number): Group {
  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  return "Evening";
}

/**
 * TimeSlotPicker renders available appointment slots grouped by time-of-day
 * section (Morning / Afternoon / Evening). It respects timezone display,
 * shows unavailable slots as disabled, and indicates remaining capacity
 * for group appointments.
 */
export function TimeSlotPicker({
  date,
  availableSlots,
  selectedSlot,
  onSelect,
  timezone,
  slotDuration,
  disabled = false,
}: TimeSlotPickerProps) {
  const dateHeader = useMemo(() => formatDateHeader(date, timezone), [date, timezone]);
  const tzAbbr = useMemo(() => getTimezoneAbbr(timezone), [timezone]);

  const groups = useMemo(() => {
    const map = new Map<Group, TimeSlot[]>([
      ["Morning", []],
      ["Afternoon", []],
      ["Evening", []],
    ]);
    for (const slot of availableSlots) {
      const hour = getHour(slot.startTime, timezone);
      map.get(groupLabel(hour))!.push(slot);
    }
    return Array.from(map.entries()).filter(([, slots]) => slots.length > 0);
  }, [availableSlots, timezone]);

  return (
    <section className={styles.card} aria-label={`Time slot picker for ${dateHeader}`}>
      <header className={styles.header}>
        <div className={styles.dateTitle}>{dateHeader}</div>
        <div className={styles.tzLabel} aria-label={`Timezone: ${timezone}`}>{tzAbbr}</div>
      </header>

      <div className={styles.body}>
        {groups.length === 0 && (
          <p className={styles.empty}>No available slots</p>
        )}

        {groups.map(([group, slots]) => (
          <div key={group} className={styles.group}>
            <h4 className={styles.groupTitle}>{group}</h4>
            <div
              className={styles.grid}
              role="radiogroup"
              aria-label={`${group} slots`}
            >
              {slots.map((slot) => {
                const isSelected = selectedSlot?.id === slot.id;
                const isDisabled = disabled || !slot.available;
                const timeLabel = formatSlotTime(slot.startTime, timezone);

                return (
                  <button
                    key={slot.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    aria-disabled={isDisabled}
                    disabled={isDisabled}
                    className={[
                      styles.slot,
                      isSelected ? styles.slotSelected : "",
                      isDisabled ? styles.slotDisabled : "",
                    ].join(" ").trim()}
                    onClick={() => !isDisabled && onSelect(slot)}
                    title={
                      !slot.available
                        ? "Unavailable"
                        : slot.remainingCapacity != null
                        ? `${slot.remainingCapacity} spots left`
                        : undefined
                    }
                  >
                    <span className={styles.slotTime}>{timeLabel}</span>
                    {slot.remainingCapacity != null && slot.available && (
                      <span className={styles.capacity}>{slot.remainingCapacity} left</span>
                    )}
                    {isSelected && <span className={styles.check} aria-hidden="true">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <footer className={styles.footer}>
        <span className={styles.duration}>Slot duration: {slotDuration} min</span>
      </footer>
    </section>
  );
}

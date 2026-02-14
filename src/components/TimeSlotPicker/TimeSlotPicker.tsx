import React, { useMemo } from "react";
import styles from "./TimeSlotPicker.module.css";
import type { TimeSlotPickerProps, TimeSlot } from "./TimeSlotPicker.types";

function groupLabelFromHour(h: number) {
  if (h < 12) return "Morning";
  if (h < 17) return "Afternoon";
  return "Evening";
}

function hourFromISO(iso: string): number | null {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.getHours();
}

export function TimeSlotPicker({ dateLabel, timezoneLabel, slots, value, onChange }: TimeSlotPickerProps) {
  const groups = useMemo(() => {
    const map = new Map<string, TimeSlot[]>();
    for (const s of slots) {
      const hr = hourFromISO(s.startISO);
      const g = hr == null ? "Slots" : groupLabelFromHour(hr);
      const arr = map.get(g) ?? [];
      arr.push(s);
      map.set(g, arr);
    }
    return Array.from(map.entries());
  }, [slots]);

  return (
    <section className={styles.card} aria-label="Time slot picker">
      <header className={styles.header}>
        <div className={styles.title}>{dateLabel}</div>
        {timezoneLabel ? <div className={styles.tz}>{timezoneLabel}</div> : null}
      </header>

      <div className={styles.body} role="radiogroup" aria-label="Available time slots">
        {groups.map(([group, groupSlots]) => (
          <div key={group} className={styles.group}>
            <div className={styles.groupTitle}>{group}</div>

            <div className={styles.grid}>
              {groupSlots.map((s) => {
                const selected = value === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    className={[
                      styles.slot,
                      selected ? styles.slotSelected : "",
                      !s.available ? styles.slotDisabled : ""
                    ].join(" ")}
                    role="radio"
                    aria-checked={selected}
                    disabled={!s.available}
                    onClick={() => onChange?.(s.id)}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

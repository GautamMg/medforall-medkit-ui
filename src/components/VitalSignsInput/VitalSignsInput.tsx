import React from "react";
import styles from "./VitalSignsInput.module.css";
import type { VitalSigns, VitalSignsInputProps } from "./VitalSignsInput.types";

function toNumberOrUndef(v: string): number | undefined {
  const t = v.trim();
  if (t === "") return undefined;
  const n = Number(t);
  return Number.isFinite(n) ? n : undefined;
}

function hintTemperatureF(v?: number) {
  if (v == null) return undefined;
  if (v < 95 || v > 104) return "Unusual temperature";
  return undefined;
}

function hintHeartRate(v?: number) {
  if (v == null) return undefined;
  if (v < 40 || v > 180) return "Unusual heart rate";
  return undefined;
}

function hintBP(sys?: number, dia?: number) {
  if (sys == null && dia == null) return undefined;
  if (sys != null && (sys < 70 || sys > 220)) return "Unusual blood pressure";
  if (dia != null && (dia < 40 || dia > 140)) return "Unusual blood pressure";
  if (sys != null && dia != null && dia >= sys) return "Diastolic should be lower than systolic";
  return undefined;
}

function hintSpO2(v?: number) {
  if (v == null) return undefined;
  if (v < 85 || v > 100) return "Unusual SpO₂";
  return undefined;
}

export function VitalSignsInput({
  label = "Vital signs",
  value,
  onChange,
  disabled = false
}: VitalSignsInputProps) {
  const tempHint = hintTemperatureF(value.temperatureF);
  const hrHint = hintHeartRate(value.heartRate);
  const bpHint = hintBP(value.systolic, value.diastolic);
  const spo2Hint = hintSpO2(value.spo2);

  return (
    <fieldset className={styles.root} disabled={disabled}>
      <legend className={styles.legend}>{label}</legend>

      <div className={styles.grid}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="vs-temp">
            Temperature (°F)
          </label>
          <input
            id="vs-temp"
            className={styles.input}
            inputMode="decimal"
            value={value.temperatureF ?? ""}
            onChange={(e) => onChange({ ...value, temperatureF: toNumberOrUndef(e.target.value) })}
            aria-describedby={tempHint ? "vs-temp-hint" : undefined}
          />
          {tempHint ? (
            <div id="vs-temp-hint" className={styles.hint} role="note">
              {tempHint}
            </div>
          ) : null}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="vs-hr">
            Heart rate (bpm)
          </label>
          <input
            id="vs-hr"
            className={styles.input}
            inputMode="numeric"
            value={value.heartRate ?? ""}
            onChange={(e) => onChange({ ...value, heartRate: toNumberOrUndef(e.target.value) })}
            aria-describedby={hrHint ? "vs-hr-hint" : undefined}
          />
          {hrHint ? (
            <div id="vs-hr-hint" className={styles.hint} role="note">
              {hrHint}
            </div>
          ) : null}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="vs-sys">
            BP systolic (mmHg)
          </label>
          <input
            id="vs-sys"
            className={styles.input}
            inputMode="numeric"
            value={value.systolic ?? ""}
            onChange={(e) => onChange({ ...value, systolic: toNumberOrUndef(e.target.value) })}
            aria-describedby={bpHint ? "vs-bp-hint" : undefined}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="vs-dia">
            BP diastolic (mmHg)
          </label>
          <input
            id="vs-dia"
            className={styles.input}
            inputMode="numeric"
            value={value.diastolic ?? ""}
            onChange={(e) => onChange({ ...value, diastolic: toNumberOrUndef(e.target.value) })}
            aria-describedby={bpHint ? "vs-bp-hint" : undefined}
          />
          {bpHint ? (
            <div id="vs-bp-hint" className={styles.hint} role="note">
              {bpHint}
            </div>
          ) : null}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="vs-spo2">
            SpO₂ (%)
          </label>
          <input
            id="vs-spo2"
            className={styles.input}
            inputMode="numeric"
            value={value.spo2 ?? ""}
            onChange={(e) => onChange({ ...value, spo2: toNumberOrUndef(e.target.value) })}
            aria-describedby={spo2Hint ? "vs-spo2-hint" : undefined}
          />
          {spo2Hint ? (
            <div id="vs-spo2-hint" className={styles.hint} role="note">
              {spo2Hint}
            </div>
          ) : null}
        </div>
      </div>
    </fieldset>
  );
}
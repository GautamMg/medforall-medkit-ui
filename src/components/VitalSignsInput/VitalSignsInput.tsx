import React, { useEffect, useRef, useState } from "react";
import styles from "./VitalSignsInput.module.css";
import type { ValidationError, VitalSigns, VitalSignsInputProps } from "./VitalSignsInput.types";

// ─── Conversion helpers ──────────────────────────────────────────────────────

function fToC(f: number) { return Math.round((f - 32) * 5 / 9 * 10) / 10; }
function cToF(c: number) { return Math.round((c * 9 / 5 + 32) * 10) / 10; }
function lbToKg(lb: number) { return Math.round(lb * 0.453592 * 10) / 10; }
function kgToLb(kg: number) { return Math.round(kg * 2.20462 * 10) / 10; }
function inToCm(inch: number) { return Math.round(inch * 2.54 * 10) / 10; }
function cmToIn(cm: number) { return Math.round(cm / 2.54 * 10) / 10; }

function calcBMI(weight?: number, weightUnit?: "lb" | "kg", height?: number, heightUnit?: "in" | "cm"): number | null {
  if (!weight || !height) return null;
  const kg = weightUnit === "lb" ? lbToKg(weight) : weight;
  const m  = heightUnit === "in" ? inToCm(height) / 100 : height / 100;
  if (m <= 0) return null;
  return Math.round(kg / (m * m) * 10) / 10;
}

// ─── Validation ──────────────────────────────────────────────────────────────

function validateVitals(v: VitalSigns, required: (keyof VitalSigns)[]): ValidationError[] {
  const errors: ValidationError[] = [];

  const add = (field: keyof VitalSigns, msg: string) => errors.push({ field, message: msg });

  for (const f of required) {
    if (v[f] == null) add(f, "This field is required");
  }

  if (v.bloodPressureSystolic != null && (v.bloodPressureSystolic < 60 || v.bloodPressureSystolic > 250))
    add("bloodPressureSystolic", "Unusual systolic (60–250 mmHg)");
  if (v.bloodPressureDiastolic != null && (v.bloodPressureDiastolic < 30 || v.bloodPressureDiastolic > 150))
    add("bloodPressureDiastolic", "Unusual diastolic (30–150 mmHg)");
  if (v.bloodPressureSystolic != null && v.bloodPressureDiastolic != null &&
      v.bloodPressureDiastolic >= v.bloodPressureSystolic)
    add("bloodPressureDiastolic", "Diastolic must be lower than systolic");

  if (v.heartRate != null && (v.heartRate < 30 || v.heartRate > 250))
    add("heartRate", "Unusual heart rate (30–250 bpm)");

  const tempF = v.temperature != null
    ? (v.temperatureUnit === "C" ? cToF(v.temperature) : v.temperature)
    : undefined;
  if (tempF != null && (tempF < 93 || tempF > 108))
    add("temperature", "Unusual temperature");

  if (v.respiratoryRate != null && (v.respiratoryRate < 4 || v.respiratoryRate > 60))
    add("respiratoryRate", "Unusual respiratory rate (4–60 /min)");

  if (v.oxygenSaturation != null && (v.oxygenSaturation < 70 || v.oxygenSaturation > 100))
    add("oxygenSaturation", "Unusual SpO₂ (70–100 %)");

  if (v.painLevel != null && (v.painLevel < 0 || v.painLevel > 10))
    add("painLevel", "Pain level must be 0–10");

  return errors;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

interface FieldProps {
  id: string;
  label: string;
  value: number | undefined;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  hint?: string;
  hintId?: string;
  disabled?: boolean;
  onChange: (val: number | undefined) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

function NumericField({ id, label, value, inputMode = "decimal", hint, hintId, disabled, onChange, onKeyDown }: FieldProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>{label}</label>
      <input
        id={id}
        className={`${styles.input} ${hint ? styles.inputWarn : ""}`}
        inputMode={inputMode}
        value={value ?? ""}
        disabled={disabled}
        onChange={(e) => {
          const t = e.target.value.trim();
          if (t === "") { onChange(undefined); return; }
          const n = Number(t);
          onChange(Number.isFinite(n) ? n : undefined);
        }}
        onKeyDown={onKeyDown}
        aria-describedby={hint ? hintId : undefined}
      />
      {hint && <div id={hintId} className={styles.hint} role="note">{hint}</div>}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

/**
 * VitalSignsInput provides medical-grade input for all common vital signs with
 * unit conversion, BMI auto-calculation, out-of-range highlighting, and
 * keyboard navigation between fields.
 */
export function VitalSignsInput({
  onChange,
  initialValues = {},
  requiredFields = [],
  onValidationError,
  disabled = false,
  label = "Vital signs",
}: VitalSignsInputProps) {
  const [vitals, setVitals] = useState<VitalSigns>({
    temperatureUnit: "F",
    weightUnit: "lb",
    heightUnit: "in",
    ...initialValues,
  });

  const fieldRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Propagate changes and validate
  useEffect(() => {
    onChange(vitals);
    if (onValidationError) {
      const errors = validateVitals(vitals, requiredFields);
      onValidationError(errors);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vitals]);

  function update(patch: Partial<VitalSigns>) {
    setVitals((prev) => ({ ...prev, ...patch }));
  }

  // Keyboard: Tab already handles field-to-field, but support Enter to advance
  function handleKeyDown(nextId: string) {
    return (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const next = document.getElementById(nextId) as HTMLInputElement | null;
        next?.focus();
      }
    };
  }

  const bmi = calcBMI(vitals.weight, vitals.weightUnit, vitals.height, vitals.heightUnit);
  const errors = validateVitals(vitals, requiredFields);
  function errFor(field: keyof VitalSigns) {
    return errors.find((e) => e.field === field)?.message;
  }

  return (
    <fieldset className={styles.root} disabled={disabled} aria-label={label}>
      <legend className={styles.legend}>{label}</legend>

      <div className={styles.grid}>
        {/* Blood pressure */}
        <NumericField
          id="vs-sys" label="Systolic BP (mmHg)" inputMode="numeric"
          value={vitals.bloodPressureSystolic} hint={errFor("bloodPressureSystolic")} hintId="vs-sys-hint"
          disabled={disabled} onChange={(v) => update({ bloodPressureSystolic: v })}
          onKeyDown={handleKeyDown("vs-dia")}
        />
        <NumericField
          id="vs-dia" label="Diastolic BP (mmHg)" inputMode="numeric"
          value={vitals.bloodPressureDiastolic} hint={errFor("bloodPressureDiastolic")} hintId="vs-dia-hint"
          disabled={disabled} onChange={(v) => update({ bloodPressureDiastolic: v })}
          onKeyDown={handleKeyDown("vs-hr")}
        />

        {/* Heart rate */}
        <NumericField
          id="vs-hr" label="Heart rate (bpm)" inputMode="numeric"
          value={vitals.heartRate} hint={errFor("heartRate")} hintId="vs-hr-hint"
          disabled={disabled} onChange={(v) => update({ heartRate: v })}
          onKeyDown={handleKeyDown("vs-temp")}
        />

        {/* Temperature with unit toggle */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="vs-temp">
            Temperature
          </label>
          <div className={styles.unitRow}>
            <input
              id="vs-temp"
              className={`${styles.input} ${errFor("temperature") ? styles.inputWarn : ""}`}
              inputMode="decimal"
              value={vitals.temperature ?? ""}
              disabled={disabled}
              onChange={(e) => {
                const t = e.target.value.trim();
                update({ temperature: t === "" ? undefined : Number(t) });
              }}
              onKeyDown={handleKeyDown("vs-rr")}
              aria-describedby={errFor("temperature") ? "vs-temp-hint" : undefined}
            />
            <button
              type="button"
              className={styles.unitToggle}
              disabled={disabled}
              onClick={() => {
                const unit = vitals.temperatureUnit === "F" ? "C" : "F";
                const converted = vitals.temperature != null
                  ? (unit === "C" ? fToC(vitals.temperature) : cToF(vitals.temperature))
                  : undefined;
                update({ temperatureUnit: unit, temperature: converted });
              }}
              aria-label={`Switch to ${vitals.temperatureUnit === "F" ? "Celsius" : "Fahrenheit"}`}
            >
              °{vitals.temperatureUnit}
            </button>
          </div>
          {errFor("temperature") && <div id="vs-temp-hint" className={styles.hint} role="note">{errFor("temperature")}</div>}
        </div>

        {/* Respiratory rate */}
        <NumericField
          id="vs-rr" label="Respiratory rate (/min)" inputMode="numeric"
          value={vitals.respiratoryRate} hint={errFor("respiratoryRate")} hintId="vs-rr-hint"
          disabled={disabled} onChange={(v) => update({ respiratoryRate: v })}
          onKeyDown={handleKeyDown("vs-spo2")}
        />

        {/* SpO2 */}
        <NumericField
          id="vs-spo2" label="SpO₂ (%)" inputMode="numeric"
          value={vitals.oxygenSaturation} hint={errFor("oxygenSaturation")} hintId="vs-spo2-hint"
          disabled={disabled} onChange={(v) => update({ oxygenSaturation: v })}
          onKeyDown={handleKeyDown("vs-weight")}
        />

        {/* Weight with unit toggle */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="vs-weight">Weight</label>
          <div className={styles.unitRow}>
            <input
              id="vs-weight"
              className={styles.input}
              inputMode="decimal"
              value={vitals.weight ?? ""}
              disabled={disabled}
              onChange={(e) => {
                const t = e.target.value.trim();
                update({ weight: t === "" ? undefined : Number(t) });
              }}
              onKeyDown={handleKeyDown("vs-height")}
            />
            <button
              type="button"
              className={styles.unitToggle}
              disabled={disabled}
              onClick={() => {
                const unit = vitals.weightUnit === "lb" ? "kg" : "lb";
                const converted = vitals.weight != null
                  ? (unit === "kg" ? lbToKg(vitals.weight) : kgToLb(vitals.weight))
                  : undefined;
                update({ weightUnit: unit, weight: converted });
              }}
              aria-label={`Switch to ${vitals.weightUnit === "lb" ? "kilograms" : "pounds"}`}
            >
              {vitals.weightUnit}
            </button>
          </div>
        </div>

        {/* Height with unit toggle */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="vs-height">Height</label>
          <div className={styles.unitRow}>
            <input
              id="vs-height"
              className={styles.input}
              inputMode="decimal"
              value={vitals.height ?? ""}
              disabled={disabled}
              onChange={(e) => {
                const t = e.target.value.trim();
                update({ height: t === "" ? undefined : Number(t) });
              }}
              onKeyDown={handleKeyDown("vs-pain")}
            />
            <button
              type="button"
              className={styles.unitToggle}
              disabled={disabled}
              onClick={() => {
                const unit = vitals.heightUnit === "in" ? "cm" : "in";
                const converted = vitals.height != null
                  ? (unit === "cm" ? inToCm(vitals.height) : cmToIn(vitals.height))
                  : undefined;
                update({ heightUnit: unit, height: converted });
              }}
              aria-label={`Switch to ${vitals.heightUnit === "in" ? "centimeters" : "inches"}`}
            >
              {vitals.heightUnit}
            </button>
          </div>
        </div>

        {/* BMI (read-only auto-calc) */}
        {bmi != null && (
          <div className={styles.field}>
            <span className={styles.label}>BMI (auto)</span>
            <span className={styles.bmi} aria-label={`BMI: ${bmi}`}>{bmi}</span>
          </div>
        )}

        {/* Pain level 0-10 */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="vs-pain">
            Pain level (0–10)
          </label>
          <input
            id="vs-pain"
            className={`${styles.input} ${errFor("painLevel") ? styles.inputWarn : ""}`}
            type="range"
            min={0}
            max={10}
            step={1}
            value={vitals.painLevel ?? 0}
            disabled={disabled}
            onChange={(e) => update({ painLevel: Number(e.target.value) })}
            aria-valuemin={0}
            aria-valuemax={10}
            aria-valuenow={vitals.painLevel ?? 0}
            aria-describedby={errFor("painLevel") ? "vs-pain-hint" : undefined}
          />
          <span className={styles.painValue}>{vitals.painLevel ?? 0}</span>
          {errFor("painLevel") && <div id="vs-pain-hint" className={styles.hint} role="note">{errFor("painLevel")}</div>}
        </div>
      </div>
    </fieldset>
  );
}

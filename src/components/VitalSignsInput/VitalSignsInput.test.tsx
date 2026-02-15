import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { VitalSignsInput } from "./VitalSignsInput";

describe("VitalSignsInput", () => {
  it("renders all core vital sign fields", () => {
    render(<VitalSignsInput onChange={() => {}} />);
    expect(screen.getByLabelText("Systolic BP (mmHg)")).toBeInTheDocument();
    expect(screen.getByLabelText("Diastolic BP (mmHg)")).toBeInTheDocument();
    expect(screen.getByLabelText("Heart rate (bpm)")).toBeInTheDocument();
    expect(screen.getByLabelText("Temperature")).toBeInTheDocument();
    expect(screen.getByLabelText("Respiratory rate (/min)")).toBeInTheDocument();
    expect(screen.getByLabelText("SpO₂ (%)")).toBeInTheDocument();
    expect(screen.getByLabelText("Weight")).toBeInTheDocument();
    expect(screen.getByLabelText("Height")).toBeInTheDocument();
    expect(screen.getByLabelText("Pain level (0–10)")).toBeInTheDocument();
  });

  it("calls onChange when heart rate is entered", () => {
    const onChange = vi.fn();
    render(<VitalSignsInput onChange={onChange} />);
    fireEvent.change(screen.getByLabelText("Heart rate (bpm)"), { target: { value: "72" } });
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ heartRate: 72 }));
  });

  it("shows warning hint when diastolic >= systolic", () => {
    render(<VitalSignsInput onChange={() => {}} initialValues={{ bloodPressureSystolic: 90, bloodPressureDiastolic: 95 }} />);
    expect(screen.getByText("Diastolic must be lower than systolic")).toBeInTheDocument();
  });

  it("shows warning hint for out-of-range heart rate", () => {
    render(<VitalSignsInput onChange={() => {}} initialValues={{ heartRate: 10 }} />);
    expect(screen.getByText(/Unusual heart rate/)).toBeInTheDocument();
  });

  it("toggles temperature unit and converts value", () => {
    const onChange = vi.fn();
    render(<VitalSignsInput onChange={onChange} initialValues={{ temperature: 98.6, temperatureUnit: "F" }} />);
    fireEvent.click(screen.getByLabelText("Switch to Celsius"));
    // 98.6°F → 37°C
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ temperatureUnit: "C", temperature: 37 }));
  });

  it("toggles weight unit and converts value", () => {
    const onChange = vi.fn();
    render(<VitalSignsInput onChange={onChange} initialValues={{ weight: 154, weightUnit: "lb" }} />);
    fireEvent.click(screen.getByLabelText("Switch to kilograms"));
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ weightUnit: "kg" }));
  });

  it("auto-calculates BMI when height and weight are provided", () => {
    render(<VitalSignsInput onChange={() => {}} initialValues={{ weight: 70, weightUnit: "kg", height: 175, heightUnit: "cm" }} />);
    // BMI = 70 / 1.75^2 ≈ 22.9
    expect(screen.getByLabelText(/BMI/)).toBeInTheDocument();
  });

  it("calls onValidationError with errors for required fields", () => {
    const onValidationError = vi.fn();
    render(
      <VitalSignsInput
        onChange={() => {}}
        requiredFields={["heartRate"]}
        onValidationError={onValidationError}
      />
    );
    expect(onValidationError).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ field: "heartRate" })])
    );
  });

  it("has no obvious a11y violations", async () => {
    const { container } = render(
      <VitalSignsInput
        onChange={() => {}}
        initialValues={{ bloodPressureSystolic: 120, bloodPressureDiastolic: 80, heartRate: 72 }}
      />
    );
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});

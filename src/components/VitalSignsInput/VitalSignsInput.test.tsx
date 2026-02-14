import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { VitalSignsInput } from "./VitalSignsInput";

describe("VitalSignsInput", () => {
  it("updates temperature on input", () => {
    const onChange = vi.fn();
    render(<VitalSignsInput value={{}} onChange={onChange} />);

    fireEvent.change(screen.getByLabelText("Temperature (°F)"), { target: { value: "99.1" } });
    expect(onChange).toHaveBeenCalledWith({ temperatureF: 99.1 });
  });

  it("shows a hint for unusual BP", () => {
    const onChange = vi.fn();
    render(<VitalSignsInput value={{ systolic: 90, diastolic: 95 }} onChange={onChange} />);

    expect(screen.getByText("Diastolic should be lower than systolic")).toBeInTheDocument();
  });

  it("has no obvious a11y violations", async () => {
    const { container } = render(
      <VitalSignsInput
        value={{ temperatureF: 98.6, heartRate: 72, systolic: 120, diastolic: 80, spo2: 98 }}
        onChange={() => {}}
      />
    );

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { TimeSlotPicker } from "./TimeSlotPicker";

describe("TimeSlotPicker", () => {
  it("calls onChange when an available slot is clicked", () => {
    const onChange = vi.fn();
    render(
      <TimeSlotPicker
        dateLabel="Fri, Feb 14"
        slots={[
          { id: "a", label: "9:00 AM", startISO: "2026-02-14T09:00:00", available: true },
          { id: "b", label: "9:30 AM", startISO: "2026-02-14T09:30:00", available: false }
        ]}
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getByRole("radio", { name: "9:00 AM" }));
    expect(onChange).toHaveBeenCalledWith("a");
  });

  it("has no obvious a11y violations", async () => {
    const { container } = render(
      <TimeSlotPicker
        dateLabel="Fri, Feb 14"
        slots={[{ id: "a", label: "9:00 AM", startISO: "2026-02-14T09:00:00", available: true }]}
      />
    );

    const results = await axe(container);
  expect(results.violations).toHaveLength(0);
  });
});

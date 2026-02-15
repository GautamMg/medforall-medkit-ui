import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { TimeSlotPicker } from "./TimeSlotPicker";
import type { TimeSlot } from "./TimeSlotPicker.types";

function makeSlot(id: string, hour: number, available = true): TimeSlot {
  const start = new Date(`2026-02-14T${String(hour).padStart(2,"0")}:00:00`);
  return { id, startTime: start, endTime: new Date(start.getTime() + 30*60000), available };
}

const baseProps = {
  date: new Date("2026-02-14T12:00:00Z"),
  availableSlots: [
    makeSlot("morning", 9,  true),
    makeSlot("unavail", 10, false),
    makeSlot("afternoon", 13, true),
    makeSlot("evening", 18, true),
  ],
  timezone: "America/New_York",
  slotDuration: 30,
  onSelect: vi.fn(),
};

describe("TimeSlotPicker", () => {
  it("renders date header", () => {
    render(<TimeSlotPicker {...baseProps} />);
    expect(screen.getByText(/Feb 14/)).toBeInTheDocument();
  });

  it("displays timezone abbreviation", () => {
    render(<TimeSlotPicker {...baseProps} />);
    // "ET" or "EST" or "EDT" depending on date
    expect(screen.getByLabelText(/Timezone:/)).toBeInTheDocument();
  });

  it("groups slots into Morning / Afternoon / Evening sections", () => {
    render(<TimeSlotPicker {...baseProps} />);
    expect(screen.getByText("Morning")).toBeInTheDocument();
    expect(screen.getByText("Afternoon")).toBeInTheDocument();
    expect(screen.getByText("Evening")).toBeInTheDocument();
  });

  it("calls onSelect with correct slot when available slot clicked", () => {
    const onSelect = vi.fn();
    render(<TimeSlotPicker {...baseProps} onSelect={onSelect} />);
    const morningSlot = screen.getAllByRole("radio")[0];
    fireEvent.click(morningSlot);
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: "morning" }));
  });

  it("does not call onSelect when unavailable slot clicked", () => {
    const onSelect = vi.fn();
    render(<TimeSlotPicker {...baseProps} onSelect={onSelect} />);
    const unavailBtn = screen.getAllByRole("radio").find((b) => b.hasAttribute("disabled"))!;
    fireEvent.click(unavailBtn);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("marks selected slot with aria-checked=true", () => {
    const selected = baseProps.availableSlots[0];
    render(<TimeSlotPicker {...baseProps} selectedSlot={selected} />);
    const btn = screen.getAllByRole("radio")[0];
    expect(btn).toHaveAttribute("aria-checked", "true");
  });

  it("shows remaining capacity when provided", () => {
    const slotWithCapacity: TimeSlot = {
      id: "group",
      startTime: new Date("2026-02-14T09:00:00"),
      endTime: new Date("2026-02-14T09:30:00"),
      available: true,
      remainingCapacity: 3,
    };
    render(<TimeSlotPicker {...baseProps} availableSlots={[slotWithCapacity]} />);
    expect(screen.getByText("3 left")).toBeInTheDocument();
  });

  it("disables all slots when disabled=true", () => {
    render(<TimeSlotPicker {...baseProps} disabled />);
    const radios = screen.getAllByRole("radio");
    radios.forEach((r) => expect(r).toBeDisabled());
  });

  it("shows empty state when no slots provided", () => {
    render(<TimeSlotPicker {...baseProps} availableSlots={[]} />);
    expect(screen.getByText("No available slots")).toBeInTheDocument();
  });

  it("has no obvious a11y violations", async () => {
    const { container } = render(<TimeSlotPicker {...baseProps} />);
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});

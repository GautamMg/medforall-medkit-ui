import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { AppointmentCard } from "./AppointmentCard";
import type { AppointmentCardProps } from "./AppointmentCard.types";

const baseProps: AppointmentCardProps = {
  patient: {
    name: "Ava Johnson",
    dateOfBirth: new Date("1994-03-12"),
    mrn: "MRN-00123",
  },
  appointment: {
    id: "appt-1",
    scheduledTime: new Date("2026-02-14T10:30:00"),
    duration: 30,
    type: "in-person",
    status: "scheduled",
    reason: "Annual physical exam",
  },
  provider: { name: "Dr. Sarah Chen", specialty: "Internal Medicine" },
};

describe("AppointmentCard", () => {
  it("renders patient name and MRN", () => {
    render(<AppointmentCard {...baseProps} />);
    expect(screen.getByText("Ava Johnson")).toBeInTheDocument();
    expect(screen.getByText("MRN: MRN-00123")).toBeInTheDocument();
  });

  it("calculates and displays patient age from DOB", () => {
    render(<AppointmentCard {...baseProps} />);
    // Patient born 1994-03-12; as of 2026-02-14 they are 31
    expect(screen.getByText(/31 yrs/)).toBeInTheDocument();
  });

  it("renders appointment reason", () => {
    render(<AppointmentCard {...baseProps} />);
    expect(screen.getByText("Annual physical exam")).toBeInTheDocument();
  });

  it("renders provider name and specialty", () => {
    render(<AppointmentCard {...baseProps} />);
    expect(screen.getByText(/Dr. Sarah Chen/)).toBeInTheDocument();
  });

  it("shows the correct status badge", () => {
    render(<AppointmentCard {...baseProps} />);
    expect(screen.getByLabelText("Status: Scheduled")).toBeInTheDocument();
  });

  it("renders all appointment statuses without crashing", () => {
    const statuses = ["scheduled", "checked-in", "in-progress", "completed", "no-show", "cancelled"] as const;
    for (const status of statuses) {
      const { unmount } = render(
        <AppointmentCard {...baseProps} appointment={{ ...baseProps.appointment, status }} />
      );
      unmount();
    }
  });

  it("renders all appointment types without crashing", () => {
    const types = ["in-person", "telehealth", "phone"] as const;
    for (const type of types) {
      const { unmount } = render(
        <AppointmentCard {...baseProps} appointment={{ ...baseProps.appointment, type }} />
      );
      unmount();
    }
  });

  it("opens action menu when Actions button clicked", () => {
    render(<AppointmentCard {...baseProps} onReschedule={vi.fn()} onCancel={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Appointment actions" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("calls onReschedule when Reschedule menu item clicked", () => {
    const onReschedule = vi.fn();
    render(<AppointmentCard {...baseProps} onReschedule={onReschedule} />);
    fireEvent.click(screen.getByRole("button", { name: "Appointment actions" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Reschedule" }));
    expect(onReschedule).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when Cancel menu item clicked", () => {
    const onCancel = vi.fn();
    render(<AppointmentCard {...baseProps} onCancel={onCancel} />);
    fireEvent.click(screen.getByRole("button", { name: "Appointment actions" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onStatusChange with 'checked-in' when Check in clicked", () => {
    const onStatusChange = vi.fn();
    render(<AppointmentCard {...baseProps} onStatusChange={onStatusChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Appointment actions" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Check in" }));
    expect(onStatusChange).toHaveBeenCalledWith("checked-in");
  });

  it("renders initials placeholder when no avatar provided", () => {
    render(<AppointmentCard {...baseProps} />);
    // placeholder div with first letter
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("has no obvious a11y violations", async () => {
    const { container } = render(<AppointmentCard {...baseProps} />);
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});

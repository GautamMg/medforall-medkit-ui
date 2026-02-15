import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { useState } from "react";
import { TimeSlotPicker } from "./TimeSlotPicker";
import type { TimeSlot } from "./TimeSlotPicker.types";

const date = new Date("2026-02-14T12:00:00Z");

function makeSlot(id: string, hour: number, minute: number, available = true, remainingCapacity?: number): TimeSlot {
  const start = new Date(`2026-02-14T${String(hour).padStart(2,"0")}:${String(minute).padStart(2,"0")}:00`);
  const end   = new Date(start.getTime() + 30 * 60000);
  return { id, startTime: start, endTime: end, available, remainingCapacity };
}

const slots: TimeSlot[] = [
  makeSlot("t1", 9,  0,  true),
  makeSlot("t2", 9,  30, false),
  makeSlot("t3", 10, 0,  true, 3),
  makeSlot("t4", 10, 30, true),
  makeSlot("t5", 13, 0,  true),
  makeSlot("t6", 13, 30, false),
  makeSlot("t7", 14, 0,  true, 1),
  makeSlot("t8", 18, 0,  true),
];

const meta: Meta<typeof TimeSlotPicker> = {
  title: "Components/TimeSlotPicker",
  component: TimeSlotPicker,
  parameters: { viewport: { defaultViewport: "responsive" } },
  args: {
    date,
    availableSlots: slots,
    timezone: "America/New_York",
    slotDuration: 30,
    onSelect: fn(),
  },
  argTypes: {
    date: { control: false },
    availableSlots: { control: false },
    selectedSlot: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — no selection */
export const Default: Story = {};

/** Interactive — selection state managed */
export const Interactive: Story = {
  render: () => {
    const [selected, setSelected] = useState<TimeSlot | undefined>(undefined);
    return (
      <TimeSlotPicker
        date={date}
        availableSlots={slots}
        timezone="America/New_York"
        slotDuration={30}
        selectedSlot={selected}
        onSelect={setSelected}
      />
    );
  },
};

/** No available slots */
export const NoSlots: Story = {
  args: { availableSlots: [] },
};

/** Disabled state */
export const Disabled: Story = {
  args: { disabled: true },
};

/** Pacific timezone */
export const PacificTime: Story = {
  args: { timezone: "America/Los_Angeles" },
};

/** Mobile viewport */
export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: "mobile1" } },
};

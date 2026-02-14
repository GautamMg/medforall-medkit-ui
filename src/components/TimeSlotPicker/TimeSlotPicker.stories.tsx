import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TimeSlotPicker } from "./TimeSlotPicker";
import type { TimeSlot } from "./TimeSlotPicker.types";

const sample: TimeSlot[] = [
  { id: "t1", label: "9:00 AM", startISO: "2026-02-14T09:00:00", available: true },
  { id: "t2", label: "9:30 AM", startISO: "2026-02-14T09:30:00", available: false },
  { id: "t3", label: "10:00 AM", startISO: "2026-02-14T10:00:00", available: true },
  { id: "t4", label: "1:00 PM", startISO: "2026-02-14T13:00:00", available: true },
  { id: "t5", label: "1:30 PM", startISO: "2026-02-14T13:30:00", available: true },
  { id: "t6", label: "6:00 PM", startISO: "2026-02-14T18:00:00", available: true }
];

const meta: Meta<typeof TimeSlotPicker> = {
    title: "Components/TimeSlotPicker",
    component: TimeSlotPicker,
    args: {
      dateLabel: "Fri, Feb 14",
      timezoneLabel: "ET",
      slots: sample
    }
  };
  

  export default meta;
  type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSelection: Story = {
    args: {
      dateLabel: "Fri, Feb 14",
      timezoneLabel: "ET",
      slots: sample
    },
    render: (args) => {
      const a = args as React.ComponentProps<typeof TimeSlotPicker>;
  
      const [value, setValue] = useState(a.value ?? "t3");
  
      return (
        <TimeSlotPicker
          dateLabel={a.dateLabel}
          timezoneLabel={a.timezoneLabel}
          slots={a.slots}
          value={value}
          onChange={setValue}
        />
      );
    }
  };
  

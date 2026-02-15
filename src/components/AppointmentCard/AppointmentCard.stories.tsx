import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { AppointmentCard } from "./AppointmentCard";

const basePatient = {
  name: "Ava Johnson",
  dateOfBirth: new Date("1994-03-12"),
  mrn: "MRN-00123",
};

const baseAppointment = {
  id: "appt-1",
  scheduledTime: new Date("2026-02-14T10:30:00"),
  duration: 30,
  type: "in-person" as const,
  status: "scheduled" as const,
  reason: "Annual physical exam",
};

const provider = { name: "Dr. Sarah Chen", specialty: "Internal Medicine" };

const meta: Meta<typeof AppointmentCard> = {
  title: "Components/AppointmentCard",
  component: AppointmentCard,
  parameters: {
    viewport: { defaultViewport: "responsive" },
  },
  args: {
    patient: basePatient,
    appointment: baseAppointment,
    provider,
    onStatusChange: fn(),
    onReschedule: fn(),
    onCancel: fn(),
  },
  argTypes: {
    patient: { control: false },
    appointment: { control: false },
    provider: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Default scheduled in-person appointment */
export const Default: Story = {};

/** Telehealth appointment variant */
export const Telehealth: Story = {
  args: {
    appointment: { ...baseAppointment, type: "telehealth" },
  },
};

/** Phone call appointment */
export const Phone: Story = {
  args: {
    appointment: { ...baseAppointment, type: "phone" },
  },
};

/** Checked-in status */
export const CheckedIn: Story = {
  args: {
    appointment: { ...baseAppointment, status: "checked-in" },
  },
};

/** In-progress appointment */
export const InProgress: Story = {
  args: {
    appointment: { ...baseAppointment, status: "in-progress" },
  },
};

/** Completed appointment */
export const Completed: Story = {
  args: {
    appointment: { ...baseAppointment, status: "completed" },
  },
};

/** No-show appointment */
export const NoShow: Story = {
  args: {
    appointment: { ...baseAppointment, status: "no-show" },
  },
};

/** Cancelled appointment */
export const Cancelled: Story = {
  args: {
    appointment: { ...baseAppointment, status: "cancelled" },
  },
};

/** With patient avatar */
export const WithAvatar: Story = {
  args: {
    patient: {
      ...basePatient,
      avatar: "https://i.pravatar.cc/40?img=5",
    },
  },
};

/** No provider info */
export const NoProvider: Story = {
  args: { provider: undefined },
};

/** Mobile viewport */
export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

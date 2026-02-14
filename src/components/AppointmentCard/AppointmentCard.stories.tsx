import type { Meta, StoryObj } from "@storybook/react";
import { AppointmentCard } from "./AppointmentCard";

const meta: Meta<typeof AppointmentCard> = {
  title: "Components/AppointmentCard",
  component: AppointmentCard,
  parameters: {
    viewport: { defaultViewport: "responsive" }
  },
  args: {
    patient: { firstName: "Ava", lastName: "Johnson", dateOfBirth: "1994-03-12" },
    appointmentType: "in-person",
    status: "scheduled",
    appointmentTime: "Mon 10:30 AM",
    clinicName: "Downtown Clinic"
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Telehealth: Story = {
  args: { appointmentType: "telehealth" }
};

export const Cancelled: Story = {
  args: { status: "cancelled" }
};
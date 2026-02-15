import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { VitalSignsInput } from "./VitalSignsInput";

const meta: Meta<typeof VitalSignsInput> = {
  title: "Components/VitalSignsInput",
  component: VitalSignsInput,
  parameters: {
    viewport: { defaultViewport: "responsive" },
  },
  args: {
    onChange: fn(),
    onValidationError: fn(),
  },
  argTypes: {
    requiredFields: { control: false },
    initialValues: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Empty form — all fields blank */
export const Default: Story = {};

/** Pre-filled with healthy values */
export const Prefilled: Story = {
  args: {
    initialValues: {
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
      heartRate: 72,
      temperature: 98.6,
      temperatureUnit: "F",
      respiratoryRate: 16,
      oxygenSaturation: 98,
      weight: 165,
      weightUnit: "lb",
      height: 68,
      heightUnit: "in",
      painLevel: 2,
    },
  },
};

/** Out-of-range values show warning hints */
export const InvalidValues: Story = {
  args: {
    initialValues: {
      bloodPressureSystolic: 90,
      bloodPressureDiastolic: 95, // diastolic > systolic
      heartRate: 10,
      temperature: 110,
      temperatureUnit: "F",
      oxygenSaturation: 60,
      painLevel: 10,
    },
  },
};

/** Metric units (°C, kg, cm) */
export const MetricUnits: Story = {
  args: {
    initialValues: {
      temperature: 37,
      temperatureUnit: "C",
      weight: 75,
      weightUnit: "kg",
      height: 175,
      heightUnit: "cm",
    },
  },
};

/** Required fields validation */
export const WithRequiredFields: Story = {
  args: {
    requiredFields: ["bloodPressureSystolic", "bloodPressureDiastolic", "heartRate"],
  },
};

/** Disabled state */
export const Disabled: Story = {
  args: {
    disabled: true,
    initialValues: {
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
      heartRate: 72,
    },
  },
};

/** Mobile viewport */
export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

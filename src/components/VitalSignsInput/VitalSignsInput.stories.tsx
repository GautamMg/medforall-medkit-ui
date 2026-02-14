import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { VitalSignsInput } from "./VitalSignsInput";
import type { VitalSigns } from "./VitalSignsInput.types";

const meta: Meta<typeof VitalSignsInput> = {
  title: "Components/VitalSignsInput",
  component: VitalSignsInput
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<VitalSigns>({});
    return <VitalSignsInput value={value} onChange={setValue} />;
  }
};

export const Prefilled: Story = {
  render: () => {
    const [value, setValue] = useState<VitalSigns>({
      temperatureF: 98.6,
      heartRate: 72,
      systolic: 120,
      diastolic: 80,
      spo2: 98
    });
    return <VitalSignsInput value={value} onChange={setValue} />;
  }
};

export const InvalidValues: Story = {
  render: () => {
    const [value, setValue] = useState<VitalSigns>({
      temperatureF: 105,
      heartRate: 190,
      systolic: 90,
      diastolic: 95,
      spo2: 82
    });
    return <VitalSignsInput value={value} onChange={setValue} />;
  }
};

export const Disabled: Story = {
  render: () => {
    const [value, setValue] = useState<VitalSigns>({
      temperatureF: 98.6,
      heartRate: 72
    });
    return <VitalSignsInput value={value} onChange={setValue} disabled />;
  }
};

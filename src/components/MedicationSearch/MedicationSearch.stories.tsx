import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { MedicationSearch } from "./MedicationSearch";
import type { Medication } from "./MedicationSearch.types";

const allMeds: Medication[] = [
  { id: "amox",  brandName: "Amoxil",    genericName: "Amoxicillin",  strength: "500 mg", form: "capsule",   controlledSubstance: false, requiresPriorAuth: false },
  { id: "ibu",   brandName: "Advil",     genericName: "Ibuprofen",    strength: "200 mg", form: "tablet",    controlledSubstance: false, requiresPriorAuth: false },
  { id: "oxy",   brandName: "OxyContin", genericName: "Oxycodone",    strength: "10 mg",  form: "tablet",    controlledSubstance: true,  requiresPriorAuth: true  },
  { id: "adder", brandName: "Adderall",  genericName: "Amphetamine",  strength: "20 mg",  form: "tablet",    controlledSubstance: true,  requiresPriorAuth: false },
  { id: "hum",   brandName: "Humira",    genericName: "Adalimumab",   strength: "40 mg",  form: "injection", controlledSubstance: false, requiresPriorAuth: true  },
  { id: "azith", brandName: "Zithromax", genericName: "Azithromycin", strength: "250 mg", form: "tablet",    controlledSubstance: false, requiresPriorAuth: false },
];

async function mockSearch(query: string): Promise<Medication[]> {
  await new Promise((r) => setTimeout(r, 400));
  const q = query.toLowerCase();
  return allMeds.filter(
    (m) => m.brandName.toLowerCase().includes(q) || m.genericName.toLowerCase().includes(q)
  );
}

const meta: Meta<typeof MedicationSearch> = {
  title: "Components/MedicationSearch",
  component: MedicationSearch,
  parameters: { viewport: { defaultViewport: "responsive" } },
  args: {
    searchFn: mockSearch,
    onSelect: fn(),
  },
  argTypes: {
    searchFn: { control: false },
    recentSelections: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — type to search */
export const Default: Story = {};

/** With recent selections shown on focus */
export const WithRecentSelections: Story = {
  args: {
    recentSelections: [allMeds[0], allMeds[1]],
  },
};

/** Shows controlled substance and prior auth indicators */
export const ControlledSubstances: Story = {
  args: {
    searchFn: async () => allMeds.filter((m) => m.controlledSubstance || m.requiresPriorAuth),
  },
};

/** Mobile viewport */
export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: "mobile1" } },
};

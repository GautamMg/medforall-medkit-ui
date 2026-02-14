import type { Meta, StoryObj } from "@storybook/react";
import { useMemo, useState } from "react";
import { MedicationSearch } from "./MedicationSearch";
import type { MedicationOption } from "./MedicationSearch.types";

const all: MedicationOption[] = [
  { id: "amox", name: "Amoxicillin", subtitle: "500 mg capsule" },
  { id: "ibu", name: "Ibuprofen", subtitle: "200 mg tablet" },
  { id: "acet", name: "Acetaminophen", subtitle: "500 mg tablet" },
  { id: "azith", name: "Azithromycin", subtitle: "250 mg tablet" }
];

const meta: Meta<typeof MedicationSearch> = {
  title: "Components/MedicationSearch",
  component: MedicationSearch,
  args: {
    label: "Medication",
    placeholder: "Search medications",
    emptyText: "No results"
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [query, setQuery] = useState("");
    const results = useMemo(() => {
      const q = query.trim().toLowerCase();
      if (!q) return [];
      return all.filter((m) => m.name.toLowerCase().includes(q));
    }, [query]);

    return (
      <MedicationSearch
        {...args}
        query={query}
        onQueryChange={setQuery}
        results={results}
        onSelect={(m) => alert(`Selected: ${m.name}`)}
      />
    );
  }
};

export const WithResults: Story = {
  render: (args) => {
    const [query, setQuery] = useState("a");
    const results = all.filter((m) => m.name.toLowerCase().includes(query));
    return (
      <MedicationSearch
        {...args}
        query={query}
        onQueryChange={setQuery}
        results={results}
        onSelect={() => {}}
      />
    );
  }
};

export const Empty: Story = {
  render: (args) => {
    const [query, setQuery] = useState("zzz");
    return (
      <MedicationSearch
        {...args}
        query={query}
        onQueryChange={setQuery}
        results={[]}
        onSelect={() => {}}
      />
    );
  }
};

export const Loading: Story = {
  render: (args) => {
    const [query, setQuery] = useState("am");
    return (
      <MedicationSearch
        {...args}
        query={query}
        onQueryChange={setQuery}
        results={[]}
        loading
        onSelect={() => {}}
      />
    );
  }
};

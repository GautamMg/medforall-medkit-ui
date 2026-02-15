import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { axe } from "vitest-axe";
import { MedicationSearch } from "./MedicationSearch";
import type { Medication } from "./MedicationSearch.types";

const mockMeds: Medication[] = [
  { id: "amox", brandName: "Amoxil",    genericName: "Amoxicillin", strength: "500 mg", form: "capsule", controlledSubstance: false, requiresPriorAuth: false },
  { id: "oxy",  brandName: "OxyContin", genericName: "Oxycodone",   strength: "10 mg",  form: "tablet",  controlledSubstance: true,  requiresPriorAuth: true  },
];

// Zero-delay search for deterministic tests
async function fastSearch(query: string): Promise<Medication[]> {
  const q = query.toLowerCase();
  return mockMeds.filter((m) => m.brandName.toLowerCase().includes(q) || m.genericName.toLowerCase().includes(q));
}

describe("MedicationSearch", () => {
  it("calls searchFn after debounce and shows results", async () => {
    const searchFn = vi.fn(fastSearch);
    render(<MedicationSearch searchFn={searchFn} onSelect={() => {}} debounceMs={0} />);

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "amox" } });

    await waitFor(() => expect(screen.getByText("Amoxil")).toBeInTheDocument(), { timeout: 3000 });
    expect(searchFn).toHaveBeenCalledWith("amox");
  });

  it("calls onSelect when result is clicked", async () => {
    const onSelect = vi.fn();
    render(<MedicationSearch searchFn={fastSearch} onSelect={onSelect} debounceMs={0} />);

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "oxy" } });
    const option = await screen.findByText("OxyContin", {}, { timeout: 3000 });

    fireEvent.mouseDown(option.closest("[role='option']")!);
    fireEvent.click(option.closest("[role='option']")!);
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: "oxy" }));
  });

  it("navigates results with arrow keys and selects with Enter", async () => {
    const onSelect = vi.fn();
    render(<MedicationSearch searchFn={async () => mockMeds} onSelect={onSelect} debounceMs={0} />);

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "a" } });
    await screen.findByText("Amoxil", {}, { timeout: 3000 });

    const input = screen.getByRole("combobox");
    fireEvent.keyDown(input, { key: "ArrowDown" }); // move to second item
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: "oxy" }));
  });

  it("shows controlled substance badge", async () => {
    render(<MedicationSearch searchFn={async () => mockMeds} onSelect={() => {}} debounceMs={0} />);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "oxy" } });
    await waitFor(() => expect(screen.getByTitle("Controlled substance")).toBeInTheDocument(), { timeout: 3000 });
  });

  it("shows prior auth badge", async () => {
    render(<MedicationSearch searchFn={async () => mockMeds} onSelect={() => {}} debounceMs={0} />);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "oxy" } });
    await waitFor(() => expect(screen.getByTitle("Requires prior authorization")).toBeInTheDocument(), { timeout: 3000 });
  });

  it("shows recent selections on focus when query is empty", () => {
    render(
      <MedicationSearch
        searchFn={fastSearch}
        onSelect={() => {}}
        recentSelections={[mockMeds[0]]}
      />
    );
    fireEvent.focus(screen.getByRole("combobox"));
    expect(screen.getByText("Recent selections")).toBeInTheDocument();
    expect(screen.getByText("Amoxil")).toBeInTheDocument();
  });

  it("shows no-results message when search returns empty", async () => {
    render(<MedicationSearch searchFn={async () => []} onSelect={() => {}} debounceMs={0} />);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "zzz" } });
    await waitFor(() => expect(screen.getByText(/No results for/)).toBeInTheDocument(), { timeout: 3000 });
  });

  it("has no obvious a11y violations", async () => {
    const { container } = render(<MedicationSearch searchFn={fastSearch} onSelect={() => {}} />);
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});

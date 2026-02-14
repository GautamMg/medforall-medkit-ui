import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { MedicationSearch } from "./MedicationSearch";

describe("MedicationSearch", () => {
  it("calls onQueryChange when typing", () => {
    const onQueryChange = vi.fn();
    render(
      <MedicationSearch
        query=""
        onQueryChange={onQueryChange}
        results={[]}
        onSelect={() => {}}
      />
    );

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "amox" } });
    expect(onQueryChange).toHaveBeenCalledWith("amox");
  });

  it("selects active item on Enter", () => {
    const onSelect = vi.fn();
    render(
      <MedicationSearch
        query="a"
        onQueryChange={() => {}}
        results={[
          { id: "amox", name: "Amoxicillin" },
          { id: "az", name: "Azithromycin" }
        ]}
        onSelect={onSelect}
      />
    );

    const input = screen.getByRole("combobox");
    fireEvent.keyDown(input, { key: "ArrowDown" }); // move to second item
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onSelect).toHaveBeenCalledWith({ id: "az", name: "Azithromycin" });
  });

  it("has no obvious a11y violations", async () => {
    const { container } = render(
      <MedicationSearch
        query="a"
        onQueryChange={() => {}}
        results={[{ id: "amox", name: "Amoxicillin", subtitle: "500 mg capsule" }]}
        onSelect={() => {}}
      />
    );

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});

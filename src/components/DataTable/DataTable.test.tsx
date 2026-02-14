import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { DataTable } from "./DataTable";

type Row = { id: string; name: string };

describe("DataTable", () => {
  it("renders headers and rows", () => {
    render(
      <DataTable<Row>
        caption="Test"
        ariaLabel="Test table"
        columns={[{ key: "name", header: "Name" }]}
        rows={[{ id: "1", name: "Ava" }]}
        getRowId={(r) => r.id}
      />
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Ava")).toBeInTheDocument();
  });

  it("has no obvious a11y violations", async () => {
    const { container } = render(
      <DataTable<Row>
        ariaLabel="Test table"
        columns={[{ key: "name", header: "Name" }]}
        rows={[{ id: "1", name: "Ava" }]}
        getRowId={(r) => r.id}
      />
    );

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});

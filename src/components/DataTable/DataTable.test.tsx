import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { DataTable } from "./DataTable";
import type { ColumnDef } from "./DataTable.types";

type Row = Record<string, unknown> & { id: string; name: string; status: string };

const rows: Row[] = [
  { id: "1", name: "Ava Johnson", status: "Active" },
  { id: "2", name: "Noah Smith",  status: "Inactive" },
  { id: "3", name: "Emma Davis",  status: "Active" },
];

const columns: ColumnDef<Row>[] = [
  { id: "name",   header: "Patient", accessor: "name",   sortable: true },
  { id: "status", header: "Status",  accessor: "status", sortable: true },
];

const baseProps = { data: rows, columns, getRowId: (r: Row) => r.id, ariaLabel: "Test table" };

describe("DataTable", () => {
  it("renders column headers and row data", () => {
    render(<DataTable {...baseProps} />);
    expect(screen.getByText("Patient")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Ava Johnson")).toBeInTheDocument();
    expect(screen.getByText("Noah Smith")).toBeInTheDocument();
  });

  it("shows skeleton rows when loading", () => {
    render(<DataTable {...baseProps} loading />);
    // No row data should be visible during loading
    expect(screen.queryByText("Ava Johnson")).not.toBeInTheDocument();
    // aria-busy attribute
    expect(screen.getByRole("table")).toHaveAttribute("aria-busy", "true");
  });

  it("shows empty state when data is empty", () => {
    render(<DataTable {...baseProps} data={[]} emptyState={<span>No patients</span>} />);
    expect(screen.getByText("No patients")).toBeInTheDocument();
  });

  it("calls onSort when a sortable column header is clicked", () => {
    const onSort = vi.fn();
    render(
      <DataTable
        {...baseProps}
        sorting={{ column: "name", direction: "asc", onSort }}
      />
    );
    fireEvent.click(screen.getByText("Patient"));
    // Clicking same column asc → desc
    expect(onSort).toHaveBeenCalledWith("name", "desc");
  });

  it("shows ascending sort indicator on sorted column", () => {
    render(
      <DataTable
        {...baseProps}
        sorting={{ column: "name", direction: "asc", onSort: vi.fn() }}
      />
    );
    const th = screen.getByText("Patient").closest("th");
    expect(th).toHaveAttribute("aria-sort", "ascending");
  });

  it("calls onRowClick when a row is clicked", () => {
    const onRowClick = vi.fn();
    render(<DataTable {...baseProps} onRowClick={onRowClick} />);
    fireEvent.click(screen.getByText("Ava Johnson").closest("tr")!);
    expect(onRowClick).toHaveBeenCalledWith(rows[0]);
  });

  it("selects a row via checkbox (multiple mode)", () => {
    const onSelectionChange = vi.fn();
    render(
      <DataTable
        {...baseProps}
        selection={{ selected: [], onSelectionChange, mode: "multiple" }}
      />
    );
    const checkboxes = screen.getAllByRole("checkbox");
    // First checkbox is "select all", second is first row
    fireEvent.click(checkboxes[1]);
    expect(onSelectionChange).toHaveBeenCalledWith(["1"]);
  });

  it("selects all rows when select-all checkbox clicked", () => {
    const onSelectionChange = vi.fn();
    render(
      <DataTable
        {...baseProps}
        selection={{ selected: [], onSelectionChange, mode: "multiple" }}
      />
    );
    fireEvent.click(screen.getAllByRole("checkbox")[0]); // select-all
    expect(onSelectionChange).toHaveBeenCalledWith(["1", "2", "3"]);
  });

  it("renders pagination controls when pagination prop provided", () => {
    render(
      <DataTable
        {...baseProps}
        pagination={{ page: 1, pageSize: 10, total: 30, onPageChange: vi.fn(), onPageSizeChange: vi.fn() }}
      />
    );
    expect(screen.getByLabelText("Next page")).toBeInTheDocument();
    expect(screen.getByLabelText("Previous page")).toBeInTheDocument();
    expect(screen.getByText(/of 30/)).toBeInTheDocument();
  });

  it("disables Previous button on first page", () => {
    render(
      <DataTable
        {...baseProps}
        pagination={{ page: 1, pageSize: 10, total: 30, onPageChange: vi.fn(), onPageSizeChange: vi.fn() }}
      />
    );
    expect(screen.getByLabelText("Previous page")).toBeDisabled();
  });

  it("calls onPageChange when Next is clicked", () => {
    const onPageChange = vi.fn();
    render(
      <DataTable
        {...baseProps}
        pagination={{ page: 1, pageSize: 2, total: rows.length, onPageChange, onPageSizeChange: vi.fn() }}
      />
    );
    fireEvent.click(screen.getByLabelText("Next page"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("supports keyboard activation of clickable rows", () => {
    const onRowClick = vi.fn();
    render(<DataTable {...baseProps} onRowClick={onRowClick} />);
    const row = screen.getByText("Ava Johnson").closest("tr")!;
    fireEvent.keyDown(row, { key: "Enter" });
    expect(onRowClick).toHaveBeenCalledWith(rows[0]);
  });

  it("has no obvious a11y violations", async () => {
    const { container } = render(<DataTable {...baseProps} />);
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});

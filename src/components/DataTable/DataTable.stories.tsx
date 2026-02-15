import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { useState } from "react";
import { DataTable } from "./DataTable";
import type { ColumnDef } from "./DataTable.types";

type Patient = Record<string, unknown> & {
  id: string;
  name: string;
  mrn: string;
  status: "Active" | "Inactive";
  lastVisit: string;
  riskLevel: "Low" | "Medium" | "High";
};

const rows: Patient[] = Array.from({ length: 20 }, (_, i) => ({
  id: String(i + 1),
  name: ["Ava Johnson", "Noah Smith", "Emma Davis", "Liam Brown", "Olivia Wilson"][i % 5],
  mrn: `MRN-${String(1000 + i).padStart(5, "0")}`,
  status: i % 3 === 0 ? "Inactive" : "Active",
  lastVisit: `2026-01-${String((i % 28) + 1).padStart(2, "0")}`,
  riskLevel: (["Low", "Medium", "High"] as const)[i % 3],
}));

const columns: ColumnDef<Patient>[] = [
  { id: "name",      header: "Patient",    accessor: "name",      sortable: true },
  { id: "mrn",       header: "MRN",        accessor: "mrn",       width: 140 },
  {
    id: "status", header: "Status", accessor: "status", sortable: true, align: "center",
    cell: (v) => (
      <span style={{ padding: "2px 8px", borderRadius: 9999, fontSize: 12,
        background: v === "Active" ? "#dcfce7" : "#f1f5f9",
        color: v === "Active" ? "#15803d" : "#475569" }}>
        {v as string}
      </span>
    ),
  },
  { id: "lastVisit", header: "Last Visit", accessor: "lastVisit", sortable: true },
  { id: "riskLevel", header: "Risk",       accessor: "riskLevel", sortable: true, align: "center" },
];

const meta: Meta<typeof DataTable<Patient>> = {
  title: "Components/DataTable",
  component: DataTable,
  parameters: { viewport: { defaultViewport: "responsive" } },
  args: {
    data: rows,
    columns,
    getRowId: (r: Patient) => r.id,
    ariaLabel: "Patients",
    onRowClick: fn(),
  },
  argTypes: {
    data: { control: false },
    columns: { control: false },
    getRowId: { control: false },
    emptyState: { control: false },
    pagination: { control: false },
    sorting: { control: false },
    selection: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Default table with data */
export const Default: Story = {};

/** Loading skeleton */
export const Loading: Story = {
  args: { data: [], loading: true },
};

/** Empty state */
export const Empty: Story = {
  args: {
    data: [],
    emptyState: <span style={{ color: "#94a3b8" }}>No patients found</span>,
  },
};

/** Sticky header with scroll */
export const StickyHeader: Story = {
  args: { stickyHeader: true },
};

/** Sorting — controlled externally */
export const WithSorting: Story = {
  render: () => {
    const [sort, setSort] = useState({ column: "name", direction: "asc" as "asc" | "desc" });
    const sorted = [...rows].sort((a, b) => {
      const v = String(a[sort.column as keyof Patient]) < String(b[sort.column as keyof Patient]) ? -1 : 1;
      return sort.direction === "asc" ? v : -v;
    });
    return (
      <DataTable
        data={sorted}
        columns={columns}
        getRowId={(r) => r.id}
        sorting={{ column: sort.column, direction: sort.direction, onSort: (c, d) => setSort({ column: c, direction: d }) }}
        ariaLabel="Patients sortable"
      />
    );
  },
};

/** Row selection — multiple */
export const WithSelection: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    return (
      <div>
        <p style={{ marginBottom: 8, fontSize: 13 }}>Selected: {selected.join(", ") || "none"}</p>
        <DataTable
          data={rows.slice(0, 6)}
          columns={columns}
          getRowId={(r) => r.id}
          selection={{ selected, onSelectionChange: setSelected, mode: "multiple" }}
          ariaLabel="Patients selectable"
        />
      </div>
    );
  },
};

/** Pagination — server-side simulation */
export const WithPagination: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const paged = rows.slice((page - 1) * pageSize, page * pageSize);
    return (
      <DataTable
        data={paged}
        columns={columns}
        getRowId={(r) => r.id}
        pagination={{ page, pageSize, total: rows.length, onPageChange: setPage, onPageSizeChange: setPageSize }}
        ariaLabel="Patients paginated"
      />
    );
  },
};

/** Mobile viewport */
export const Mobile: Story = {
  args: { data: rows.slice(0, 5) },
  parameters: { viewport: { defaultViewport: "mobile1" } },
};

import type { Meta, StoryObj } from "@storybook/react";
import { DataTable } from "./DataTable";
import type { DataTableColumn } from "./DataTable.types";

type Row = {
  id: string;
  name: string;
  status: "Scheduled" | "Cancelled";
  time: string;
};

const rows: Row[] = [
  { id: "1", name: "Ava Johnson", status: "Scheduled", time: "10:30 AM" },
  { id: "2", name: "Noah Smith", status: "Cancelled", time: "2:00 PM" }
];

const columns: DataTableColumn<Row>[] = [
  { key: "name", header: "Patient" },
  { key: "time", header: "Time", width: "140px" },
  { key: "status", header: "Status", width: "140px" }
];

const meta: Meta<typeof DataTable<Row>> = {
  title: "Components/DataTable",
  component: DataTable,
  args: {
    caption: "Appointments",
    columns,
    rows,
    getRowId: (r: Row) => r.id
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    rows: [],
    emptyText: "No appointments"
  }
};

export const ClickableRows: Story = {
  args: {
    onRowClick: (row: Row) => {
      // storybook action can be added later; keep it simple
      alert(`Clicked: ${row.name}`);
    }
  }
};

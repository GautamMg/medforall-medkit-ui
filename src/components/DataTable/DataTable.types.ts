import type React from "react";

export interface ColumnDef<T> {
  id: string;
  header: string | React.ReactNode;
  /** Key of T or a function that extracts the cell value */
  accessor: keyof T | ((row: T) => unknown);
  /** Custom cell renderer */
  cell?: (value: unknown, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: number | string;
  align?: "left" | "center" | "right";
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export interface SortingConfig {
  column: string;
  direction: "asc" | "desc";
  onSort: (column: string, direction: "asc" | "desc") => void;
}

export interface SelectionConfig {
  selected: string[];
  onSelectionChange: (ids: string[]) => void;
  mode: "single" | "multiple";
}

export interface DataTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: ColumnDef<T>[];
  /** Derive a unique string id from a row */
  getRowId: (row: T) => string;
  pagination?: PaginationConfig;
  sorting?: SortingConfig;
  selection?: SelectionConfig;
  loading?: boolean;
  emptyState?: React.ReactNode;
  onRowClick?: (row: T) => void;
  /** Freeze the header on scroll */
  stickyHeader?: boolean;
  /** Virtualize rows when count exceeds this number (default: 100) */
  virtualizeThreshold?: number;
  caption?: string;
  ariaLabel?: string;
}

// Re-export legacy alias so existing stories compile without change
export type DataTableColumn<T> = ColumnDef<T>;

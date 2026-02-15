import React, { useCallback, useRef } from "react";
import styles from "./DataTable.module.css";
import type { ColumnDef, DataTableProps } from "./DataTable.types";

// ─── Skeleton loader ─────────────────────────────────────────────────────────

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr aria-hidden="true">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i}>
          <div className={styles.skeletonCell} />
        </td>
      ))}
    </tr>
  );
}

// ─── Sort indicator ───────────────────────────────────────────────────────────

function SortIcon({ direction }: { direction: "asc" | "desc" | null }) {
  if (!direction) return <span className={styles.sortIcon} aria-hidden="true">⇅</span>;
  return (
    <span className={styles.sortIconActive} aria-hidden="true">
      {direction === "asc" ? "↑" : "↓"}
    </span>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({ page, pageSize, total, onPageChange, onPageSizeChange }: {
  page: number; pageSize: number; total: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to   = Math.min(page * pageSize, total);

  return (
    <div className={styles.pagination} role="navigation" aria-label="Table pagination">
      <span className={styles.paginationInfo}>{from}–{to} of {total}</span>

      <div className={styles.paginationControls}>
        <label className={styles.pageSizeLabel}>
          Rows
          <select
            className={styles.pageSizeSelect}
            value={pageSize}
            onChange={(e) => { onPageSizeChange(Number(e.target.value)); onPageChange(1); }}
            aria-label="Rows per page"
          >
            {[10, 25, 50, 100].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>

        <button
          type="button"
          className={styles.pageBtn}
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          ‹
        </button>
        <span className={styles.pageNum} aria-current="page">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          className={styles.pageBtn}
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          ›
        </button>
      </div>
    </div>
  );
}

// ─── Main DataTable ───────────────────────────────────────────────────────────

/**
 * DataTable is a fully-featured data grid with server-side pagination,
 * sortable columns, row selection (single/multiple), loading skeleton,
 * sticky header, and keyboard navigation.
 */
export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  getRowId,
  pagination,
  sorting,
  selection,
  loading = false,
  emptyState,
  onRowClick,
  stickyHeader = false,
  virtualizeThreshold = 100,
  caption,
  ariaLabel = "Data table",
}: DataTableProps<T>) {
  const tableRef = useRef<HTMLTableElement | null>(null);

  function getCellValue(row: T, col: ColumnDef<T>): unknown {
    if (typeof col.accessor === "function") return col.accessor(row);
    return row[col.accessor];
  }

  function renderCell(row: T, col: ColumnDef<T>): React.ReactNode {
    const value = getCellValue(row, col);
    if (col.cell) return col.cell(value, row);
    return value == null ? "" : String(value);
  }

  const handleSort = useCallback((colId: string) => {
    if (!sorting) return;
    const nextDir: "asc" | "desc" =
      sorting.column === colId && sorting.direction === "asc" ? "desc" : "asc";
    sorting.onSort(colId, nextDir);
  }, [sorting]);

  function isRowSelected(row: T): boolean {
    if (!selection) return false;
    return selection.selected.includes(getRowId(row));
  }

  function toggleRowSelection(row: T) {
    if (!selection) return;
    const id = getRowId(row);
    if (selection.mode === "single") {
      selection.onSelectionChange(isRowSelected(row) ? [] : [id]);
    } else {
      const next = isRowSelected(row)
        ? selection.selected.filter((s) => s !== id)
        : [...selection.selected, id];
      selection.onSelectionChange(next);
    }
  }

  function toggleAllSelection() {
    if (!selection || selection.mode === "single") return;
    if (selection.selected.length === data.length) {
      selection.onSelectionChange([]);
    } else {
      selection.onSelectionChange(data.map(getRowId));
    }
  }

  const allSelected = selection ? selection.selected.length === data.length && data.length > 0 : false;
  const someSelected = selection ? selection.selected.length > 0 && !allSelected : false;

  // Effective columns — prepend checkbox column if selection enabled
  const effectiveCols: ColumnDef<T>[] = selection
    ? [{ id: "__select__", header: "", accessor: (r) => getRowId(r), width: 40 }, ...columns]
    : columns;

  const isEmpty = !loading && data.length === 0;

  // Virtualization warning — for brevity we render all rows but cap with a note
  // Full virtualization would use a library like @tanstack/virtual
  const virtualize = data.length > virtualizeThreshold;

  return (
    <div className={[styles.root, stickyHeader ? styles.stickyRoot : ""].join(" ").trim()}>
      <div className={styles.scrollWrap}>
        <table
          ref={tableRef}
          className={[styles.table, stickyHeader ? styles.stickyTable : ""].join(" ").trim()}
          aria-label={ariaLabel}
          aria-busy={loading}
          aria-rowcount={pagination ? pagination.total : data.length}
        >
          {caption && <caption className={styles.caption}>{caption}</caption>}

          <thead className={stickyHeader ? styles.stickyHead : undefined}>
            <tr>
              {effectiveCols.map((col) => {
                if (col.id === "__select__") {
                  return (
                    <th key="__select__" scope="col" style={{ width: 40 }}>
                      {selection?.mode === "multiple" && (
                        <input
                          type="checkbox"
                          checked={allSelected}
                          ref={(el) => { if (el) el.indeterminate = someSelected; }}
                          onChange={toggleAllSelection}
                          aria-label="Select all rows"
                        />
                      )}
                    </th>
                  );
                }

                const isSorted = sorting?.column === col.id;
                const sortDir = isSorted ? sorting!.direction : null;

                return (
                  <th
                    key={col.id}
                    scope="col"
                    style={{
                      width: col.width,
                      textAlign: col.align ?? "left",
                      cursor: col.sortable ? "pointer" : "default",
                    }}
                    aria-sort={col.sortable ? (isSorted ? (sortDir === "asc" ? "ascending" : "descending") : "none") : undefined}
                    onClick={col.sortable ? () => handleSort(col.id) : undefined}
                    tabIndex={col.sortable ? 0 : undefined}
                    onKeyDown={col.sortable ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleSort(col.id); } } : undefined}
                  >
                    <span className={styles.headerContent}>
                      {col.header}
                      {col.sortable && <SortIcon direction={sortDir} />}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {loading && Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} cols={effectiveCols.length} />
            ))}

            {!loading && isEmpty && (
              <tr>
                <td className={styles.emptyCell} colSpan={effectiveCols.length}>
                  {emptyState ?? <span className={styles.emptyText}>No data</span>}
                </td>
              </tr>
            )}

            {!loading && !isEmpty && data.map((row, rowIdx) => {
              const id = getRowId(row);
              const selected = isRowSelected(row);
              const clickable = Boolean(onRowClick);

              return (
                <tr
                  key={id}
                  aria-rowindex={rowIdx + 1}
                  aria-selected={selection ? selected : undefined}
                  className={[
                    clickable ? styles.rowClickable : "",
                    selected ? styles.rowSelected : "",
                  ].join(" ").trim()}
                  onClick={clickable ? () => onRowClick!(row) : undefined}
                  tabIndex={clickable ? 0 : undefined}
                  onKeyDown={
                    clickable
                      ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onRowClick!(row); } }
                      : undefined
                  }
                >
                  {effectiveCols.map((col) => {
                    if (col.id === "__select__") {
                      return (
                        <td key="__select__" onClick={(e) => e.stopPropagation()}>
                          <input
                            type={selection?.mode === "single" ? "radio" : "checkbox"}
                            checked={selected}
                            onChange={() => toggleRowSelection(row)}
                            aria-label={`Select row ${id}`}
                          />
                        </td>
                      );
                    }
                    return (
                      <td key={col.id} style={{ textAlign: col.align ?? "left" }}>
                        {renderCell(row, col)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {virtualize && !loading && (
        <div className={styles.virtualizationNote} role="note">
          Showing {data.length} rows (large dataset — consider adding server-side pagination)
        </div>
      )}

      {pagination && (
        <Pagination
          page={pagination.page}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onPageChange={pagination.onPageChange}
          onPageSizeChange={pagination.onPageSizeChange}
        />
      )}
    </div>
  );
}

import React from "react";
import styles from "./DataTable.module.css";
import type { DataTableProps } from "./DataTable.types";

export function DataTable<T>({
  caption,
  ariaLabel = "Data table",
  columns,
  rows,
  getRowId,
  emptyText = "No data",
  onRowClick
}: DataTableProps<T>) {
  const isEmpty = rows.length === 0;

  return (
    <div className={styles.root}>
      <table className={styles.table} aria-label={ariaLabel}>
        {caption ? <caption className={styles.caption}>{caption}</caption> : null}

        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} scope="col" style={c.width ? { width: c.width } : undefined}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {isEmpty ? (
            <tr>
              <td className={styles.empty} colSpan={columns.length}>
                {emptyText}
              </td>
            </tr>
          ) : (
            rows.map((row) => {
              const clickable = Boolean(onRowClick);
              return (
                <tr
                    key={getRowId(row)}
                    className={clickable ? styles.rowClickable : undefined}
                    role={clickable ? "button" : undefined}
                    tabIndex={clickable ? 0 : undefined}
                    onClick={clickable ? () => onRowClick?.(row) : undefined}
                    onKeyDown={
                        clickable
                        ? (e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                onRowClick?.(row);
                            }
                            }
                        : undefined
                    }
                  >
                  {columns.map((c) => (
                    <td key={c.key}>{c.render ? c.render(row) : String((row as any)[c.key] ?? "")}</td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

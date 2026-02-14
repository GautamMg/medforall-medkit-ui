import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./MedicationSearch.module.css";
import type { MedicationOption, MedicationSearchProps } from "./MedicationSearch.types";

export function MedicationSearch({
  label = "Medication",
  placeholder = "Search medications",
  query,
  onQueryChange,
  results,
  loading = false,
  emptyText = "No results",
  onSelect
}: MedicationSearchProps) {
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const listId = useMemo(() => `med-search-${Math.random().toString(16).slice(2)}`, []);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // reset active selection whenever results change
  useEffect(() => {
    setActiveIndex(results.length > 0 ? 0 : -1);
  }, [results]);

  const activeItem: MedicationOption | undefined =
    activeIndex >= 0 ? results[activeIndex] : undefined;

  const isOpen =
    loading || results.length > 0 || (query.trim().length > 0 && results.length === 0);

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (results.length === 0) return;
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (results.length === 0) return;
      setActiveIndex((i) => Math.max(i - 1, 0));
      return;
    }

    if (e.key === "Enter") {
      if (activeItem) onSelect(activeItem);
      return;
    }

    if (e.key === "Escape") {
      setActiveIndex(-1);
      return;
    }
  }

  return (
    <div className={styles.root}>
      <label className={styles.label}>
        {label}
        <input
          ref={inputRef}
          className={styles.input}
          value={query}
          placeholder={placeholder}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeItem ? `${listId}-${activeItem.id}` : undefined}
        />
      </label>

      <div className={styles.panel}>
        {loading ? (
          <div className={styles.state}>Loading…</div>
        ) : results.length === 0 ? (
          <div className={styles.state}>{emptyText}</div>
        ) : (
          <ul className={styles.list} role="listbox" id={listId} aria-label="Medication results">
            {results.map((m, idx) => {
              const active = idx === activeIndex;
              return (
                <li
                  key={m.id}
                  id={`${listId}-${m.id}`}
                  role="option"
                  aria-selected={active}
                  tabIndex={-1}
                  className={[styles.item, active ? styles.itemActive : ""].join(" ")}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onMouseDown={(e) => e.preventDefault()} // prevent input blur
                  onClick={() => onSelect(m)}
                >
                  <div className={styles.itemName}>{m.name}</div>
                  {m.subtitle ? <div className={styles.itemSub}>{m.subtitle}</div> : null}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
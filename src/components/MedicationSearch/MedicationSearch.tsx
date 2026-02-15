import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./MedicationSearch.module.css";
import type { Medication, MedicationSearchProps } from "./MedicationSearch.types";

/**
 * MedicationSearch is a fully accessible autocomplete for medications.
 * It debounces the search, cancels stale requests, shows controlled-substance
 * and prior-auth indicators, and displays recent selections when idle.
 */
export function MedicationSearch({
  onSelect,
  searchFn,
  debounceMs = 300,
  placeholder = "Search medications…",
  label = "Medication",
  recentSelections = [],
  maxResults = 10,
}: MedicationSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showRecent, setShowRecent] = useState(false);

  const listId = useMemo(() => `med-list-${Math.random().toString(16).slice(2)}`, []);
  const inputRef = useRef<HTMLInputElement | null>(null);
  // Track abort controller to cancel in-flight requests
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset active item when list changes
  useEffect(() => {
    setActiveIndex(results.length > 0 ? 0 : -1);
  }, [results]);

  // Debounced search with request cancellation
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setLoading(false);
      setShowRecent(recentSelections.length > 0);
      return;
    }

    setShowRecent(false);
    debounceRef.current = setTimeout(async () => {
      // Cancel previous request
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();
      const signal = abortRef.current.signal;

      setLoading(true);
      try {
        const data = await searchFn(trimmed);
        if (!signal.aborted) {
          setResults(data.slice(0, maxResults));
        }
      } catch {
        if (!signal.aborted) setResults([]);
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    }, debounceMs);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, debounceMs, maxResults]);

  const displayList: Medication[] = showRecent ? recentSelections.slice(0, maxResults) : results;
  const isOpen = loading || displayList.length > 0 || (query.trim().length > 0 && !loading && results.length === 0);
  const activeItem = activeIndex >= 0 ? displayList[activeIndex] : undefined;

  function handleSelect(med: Medication) {
    onSelect(med);
    setQuery("");
    setResults([]);
    setShowRecent(false);
    inputRef.current?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, displayList.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (activeItem) handleSelect(activeItem);
    } else if (e.key === "Escape") {
      setQuery("");
      setResults([]);
      setActiveIndex(-1);
    }
  }

  return (
    <div className={styles.root}>
      <label className={styles.label} htmlFor={`${listId}-input`}>
        {label}
      </label>
      <input
        id={`${listId}-input`}
        ref={inputRef}
        className={styles.input}
        value={query}
        placeholder={placeholder}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => { if (!query.trim() && recentSelections.length > 0) setShowRecent(true); }}
        onBlur={() => setTimeout(() => setShowRecent(false), 150)}
        onKeyDown={onKeyDown}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={activeItem ? `${listId}-${activeItem.id}` : undefined}
      />

      {isOpen && (
        <div className={styles.panel} role="listbox" id={listId} aria-label="Medication results">
          {showRecent && (
            <div className={styles.sectionHeader}>Recent selections</div>
          )}

          {loading && (
            <div className={styles.state} role="status" aria-live="polite">Loading…</div>
          )}

          {!loading && displayList.length === 0 && query.trim() && (
            <div className={styles.state}>No results for "{query}"</div>
          )}

          {!loading && displayList.map((med, idx) => {
            const active = idx === activeIndex;
            return (
              <div
                key={med.id}
                id={`${listId}-${med.id}`}
                role="option"
                aria-selected={active}
                className={[styles.item, active ? styles.itemActive : ""].join(" ")}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(med)}
              >
                <div className={styles.itemMain}>
                  <span className={styles.itemName}>{med.brandName}</span>
                  <span className={styles.itemGeneric}>{med.genericName}</span>
                </div>
                <div className={styles.itemMeta}>
                  <span>{med.strength} · {med.form}</span>
                  <div className={styles.badges}>
                    {med.controlledSubstance && (
                      <span className={styles.badgeControlled} title="Controlled substance">⚠ C</span>
                    )}
                    {med.requiresPriorAuth && (
                      <span className={styles.badgePriorAuth} title="Requires prior authorization">PA</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

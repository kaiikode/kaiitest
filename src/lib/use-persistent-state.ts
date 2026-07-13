"use client";

import {
  useCallback,
  useMemo,
  useState,
  useSyncExternalStore,
  type SetStateAction,
} from "react";

/**
 * Demo-mode persistence that behaves like React state while surviving reloads.
 * Production repositories can keep the same component API and replace this
 * adapter with wedding-scoped Supabase queries and mutations.
 */
export function usePersistentState<T>(
  key: string,
  initialValue: T,
): [T, (value: SetStateAction<T>) => void] {
  const storageKey = `padua-planning:${key}`;
  const [initialSnapshot] = useState(() => JSON.stringify(initialValue));
  const eventName = `padua-storage:${storageKey}`;

  const serialized = useSyncExternalStore(
    useCallback(
      (onStoreChange) => {
        const listener = (event: Event) => {
          if (
            event instanceof StorageEvent &&
            event.key !== null &&
            event.key !== storageKey
          )
            return;
          onStoreChange();
        };
        window.addEventListener("storage", listener);
        window.addEventListener(eventName, listener);
        return () => {
          window.removeEventListener("storage", listener);
          window.removeEventListener(eventName, listener);
        };
      },
      [eventName, storageKey],
    ),
    useCallback(
      () => localStorage.getItem(storageKey) ?? initialSnapshot,
      [initialSnapshot, storageKey],
    ),
    useCallback(() => initialSnapshot, [initialSnapshot]),
  );

  const state = useMemo(() => {
    try {
      return JSON.parse(serialized) as T;
    } catch {
      return JSON.parse(initialSnapshot) as T;
    }
  }, [initialSnapshot, serialized]);

  const setState = useCallback(
    (value: SetStateAction<T>) => {
      let current = initialValue;
      try {
        current = JSON.parse(
          localStorage.getItem(storageKey) ?? initialSnapshot,
        ) as T;
      } catch {
        // Fall back to the component's initial state.
      }
      const next =
        typeof value === "function"
          ? (value as (previous: T) => T)(current)
          : value;
      localStorage.setItem(storageKey, JSON.stringify(next));
      window.dispatchEvent(new Event(eventName));
    },
    [eventName, initialSnapshot, initialValue, storageKey],
  );

  return [state, setState];
}

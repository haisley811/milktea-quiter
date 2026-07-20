import { initialStats, rebuildStats } from "./stats.ts";
import type { AppStats } from "./types.ts";

export const STORAGE_KEY = "milkTeaAppData";

export type StorageAdapter = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

export type AppStoragePort = StorageAdapter;

export type StorageResult =
  | { ok: true }
  | { ok: false; reason: "unavailable" | "read-failed" | "write-failed" | "remove-failed" };

function getBrowserStorage(): StorageAdapter | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

export function loadAppStatsFromStorage(storage: StorageAdapter | null = getBrowserStorage()): AppStats {
  if (!storage) {
    return initialStats;
  }

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) {
      return initialStats;
    }

    const parsed = JSON.parse(raw) as Partial<AppStats>;
    return rebuildStats(parsed.records ?? [], 50);
  } catch {
    return initialStats;
  }
}

export function saveAppStatsToStorage(stats: AppStats, storage: StorageAdapter | null = getBrowserStorage()): StorageResult {
  if (!storage) {
    return { ok: false, reason: "unavailable" };
  }

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(stats));
    return { ok: true };
  } catch {
    return { ok: false, reason: "write-failed" };
  }
}

export function clearAppStatsFromStorage(storage: StorageAdapter | null = getBrowserStorage()): StorageResult {
  if (!storage) {
    return { ok: false, reason: "unavailable" };
  }

  try {
    storage.removeItem(STORAGE_KEY);
    return { ok: true };
  } catch {
    return { ok: false, reason: "remove-failed" };
  }
}

export function createMemoryStorageAdapter(seed: Record<string, string> = {}): StorageAdapter {
  const store = new Map(Object.entries(seed));

  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => {
      store.set(key, value);
    },
    removeItem: (key) => {
      store.delete(key);
    }
  };
}

export const loadAppStats = loadAppStatsFromStorage;
export const saveAppStats = saveAppStatsToStorage;
export const clearAppStats = clearAppStatsFromStorage;

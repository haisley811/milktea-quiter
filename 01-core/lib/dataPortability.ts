import { rebuildStats } from "./stats.ts";
import { STORAGE_KEY } from "./storage.ts";
import type { AppStats, DrinkRecord } from "./types.ts";

export const APP_DATA_EXPORT_VERSION = 1;
export const APP_DATA_EXPORT_APP_ID = "today-no-milktea";

export type AppDataExportPayload = {
  appId: typeof APP_DATA_EXPORT_APP_ID;
  version: typeof APP_DATA_EXPORT_VERSION;
  storageKey: typeof STORAGE_KEY;
  exportedAt: string;
  records: DrinkRecord[];
};

export type ImportAppDataResult =
  | { ok: true; stats: AppStats; importedRecords: number }
  | { ok: false; reason: "invalid-json" | "invalid-payload" | "unsupported-version"; message: string };

function isRecordLike(value: unknown): value is DrinkRecord {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Partial<DrinkRecord>;
  const dateTime = typeof record.date === "string" ? new Date(record.date).getTime() : Number.NaN;

  return (
    typeof record.id === "string" &&
    Number.isFinite(dateTime) &&
    (record.mode === "saved" || record.mode === "consumed") &&
    typeof record.drinkName === "string" &&
    typeof record.drinkType === "string" &&
    typeof record.size === "string" &&
    typeof record.ice === "string" &&
    typeof record.sugar === "string" &&
    Array.isArray(record.toppings) &&
    record.toppings.every((topping) => typeof topping === "string") &&
    typeof record.customTopping === "string" &&
    typeof record.source === "string" &&
    typeof record.confidence === "string" &&
    Number.isFinite(record.price) &&
    Number.isFinite(record.calories) &&
    Number.isFinite(record.sugarGram)
  );
}

function isPayloadLike(value: unknown): value is AppDataExportPayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Partial<AppDataExportPayload>;

  return (
    payload.appId === APP_DATA_EXPORT_APP_ID &&
    payload.storageKey === STORAGE_KEY &&
    payload.version === APP_DATA_EXPORT_VERSION &&
    typeof payload.exportedAt === "string" &&
    Number.isFinite(new Date(payload.exportedAt).getTime()) &&
    Array.isArray(payload.records) &&
    payload.records.every(isRecordLike)
  );
}

export function exportAppData(stats: AppStats, now = new Date()): AppDataExportPayload {
  return {
    appId: APP_DATA_EXPORT_APP_ID,
    version: APP_DATA_EXPORT_VERSION,
    storageKey: STORAGE_KEY,
    exportedAt: now.toISOString(),
    records: stats.records.map((record) => ({ ...record, toppings: [...record.toppings] }))
  };
}

export function serializeAppDataExport(stats: AppStats, now = new Date()) {
  return JSON.stringify(exportAppData(stats, now), null, 2);
}

export function importAppDataPayload(payload: unknown): ImportAppDataResult {
  if (!payload || typeof payload !== "object") {
    return { ok: false, reason: "invalid-payload", message: "导入内容不是有效的数据对象。" };
  }

  const candidate = payload as Partial<AppDataExportPayload>;
  if (candidate.version !== APP_DATA_EXPORT_VERSION) {
    return { ok: false, reason: "unsupported-version", message: "导入数据版本暂不支持。" };
  }

  if (!isPayloadLike(payload)) {
    return { ok: false, reason: "invalid-payload", message: "导入数据字段不完整或格式不正确。" };
  }

  const stats = rebuildStats(payload.records, 50);
  return { ok: true, stats, importedRecords: stats.records.length };
}

export function parseAppDataExport(text: string): ImportAppDataResult {
  try {
    return importAppDataPayload(JSON.parse(text));
  } catch {
    return { ok: false, reason: "invalid-json", message: "导入内容不是有效的 JSON。" };
  }
}

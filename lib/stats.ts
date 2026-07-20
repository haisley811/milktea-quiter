import type { AppStats, DrinkRecord } from "./types.ts";

export type TodayRecordSummary = {
  total: number;
  saved: number;
  consumed: number;
  netMoney: number;
  latestMode: DrinkRecord["mode"] | null;
};

export const initialStats: AppStats = {
  totalSavedMoney: 0,
  totalSpentMoney: 0,
  netMoney: 0,
  totalReducedCalories: 0,
  totalAddedCalories: 0,
  netCalories: 0,
  totalReducedSugar: 0,
  totalAddedSugar: 0,
  netSugar: 0,
  bodyScore: 50,
  streakDays: 0,
  records: []
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function dateKey(date: Date | string) {
  const next = typeof date === "string" ? new Date(date) : date;
  const year = next.getFullYear();
  const month = String(next.getMonth() + 1).padStart(2, "0");
  const day = String(next.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function daysBetween(from: Date, to: Date) {
  const fromStart = new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime();
  const toStart = new Date(to.getFullYear(), to.getMonth(), to.getDate()).getTime();
  return Math.round((toStart - fromStart) / 86_400_000);
}

export function calculateStreak(records: DrinkRecord[], now = new Date()) {
  const savedDays = new Set(records.filter((record) => record.mode === "saved").map((record) => dateKey(record.date)));
  let streak = 0;
  let cursor = new Date(now);

  while (savedDays.has(dateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function rebuildStats(records: DrinkRecord[], baseScore = 50, now = new Date()): AppStats {
  const sorted = [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const totals = sorted.reduce(
    (acc, record) => {
      if (record.mode === "saved") {
        acc.totalSavedMoney += record.price;
        acc.totalReducedCalories += record.calories;
        acc.totalReducedSugar += record.sugarGram;
        acc.bodyScore -= 2;
      } else {
        acc.totalSpentMoney += record.price;
        acc.totalAddedCalories += record.calories;
        acc.totalAddedSugar += record.sugarGram;
        acc.bodyScore += 2;
      }
      return acc;
    },
    {
      totalSavedMoney: 0,
      totalSpentMoney: 0,
      totalReducedCalories: 0,
      totalAddedCalories: 0,
      totalReducedSugar: 0,
      totalAddedSugar: 0,
      bodyScore: baseScore
    }
  );

  return {
    totalSavedMoney: Math.round(totals.totalSavedMoney * 10) / 10,
    totalSpentMoney: Math.round(totals.totalSpentMoney * 10) / 10,
    netMoney: Math.round((totals.totalSavedMoney - totals.totalSpentMoney) * 10) / 10,
    totalReducedCalories: totals.totalReducedCalories,
    totalAddedCalories: totals.totalAddedCalories,
    netCalories: totals.totalReducedCalories - totals.totalAddedCalories,
    totalReducedSugar: totals.totalReducedSugar,
    totalAddedSugar: totals.totalAddedSugar,
    netSugar: totals.totalReducedSugar - totals.totalAddedSugar,
    bodyScore: clamp(totals.bodyScore, 0, 100),
    streakDays: calculateStreak(sorted, now),
    records: sorted
  };
}

export function addRecordToStats(current: AppStats, record: DrinkRecord) {
  return rebuildStats([record, ...current.records], 50);
}

export function getTodayRecordSummary(records: DrinkRecord[], now = new Date()): TodayRecordSummary {
  const today = dateKey(now);
  const todayRecords = records.filter((record) => dateKey(record.date) === today);

  return todayRecords.reduce<TodayRecordSummary>(
    (summary, record, index) => ({
      total: summary.total + 1,
      saved: summary.saved + (record.mode === "saved" ? 1 : 0),
      consumed: summary.consumed + (record.mode === "consumed" ? 1 : 0),
      netMoney: Math.round((summary.netMoney + (record.mode === "saved" ? record.price : -record.price)) * 10) / 10,
      latestMode: index === 0 ? record.mode : summary.latestMode
    }),
    { total: 0, saved: 0, consumed: 0, netMoney: 0, latestMode: todayRecords[0]?.mode ?? null }
  );
}

export function groupRecordsByDate(records: DrinkRecord[]) {
  return records.reduce<Record<string, DrinkRecord[]>>((groups, record) => {
    const key = dateKey(record.date);
    groups[key] = groups[key] ?? [];
    groups[key].push(record);
    return groups;
  }, {});
}

export function recentSevenDays(records: DrinkRecord[], now = new Date()) {
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(now);
    day.setDate(day.getDate() - (6 - index));
    const key = dateKey(day);
    const dayRecords = records.filter((record) => dateKey(record.date) === key);

    return {
      key,
      label: `${day.getMonth() + 1}/${day.getDate()}`,
      saved: dayRecords.filter((record) => record.mode === "saved").length,
      consumed: dayRecords.filter((record) => record.mode === "consumed").length,
      isToday: daysBetween(day, now) === 0
    };
  });
}

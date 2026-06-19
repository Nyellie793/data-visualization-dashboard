import type { CsvRow } from "../types/csv";

export type ColumnType = "numeric" | "text";

/**
 * Detects whether each column is mostly numeric or mostly text by sampling
 * up to the first 200 rows (cheap even on very large datasets).
 */
export const detectColumnTypes = (data: CsvRow[]): Record<string, ColumnType> => {
  if (data.length === 0) return {};

  const keys = Object.keys(data[0]);
  const sample = data.slice(0, 200);
  const types: Record<string, ColumnType> = {};

  keys.forEach((key) => {
    let nonEmpty = 0;
    let numeric = 0;

    sample.forEach((row) => {
      const value = row[key];
      if (value === undefined || value === "") return;
      nonEmpty += 1;
      if (!isNaN(Number(value))) numeric += 1;
    });

    types[key] = nonEmpty > 0 && numeric / nonEmpty >= 0.8 ? "numeric" : "text";
  });

  return types;
};

export const getNumericColumns = (types: Record<string, ColumnType>): string[] =>
  Object.keys(types).filter((key) => types[key] === "numeric");

export const getTextColumns = (types: Record<string, ColumnType>): string[] =>
  Object.keys(types).filter((key) => types[key] === "text");

export type ColumnStats = {
  column: string;
  count: number;
  min: number;
  max: number;
  mean: number;
  sum: number;
};

/**
 * Computes summary statistics for the given numeric columns across the
 * FULL dataset (not just whatever is currently charted). Uses reduce
 * instead of Math.min/max(...spread) so it doesn't blow the call stack
 * on very large datasets.
 */
export const computeColumnStats = (
  data: CsvRow[],
  numericKeys: string[]
): ColumnStats[] => {
  return numericKeys.map((key) => {
    let count = 0;
    let sum = 0;
    let min = Infinity;
    let max = -Infinity;

    for (const row of data) {
      const value = Number(row[key]);
      if (isNaN(value)) continue;
      count += 1;
      sum += value;
      if (value < min) min = value;
      if (value > max) max = value;
    }

    return {
      column: key,
      count,
      min: count ? min : 0,
      max: count ? max : 0,
      mean: count ? sum / count : 0,
      sum,
    };
  });
};

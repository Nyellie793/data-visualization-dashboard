import type { CsvRow } from "../types/csv";
import type { ChartData, ChartOptions } from "chart.js";

const PALETTE = [
  { bg: "#3B82F6", border: "#2563EB" },
  { bg: "#10B981", border: "#059669" },
  { bg: "#F59E0B", border: "#D97706" },
  { bg: "#EF4444", border: "#DC2626" },
  { bg: "#8B5CF6", border: "#7C3AED" },
  { bg: "#06B6D4", border: "#0891B2" },
  { bg: "#EC4899", border: "#DB2777" },
  { bg: "#84CC16", border: "#65A30D" },
];

const getColor = (index: number) => PALETTE[index % PALETTE.length];

const getColorArray = (n: number) =>
  Array.from({ length: n }, (_, i) => getColor(i).bg);

const getBorderArray = (n: number) =>
  Array.from({ length: n }, (_, i) => getColor(i).border);

const toNumber = (value: unknown): number => {
  const n = Number(value);
  return isNaN(n) ? 0 : n;
};

export type SupportedChartType =
  | "bar"
  | "line"
  | "pie"
  | "doughnut"
  | "radar"
  | "polarArea"
  | "scatter"
  | "bubble";

export const CHART_FAMILY: Record<
  SupportedChartType,
  "categorical" | "proportion" | "xy" | "bubble"
> = {
  bar: "categorical",
  line: "categorical",
  radar: "categorical",
  pie: "proportion",
  doughnut: "proportion",
  polarArea: "proportion",
  scatter: "xy",
  bubble: "bubble",
};

/**
 * Bar / Line / Radar: one shared category (x) axis, with one dataset per
 * selected y column so a dataset with many numeric columns can be
 * compared side by side instead of being limited to a single series.
 */
export const buildCategoricalChartData = (
  data: CsvRow[],
  xKey: string,
  yKeys: string[],
  chartType: "bar" | "line" | "radar"
): ChartData<"bar" | "line" | "radar"> => {
  const labels = data.map((row) => String(row[xKey]));

  const datasets = yKeys.map((yKey, i) => {
    const color = getColor(i);
    return {
      label: yKey,
      data: data.map((row) => toNumber(row[yKey])),
      backgroundColor: chartType === "radar" ? `${color.bg}33` : color.bg,
      borderColor: color.border,
      borderWidth: 2,
      tension: 0.35,
      pointRadius: chartType === "bar" ? 0 : 3,
      fill: chartType === "radar",
    };
  });

  return { labels, datasets } as ChartData<"bar" | "line" | "radar">;
};

/**
 * Pie / Doughnut / PolarArea: one label column, one numeric value column,
 * each row becomes a slice.
 */
export const buildProportionChartData = (
  data: CsvRow[],
  labelKey: string,
  valueKey: string
): ChartData<"pie" | "doughnut" | "polarArea"> => {
  const labels = data.map((row) => String(row[labelKey]));
  const values = data.map((row) => toNumber(row[valueKey]));

  return {
    labels,
    datasets: [
      {
        label: valueKey,
        data: values,
        backgroundColor: getColorArray(data.length),
        borderColor: getBorderArray(data.length),
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  } as ChartData<"pie" | "doughnut" | "polarArea">;
};

/**
 * Scatter: numeric x column plotted against one or more numeric y columns,
 * each rendered as its own series of {x, y} points (no connecting line).
 */
export const buildScatterChartData = (
  data: CsvRow[],
  xKey: string,
  yKeys: string[]
): ChartData<"scatter"> => {
  const datasets = yKeys.map((yKey, i) => {
    const color = getColor(i);
    return {
      label: yKey,
      data: data.map((row) => ({
        x: toNumber(row[xKey]),
        y: toNumber(row[yKey]),
      })),
      backgroundColor: color.bg,
      borderColor: color.border,
      pointRadius: 4,
      pointHoverRadius: 6,
    };
  });

  return { datasets } as ChartData<"scatter">;
};

/**
 * Bubble: three numeric columns at once (x, y, radius) — useful for
 * datasets with more than two meaningful numeric dimensions.
 */
export const buildBubbleChartData = (
  data: CsvRow[],
  xKey: string,
  yKey: string,
  rKey: string
): ChartData<"bubble"> => {
  const rawR = data.map((row) => toNumber(row[rKey]));
  const maxR = Math.max(...rawR, 1) || 1;
  const color = getColor(0);

  return {
    datasets: [
      {
        label: `${yKey} vs ${xKey} (size: ${rKey})`,
        data: data.map((row, i) => ({
          x: toNumber(row[xKey]),
          y: toNumber(row[yKey]),
          r: 4 + (rawR[i] / maxR) * 20,
        })),
        backgroundColor: `${color.bg}99`,
        borderColor: color.border,
      },
    ],
  } as ChartData<"bubble">;
};

type ChartOptionsConfig = {
  title: string;
  xLabel?: string;
  yLabel?: string;
  linearAxes?: boolean;
};

export const buildChartOptions = ({
  title,
  xLabel,
  yLabel,
  linearAxes = false,
}: ChartOptionsConfig): ChartOptions<
  "bar" | "line" | "pie" | "doughnut" | "radar" | "polarArea" | "scatter" | "bubble"
> => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "top" as const },
    title: { display: true, text: title, font: { size: 20 } },
  },
  animation: { duration: 800 },
  ...(linearAxes
    ? {
        scales: {
          x: {
            type: "linear" as const,
            position: "bottom" as const,
            title: { display: !!xLabel, text: xLabel },
          },
          y: {
            title: { display: !!yLabel, text: yLabel },
          },
        },
      }
    : {}),
});

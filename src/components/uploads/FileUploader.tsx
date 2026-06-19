import { useMemo, useState } from "react";

import DataPreview from "./DataPreview";
import ChartGenerator from "../charts/ChartGenerator";
import StatsSummary from "../analysis/StatsSummary";
import type { CsvRow } from "../../types/csv";
import { parseDataFile } from "../../utils/csvParser";
import {
  detectColumnTypes,
  getNumericColumns,
  getTextColumns,
} from "../../utils/dataAnalysis";
import { CHART_FAMILY } from "../../utils/ChartHelper";
import type { SupportedChartType } from "../../utils/ChartHelper";

const CHART_TYPE_OPTIONS: { value: SupportedChartType; label: string }[] = [
  { value: "bar", label: "Bar Chart" },
  { value: "line", label: "Line Chart" },
  { value: "radar", label: "Radar Chart" },
  { value: "pie", label: "Pie Chart" },
  { value: "doughnut", label: "Doughnut Chart" },
  { value: "polarArea", label: "Polar Area Chart" },
  { value: "scatter", label: "Scatter Plot" },
  { value: "bubble", label: "Bubble Chart" },
];

const DEFAULT_ROW_LIMIT = 300;

const FileUploader = () => {
  const [fileName, setFileName] = useState("");
  const [data, setData] = useState<CsvRow[]>([]);
  const [error, setError] = useState("");

  const [chartType, setChartType] = useState<SupportedChartType>("bar");

  // categorical (bar/line/radar) + scatter Y
  const [xKey, setXKey] = useState("");
  const [yKeys, setYKeys] = useState<string[]>([]);

  // pie / doughnut / polarArea
  const [labelKey, setLabelKey] = useState("");
  const [valueKey, setValueKey] = useState("");

  // bubble
  const [bubbleYKey, setBubbleYKey] = useState("");
  const [bubbleRKey, setBubbleRKey] = useState("");

  // performance control for large datasets
  const [rowLimit, setRowLimit] = useState(DEFAULT_ROW_LIMIT);

  const columnTypes = useMemo(() => detectColumnTypes(data), [data]);
  const numericKeys = useMemo(() => getNumericColumns(columnTypes), [columnTypes]);
  const allKeys = useMemo(() => Object.keys(columnTypes), [columnTypes]);

  const family = CHART_FAMILY[chartType];

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");
    setFileName(file.name);

    try {
      const parsed = await parseDataFile(file);
      setData(parsed);
      setRowLimit(Math.min(parsed.length, DEFAULT_ROW_LIMIT) || DEFAULT_ROW_LIMIT);

      const types = detectColumnTypes(parsed);
      const numeric = getNumericColumns(types);
      const text = getTextColumns(types);
      const keys = Object.keys(types);

      const defaultX = text[0] || keys[0] || "";
      const defaultY = numeric[0] ? [numeric[0]] : keys[1] ? [keys[1]] : keys[0] ? [keys[0]] : [];

      setXKey(defaultX);
      setYKeys(defaultY);
      setLabelKey(defaultX);
      setValueKey(numeric[0] || keys[1] || keys[0] || "");
      setBubbleYKey(numeric[1] || numeric[0] || keys[0] || "");
      setBubbleRKey(numeric[2] || numeric[0] || keys[0] || "");
    } catch (err) {
      setData([]);
      setError(err instanceof Error ? err.message : "Failed to parse the file.");
    }
  };

  const toggleYKey = (key: string) => {
    setYKeys((prev) => {
      if (prev.includes(key)) {
        // keep at least one column selected
        return prev.length > 1 ? prev.filter((k) => k !== key) : prev;
      }
      return [...prev, key];
    });
  };

  const chartedData = useMemo(() => data.slice(0, rowLimit), [data, rowLimit]);

  return (
    <div className="space-y-8">
      {/* Upload */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <span className="text-2xl font-semibold mb-6 block">Upload Dataset</span>

        <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileChange} />

        {fileName && !error && (
          <p className="mt-4 text-green-600 font-semibold">{fileName}</p>
        )}

        {error && <p className="mt-4 text-red-600 font-semibold">{error}</p>}
      </div>

      {data.length > 0 && (
        <>
          <DataPreview data={data} />

          <StatsSummary data={data} numericKeys={numericKeys} />

          {/* Chart Type */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Select Chart Type</h2>

            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value as SupportedChartType)}
              className="border rounded-lg p-3"
            >
              {CHART_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Column Selectors — shape depends on the chart family */}
          <div className="bg-white p-6 rounded-xl shadow-md space-y-5">
            <h2 className="text-xl font-semibold">Choose Columns</h2>

            {(family === "categorical" || family === "xy") && (
              <>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    {family === "xy" ? "X (numeric)" : "X Axis"}
                  </label>
                  <select
                    value={xKey}
                    onChange={(e) => setXKey(e.target.value)}
                    className="border p-2 rounded w-full sm:w-64"
                  >
                    {(family === "xy" ? numericKeys : allKeys).map((key) => (
                      <option key={key} value={key}>
                        {key}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Y Series (select one or more numeric columns)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {numericKeys.length === 0 && (
                      <p className="text-sm text-amber-600">
                        No numeric columns detected in this dataset.
                      </p>
                    )}
                    {numericKeys.map((key) => (
                      <button
                        type="button"
                        key={key}
                        onClick={() => toggleYKey(key)}
                        className={`px-3 py-1.5 rounded-full border text-sm transition ${
                          yKeys.includes(key)
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-white border-gray-300 text-gray-700 hover:border-blue-400"
                        }`}
                      >
                        {key}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {family === "proportion" && (
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Label column
                  </label>
                  <select
                    value={labelKey}
                    onChange={(e) => setLabelKey(e.target.value)}
                    className="border p-2 rounded"
                  >
                    {allKeys.map((key) => (
                      <option key={key} value={key}>
                        {key}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Value column (numeric)
                  </label>
                  <select
                    value={valueKey}
                    onChange={(e) => setValueKey(e.target.value)}
                    className="border p-2 rounded"
                  >
                    {numericKeys.map((key) => (
                      <option key={key} value={key}>
                        {key}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {family === "bubble" && (
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">X (numeric)</label>
                  <select
                    value={xKey}
                    onChange={(e) => setXKey(e.target.value)}
                    className="border p-2 rounded"
                  >
                    {numericKeys.map((key) => (
                      <option key={key} value={key}>
                        {key}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Y (numeric)</label>
                  <select
                    value={bubbleYKey}
                    onChange={(e) => setBubbleYKey(e.target.value)}
                    className="border p-2 rounded"
                  >
                    {numericKeys.map((key) => (
                      <option key={key} value={key}>
                        {key}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Bubble size (numeric)
                  </label>
                  <select
                    value={bubbleRKey}
                    onChange={(e) => setBubbleRKey(e.target.value)}
                    className="border p-2 rounded"
                  >
                    {numericKeys.map((key) => (
                      <option key={key} value={key}>
                        {key}
                      </option>
                    ))}
                  </select>
                </div>

                {numericKeys.length < 3 && (
                  <p className="text-sm text-amber-600 w-full">
                    Bubble charts work best with at least 3 numeric columns
                    (x, y, size). This dataset has {numericKeys.length}.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Row limit — keeps large datasets responsive */}
          {data.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2">Rows to Chart</h2>
              <p className="text-sm text-gray-500 mb-3">
                Dataset has {data.length.toLocaleString()} rows. Charting all of
                them can get slow — adjust how many to plot (statistics above
                always use the full dataset).
              </p>
              <input
                type="number"
                min={1}
                max={data.length}
                value={rowLimit}
                onChange={(e) =>
                  setRowLimit(
                    Math.max(1, Math.min(data.length, Number(e.target.value) || 1))
                  )
                }
                className="border rounded-lg p-2 w-40"
              />
              <span className="text-sm text-gray-500 ml-2">
                of {data.length.toLocaleString()} rows
              </span>
            </div>
          )}

          {/* Chart */}
          <ChartGenerator
            data={chartedData}
            chartType={chartType}
            xKey={xKey}
            yKeys={yKeys}
            labelKey={labelKey}
            valueKey={valueKey}
            bubbleYKey={bubbleYKey}
            bubbleRKey={bubbleRKey}
          />
        </>
      )}
    </div>
  );
};

export default FileUploader;

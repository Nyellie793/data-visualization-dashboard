import { useState } from "react";
import Papa from "papaparse";

import DataPreview from "./DataPreview";
import ChartGenerator from "../charts/ChartGenerator";
import type { CsvRow } from "../../types/csv";

const FileUploader = () => {
  const [fileName, setFileName] = useState("");
  const [data, setData] = useState<CsvRow[]>([]);
  const [chartType, setChartType] = useState("bar");

  const [xKey, setXKey] = useState("");
  const [yKey, setYKey] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = results.data;
        setData(parsed);

        const keys = Object.keys(parsed[0] || {});
        setXKey(keys[0]);
        setYKey(keys[1]);
      },
    });
  };

  return (
    <div className="space-y-8">

      {/* Upload */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <span className="text-2xl font-semibold mb-6">Upload Dataset</span>

        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
        />

        {fileName && (
          <p className="mt-4 text-green-600 font-semibold">
            {fileName}
          </p>
        )}
      </div>

      {/* Data Preview */}
      {data.length > 0 && (
        <>
          <DataPreview data={data} />

          {/* Column Selectors */}
          <div className="bg-white p-6 rounded-xl shadow-md space-y-4">

            <h2 className="text-xl font-semibold">
              Choose Columns
            </h2>

            <div className="flex gap-4">
              <select
                value={xKey}
                onChange={(e) => setXKey(e.target.value)}
                className="border p-2 rounded"
              >
                {Object.keys(data[0]).map((key) => (
                  <option key={key}>{key}</option>
                ))}
              </select>

              <select
                value={yKey}
                onChange={(e) => setYKey(e.target.value)}
                className="border p-2 rounded"
              >
                {Object.keys(data[0]).map((key) => (
                  <option key={key}>{key}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Chart Type */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              Select Chart Type
            </h2>

            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="border rounded-lg p-3"
            >
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
              <option value="pie">Pie Chart</option>
              <option value="doughnut">Doughnut Chart</option>
            </select>
          </div>

          {/* Chart */}
          <ChartGenerator
            data={data}
            chartType={chartType}
            xKey={xKey}
            yKey={yKey}
          />
        </>
      )}
    </div>
  );
};

export default FileUploader;
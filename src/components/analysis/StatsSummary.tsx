import type { CsvRow } from "../../types/csv";
import { computeColumnStats } from "../../utils/dataAnalysis";

type Props = {
  data: CsvRow[];
  numericKeys: string[];
};

const formatNumber = (n: number) =>
  Number.isInteger(n) ? n.toLocaleString() : n.toFixed(2);

const StatsSummary = ({ data, numericKeys }: Props) => {
  if (numericKeys.length === 0) return null;

  const stats = computeColumnStats(data, numericKeys);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-1">Summary Statistics</h2>
      <p className="text-sm text-gray-500 mb-4">
        Computed across all {data.length.toLocaleString()} rows, regardless of
        what's currently charted.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead>
            <tr>
              <th className="border bg-slate-100 p-2 text-left">Column</th>
              <th className="border bg-slate-100 p-2 text-right">Count</th>
              <th className="border bg-slate-100 p-2 text-right">Min</th>
              <th className="border bg-slate-100 p-2 text-right">Max</th>
              <th className="border bg-slate-100 p-2 text-right">Mean</th>
              <th className="border bg-slate-100 p-2 text-right">Sum</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s) => (
              <tr key={s.column}>
                <td className="border p-2 font-medium">{s.column}</td>
                <td className="border p-2 text-right">{s.count.toLocaleString()}</td>
                <td className="border p-2 text-right">{formatNumber(s.min)}</td>
                <td className="border p-2 text-right">{formatNumber(s.max)}</td>
                <td className="border p-2 text-right">{formatNumber(s.mean)}</td>
                <td className="border p-2 text-right">{formatNumber(s.sum)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatsSummary;

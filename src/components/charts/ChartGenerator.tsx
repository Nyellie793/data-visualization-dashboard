import type { CsvRow } from "../../types/csv";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Title,
  } from "chart.js";
  
  import {
    Bar,
    Line,
    Pie,
    Doughnut,
  } from "react-chartjs-2";
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Title
  );
  
  type Props = {
    data: CsvRow[];
    chartType: string;
    xKey: string;
    yKey: string;
  };
  
  const ChartGenerator = ({
    data,
    chartType,
    xKey,
    yKey
  }: Props) => {
    if (!data || data.length === 0) return null;
    
  
    const labels = data.map(
      (item) => String(item[xKey])
    );
  
    const values = data.map((item) => {
        const val = Number(item[yKey]);
        return isNaN(val) ? 0 : val;
    });
  
    const chartData = {
      labels,
      datasets: [
        {
          label: yKey,
          data: values,
  
          backgroundColor: [
            "#3B82F6",
            "#10B981",
            "#F59E0B",
            "#EF4444",
            "#8B5CF6",
            "#06B6D4",
            "#EC4899",
            "#84CC16",
          ],
  
          borderColor: [
            "#2563EB",
            "#059669",
            "#D97706",
            "#DC2626",
            "#7C3AED",
            "#0891B2",
            "#DB2777",
            "#65A30D",
          ],
  
          borderWidth: 2,
  
          hoverBackgroundColor: [
            "#60A5FA",
            "#34D399",
            "#FBBF24",
            "#F87171",
            "#A78BFA",
            "#22D3EE",
            "#F472B6",
            "#A3E635",
          ],
  
          hoverBorderWidth: 4,
  
          tension: 0.4,
  
          fill: chartType === "line",
        },
      ],
    };
  
    const options = {
      responsive: true,
  
      plugins: {
        legend: {
          position: "top" as const,
        },
  
        title: {
          display: true,
          text:  `Smart Data Visualization: ${yKey} vs ${xKey}`,
          font: {
            size: 22,
          },
        },
      },
  
      animation: {
        duration: 2000,
      },
    };
  
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
  
        <h2 className="text-2xl font-bold mb-6">
          Generated Chart
        </h2>
  
        {chartType === "bar" && (
          <Bar
            data={chartData}
            options={options}
          />
        )}
  
        {chartType === "line" && (
          <Line
            data={chartData}
            options={options}
          />
        )}
  
        {chartType === "pie" && (
          <Pie
            data={chartData}
            options={options}
          />
        )}
  
        {chartType === "doughnut" && (
          <Doughnut
            data={chartData}
            options={{
              ...options,
              cutout: "65%",
            }}
          />
        )}
  
      </div>
    );
  };
  
  export default ChartGenerator;
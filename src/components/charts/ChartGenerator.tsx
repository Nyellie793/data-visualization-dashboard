import type { CsvRow } from "../../types/csv";
import type { ChartData, ChartOptions } from "chart.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  BarController,
  LineController,
  PieController,
  DoughnutController,
  RadarController,
  PolarAreaController,
  ScatterController,
  BubbleController,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

import BarChart from "./BarChart";
import LineChart from "./LineChart";
import PieChart from "./PieChart";
import RadarChart from "./RadarChart";
import PolarAreaChart from "./PolarAreaChart";
import ScatterChart from "./ScatterChart";
import BubbleChart from "./BubbleChart";

import {
  buildCategoricalChartData,
  buildProportionChartData,
  buildScatterChartData,
  buildBubbleChartData,
  buildChartOptions,
  CHART_FAMILY,
} from "../../utils/ChartHelper";
import type { SupportedChartType } from "../../utils/ChartHelper";

// Registering elements (BarElement, ArcElement...) without their matching
// controllers (BarController, PieController...) makes Chart.js throw
// `"<type>" is not a registered controller` the moment it tries to render —
// every chart type used here needs both registered.
ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  BarController,
  LineController,
  PieController,
  DoughnutController,
  RadarController,
  PolarAreaController,
  ScatterController,
  BubbleController,
  Tooltip,
  Legend,
  Title
);

type Props = {
  data: CsvRow[];
  chartType: SupportedChartType;
  xKey: string;
  yKeys: string[];
  labelKey: string;
  valueKey: string;
  bubbleYKey: string;
  bubbleRKey: string;
};

const ChartGenerator = ({
  data,
  chartType,
  xKey,
  yKeys,
  labelKey,
  valueKey,
  bubbleYKey,
  bubbleRKey,
}: Props) => {
  if (!data || data.length === 0) return null;

  const family = CHART_FAMILY[chartType];

  const renderChart = () => {
    if (family === "categorical") {
      if (yKeys.length === 0) {
        return (
          <p className="text-gray-500">
            Select at least one numeric column to plot.
          </p>
        );
      }

      const type = chartType as "bar" | "line" | "radar";
      const chartData = buildCategoricalChartData(data, xKey, yKeys, type);
      const options = buildChartOptions({
        title: `${yKeys.join(", ")} by ${xKey}`,
      });

      if (type === "bar") {
        return (
          <BarChart
            data={chartData as ChartData<"bar">}
            options={options as ChartOptions<"bar">}
          />
        );
      }
      if (type === "line") {
        return (
          <LineChart
            data={chartData as ChartData<"line">}
            options={options as ChartOptions<"line">}
          />
        );
      }
      return (
        <RadarChart
          data={chartData as ChartData<"radar">}
          options={options as ChartOptions<"radar">}
        />
      );
    }

    if (family === "proportion") {
      const chartData = buildProportionChartData(data, labelKey, valueKey);
      const options = buildChartOptions({
        title: `${valueKey} by ${labelKey}`,
      });

      if (chartType === "pie") {
        return (
          <PieChart
            data={chartData as ChartData<"pie">}
            options={options as ChartOptions<"pie">}
          />
        );
      }
      if (chartType === "doughnut") {
        return (
          <PieChart
            data={chartData as ChartData<"pie">}
            options={options as ChartOptions<"pie">}
            doughnut
          />
        );
      }
      return (
        <PolarAreaChart
          data={chartData as ChartData<"polarArea">}
          options={options as ChartOptions<"polarArea">}
        />
      );
    }

    if (family === "xy") {
      if (yKeys.length === 0) {
        return (
          <p className="text-gray-500">
            Select at least one numeric Y column to plot against X.
          </p>
        );
      }

      const chartData = buildScatterChartData(data, xKey, yKeys);
      const options = buildChartOptions({
        title: `${yKeys.join(", ")} vs ${xKey}`,
        xLabel: xKey,
        yLabel: yKeys.join(", "),
        linearAxes: true,
      });

      return (
        <ScatterChart
          data={chartData}
          options={options as ChartOptions<"scatter">}
        />
      );
    }

    // bubble
    const chartData = buildBubbleChartData(data, xKey, bubbleYKey, bubbleRKey);
    const options = buildChartOptions({
      title: `${bubbleYKey} vs ${xKey} (size: ${bubbleRKey})`,
      xLabel: xKey,
      yLabel: bubbleYKey,
      linearAxes: true,
    });

    return (
      <BubbleChart
        data={chartData}
        options={options as ChartOptions<"bubble">}
      />
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold mb-6">Generated Chart</h2>
      <div className="h-[500px]">{renderChart()}</div>
    </div>
  );
};

export default ChartGenerator;

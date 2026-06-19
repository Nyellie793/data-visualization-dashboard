import { Bar } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";

type Props = {
  data: ChartData<"bar">;
  options: ChartOptions<"bar">;
};

const BarChart = ({ data, options }: Props) => {
  return <Bar data={data} options={options} />;
};

export default BarChart;

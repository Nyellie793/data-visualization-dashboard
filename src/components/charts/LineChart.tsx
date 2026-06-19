import { Line } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";

type Props = {
  data: ChartData<"line">;
  options: ChartOptions<"line">;
};

const LineChart = ({ data, options }: Props) => {
  return <Line data={data} options={options} />;
};

export default LineChart;

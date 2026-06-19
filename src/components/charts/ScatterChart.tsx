import { Scatter } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";

type Props = {
  data: ChartData<"scatter">;
  options: ChartOptions<"scatter">;
};

const ScatterChart = ({ data, options }: Props) => {
  return <Scatter data={data} options={options} />;
};

export default ScatterChart;

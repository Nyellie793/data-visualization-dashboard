import { Radar } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";

type Props = {
  data: ChartData<"radar">;
  options: ChartOptions<"radar">;
};

const RadarChart = ({ data, options }: Props) => {
  return <Radar data={data} options={options} />;
};

export default RadarChart;

import { PolarArea } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";

type Props = {
  data: ChartData<"polarArea">;
  options: ChartOptions<"polarArea">;
};

const PolarAreaChart = ({ data, options }: Props) => {
  return <PolarArea data={data} options={options} />;
};

export default PolarAreaChart;

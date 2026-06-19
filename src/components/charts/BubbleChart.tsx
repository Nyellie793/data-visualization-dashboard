import { Bubble } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";

type Props = {
  data: ChartData<"bubble">;
  options: ChartOptions<"bubble">;
};

const BubbleChart = ({ data, options }: Props) => {
  return <Bubble data={data} options={options} />;
};

export default BubbleChart;

import { Pie, Doughnut } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";

type Props = {
  data: ChartData<"pie">;
  options: ChartOptions<"pie">;
  doughnut?: boolean;
};

const PieChart = ({ data, options, doughnut = false }: Props) => {
  if (doughnut) {
    return (
      <Doughnut
        data={data as unknown as ChartData<"doughnut">}
        options={{ ...options, cutout: "65%" } as ChartOptions<"doughnut">}
      />
    );
  }

  return <Pie data={data} options={options} />;
};

export default PieChart;

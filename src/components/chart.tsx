import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Chart = ({
  data,
  dateRange,
  lineColor = "rgba(75, 192, 192, 1)",
  backgroundColor = "rgba(75, 192, 192, 0.2)",
}: {
  data: { created_at: string; totalCost: number }[];
  dateRange?: { from: Date; to: Date };
  lineColor?: string;
  backgroundColor?: string;
}) => {
  const filteredData = dateRange
    ? data.filter((item) => {
        const itemDate = new Date(item.created_at);
        return (
          (!dateRange.from || itemDate >= dateRange.from) &&
          (!dateRange.to || itemDate <= dateRange.to)
        );
      })
    : data;

  const chartData = {
    labels: filteredData.map((item) => item.created_at),
    datasets: [
      {
        label: "Total Cost",
        data: filteredData.map((item) => item.totalCost),
        borderColor: lineColor,
        backgroundColor: backgroundColor,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
    },
    scales: {
      x: {
        type: "category" as const,
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        type: "linear" as const,
        title: {
          display: true,
          text: "Cost",
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default Chart;

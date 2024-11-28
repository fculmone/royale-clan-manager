import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { fakePlayerData } from "./fakePlayerData.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function WarBattleGraph({
  graphData,
  playerIndex,
}: {
  graphData: any[];
  playerIndex: number;
}) {
  const options = {
    indexAxis: "y" as const,
    maintainAspectRaio: true,
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    scales: {
      x: {
        max: 3600,
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
        onClick: (e) => e.native.stopPropagation(),
      },
      title: {
        display: true,
        text: `${graphData[playerIndex]["Name"]}'s War History`,
      },
    },
  };

  const labels = graphData[playerIndex]["War Weeks"];

  const data = {
    labels,
    datasets: [
      {
        label: "War Points",
        data: graphData[playerIndex]["War Points"],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return <Bar width={1080} height={1080} options={options} data={data} />;
}

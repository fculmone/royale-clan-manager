import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function WarHistoryLineGraph({ graphData }: { graphData: any[] }) {
  try {
    const options = {
      responsive: true,
      maintainAspectRaio: true,
      plugins: {
        legend: {
          position: "top" as const,
        },
        title: {
          display: true,
          text: "Clan War Fame History",
        },
      },
    };

    const labels = graphData[3];

    let main_clans_data = {
      label: graphData[1][1],
      data: graphData[1][0],
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    };

    let other_clans_data: any[] = [];
    let colors = ["blue", "green", "orange", "purple"];

    graphData[2].forEach((clan, index) => {
      let curr_data = {
        label: clan[1],
        data: clan[0],
        borderColor: colors[index],
      };
      other_clans_data.push(curr_data);
    });

    const data = {
      labels,
      datasets: [main_clans_data, ...other_clans_data],
    };

    return <Line width={1080} height={1080} options={options} data={data} />;
  } catch (err) {
    return <></>;
  }
}

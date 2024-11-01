import { Line } from "react-chartjs-2";
import {
    CategoryScale,
    ChartData,
    Chart as ChartJS,
    ChartOptions,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from "chart.js"

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

interface IProps {
    data: ChartData<'line'>,
    label: string,
    text: string
}

const LineChart = ({ data, label, text }: IProps) => {
    const options: ChartOptions<'line'> = {
        plugins: {
            title: {
                display: true,
                text: label,
                font: {
                    size: 18,
                },
                padding: {
                    top: 10,
                    bottom: 20
                }
            },
            legend: {
                display: true,
                position: 'top'
            }
        },
        layout: {
            padding: 10,
        },
        responsive: true,
        scales: {
            y: {
                title: {
                    display: true,
                    text: text
                }
            }
        }
    };
    return (
        <Line options={options} data={data}></Line>
    )
}

export default LineChart
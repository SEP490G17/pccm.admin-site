import { Bar } from "react-chartjs-2";
import {
    CategoryScale,
    ChartData,
    Chart as ChartJS,
    ChartOptions,
    Legend,
    LinearScale,
    BarElement,
    Title,
    Tooltip
} from "chart.js"

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)

interface IProps {
    data: ChartData<'bar'>,
    label: string,
    text: string
}

const BarChart = ({ data, label, text }: IProps) => {
    const options: ChartOptions<'bar'> = {
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
        <Bar options={options} data={data}></Bar>
    )
}

export default BarChart
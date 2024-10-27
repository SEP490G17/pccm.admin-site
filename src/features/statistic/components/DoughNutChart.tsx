import { Chart as ChartJS, Tooltip, Legend, ArcElement, ChartData, ChartOptions } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
)

interface IProps {
    data: ChartData<'doughnut'>,
    label: string,
}

const DoughNutChart = ({ data, label }: IProps) => {
    const options: ChartOptions<'doughnut'> = {
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
    };
    return (
        <Doughnut options={options} data={data}></Doughnut>
    )
}

export default DoughNutChart
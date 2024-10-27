import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ChartData } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

interface IProps {
    data: ChartData<'bar' | 'line'>,
    labelLeft: string,
    labelRight: string,
    text: string
}

const MixedChart = ({ data, labelLeft, labelRight, text }: IProps) => {
    const options: ChartOptions<'bar' | 'line'> = {
        scales: {
            y1: {
                type: 'linear',
                position: 'left',
                beginAtZero: true,
                title: {
                    display: true,
                    text: labelLeft,
                },
            },
            y2: {
                type: 'linear',
                position: 'right',
                beginAtZero: true,
                title: {
                    display: true,
                    text: labelRight,
                },
                grid: {
                    drawOnChartArea: false,
                },
            },
            x: {
                title: {
                    display: true,
                    text: text,
                },
            },
        },
    };

    return <Chart type="bar" data={data} options={options} />;
};

export default MixedChart;

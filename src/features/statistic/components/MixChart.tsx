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
                suggestedMax: Math.max(...data.datasets[0].data.filter(item => typeof item === 'number')) * 1.3,
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
                suggestedMax: Math.max(...data.datasets[1].data.filter(item => typeof item === 'number')) * 1.3,
            },
            x: {
                title: {
                    display: true,
                    text: text,
                },
            },
        },
    };
    


    return <Chart height={'170%'} type="bar" data={data} options={options} />;
};

export default MixedChart;

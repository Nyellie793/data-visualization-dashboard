import { Line } from 'react-chartjs-2';
import { useState } from 'react';
import { evaluate } from 'mathjs';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const FunctionChart = () => {
    const [expression, setExpression] = useState('x^2');

    const generateChartData = () => {
        const labels: number[] = [];
        const values: number[] = [];

        for (let x = -10; x <= 10; x++) {
            labels.push(x);
            try{
                const y = evaluate(expression, { x });

                if (typeof y == "number" && isFinite(y)) {
                    values.push(y);
                }else {
                    values.push(NaN);
                }
            } catch {
                values.push(NaN);
            }
        }

        return {
            labels,
            datasets: [
                {
                    label: `y = ${expression}`,
                    data: values,
                    borderWidth: 3,
                        tension: 0.4
                },
            ],
        };
    };
    
    const options ={
        responsive: true,
        maintainAspectRatio: false,
        plugins : {
            legend: {
                display: true,
            },
            title : {
                display: true,
                text: "Function Plot",
            },  
        },
    };

    return (
        <div className='max-w-5xl max-auto p-6'>
            <div className='bg-white rounded-xl shadow-lg p-6'>
                <h2 className='text-2xl font-bold mb-4'>
                    Mathematical Function Plotter
                </h2>

                <input 
                  type='text'
                  value={expression}
                  onChange={(e) => setExpression(e.target.value)}
                  placeholder='Enter a function e.g x^2'
                  className='w-full border rounded-lg p-3 mb-6'
                />

                <div className='h-[500px]'>
                    <Line 
                      data={generateChartData()}
                      options={options}
                    />
                </div>

                <div className='mt-6'>
                    <h3 className='font-semibold mb-2'>
                        Sample Functions 
                    </h3>

                    <ul className='space-y-1 text-gray-600'>
                        <li>x^2</li>
                        <li>x^3</li>
                        <li>sin(x)</li>
                        <li>cos(x)</li>
                        <li>tan(x)</li>
                        <li>2*x + 5</li>
                        <li>sqrt(x + 10)</li>
                        <li>log(x + 11)</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default FunctionChart;
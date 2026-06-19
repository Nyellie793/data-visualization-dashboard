import { Line } from 'react-chartjs-2';
import { useState } from 'react';
import { evaluate } from 'mathjs';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    LineController,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    LineController,
    Title,
    Tooltip,
    Legend
);

const LINE_COLORS = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6"];

type PlottedFunction = {
    id: number;
    expression: string;
};

let nextId = 2;

const FunctionChart = () => {
    const [functions, setFunctions] = useState<PlottedFunction[]>([
        { id: 1, expression: 'x^2' },
    ]);
    const [rangeMin, setRangeMin] = useState(-10);
    const [rangeMax, setRangeMax] = useState(10);
    const [step, setStep] = useState(0.25);

    const updateExpression = (id: number, expression: string) => {
        setFunctions((prev) =>
            prev.map((fn) => (fn.id === id ? { ...fn, expression } : fn))
        );
    };

    const addFunction = () => {
        setFunctions((prev) => [...prev, { id: nextId++, expression: 'x' }]);
    };

    const removeFunction = (id: number) => {
        setFunctions((prev) => prev.filter((fn) => fn.id !== id));
    };

    const generateChartData = () => {
        const labels: number[] = [];

        const safeStep = step > 0 ? step : 0.25;
        for (let x = rangeMin; x <= rangeMax; x += safeStep) {
            labels.push(Math.round(x * 1000) / 1000);
        }

        const datasets = functions.map((fn, index) => {
            const values = labels.map((x) => {
                try {
                    const y = evaluate(fn.expression, { x });
                    return typeof y === 'number' && isFinite(y) ? y : NaN;
                } catch {
                    return NaN;
                }
            });

            return {
                label: `y = ${fn.expression || '?'}`,
                data: values,
                borderColor: LINE_COLORS[index % LINE_COLORS.length],
                backgroundColor: LINE_COLORS[index % LINE_COLORS.length],
                borderWidth: 3,
                tension: 0.4,
                pointRadius: 0,
            };
        });

        return { labels, datasets };
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
            },
            title: {
                display: true,
                text: 'Function Plot',
            },
        },
        scales: {
            x: {
                ticks: {
                    maxTicksLimit: 20,
                },
            },
        },
    };

    return (
        <div className='max-w-5xl mx-auto p-6'>
            <div className='bg-white rounded-xl shadow-lg p-6'>
                <h2 className='text-2xl font-bold mb-4'>
                    Mathematical Function Plotter
                </h2>

                <div className='space-y-3 mb-4'>
                    {functions.map((fn) => (
                        <div key={fn.id} className='flex gap-2 items-center'>
                            <input
                                type='text'
                                value={fn.expression}
                                onChange={(e) => updateExpression(fn.id, e.target.value)}
                                placeholder='Enter a function e.g x^2'
                                className='w-full border rounded-lg p-3'
                            />
                            {functions.length > 1 && (
                                <button
                                    type='button'
                                    onClick={() => removeFunction(fn.id)}
                                    className='shrink-0 px-3 py-2 rounded-lg border text-red-600 hover:bg-red-50'
                                    aria-label='Remove function'
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}

                    <button
                        type='button'
                        onClick={addFunction}
                        className='text-blue-600 hover:underline text-sm font-medium'
                    >
                        + Add another function
                    </button>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6'>
                    <label className='flex flex-col text-sm text-gray-600'>
                        X min
                        <input
                            type='number'
                            value={rangeMin}
                            onChange={(e) => setRangeMin(Number(e.target.value))}
                            className='border rounded-lg p-2 mt-1'
                        />
                    </label>

                    <label className='flex flex-col text-sm text-gray-600'>
                        X max
                        <input
                            type='number'
                            value={rangeMax}
                            onChange={(e) => setRangeMax(Number(e.target.value))}
                            className='border rounded-lg p-2 mt-1'
                        />
                    </label>

                    <label className='flex flex-col text-sm text-gray-600'>
                        Step (resolution)
                        <input
                            type='number'
                            min={0.01}
                            step={0.05}
                            value={step}
                            onChange={(e) => setStep(Number(e.target.value))}
                            className='border rounded-lg p-2 mt-1'
                        />
                    </label>
                </div>

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

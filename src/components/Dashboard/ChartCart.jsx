import React, { useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';

// Register all the necessary components of Chart.js
Chart.register(...registerables);

const ChartCard = ({ title = "Chart", chartData }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        const ctx = chartRef.current.getContext("2d");

        // Create a new chart instance
        const chartInstance = new Chart(ctx, {
            type: 'line', // Specify your chart type here (e.g., 'line', 'bar', etc.)
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Month'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Number of Courses'
                        }
                    }
                }
            }
        });

        // Cleanup the chart instance when the component unmounts or when chartData changes
        return () => {
            chartInstance.destroy();
        };
    }, [chartData]);

    return (
        <div className="xl:col-span-2">
            <div className="shadow rounded-lg bg-white dark:bg-default-50">
                <div className="flex items-center justify-between py-4 px-5">
                    <h4 className="text-lg font-semibold text-default-900">{title}</h4>
                </div>
                <div className="px-5 pt-5 border-t border-dashed border-default-200">
                    <div id="earning_report" className="apex-chart">
                        {/* Render the canvas where the chart will be drawn */}
                        <canvas ref={chartRef}></canvas>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChartCard;

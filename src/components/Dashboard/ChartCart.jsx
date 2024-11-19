import React, { useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';

// Register all the necessary components of Chart.js
Chart.register(...registerables);

const ChartCard = ({ title = "Chart", chartData, subTitle = "Number of Courses" }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        const ctx = chartRef.current.getContext("2d");

        const chartInstance = new Chart(ctx, {
            type: 'line', 
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Month',
                            padding: 10, // Add padding to adjust spacing
                            font: {
                                size: 14 // Adjust font size for clarity
                            }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: subTitle,
                            padding: 10,
                            font: {
                                size: 14
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            font: {
                                size: 12 // Adjust legend font size
                            }
                        }
                    }
                }
            }
        });

        return () => {
            chartInstance.destroy();
        };
    }, [chartData, subTitle]);

    return (
        <div className="xl:col-span-2">
            <div className="shadow rounded-lg bg-white dark:bg-default-50">
                <div className="flex items-center justify-between py-4 px-5">
                    <h4 className="text-lg font-semibold text-default-900">{title}</h4>
                </div>
                <div className="px-5 pt-5 border-t border-dashed border-default-200">
                    <div id="earning_report" className="apex-chart" style={{ height: '300px' }}>
                        {/* Ensure the canvas has enough height */}
                        <canvas ref={chartRef}></canvas>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChartCard;

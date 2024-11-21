import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import axiosInstance from '../helper/axios';
import { getUser } from '../helper/auth';
import { useTranslation } from 'react-i18next';

const EvaluationChart = () => {
    const { t, i18n } = useTranslation('pages/evaluationChart');
    const [data, setData] = useState({ labels: [], datasets: [] });
    
    // Check if the language is Arabic to enable RTL
    const isRTL = i18n.language === 'ar';

    useEffect(() => {
        const fetchEvaluations = async () => {
            const id = getUser().userId;
            const response = await axiosInstance.get(`/participants/${id}/evaluations`);
            const evaluations = response.data;

            const labels = evaluations.map(evaluation => `${t('evaluation')} ${evaluation.id}`);
            const scores = evaluations.map(evaluation => evaluation.score);

            setData({
                labels: labels,
                datasets: [
                    {
                        label: t('evaluationScores'),
                        data: scores,
                        fill: true,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',  // Soft green fill
                        borderColor: 'rgba(75, 192, 192, 1)',       // Green border
                        borderWidth: 2,
                        tension: 0.4,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                    }
                ]
            });
        };

        fetchEvaluations();
    }, [t]);

    return (
        <div className={`chart-container bg-white p-6 rounded-lg shadow-md ${isRTL ? 'text-right' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">{t('evaluationScores')}</h2>
            <div className="h-96 w-full">
                <Line
                    data={data}
                options={{
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                color: '#333',
                                font: {
                                    size: 14
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function (tooltipItem) {
                                    return `${t('score')}: ${tooltipItem.raw}`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            beginAtZero: true,
                            grid: {
                                display: false
                            },
                            ticks: {
                                color: '#333'
                            }
                        },
                        y: {
                            beginAtZero: true,
                            grid: {
                                borderDash: [2, 2],
                                color: 'rgba(0, 0, 0, 0.1)',
                            },
                            ticks: {
                                color: '#333'
                            },
                            title: {
                                display: true,
                                text: t('Suivi des Evaluations'), // Assuming 'yAxisSubtitle' is a key in your translations
                                color: '#333',
                                font: {
                                    size: 14,
                                    weight: 'bold'
                                }
                            }
                        }
                    },
                    animation: {
                        duration: 1500,
                        easing: 'easeOutQuart',
                    }
                }}

                />
            </div>
        </div>
    );
};

export default EvaluationChart;

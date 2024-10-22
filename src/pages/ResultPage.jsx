import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../helper/axios';
import { toast } from 'react-toastify';
import { getUser } from '../helper/auth';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useTranslation } from 'react-i18next'; // Importing useTranslation

const QuizResultPage = () => {
    const { quizId } = useParams();
    const [result, setResult] = useState(null);
    const userId = getUser().userId;
    const { t } = useTranslation('pages/quizResult'); // Initialize useTranslation

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const response = await axiosInstance.get(`/quizzes/${quizId}/result`, {
                    params: { participantId: userId }
                });
                setResult(response.data);
            } catch (error) {
                toast.error(t("error.loadingResult")); // Use translation for error message
            }
        };

        fetchResult();
    }, [quizId, userId, t]);

    if (!result) return <div>{t("loading")}</div>; // Use translation for loading message

    const correctResponses = Math.floor(result.responseIds.length * (result.score / 100));
    const scorePercentage = result.score;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">{t("quizResult.title")}</h1>

            <div className="flex justify-center items-center mb-6">
                <div className="w-48 h-48">
                    <CircularProgressbar
                        value={scorePercentage}
                        text={`${Math.round(scorePercentage)}%`}
                        styles={buildStyles({
                            textSize: '20px',
                            pathColor: `rgba(62, 152, 199, ${scorePercentage / 100})`,
                            textColor: '#4a4a4a',
                            trailColor: '#d6d6d6',
                        })}
                    />
                </div>
            </div>

            <div className="text-center">
                <p className="text-2xl font-semibold text-gray-800">{t("quizResult.correctResponses")}: {correctResponses}</p>
                <p className="text-xl text-gray-600 mt-2">{t("quizResult.score")}: {scorePercentage}%</p>
            </div>
        </div>
    );
};

export default QuizResultPage;

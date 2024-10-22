import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../helper/axios';
import { Navigate, useParams } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaQuestionCircle, FaClock } from 'react-icons/fa';
import ProgressBar from '../components/ProgressBar';
import { getUser } from '../helper/auth';

const QuestionAnswersPage = ({ path }) => {
  const { t, i18n } = useTranslation('pages/questionsAnswers'); // useTranslation hook from react-i18next
  const { evaluationId } = useParams();
  const [evaluation, setEvaluation] = useState(null);
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [entreprise, setEntreprise] = useState(null);
  const [entrepriseLoading, setEntrepriseLoading] = useState(true);
  const responsableId = getUser().userId;

  useEffect(() => {
    const fetchEntreprise = async () => {
      try {
        const response = await axiosInstance.get(`${path}/${responsableId}/entreprise`);
        setEntreprise(response.data);
      } catch (error) {
        console.error('Error fetching entreprise data:', error);
      } finally {
        setEntrepriseLoading(false);
      }
    };

    const fetchEvaluation = async (evaluationId) => {
      try {
        const response = await axiosInstance.get(`/evaluations/${evaluationId}`);
        setEvaluation(response.data);
        return response.data.responseIds;
      } catch (error) {
        console.error('Error fetching evaluation:', error);
        return [];
      }
    };

    const fetchQuestionAndAnswers = async (responseIds) => {
      const fetchQuestionAndAnswersForId = async (responseId) => {
        try {
          const response = await axiosInstance.get(`/responses/${responseId}`);
          const questionId = response.data.questionId;
          const optionIds = response.data.optionId;

          const questionResponse = await axiosInstance.get(`/questions/${questionId}`);
          const question = questionResponse.data;

          const optionPromises = optionIds.map((optionId) =>
            axiosInstance.get(`/options/${optionId}`).then((res) => res.data)
          );
          const options = await Promise.all(optionPromises);

          const answers = options.map((option) => ({
            text: option.optionText,
            isCorrect: option.isCorrect,
          }));

          return {
            question: question.text,
            answers,
          };
        } catch (error) {
          console.error('Error fetching question or answers:', error);
          return null;
        }
      };

      const qaPromises = responseIds.map((responseId) => fetchQuestionAndAnswersForId(responseId));
      const allQuestionsAndAnswers = await Promise.all(qaPromises);
      const validQA = allQuestionsAndAnswers.filter((qa) => qa !== null);
      setQuestionsAndAnswers(validQA);
    };

    const loadEvaluationAndQA = async () => {
      const responseIds = await fetchEvaluation(evaluationId);
      if (responseIds && responseIds.length > 0) {
        await fetchQuestionAndAnswers(responseIds);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    loadEvaluationAndQA();
    fetchEntreprise();
  }, [evaluationId, path, responsableId]);

  if (loading || entrepriseLoading) {
    return (
      <div className="container mx-auto p-6 min-h-screen bg-gray-50">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">{t('questions_answers.title')}</h1>
        <p className="text-center text-gray-600">{t('loading')}</p>
      </div>
    );
  }

  if (entreprise && !entreprise.showQuizCorrection) {
    return <Navigate to="/unauthorized" />;
  }

  const isRTL = i18n.language === 'ar'; // Check if the language is Arabic for RTL

  return (
    <div className={`container mx-auto p-6 min-h-screen bg-gray-50 ${isRTL ? 'text-right' : ''}`}>
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">{t('questions_answers.title')}</h1>

      {evaluation && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700">{t('evaluation_summary')}</h2>
          <div className="flex justify-between items-center">
            <p className="text-lg">
              <strong>{t('type')}:</strong> {evaluation.type}
            </p>
            <p className="text-lg flex items-center">
              <FaClock className="mr-2 text-gray-600" />
              <strong>{t('time_taken')}:</strong> {evaluation.timeTaken}s
            </p>
          </div>
          <ProgressBar score={evaluation.score} />
        </div>
      )}

      {questionsAndAnswers.length > 0 ? (
        <div className="space-y-6">
          {questionsAndAnswers.map((qa, index) => (
            <div key={index} className={`bg-white p-5 rounded-lg shadow-lg ${isRTL ? 'text-right' : ''}`}>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 flex items-center">
                <FaQuestionCircle className="mr-2 text-blue-500" />
                {qa.question}
              </h3>
              <div className="mb-3">
                <strong className="text-lg">{t('answers')}:</strong>
                <ul className="mt-2 space-y-2">
                  {qa.answers.map((answer, idx) => (
                    <li key={idx} className="flex items-center">
                      {answer.isCorrect ? (
                        <FaCheckCircle className="mr-2 text-green-600" />
                      ) : (
                        <FaTimesCircle className="mr-2 text-red-600" />
                      )}
                      <span className={`text-lg ${answer.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {answer.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="flex items-center">
                {qa.answers.every((ans) => ans.isCorrect) ? (
                  <FaCheckCircle className="mr-2 text-green-600" />
                ) : (
                  <FaTimesCircle className="mr-2 text-red-600" />
                )}
                {qa.answers.every((ans) => ans.isCorrect) ? t('all_correct') : t('some_incorrect')}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">{t('no_questions')}</p>
      )}
    </div>
  );
};

export default QuestionAnswersPage;


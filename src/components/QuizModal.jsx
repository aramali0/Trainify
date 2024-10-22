import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const QuizModal = ({ isOpen, onClose, quizzes, sectionId,nom }) => {
    if (!isOpen) return null;


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-lg">
                <h2 className="text-2xl font-semibold mb-4">Quizzes in this Section</h2>
                {quizzes.length > 0 ? (
                    <ul>
                        {quizzes.map(quiz => (
                            <li key={quiz.id} className="mb-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg">{quiz.title} - {quiz.type}</span>
                                    <Link
                                        to={nom === "/participant" ? `/participant/quizes/${quiz.id}/start-quiz` : `${nom}/sections/${sectionId}/quiz/${quiz.id}`}
                                        className="text-blue-500 hover:underline"
                                    >
                                        Go to Quiz
                                    </Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No quizzes available for this section.</p>
                )}
                <button onClick={onClose} className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                    Close
                </button>
            </div>
        </div>
    );
};

export default QuizModal;

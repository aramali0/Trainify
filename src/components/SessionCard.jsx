// src/components/SessionCard.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import axiosInstance from '../helper/axios';
import { useTranslation } from 'react-i18next';

const SessionCard = ({ session, nom }) => {
    const [sections, setSections] = useState([]);
    const [showAllSections, setShowAllSections] = useState(false);
    const { t } = useTranslation('pages/sessionCard'); // Specify the namespace

    const fetchSections = async () => {
        try {
            const response = await axiosInstance.get(`/sessions/${session.id}/sections`);
            setSections(response.data);
        } catch (error) {
            console.error("Error fetching sections:", error);
            // Optionally, add a toast notification
        }
    };

    useEffect(() => {
        fetchSections();
    }, [session.id]);

    const formattedDate = format(new Date(session.sessionDate), 'MMMM d, yyyy');
    const formattedStartDate = format(new Date(session.startDate), 'MMMM d, yyyy');
    const formattedEndDate = format(new Date(session.endDate), 'MMMM d, yyyy');

    // Limit the number of sections displayed at once
    const displayedSections = showAllSections ? sections : sections.slice(0, 3);

    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col border border-gray-200">
            <div className="bg-gray-800 h-[6rem] max-h-[6rem] text-white p-4">
                <h2 className="text-xl h-[5rem] max-h-[5rem] text-white font-bold truncate">{session.name}</h2>
                <p className="text-sm text-gray-300">{session.courseTitle}</p>
            </div>
            <div className="p-4 flex-grow">
                <div className="mb-3">
                    <p className="text-gray-700 text-sm">
                        <strong>{t('labels.sessionDate')}:</strong> {formattedDate}
                    </p>
                    <p className="text-gray-700 text-sm">
                        <strong>{t('labels.startDate')}:</strong> {formattedStartDate}
                    </p>
                    <p className="text-gray-700 text-sm">
                        <strong>{t('labels.endDate')}:</strong> {formattedEndDate}
                    </p>
                    <p className="text-gray-700 text-sm">
                        <strong>{t('labels.duration')}:</strong> {session.duree} {t('labels.minutes')}
                    </p>
                </div>
                <div className="mb-3">
                    <p className="text-gray-700 text-sm"><strong>{t('labels.sections')}:</strong></p>
                    {sections.length > 0 ? (
                        <div className="flex flex-wrap">
                            {displayedSections.map((section) => (
                                <span key={section.id} className="inline-block ml-2 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full px-2 py-1 mr-2 mb-2">
                                    <Link to={`${nom}/sections/${session.id}`}>{section.title}</Link>
                                </span>
                            ))}
                            {sections.length > 3 && (
                                <button
                                    onClick={() => setShowAllSections(!showAllSections)}
                                    className="text-blue-600 text-xs ml-2 mt-2 hover:text-blue-800 font-semibold"
                                >
                                    {showAllSections ? t('buttons.showLess') : `+${sections.length - 3} ${t('buttons.more')}`}
                                </button>
                            )}
                        </div>
                    ) : (
                        <span className="ml-4 mt-1 text-gray-500 text-xs">{t('messages.noSectionsAvailable')}</span>
                    )}
                </div>
            </div>
            <div className="bg-gray-100 p-4 flex justify-end space-x-4">
                {(nom === "/responsable" || nom === "/charge-formation") && (
                    <Link to={`${nom}/sessions/edit/${session.id}`} className="text-blue-600 hover:text-blue-800 font-semibold">
                        {t('buttons.editSession')}
                    </Link>
                )}
                {nom === "/formateur" && (
                    <Link to={`/formateur/sessions/${session.id}/create-conference`} className="text-blue-600 hover:text-blue-800 font-semibold">
                        {t('buttons.createConference')}
                    </Link>
                )}
                {nom === "/participant" && (
                    <Link to={`/participant/sessions/${session.id}/conference`} className="text-blue-600 hover:text-blue-800 font-semibold">
                        {t('buttons.joinConference')}
                    </Link>
                )}
            </div>
        </div>
    );
};

export default SessionCard;

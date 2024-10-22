import React from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const Table = ({ data }) => {
    const { t, i18n } = useTranslation('pages/tableClasses'); // Initialize translation hook

    // Check if the current language is Arabic for RTL support
    const isRtl = i18n.language === 'ar';

    return (
        <div className={`border-t border-dashed border-default-200 ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className="relative overflow-x-auto">
                <table className="min-w-full overflow-x-hidden">
                    <thead className="border-b border-dashed border-default-200">
                        <tr>
                            <th className="px-6 py-3 text-start text-sm capitalize font-semibold text-default-900 min-w-16">
                                {t('table.no')}
                            </th>
                            <th className="px-6 py-3 text-start text-sm capitalize font-semibold text-default-900 min-w-40">
                                {t('table.title')}
                            </th>
                            <th className="px-6 py-3 text-start text-sm capitalize font-semibold text-default-900 min-w-20">
                                {t('table.numberOfParticipants')}
                            </th>
                            <th className="px-6 py-3 text-start text-sm capitalize font-semibold text-default-900 min-w-20">
                                {t('table.numberOfCourses')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-dashed divide-default-200">
                        {data.map((item, index) => (
                            <tr key={item.id}>
                                <td className="px-6 py-3 text-default-600 font-semibold whitespace-nowrap">
                                    <b>{index + 1}</b>
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap">
                                    <h6 className="text-sm font-semibold text-default-700">
                                        {item.titre}
                                    </h6>
                                </td>
                                <td className="px-6 py-3 text-default-600 font-medium whitespace-nowrap">
                                    {item.participantIds.length}
                                </td>
                                <td className="px-6 py-3 text-default-600 font-medium whitespace-nowrap">
                                    {item.courIds.length}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;

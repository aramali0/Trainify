import React, { useEffect, useState } from 'react';
import { Table, Tag, message, Spin } from 'antd';
import axiosInstance from '../helper/axios';
import { useTranslation } from 'react-i18next';

const AdminFeedbackView = () => {
    const { t } = useTranslation('pages/adminFeedbackView');
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch formateur information by ID
    const getFormateur = async (id) => {
        try {
            const response = await axiosInstance.get(`/users/${id}`);
            return response.data;
        } catch (error) {
            message.error(t('adminFeedbackView.formateurLoadError'));
            return null;
        }
    };

    useEffect(() => {
        const fetchFeedbacks = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get('/feedback');
                const feedbacksData = Array.isArray(response.data) ? response.data : [];

                const feedbacksWithFormateur = await Promise.all(feedbacksData.map(async (feedback) => {
                    const formateur = await getFormateur(feedback.formateurId);
                    return {
                        ...feedback,
                        formateur: formateur ? `${formateur.firstName} ${formateur.lastName}` : 'Unknown',
                    };
                }));

                setFeedbacks(feedbacksWithFormateur);
            } catch (error) {
                message.error(t('adminFeedbackView.loadingError'));
            } finally {
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, []);

    const columns = [
        {
            title: t('adminFeedbackView.organization'),
            dataIndex: 'organization',
            key: 'organization',
            responsive: ['lg'],
        },
        {
            title: t('adminFeedbackView.formateur'),
            dataIndex: 'formateur',
            key: 'formateur',
        },
        {
            title: t('adminFeedbackView.platformExperience'),
            dataIndex: 'platformExperience',
            key: 'platformExperience',
        },
        {
            title: t('adminFeedbackView.satisfactionLevel'),
            dataIndex: 'satisfactionLevel',
            key: 'satisfactionLevel',
            render: (level) => {
                let color = 'green';
                if (level === 'TRES_INSATISFAISANT') color = 'red';
                else if (level === 'INSATISFAISANT') color = 'orange';
                else if (level === 'NEUTRE') color = 'blue';

                return (
                    <Tag color={color} key={level}>
                        {level.replace('_', ' ')}
                    </Tag>
                );
            },
        },
        {
            title: t('adminFeedbackView.remarks'),
            dataIndex: 'remarks',
            key: 'remarks',
        },
    ];

    return (
        <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">
                {t('adminFeedbackView.title')}
            </h2>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                {loading ? (
                    <div className="flex justify-center items-center min-h-[200px]">
                        <Spin size="large" />
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        dataSource={feedbacks}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                        className="table-auto w-full"
                        scroll={{ x: true }}  // Allows horizontal scrolling for larger content
                    />
                )}
            </div>
        </div>
    );
};

export default AdminFeedbackView;

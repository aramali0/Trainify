import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Modal, message } from 'antd';
import axiosInstance from '../helper/axios';
import { getUser } from '../helper/auth';
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook

const { TextArea } = Input;
const { Option } = Select;

const FeedbackForm = () => {
    const { t } = useTranslation('auth/feedback'); // Use translation hook
    const userId = getUser().userId;
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

    useEffect(() => {
        const checkFeedbackStatus = async () => {
            try {
                const response = await axiosInstance.get(`/formateurs/${userId}/feedback-submitted`);
                setFeedbackSubmitted(response.data); // response.data will be true or false
            } catch (error) {
                console.error('Error checking feedback status:', error);
            }
        };

        checkFeedbackStatus();
    }, [userId]);

    useEffect(() => {
        if (!feedbackSubmitted) {
            const timer = setTimeout(() => {
                setIsModalVisible(true); // Show the feedback form
            }, 100 * 60 * 60); // Show modal after 10 seconds for testing

            return () => clearTimeout(timer); // Clean up the timer on unmount
        }
    }, [feedbackSubmitted]);

    const handleSubmit = (values) => {
        axiosInstance.post('/feedback', values)
            .then(() => {
                message.success(t('feedback.successMessage')); // Use translation for success message
                form.resetFields();
                setIsModalVisible(false); // Hide the modal after submission
                setFeedbackSubmitted(true); // Ensure the modal doesn't appear again
            })
            .catch(() => {
                message.error(t('feedback.errorMessage')); // Use translation for error message
            });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <>
            {!feedbackSubmitted && (
                <Modal
                    title={t('feedback.title')} // Use translation for modal title
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                    >
                        <Form.Item
                            label={t('feedback.organization')} // Use translation for label
                            name="organization"
                            rules={[{ required: true, message: t('feedback.organizationPlaceholder') }]}
                        >
                            <Input placeholder={t('feedback.organizationPlaceholder')} /> {/* Use translation for placeholder */}
                        </Form.Item>

                        <Form.Item
                            label={t('feedback.platformExperience')} // Use translation for label
                            name="platformExperience"
                            rules={[{ required: true, message: t('feedback.platformExperiencePlaceholder') }]}
                        >
                            <Input placeholder={t('feedback.platformExperiencePlaceholder}')} /> {/* Use translation for placeholder */}
                        </Form.Item>

                        <Form.Item
                            label={t('feedback.satisfactionLevel')} // Use translation for label
                            name="satisfactionLevel"
                            rules={[{ required: true, message: t('feedback.selectSatisfaction') }]}
                        >
                            <Select placeholder={t('feedback.selectSatisfaction')}> {/* Use translation for placeholder */}
                                <Option value="TRES_SATISFAISANT">{t('feedback.verySatisfied')}</Option> {/* Use translation for option text */}
                                <Option value="SATISFAISANT">{t('feedback.satisfied')}</Option>
                                <Option value="NEUTRE">{t('feedback.neutral')}</Option>
                                <Option value="INSATISFAISANT">{t('feedback.dissatisfied')}</Option>
                                <Option value="TRES_INSATISFAISANT">{t('feedback.veryDissatisfied')}</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label={t('feedback.remarks')} // Use translation for label
                            name="remarks"
                        >
                            <TextArea rows={4} placeholder={t('feedback.additionalCommentsPlaceholder')} /> {/* Use translation for placeholder */}
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                {t('feedback.submitButton')} {/* Use translation for button text */}
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            )}
        </>
    );
};

export default FeedbackForm;

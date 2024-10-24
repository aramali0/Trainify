import React, { useState, useEffect } from 'react';
import axiosInstance from '../helper/axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaIdCard, FaGenderless, FaUser, FaBirthdayCake, FaCalendarAlt, FaEdit } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { Button, Modal, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const ResponsableFormationCard = () => {
    const { entrepriseId } = useParams();
    const { t } = useTranslation('pages/responsables');
    const [responsables, setResponsables] = useState([]);
    const [loadedImages, setLoadedImages] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [selectedResponsable, setSelectedResponsable] = useState(null);
    const [newMaxSize, setNewMaxSize] = useState();

    useEffect(() => {
        const fetchResponsablesFormation = async () => {
            try {
                const response = await axiosInstance.get(`/entreprises/${entrepriseId}/responsable-formation`);
                console.log('Responsables Formation:', response.data);
                setResponsables(response.data);
                const images = await Promise.all(response.data?.map(async (responsable) => {
                    if (responsable.profileImagePath) {
                        const imageResponse = await axiosInstance.get(`${responsable.profileImagePath}`, {
                            responseType: 'blob',
                        });
                        return URL.createObjectURL(imageResponse.data);
                    }
                    return 'https://via.placeholder.com/150';
                }));
                setLoadedImages(images);
            } catch (error) {
                console.error('Error fetching Responsable Formation:', error);
                toast.error(t('messages.loadError'));
            }
        };
        fetchResponsablesFormation();
    }, [entrepriseId, t]);

    const handleModalClose = () => setShowModal(false);
    const handleModalShow = (responsable) => {
        setSelectedResponsable(responsable);
        setShowModal(true);
    };

    const handleMaxSizeUpdate = async () => {
        try {
            const maxSizeInBytes = newMaxSize;
            await axiosInstance.patch(`/responsables/${selectedResponsable.id}/maxSize`, null, {
                params: {
                    maxSize: maxSizeInBytes,
                },
            });
            toast.success(t('messages.maxSizeUpdated'));
            setResponsables((prev) =>
                prev.map((resp) =>
                    resp.id === selectedResponsable.id ? { ...resp, maxSize: maxSizeInBytes } : resp
                )
            );
            handleModalClose();
        } catch (error) {
            if (error.response?.data) {
                toast.error(error.response.data);
            } else {
                console.error('Error updating max size:', error);
                toast.error(t('messages.updateError'));
            }
        }
    };

    if (!responsables.length) {
        return <div>{t('messages.loading')}</div>;
    }

    return (
        <>
            {responsables.map((responsable, index) => (
                <motion.div
                    key={responsable.id}
                    className="shadow-lg rounded-lg bg-gradient-to-br from-blue-50 to-gray-50 p-8 mb-8 transform transition-transform duration-300 hover:scale-105"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center mb-6">
                        <img
                            src={loadedImages[index] || `https://i.pravatar.cc/150?u=${responsable.userId}`}
                            alt={responsable.firstName}
                            className="w-28 h-28 rounded-full border-4 border-blue-200 shadow-md"
                        />
                        <div className="ml-6">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-1">
                                <FaUser className="inline-block text-blue-500 mr-2" />
                                {responsable.firstName} {responsable.lastName}
                            </h2>
                            <p className="text-lg text-blue-600">{t('titles.responsableFormation')}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                        {responsable.num && (
                            <div className="flex items-center">
                                <FaPhone className="text-blue-500 mr-2" />
                                <span>{responsable.num}</span>
                            </div>
                        )}
                        {responsable.email && (
                            <div className="flex items-center">
                                <FaEnvelope className="text-blue-500 mr-2" />
                                <span>{responsable.email}</span>
                            </div>
                        )}
                        {responsable.CIN && (
                            <div className="flex items-center">
                                <FaIdCard className="text-blue-500 mr-2" />
                                <span>{responsable.CIN}</span>
                            </div>
                        )}
                        {responsable.gender && (
                            <div className="flex items-center">
                                <FaGenderless className="text-blue-500 mr-2" />
                                <span>{responsable.gender}</span>
                            </div>
                        )}
                        {responsable.age && (
                            <div className="flex items-center">
                                <FaBirthdayCake className="text-blue-500 mr-2" />
                                <span>{responsable.age} {t('labels.yearsOld')}</span>
                            </div>
                        )}
                        <div className="flex items-center">
                            <FaCalendarAlt className="text-blue-500 mr-2" />
                            <span>{t('labels.maxSize')}: {responsable.maxSize} MB</span>
                            <Button
                                variant="outline-primary"
                                className="ml-4"
                                onClick={() => handleModalShow(responsable)}
                            >
                                <FaEdit className="inline mr-1" /> {t('buttons.edit')}
                            </Button>
                        </div>
                    </div>

                    <div className="mt-6 text-sm text-gray-500">
                        <FaCalendarAlt className="text-blue-500 mr-2 inline" />
                        <span>{t('labels.accountCreated')}: {new Date(responsable.createdAt).toLocaleDateString()}</span>
                    </div>
                </motion.div>
            ))}

            {/* Modal for Max Size Update */}
            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('titles.updateMaxSize')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>{t('labels.newMaxSize')}</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder={t('placeholders.enterNewMaxSize')}
                                value={newMaxSize}
                                onChange={(e) => setNewMaxSize(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        {t('buttons.cancel')}
                    </Button>
                    <Button variant="primary" onClick={handleMaxSizeUpdate}>
                        {t('buttons.saveChanges')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ResponsableFormationCard;

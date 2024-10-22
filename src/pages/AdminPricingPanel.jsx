import React, { useState, useEffect } from 'react';
import axiosInstance from '../helper/axios';
import { Modal, Button, Card, Input, Checkbox, Typography } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import 'react-toastify/dist/ReactToastify.css';

const AdminPricingPanel = () => {
    const { t, i18n } = useTranslation('pages/AdminPricingPanel');
    const [pricingPlans, setPricingPlans] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [newPlan, setNewPlan] = useState({ planEN: '',planAR: '',planFR: '', price: '', per: '', featuresAR: [],featuresEN: [],featuresFR: [], link: '', popular: false });
    const [errors, setErrors] = useState({ planEN: '',planAR: '',planFR: '', price: '', per: '', featuresAR: [],featuresEN: [],featuresFR: [], link: '', popular: false });

    useEffect(() => {
        fetchPricingPlans();
    }, []);

    const fetchPricingPlans = async () => {
        try {
            const response = await axiosInstance.get('/pricing');
            setPricingPlans(response.data);
        } catch (error) {
            console.error(t('adminPricingPanel.errorFetching'), error);
            toast.error(t('adminPricingPanel.errorFetching'));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPlan({ ...newPlan, [name]: value });
        setErrors({ ...errors, [name]: '' }); // Clear error message on input change
    };

    const validateForm = () => {
        let isValid = true;
        let validationErrors =  { planEN: '',planAR: '',planFR: '', price: '', per: '', featuresAR: '',featuresEN: '',featuresFR: '', link: '',};


        // Plan Name Validation
        if (!/^[\u0600-\u06FF?/\,.\s]+$/.test(newPlan.planAR)) {
            validationErrors.planAR = t('adminPricingPanel.planValidation');
            isValid = false;
        }

        if (!/^[a-zA-ZÀ-ÿ?/\,.\s]+$/.test(newPlan.planFR)) {
            validationErrors.planFR = t('adminPricingPanel.planValidation');
            isValid = false;

        }
        if (!/^[a-zA-Z\s]+$/.test(newPlan.planEN)) {
            validationErrors.planEN = t('adminPricingPanel.planValidation');
            isValid = false;
        }
        // Per Validation
        if (!/^[a-zA-Z\s]+$/.test(newPlan.per)) {
            validationErrors.per = t('adminPricingPanel.perValidation');
            isValid = false;
        }

        // Price Validation
        if (!/^\d+(\.\d{1,2})?$/.test(newPlan.price)) {
            validationErrors.price = t('adminPricingPanel.priceValidation');
            isValid = false;
        }

        // Features Validation
        if (!/^([a-zA-ZÀ-ÿ0-9?/\,.\s]+)(,[a-zA-ZÀ-ÿ0-9\s]+)*$/.test(newPlan.featuresFR.join(','))) {
            validationErrors.featuresFR = t('adminPricingPanel.featuresValidation');
            isValid = false;
        }

        // Features Validation for English
        if (!/^([a-zA-Z0-9?/\,.\s]+)(,[a-zA-Z0-9\s]+)*$/.test(newPlan.featuresEN.join(','))) {
            validationErrors.featuresEN = t('adminPricingPanel.featuresValidation');
            isValid = false;
        }

        // Features Validation for Arabic
        if (!/^([\u0600-\u06FF0-9?/\,.\s]+)(,[\u0600-\u06FF0-9\s]+)*$/.test(newPlan.featuresAR.join(','))) {
            validationErrors.featuresAR = t('adminPricingPanel.featuresValidation');
            isValid = false;
        }

        // Link Validation
        if (newPlan.link && !/^http[s]?:\/\/[^\s$.?#].[^\s]*$/.test(newPlan.link)) {
            validationErrors.link = t('adminPricingPanel.linkValidation');
            isValid = false;
        }

        setErrors(validationErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            if (editMode && selectedPlan) {
                await axiosInstance.put(`/pricing/${selectedPlan.id}`, newPlan);
                toast.success(t('adminPricingPanel.successUpdate'));
            } else {
                await axiosInstance.post('/pricing', newPlan);
                toast.success(t('adminPricingPanel.successAdd'));
            }
            fetchPricingPlans();
            resetForm();
        } catch (error) {
            console.error(t('adminPricingPanel.errorSaving'), error);
            toast.error(t('adminPricingPanel.errorSaving'));
        }
    };

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/pricing/${id}`);
            fetchPricingPlans();
            toast.success(t('adminPricingPanel.successDelete'));
        } catch (error) {
            console.error(t('adminPricingPanel.errorDeleting'), error);
            toast.error(t('adminPricingPanel.errorDeleting'));
        }
    };

    const resetForm = () => {
        setNewPlan({ plan: '', price: '', per: '', features: [], link: '', popular: false });
        setErrors({ plan: '', price: '', per: '', features: '', link: '' });
        setEditMode(false);
        setSelectedPlan(null);
        setOpenModal(false);
    };

    const openEditModal = (plan) => {
        setSelectedPlan(plan);
        setNewPlan(plan);
        setEditMode(true);
        setOpenModal(true);
    };

    return (
        <div className="admin-panel">
            <ToastContainer />
            <Typography variant="h4" component="h2" gutterBottom>
                {t('adminPricingPanel.title')}
            </Typography>
            <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => setOpenModal(true)}
                style={{ marginBottom: '20px' }}
            >
                {t('adminPricingPanel.addNewPlan')}
            </Button>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {pricingPlans.map(plan => (
                    <div key={plan.id} className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out">
                        {/* Card Header */}
                        <div className="bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 text-white p-6 text-center">
                            <h3 className="text-2xl font-bold uppercase tracking-wide">
                                {
                                    i18n.language === 'ar' ? plan.planAR :
                                        i18n.language === 'fr' ? plan.planFR :
                                            plan.planEN
                                }
                            </h3>
                            <p className="mt-2 text-lg">
                                {plan.price} / {plan.per}
                            </p>
                        </div>

                        {/* Card Body */}
                        <div className="p-6">
                            {/* Features Section */}
                            <div className="mb-4">
                                <h4 className="text-lg font-medium text-gray-700 mb-2">
                                    {t('adminPricingPanel.features')}
                                </h4>

                                {
                                    i18n.language === 'ar' ? (
                                    <ul className="space-y-2 text-right text-gray-600">
                                        {plan.featuresAR.map((feature, index) => (
                                            <li key={index} className="flex items-center">
                                                <span className="text-green-500 mr-2">✔️</span>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    ) : i18n.language === 'en' ? (
                                            <ul className="space-y-2 text-gray-600">
                                                {plan.featuresEN.map((feature, index) => (
                                                    <li key={index} className="flex items-center">
                                                        <span className="text-green-500 mr-2">✔️</span>
                                                        <span>{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                    ) : (
                                            <ul className="space-y-2 text-gray-600">
                                                {plan.featuresFR.map((feature, index) => (
                                                    <li key={index} className="flex items-center">
                                                        <span className="text-green-500 mr-2">✔️</span>
                                                        <span>{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                    )
                                }
                            </div>
                        </div>

                        {/* Card Actions */}
                        <div className="bg-gray-100 p-6 flex justify-center space-x-4">
                            {/* <button
                                className="text-primary-500 hover:underline mx-2"
                                onClick={() => openEditModal(plan)}
                            >
                                {t('adminPricingPanel.editPricingPlan')}
                            </button> */}

                            <button
                                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2"
                                onClick={() => handleDelete(plan.id)}
                            >
                                <DeleteIcon className="w-5 h-5" />
                                <span>{t('adminPricingPanel.delete')}</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal open={openModal} onClose={resetForm}>
                <div className="modal-container">
                    <div className="modal-header">
                        <Typography variant="h5" component="h2" gutterBottom>
                            {editMode ? t('adminPricingPanel.editPricingPlan') : t('adminPricingPanel.addPricingPlan')}
                        </Typography>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            {/* Plan Name in English */}
                            <div>
                                <Input
                                    name="planEN"
                                    placeholder={t('adminPricingPanel.planNameEn')}
                                    value={newPlan.planEN}
                                    onChange={handleInputChange}
                                    fullWidth
                                    required
                                />
                                {errors.planEN && <p className="text-red-500 text-sm mt-1">{errors.planEN}</p>}
                            </div>

                            {/* Plan Name in French */}
                            <div style={{ marginTop: '10px' }}>
                                <Input
                                    name="planFR"
                                    placeholder={t('adminPricingPanel.planNameFr')}
                                    value={newPlan.planFR}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                            </div>

                            {/* Plan Name in Arabic */}
                            <div style={{ marginTop: '10px' }}>
                                <Input
                                    name="planAR"
                                    placeholder={t('adminPricingPanel.planNameAr')}
                                    value={newPlan.planAR}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                            </div>

                            {/* Price */}
                            <div style={{ marginTop: '10px' }}>
                                <Input
                                    name="price"
                                    placeholder={t('adminPricingPanel.price')}
                                    value={newPlan.price}
                                    onChange={handleInputChange}
                                    fullWidth
                                    required
                                />
                                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                            </div>

                            {/* Per */}
                            <div style={{ marginTop: '10px' }}>
                                <Input
                                    name="per"
                                    placeholder={t('adminPricingPanel.per')}
                                    value={newPlan.per}
                                    onChange={handleInputChange}
                                    fullWidth
                                    required
                                />
                                {errors.per && <p className="text-red-500 text-sm mt-1">{errors.per}</p>}
                            </div>

                            {/* Link */}
                            <div style={{ marginTop: '10px' }}>
                                <Input
                                    name="link"
                                    placeholder={t('adminPricingPanel.link')}
                                    value={newPlan.link}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                                {errors.link && <p className="text-red-500 text-sm mt-1">{errors.link}</p>}
                            </div>

                            {/* Features in English */}
                            <div style={{ marginTop: '10px' }}>
                                <Input
                                    name="featuresEN"
                                    placeholder={t('adminPricingPanel.featuresEn')}
                                    value={newPlan.featuresEN?.join(',')}
                                    onChange={(e) =>
                                        setNewPlan({ ...newPlan, featuresEN: e.target.value.split(',').map(f => f.trim()) })
                                    }
                                    fullWidth
                                    required
                                />
                                {errors.featuresEN && <p className="text-red-500 text-sm mt-1">{errors.featuresEN}</p>}
                            </div>

                            {/* Features in French */}
                            <div style={{ marginTop: '10px' }}>
                                <Input
                                    name="featuresFR"
                                    placeholder={t('adminPricingPanel.featuresFr')}
                                    value={newPlan?.featuresFR?.join(',')}
                                    onChange={(e) =>
                                        setNewPlan({ ...newPlan, featuresFR: e.target.value.split(',').map(f => f.trim()) })
                                    }
                                    fullWidth
                                />
                            </div>

                            {/* Features in Arabic */}
                            <div style={{ marginTop: '10px' }}>
                                <Input
                                    name="featuresAR"
                                    placeholder={t('adminPricingPanel.featuresAr')}
                                    value={newPlan?.featuresAR?.join(',')}
                                    onChange={(e) =>
                                        setNewPlan({ ...newPlan, featuresAR: e.target.value.split(',').map(f => f.trim()) })
                                    }
                                    fullWidth
                                />
                            </div>

                            {/* Popular Checkbox */}
                            <div style={{ marginTop: '10px' }}>
                                <Checkbox
                                    name="popular"
                                    checked={newPlan.popular}
                                    onChange={(e) => setNewPlan({ ...newPlan, popular: e.target.checked })}
                                />
                                <label>{t('adminPricingPanel.popular')}</label>
                            </div>

                            {/* Actions */}
                            <div className="modal-actions" style={{ marginTop: '20px' }}>
                                <Button variant="contained" color="primary" type="submit">
                                    {editMode ? t('adminPricingPanel.updatePlan') : t('adminPricingPanel.addPlan')}
                                </Button>
                                <Button variant="outlined" onClick={resetForm} style={{ marginLeft: '10px' }}>
                                    {t('cancel')}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>


            <style jsx>{`
                .admin-panel {
                    padding: 20px;
                    background: #f4f5f7;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }

                .pricing-plans-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 20px;
                }

                .pricing-card {
                    padding: 20px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }

                .card-actions {
                    margin-top: 20px;
                    display: flex;
                    justify-content: space-between;
                }

                .modal-container {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    width: 400px;
                    margin: 100px auto;
                    max-height: 80vh;
                    overflow-y: auto;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }

                .modal-header {
                    border-bottom: 1px solid #ddd;
                    padding-bottom: 10px;
                }

                .modal-body {
                    padding: 20px 0;
                }

                .modal-actions {
                    display: flex;
                    justify-content: flex-end;
                }
            `}</style>
        </div>
    );
};

export default AdminPricingPanel;

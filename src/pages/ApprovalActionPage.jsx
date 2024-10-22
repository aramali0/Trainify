// ApprovalCard.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../helper/axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Button, Modal, Box, TextField } from '@mui/material'; // Added TextField
import { useNavigate } from 'react-router-dom';
import { getUser } from '../helper/auth';
import { 
    FaBookOpen, FaCalendarAlt, FaClock, FaBuilding, 
    FaFolderOpen, FaFileAlt, FaBook, FaPersonBooth, 
    FaBookmark, FaRegBookmark 
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';


const StyledButton = ({ variant, color, onClick, children }) => {
    return (
        <Button
            variant={variant}
            color={color}
            onClick={onClick}
            style={{
                padding: '4px 8px',
                fontSize: '0.675rem',
                borderRadius: '4px',
                textTransform: 'none',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'background-color 0.3s ease, transform 0.2s ease',
            }}
            className="hover:scale-105 hover:shadow-md transition-transform"
        >
            {children}
        </Button>
    );
};

const ApprovalCard = ({ request}) => {
    const [chargeFormation, setChargeFormation] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [course, setCourse] = useState(null);
    const [session, setSession] = useState(null);
    const [section, setSection] = useState(null);
    const [classEntity, setClassEntity] = useState(null);
    const [library, setLibrary] = useState(null);
    const [resource, setResource] = useState(null);
    const [participant,setParticipant] = useState({})
    const {t , i18n} = useTranslation('pages/approvalAction');

    // New states for comment modal
    const [commentModalOpen, setCommentModalOpen] = useState(false);
    const [currentAction, setCurrentAction] = useState(null); // 'approve', 'reject', 'requestUpdate'
    const [comment, setComment] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchChargeFormation = async () => {
            try {
                const response = await axiosInstance.get(`/charge-formation/${request.chargeFormationId}`);
                setChargeFormation(response.data);
            } catch (error) {
                console.error("Error fetching Chargé de formation details:", error);
            }
        };
        fetchChargeFormation();
    }, [request.chargeFormationId]);

    const handleShowObjectClick = async () => {
        try {
            if (request.actionType === 'COURSE') {
                navigate(`/responsable/courses/${request.objectId}`);
            }
            else if (request.actionType === 'CLASS') {
                const response = await axiosInstance.get(`/classes/${request.objectId}`);
                setClassEntity(response.data)
            }
            else if (request.actionType === 'LIBRARY') {
                const response = await axiosInstance.get(`/libraries/${request.objectId}`);
                const courResponse = await axiosInstance.get(`/cours/${response.data.courId}`);
                setLibrary(response.data)
                setCourse(courResponse.data);
            }
            else if(request.actionType === 'QUIZ'){
                navigate(`/responsable/sections/0/quiz/${request.objectId}`);
            }
            else if(request.actionType === 'RESOURCE')
            {
                const response = await axiosInstance.get(`/resources/${request.objectId}/dto`);
                const responseLibrary = await axiosInstance.get(`/libraries/${response.data.libraryId}`);
                setLibrary(responseLibrary.data);
                setResource(response.data)
            }
            setOpenModal(true);
        } catch (error) {
            console.error("Error fetching object:", error);
            toast.error("Failed to load details.");
        }
    };

    const handleCloseModal = () => setOpenModal(false);

    // New handlers for actions with comments
    const handleActionClick = (actionType) => {
        setCurrentAction(actionType);
        setComment('');
        setCommentModalOpen(true);
    };

    const handleConfirmAction = async () => {
        if (!comment.trim()) {
            toast.error("Comment cannot be empty.");
            return;
        }

        const responsableId = getUser().userId;

        try {
            if (currentAction === 'approve') {
                await axiosInstance.put('/responsables/requests/approve', {
                    id: request.id,
                    responsableFormationId: responsableId,
                    comment: comment.trim(),
                });
                toast.success("Request approved successfully!");
            } else if (currentAction === 'reject') {
                await axiosInstance.put('/responsables/requests/reject', {
                    id: request.id,
                    responsableFormationId: responsableId,
                    comment: comment.trim(),
                });
                toast.success("Request rejected successfully!");
            } else if (currentAction === 'requestUpdate') {
                await axiosInstance.put('/responsables/requests/update', {
                    id: request.id,
                    responsableFormationId: responsableId,
                    comment: comment.trim(),
                });
                toast.success("Update requested successfully!");
            }
            setCommentModalOpen(false);
        } catch (error) {
            console.error(`Error during ${currentAction}:`, error);
            toast.error(`Failed to ${currentAction} request`);
        }
    };

    const handleCancelAction = () => {
        setCommentModalOpen(false);
    };

    const formatDate = (date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(date));
    };


    return (
        <motion.div className="shadow-lg rounded-lg bg-white p-6 mb-6 transform transition-transform duration-300 hover:scale-105">
            <h2 className="text-lg font-bold mb-2 text-indigo-700">{request.actionType}</h2>
            <p className="text-gray-600 mb-4">{t('requestId')}: {request.id}</p>
            <p className="text-gray-500 mb-4">{t('createdOn')}: {formatDate(request.createdDate)}</p>

            {chargeFormation ? (
                <div className="text-gray-500 mb-2">
                    <span 
                        className="block text-ellipsis overflow-hidden whitespace-nowrap" 
                        title={`${chargeFormation.firstName} ${chargeFormation.lastName}`}
                    >
                        {`${chargeFormation.firstName} ${chargeFormation.lastName}`}
                    </span>
                </div>
            ) : (
                <p className="text-gray-500 mb-2 text-sm">{t('chargeFormationNotFound')}</p>
            )}

            <div className="flex justify-center mt-4 gap-2">
                <StyledButton variant="contained" color="primary" onClick={() => handleActionClick('approve')}>
                    {t('approve')}
                </StyledButton>
                <StyledButton variant="outlined" color="secondary" onClick={() => handleActionClick('reject')}>
                    {t('reject')}
                </StyledButton>
                <StyledButton variant="contained" color="warning" onClick={() => handleActionClick('requestUpdate')}>
                    {t('requestUpdate')}
                </StyledButton>
                <StyledButton variant="contained" color="info" onClick={handleShowObjectClick}>
                    {t('showDetails')}
                </StyledButton>
            </div>

            {/* Modal for displaying different types of content */}
            <Modal open={openModal} onClose={handleCloseModal} >
                <Box className="bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full p-8 rounded-xl shadow-2xl max-w-3xl">
                    {course && request.actionType === 'COURSE'  ? (
                        // ... existing content
                        <div className="flex flex-col items-start">
                            <h2 className="text-3xl font-bold mb-4 text-blue-600">{course.titre}</h2>
                            <div className="flex items-center gap-3 text-gray-600 mb-4">
                                <FaBookOpen /> <span>Subtitle: {course.subTitre}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 mb-4">
                                <FaClock /> <span>Duration: {course.duree} hours</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 mb-4">
                                <FaCalendarAlt /> <span>Created At: {new Date(course.createdAt).toLocaleString()}</span>
                            </div>
                            <div className="mt-10">
                                <StyledButton variant="outlined" color="secondary" onClick={handleCloseModal}>
                                    Close
                                </StyledButton>
                            </div>
                        </div>
                    ) : session && request.actionType === 'SESSION' ? (
                        // ... existing content for SESSION
                        // Similar structure
                        // ...
                        <div className="flex flex-col items-start">
                            <h2 className="text-3xl font-bold mb-4 text-green-600">{session.name}</h2>
                            <div className="flex items-center gap-3 text-gray-600 mb-4">
                                <FaCalendarAlt /> <span>Start Date: {new Date(session.startDate).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 mb-4">
                                <FaCalendarAlt /> <span>End Date: {new Date(session.endDate).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 mb-4">
                                <FaClock /> <span>Duration: {session.duree} min</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 mb-4">
                                <FaBook /> <span>Course: {course.titre} </span>
                            </div>
                            <div className="mt-10">
                                <StyledButton variant="outlined" color="secondary" onClick={handleCloseModal}>
                                    Close
                                </StyledButton>
                            </div>
                        </div>
                    ) : section && request.actionType === 'SECTION' ? (
                        // ... existing content for SECTION
                        // Similar structure
                        <div className="flex flex-col items-start">
                            <h2 className="text-3xl font-bold mb-4 text-purple-600">{section.title}</h2>
                            <div className="flex items-center gap-3 text-gray-600 mb-4">
                                <FaFolderOpen /> <span>Content: {section.content}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 mb-4">
                                <FaClock /> <span>Start date: {new Date(section.startDate).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 mb-4">
                                <FaClock /> <span>End date: {new Date(section.endDate).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 mb-4">
                                <FaFolderOpen /> <span>Content: {section.content}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 mb-4">
                                <FaBook /> <span>Course: {course.titre}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 mb-4">
                                <FaFolderOpen /> <span>Session: {session.name}</span>
                            </div>
                            <div className="mt-10">
                                <StyledButton variant="outlined" color="secondary" onClick={handleCloseModal}>
                                    Close
                                </StyledButton>
                            </div>
                        </div>
                    ) : classEntity && request.actionType === 'CLASS' ? (
                        // ... existing content for CLASS
                        <div className="flex flex-col items-start">
                            <h2 className="text-3xl font-bold mb-4 text-yellow-600">{classEntity.titre}</h2>
                            <div className="flex items-center gap-3 text-gray-600 mb-4">
                                <FaBook /> <span>{t('courses')}: {classEntity.courIds.length}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 mb-4">
                                <FaPersonBooth /> <span>{t('participants')}: {classEntity.participantIds.length}</span>
                            </div>
                            <div className="mt-10">
                                <StyledButton variant="outlined" color="secondary" onClick={handleCloseModal}>
                                    {t('close')}
                                </StyledButton>
                            </div>
                        </div>
                    ) : library && request.actionType === 'LIBRARY' ? (
                        // ... existing content for LIBRARY
                        <div className="flex flex-col items-start">
                            <h2 className="text-3xl font-bold mb-4 text-red-600">{library.name}</h2>
                            <div className="flex items-center gap-3 text-gray-600 mb-4">
                                <FaBook/> <span>{t('cour')}: {course.titre}</span>
                            </div>
                            <div className="mt-10">
                                <StyledButton variant="outlined" color="secondary" onClick={handleCloseModal}>
                                    {t('close')}
                                </StyledButton>
                            </div>
                        </div>
                    ) : resource && request.actionType === 'RESOURCE' ? (
                        // ... existing content for RESOURCE
                        <div className="flex flex-col items-start">
                            <h2 className="text-3xl font-bold mb-4 text-orange-600">{resource.title}</h2>
                            <div className="flex items-center gap-3 text-gray-600 mb-4">
                                <FaFileAlt /> <span>{t('resourceType')}: {resource.type}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 mb-4">
                                <FaRegBookmark /> <span>{t('library')}: {library.name}</span>
                            </div>
                            <div className="mt-10">
                                <StyledButton variant="outlined" color="secondary" onClick={handleCloseModal}>
                                    {t('close')}
                                </StyledButton>
                            </div>
                        </div>
                    ) : (
                        <p>{t('loadingDetails')}</p>
                    )}
                </Box>
            </Modal>

            {/* New Modal for entering comments */}
            <Modal open={commentModalOpen} onClose={handleCancelAction}>
                <Box className="bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-md p-6 rounded-xl shadow-2xl">
                    <h2 className="text-xl font-bold mb-4">
                        {currentAction === 'approve' && 'Approve Request'}
                        {currentAction === 'reject' && 'Reject Request'}
                        {currentAction === 'requestUpdate' && 'Request Update'}
                    </h2>
                    <TextField
                        label={t('comment')}
                        multiline
                        rows={4}
                        variant="outlined"
                        fullWidth
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder={t('enterComment')}
                    />
                    <div className="flex justify-end mt-4 gap-2">
                        <Button variant="contained" color="primary" onClick={handleConfirmAction}>
                        {t('confirm')}
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={handleCancelAction}>
                        {t('cancel')}
                        </Button>
                    </div>
                </Box>
            </Modal>
        </motion.div>
    );
};



const ApprovalActionsPage = () => {
    const responsableId = getUser().userId;
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { t, i18n } = useTranslation('pages/approvalAction');

    useEffect(() => {
        const fetchPendingRequests = async () => {
            try {
                const response = await axiosInstance.get(`/responsables/${responsableId}/requests`);
                setRequests(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching pending requests:", error);
                toast.error("Failed to load requests");
                setIsLoading(false);
            }
        };

        fetchPendingRequests();
    }, [responsableId]);

    // const handleApprove = async (requestId) => {
    //     try {
    //         await axiosInstance.put(`/responsables/requests/${requestId}/approve/${responsableId}`);
    //         setRequests((prev) => prev.filter((request) => request.id !== requestId));
    //         toast.success("Request approved successfully!");
    //     } catch (error) {
    //         console.error("Error approving request:", error);
    //         toast.error("Failed to approve request");
    //     }
    // };

    // const handleReject = async (requestId) => {
    //     try {
    //         await axiosInstance.put(`/responsables/requests/${requestId}/reject/${responsableId}`);
    //         setRequests((prev) => prev.filter((request) => request.id !== requestId));
    //         toast.success("Request rejected successfully!");
    //     } catch (error) {
    //         console.error("Error rejecting request:", error);
    //         toast.error("Failed to reject request");
    //     }
    // };

    // const handleRequestUpdate = async (requestId) => {
    //     try {
    //         await axiosInstance.put(`/responsables/requests/${requestId}/update/${responsableId}`);
    //         setRequests((prev) => prev.filter((request) => request.id !== requestId));
    //         toast.success("Update requested successfully!");
    //     } catch (error) {
    //         console.error("Error requesting update:", error);
    //         toast.error("Failed to request update");
    //     }
    // };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-gray-100">
            <h1 className="text-3xl font-bold mb-6 text-center">{t('pending')}</h1>
            {isLoading ? (
                <p className="text-center text-gray-500">{t('loadingRequest')}</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {requests.length > 0 ? (
                        requests.map((request) => (
                            <ApprovalCard
                                key={request.id}
                                request={request}
                            />
                        ))
                    ) : (
                        <p className="text-center text-gray-500 col-span-3">{t('noPendingRequests')}</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ApprovalActionsPage;

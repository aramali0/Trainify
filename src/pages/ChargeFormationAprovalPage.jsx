import React, { useState, useEffect, useMemo } from 'react';
import axiosInstance from '../helper/axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { getUser } from '../helper/auth';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaEdit, FaCommentDots } from 'react-icons/fa';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { Modal, Box, Typography, Button } from '@mui/material'; // Import MUI components

// Modal styling for MUI (can be customized)
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '10px',
};
// Individual card component
const ApprovalCard = ({ approval, responsable }) => {
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
    const isUpdateStatus = approval.updateRequested; // Check if the status is 'Update'
    const navigate = useNavigate();

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
  
    const onUpdate = (approval) => {
        switch (approval.actionType) {
            case "COURSE":
                navigate(`/charge-formation/courses/${approval.objectId}`); // Navigate to the update page
                break;
            case "QUIZ":
                navigate(`/charge-formation/quiz/${approval.objectId}/edit-quiz`); // Navigate to the update page
                break;
            case "CLASS":
                navigate(`/charge-formation/edit-class/${approval.objectId}`); // Navigate to the update page
                break;
            default:
                break;
        }
    };

    const onReject = (approval) => {
        switch (approval.actionType) {
            case "COURSE":
                navigate(`/charge-formation/courses/${approval.objectId}`); // Navigate to the update page
                break;
            case "QUIZ":
                navigate(`/charge-formationsections/0/quiz/${approval.objectId}`); // Navigate to the update page
                break;
            case "CLASS":
                navigate(`/charge-formation/edit-class/${approval.objectId}`); // Navigate to the update page
                break;
            default:
                break;
        }
    };

    // Handle status rendering explicitly for 'Pending' or 'Waiting'
    const renderStatus = () => {
        if (approval.approved) {
            return 'Approved';
        } else if (approval.rejected) {
            return 'Rejected';
        } else if (approval.updateRequested) {
            return 'Update Requested';
        } else {
            return 'Pending'; // Fallback to raw status
        }
    };

    return (
        <motion.div
            className="shadow-lg rounded-lg relative bg-white p-6 mb-6 transform transition-transform duration-300 hover:scale-105"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex justify-between items-center ">
                <h2 className="text-lg font-bold text-indigo-700">{approval.actionType}</h2>
                <div>
                    {approval.approved ? (
                        <FaCheckCircle
                            className="text-green-600 text-xl"
                        />
                    ) : approval.rejected ? (
                        <FaTimesCircle
                            onClick={() => onReject(approval)}
                            className="text-red-600 text-xl cursor-pointer"
                        />
                    ) : isUpdateStatus ? (
                        <FaEdit className="text-orange-600 text-xl"
                            onClick={() => onUpdate(approval)} />
                    ) : (
                        <FaInfoCircle className="text-yellow-600 text-xl" />
                    )} 
                </div>
            </div>
            <p className="text-gray-600 mb-2">Request ID: {approval.id}</p>
            <p className="text-gray-500 mb-2">Created on: {new Date(approval.createdDate).toLocaleString()}</p>
            {responsable ? (
                <p className="text-gray-500 mb-2">
                    Responsable: {`${responsable.firstName} ${responsable.lastName}`}
                </p>
            ) : (
                <p className="text-gray-500 mb-2">Responsable: Not found</p>
            )}
            <div className='flex justify-start gap-4'>
                <p className={`mb-4 ${approval.approved ? 'text-green-600' : approval.rejected ? 'text-red-600' : isUpdateStatus ? 'text-orange-600' : 'text-yellow-600'}`}>
                    Status: {renderStatus()}
                </p>
                {approval.comment && (
                <FaCommentDots
                className="text-blue-600 text-xl cursor-pointer"
                onClick={openModal} // Open modal on click
                />
            )}
            </div>
            <Modal
                open={isModalOpen}
                onClose={closeModal}
                aria-labelledby="comment-modal-title"
                aria-describedby="comment-modal-description"
                >
                <Box sx={modalStyle}>
                <Typography id="comment-modal-title" variant="h6" component="h2">
                    Comment
                </Typography>
                <Typography id="comment-modal-description" sx={{ mt: 2 }}>
                    {approval.comment ? approval.comment : "No comment available"}
                </Typography>
                <Button
                    onClick={closeModal}
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3 }}
                >
                    Close
                </Button>
                </Box>
            </Modal>
        </motion.div>
    );
};

// Main Page component
const ChargeFormationApprovalsPage = () => {
    const chargeFormationId = getUser().userId; // Assuming getUser() returns the logged-in user's info
    const [approvals, setApprovals] = useState([]);
    const [responsables, setResponsables] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [selectedApproval, setSelectedApproval] = useState(null); // For handling selected approval for updating
    const [isModalOpen, setIsModalOpen] = useState(false); // For modal state
    const [filterActionType, setFilterActionType] = useState(null); // For filtering by actionType

    useEffect(() => {
        const fetchApprovals = async () => {
            try {
                const response = await axiosInstance.get(`/charge-formation/${chargeFormationId}/approvals`);
                setApprovals(response.data);

                // Extract unique responsableFormationIds
                const uniqueResponsableIds = [...new Set(response.data.map(approval => approval.responsableFormationId))];

                // Fetch all responsables in parallel
                const responsablePromises = uniqueResponsableIds.map(id => !!id &&
                    axiosInstance.get(`/responsables/${id}`).then(res => res.data).catch(err => {
                        console.error(`Error fetching Responsable with ID ${id}:`, err);
                        return null;
                    })
                );

                const responsablesData = await Promise.all(responsablePromises);

                // Create a mapping of responsableId to responsable details
                const responsablesMap = {};
                responsablesData.forEach(responsable => {
                    if (responsable) {
                        responsablesMap[responsable.id] = responsable;
                    }
                });

                setResponsables(responsablesMap);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching approvals:", error);
                toast.error("Failed to load approvals");
                setIsLoading(false);
            }
        };

        fetchApprovals();
    }, [chargeFormationId]);


    const actionTypeOptions = useMemo(() => {
        const uniqueActionTypes = [...new Set(approvals.map(approval => approval.actionType))];
        return uniqueActionTypes.map(type => ({
            value: type,
            label: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase(),
        }));
    }, [approvals]);


    // Handle sorting and filtering
    const sortedAndFilteredApprovals = useMemo(() => {
        let filtered = approvals;

        if (filterActionType) {
            filtered = approvals.filter(approval => approval.actionType === filterActionType.value);
        }

        // Sort by createdDate descending
        return filtered.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
    }, [approvals, filterActionType]);

    // Handle the click event to update a request
    const handleUpdateClick = (approval) => {
        setSelectedApproval(approval);
        setIsModalOpen(true); // Open modal
    };

    // Handle save after updating the request
    const handleSaveChanges = async (updatedApproval) => {
        try {
            await axiosInstance.put(`/requests/${updatedApproval.id}/update`, updatedApproval); // Call backend API to save changes
            // Update the local approvals state with the updated data
            setApprovals((prevApprovals) =>
                prevApprovals.map((app) => (app.id === updatedApproval.id ? updatedApproval : app))
            );
            toast.success("Request updated successfully!");
            setIsModalOpen(false); // Close modal after saving
        } catch (error) {
            console.error("Error updating request:", error);
            toast.error("Failed to update request.");
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">My Approval Statuses</h1>
                <Select
                    options={actionTypeOptions}
                    value={filterActionType}
                    onChange={setFilterActionType}
                    isClearable
                    placeholder="Filter by Action Type"
                    className="w-1/3"
                />
            </div>

            {isLoading ? (
                <p className="text-center text-gray-500">Loading approvals...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {sortedAndFilteredApprovals.length > 0 ? (
                        sortedAndFilteredApprovals.map((approval) => (
                            <ApprovalCard
                                key={approval.id}
                                approval={approval}
                                responsable={responsables[approval.responsableFormationId]}
                                onUpdate={handleUpdateClick} // Pass the update handler
                            />
                        ))
                    ) : (
                        <p className="text-center text-gray-500 col-span-3">No approvals found.</p>
                    )}
                </div>
            )}

            {/* Render the modal if there's a selected approval */}
            {selectedApproval && (
                <UpdateRequestModal
                    open={isModalOpen}
                    handleClose={() => setIsModalOpen(false)}
                    approval={selectedApproval}
                    handleSave={handleSaveChanges}
                />
            )}
        </div>
    );
};

export default ChargeFormationApprovalsPage;

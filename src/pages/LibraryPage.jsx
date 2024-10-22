import React, { useState, useEffect } from 'react';
import axiosInstance from '../helper/axios';
import axiosInstanceForRessources from '../helper/axiosForResoures';
import { toast, ToastContainer } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { FaFolder, FaFileAlt, FaPlus, FaChevronDown, FaChevronUp, FaTrash, FaUpload } from 'react-icons/fa';
import { getUser } from '../helper/auth';
import { Spinner, Modal } from 'react-bootstrap'; // Using react-bootstrap
import { useTranslation } from 'react-i18next';


const LibraryPage = ({ nom, user, path }) => {
    const { courseId } = useParams();
    const userId = getUser().userId;
    const [libraries, setLibraries] = useState([]);
    const [selectedLibrary, setSelectedLibrary] = useState(null);
    const [file, setFile] = useState(null);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(false); // Spinner state
    const [showModal, setShowModal] = useState(false); // State for modal display
    const navigate = useNavigate();
    const {t} = useTranslation('pages/library'); // Initialize translation hook
    const translate = (key) => t(key); // Translation function

    const getmaxSizeByResponsable = async () => {
        try {
            const response = await axiosInstance.get(`/responsables/${userId}/maxSize`);
            return response.data;
        } catch (error) {
            console.log("error Responsable: ", error);
            toast.error(error.response?.data || 'Failed to fetch max-Size');
        }
    };

    const getmaxSizeByFormateur = async (id) => {
        try {
            const response = await axiosInstance.get(`/formateurs/${id}/maxSize`);
            return response.data;
        } catch (error) {
            toast.error(error.response?.data || 'Failed to fetch max-Size');
        }
    };

    useEffect(() => {
        const fetchLibraries = async () => {
            try {
                let response;
                if (courseId != null) {
                    response = await axiosInstance.get(`/libraries/cour/${courseId}`);
                } else {
                    switch (user) {
                        case "admin":
                            response = await axiosInstance.get(`/libraries`);
                            break;
                        case "responsable":
                            response = await axiosInstance.get(`libraries/responsable/${userId}`);
                            break;
                        case "formateur":
                            response = await axiosInstance.get(`libraries/formateur/${userId}`);
                            break;
                        case "charge-formation":
                            response = await axiosInstance.get(`libraries/charge-formation/${userId}`);
                            break;
                        default:
                            break;
                    }
                }
                setLibraries(response.data);
            } catch (error) {
                toast.error(translate("messages.fetchLibrariesError"));
            }
        };

        fetchLibraries();
    }, [courseId, user, userId]);

    const handleCreateLibrary = () => {
        navigate(`${nom}/courses/${courseId}/create-library`);
    };

    const handleUploadFile = async (e) => {
        const file = e.target.files[0];
        setFile(file);
        if (!file || !selectedLibrary) {
            toast.error(translate("messages.selectFile"));
            return;
        }

        if (user === "responsable") {
            const maxSize = await getmaxSizeByResponsable();
            if ((file.size / (1024 * 1024)) > maxSize) {
                toast.error(translate("messages.fileSizeExceeds"));
                return;
            }
        } else if (user === "formateur") {
            const maxSize = await getmaxSizeByFormateur(selectedLibrary);
            if (file.size > maxSize) {
                toast.error(translate("messages.fileSizeExceeds"));
                return;
            }
        }

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        try {
            const responsePost = await axiosInstanceForRessources.post(`/resources/library/${selectedLibrary}/upload-or-update`, formData);
            toast.success(translate("messages.uploadSuccess"));
            if (responsePost?.data) {
                toast.success(responsePost.data);
            }
            setFile(null);

            const response = await axiosInstance.get(`/resources/library/${selectedLibrary}/dtos`);
            setResources(response.data);
        } catch (error) {
            toast.error(error.response?.data || translate("messages.uploadError"));
        } finally {
            setLoading(false);
        }
    };

    const handleSelectLibrary = async (id) => {
        if (selectedLibrary === id) {
            setSelectedLibrary(null);
            setResources([]);
            return;
        }
        setSelectedLibrary(id);
        try {
            const response = await axiosInstance.get(`/resources/library/${id}/dtos`);
            setResources(response.data);
        } catch (error) {
            toast.error(translate("messages.fetchLibrariesError"));
        }
    };

    const handleDeleteLibrary = async (id) => {
        try {
            await axiosInstance.delete(`/libraries/${id}`);
            toast.success(translate("messages.deleteLibrarySuccess"));
            const response = await axiosInstance.get(`/libraries/cour/${courseId}`);
            setLibraries(response.data);
            if (selectedLibrary === id) {
                setSelectedLibrary(null);
                setResources([]);
            }
        } catch (error) {
            toast.error(error.response?.data || translate("messages.fetchLibrariesError"));
        }
    };

    const handleDeleteResource = async (resourceId) => {
        try {
            await axiosInstance.delete(`/resources/${resourceId}`);
            toast.success(translate("messages.deleteResourceSuccess"));
            const response = await axiosInstance.get(`/resources/library/${selectedLibrary}/dtos`);
            setResources(response.data);
        } catch (error) {
            toast.error(error.response?.data || translate("messages.fetchLibrariesError"));
        }
    };

    // Function to display the resource
    const handleResourceView = async (resourceId, resourceTitle, resourceType) => {
        try {
            const response = await axiosInstance.get(`/resources/${resourceId}`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const fileExtension = resourceTitle.split('.').pop().toLowerCase();

            if (['mp4', 'avi', 'mov'].includes(fileExtension)) {
                // Display video in modal
                setFile({ url, type: 'video' });
                setShowModal(true);  // Show modal for video
            } else {
                // Trigger download for files
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', resourceTitle); // This will trigger the download
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            toast.error(translate("messages.loadError"));
        }
    };

    // Function to determine the appropriate icon based on file extension
    const getFileIcon = (fileName) => {
        const ext = fileName.split('.').pop().toLowerCase();

        switch (ext) {
            case 'pdf':
                return <FaFileAlt className="text-red-500" />; // Updated to generic icon for simplicity
            case 'doc':
            case 'docx':
                return <FaFileAlt className="text-blue-500" />;
            case 'xls':
            case 'xlsx':
                return <FaFileAlt className="text-green-500" />;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return <FaFileAlt className="text-yellow-500" />;
            case 'mp4':
            case 'avi':
            case 'mov':
                return <FaFileAlt className="text-purple-500" />;
            case 'mp3':
            case 'wav':
                return <FaFileAlt className="text-orange-500" />;
            case 'zip':
            case 'rar':
                return <FaFileAlt className="text-gray-500" />;
            case 'html':
            case 'css':
            case 'js':
            case 'json':
                return <FaFileAlt className="text-teal-500" />;
            default:
                return <FaFileAlt className="text-gray-500" />;
        }
    };

    return (
        <div className="p-6 bg-gray-100">
            <ToastContainer />
            <h1 className="text-3xl font-bold mb-4 text-gray-800">{translate("titles.libraryManagement")}</h1>

            {(nom !== "/participant") && courseId && (
                <div className="flex justify-end mb-6">
                    <button
                        onClick={handleCreateLibrary}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                    >
                        <FaPlus className="mr-2" />
                        {translate("buttons.createLibrary")}
                    </button>
                </div>
            )}

            <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">{translate("titles.libraries")}</h2>
                <ul className="space-y-4">
                    {libraries.map((library) => (
                        <li key={library.id} className="border-b last:border-b-0 pb-4">
                            <div className="flex justify-between items-center cursor-pointer" onClick={() => handleSelectLibrary(library.id)}>
                                <div className="flex items-center space-x-2">
                                    <FaFolder className="text-yellow-500 text-2xl" />
                                    <span className="text-lg font-medium text-gray-800">{library.name}</span>
                                </div>

                                <div className="flex items-center space-x-4">
                                    {nom !== "/participant" && (
                                        <>
                                            <label>
                                                <FaUpload
                                                    className={`text-gray-500 hover:text-green-600 cursor-pointer ${loading ? 'opacity-50' : ''}`}
                                                    title={translate("buttons.uploadResource")}
                                                />
                                                <input
                                                    type="file"
                                                    onChange={handleUploadFile}
                                                    style={{ display: 'none' }}
                                                />
                                            </label>
                                            <FaTrash
                                                className="text-gray-500 hover:text-red-600 cursor-pointer"
                                                title={translate("buttons.deleteLibrary")}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteLibrary(library.id);
                                                }}
                                            />
                                        </>
                                    )}
                                    {selectedLibrary === library.id ? <FaChevronUp /> : <FaChevronDown />}
                                </div>
                            </div>
                            {selectedLibrary === library.id && (
                                <ul className="pl-8 mt-4 space-y-2">
                                    {resources.length > 0 ? (
                                        resources.map((resource) => (
                                            <li key={resource.id} className="flex justify-between items-center">
                                                <div className="flex items-center space-x-2">
                                                    {getFileIcon(resource.title)}
                                                    <span className="text-gray-700">{resource.title}</span>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <FaFileAlt
                                                        className="text-teal-600 hover:text-teal-700 cursor-pointer"
                                                        title={translate("buttons.uploadResource")}
                                                        onClick={() => handleResourceView(resource.id, resource.title, resource.type)}
                                                    />
                                                    {nom !== "/participant" && (
                                                        <FaTrash
                                                            className="text-red-500 hover:text-red-700 cursor-pointer"
                                                            title={translate("buttons.deleteResource")}
                                                            onClick={() => handleDeleteResource(resource.id)}
                                                        />
                                                    )}
                                                </div>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-gray-500">{translate("messages.noResources")}</li>
                                    )}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Video Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{translate("titles.videoViewer")}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center h-full w-full">
                    {file?.type === 'video' && (
                        <video controls className="w-full max-w-lg mx-auto" controlsList="nodownload">
                            <source src={file.url} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default LibraryPage;

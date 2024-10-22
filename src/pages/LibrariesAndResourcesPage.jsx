import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../helper/axios';
import { toast, ToastContainer } from 'react-toastify';
import { FaFolder, FaFileAlt, FaChevronDown, FaChevronUp, FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaFileAudio, FaFileVideo, FaFileArchive, FaFileCode } from 'react-icons/fa';
import { getUser } from '../helper/auth';
import { Modal, Button } from 'react-bootstrap';  
import { useTranslation } from 'react-i18next'; // For translations

const LibrariesAndResourcesPage = () => {
    const { t,i18n } = useTranslation('pages/libraryAndResources'); // Hook for accessing translations
    const [libraries, setLibraries] = useState([]);
    const [selectedLibrary, setSelectedLibrary] = useState(null);
    const [resources, setResources] = useState([]);
    const [file, setFile] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const participantId = getUser().userId;

    const isRTL = i18n.dir() === 'rtl'; // Check if the language is RTL 

    useEffect(() => {
        const fetchLibraries = async () => {
            try {
                const response = await axiosInstance.get(`/participants/${participantId}/libraries`);
                setLibraries(response.data);
            } catch (error) {
                toast.error(t('toastError'));
            }
        };

        fetchLibraries();
    }, [participantId, t]);

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
            toast.error(t('toastErrorResources'));
        }
    };

    const handleResourceView = async (resourceId, resourceTitle) => {
        try {
            const response = await axiosInstance.get(`/resources/${resourceId}`, { responseType: 'blob' });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const fileExtension = resourceTitle.split('.').pop().toLowerCase();

            if (['mp4', 'avi', 'mov'].includes(fileExtension)) {
                setFile({ url, type: 'video' });
                setShowModal(true);
            } else {
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', resourceTitle);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            toast.error(t('toastErrorLoadingResource'));
        }
    };

    const getFileIcon = (fileName) => {
        const ext = fileName.split('.').pop().toLowerCase();
        switch (ext) {
            case 'pdf':
                return <FaFilePdf className="text-red-500" />;
            case 'doc':
            case 'docx':
                return <FaFileWord className="text-blue-500" />;
            case 'xls':
            case 'xlsx':
                return <FaFileExcel className="text-green-500" />;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return <FaFileImage className="text-yellow-500" />;
            case 'mp4':
            case 'avi':
            case 'mov':
                return <FaFileVideo className="text-purple-500" />;
            case 'mp3':
            case 'wav':
                return <FaFileAudio className="text-orange-500" />;
            case 'zip':
            case 'rar':
                return <FaFileArchive className="text-gray-500" />;
            case 'html':
            case 'css':
            case 'js':
            case 'json':
                return <FaFileCode className="text-teal-500" />;
            default:
                return <FaFileAlt className="text-gray-500" />;
        }
    };

    return (
        <div className={`p-6 bg-gray-100 ${isRTL ? 'rtl' : ''}`}>  {/* Applying RTL if Arabic */}
            <ToastContainer />
            <h1 className="text-3xl font-bold mb-4 text-gray-800">{t('librariesTitle')}</h1>

            <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">{t('librariesSubtitle')}</h2>
                <ul className="space-y-4">
                    {libraries.map((library) => (
                        <li key={library.id} className="border-b last:border-b-0 pb-4">
                            <div className="flex justify-between items-center cursor-pointer" onClick={() => handleSelectLibrary(library.id)}>
                                <div className="flex items-center space-x-2">
                                    <FaFolder className="text-yellow-500 text-2xl" />
                                    <span className="text-lg font-medium text-gray-800">{library.name}</span>
                                </div>
                                <div className="flex items-center space-x-4">
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
                                                    <span className="cursor-pointer text-blue-600 hover:underline" onClick={() => handleResourceView(resource.id, resource.title)}>
                                                        {resource.title} ({resource.type})
                                                    </span>
                                                </div>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-gray-600">{t('noResources')}</li>
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
                    <Modal.Title>{t('videoViewerTitle')}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    {file?.type === 'video' && (
                        <video controls className="w-full max-w-lg mx-auto" controlsList="nodownload">
                            <source src={file.url} type="video/mp4" />
                            {t('videoUnsupported')}
                        </video>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        {t('close')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default LibrariesAndResourcesPage;

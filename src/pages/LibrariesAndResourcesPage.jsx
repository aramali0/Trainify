import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../helper/axios';
import { toast, ToastContainer } from 'react-toastify';
import { FaFolder, FaFileAlt, FaChevronDown, FaChevronUp, FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaFileAudio, FaFileVideo, FaFileArchive, FaFileCode } from 'react-icons/fa';
import { getUser } from '../helper/auth';
import { Modal, Button } from 'react-bootstrap';  
import { useTranslation } from 'react-i18next'; 
import Select from 'react-select'; // Import react-select

const LibrariesAndResourcesPage = () => {
    const { t,i18n } = useTranslation('pages/libraryAndResources'); 
    const [libraries, setLibraries] = useState([]);
    const [selectedLibrary, setSelectedLibrary] = useState(null);
    const [resources, setResources] = useState([]);
    const [file, setFile] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [libraryName, setLibraryName] = useState('');
    const [formationId, setFormationId] = useState(null);
    const [formations, setFormations] = useState([]); // New state for all formations
    
    const participantId = getUser().userId;

    const isRTL = i18n.dir() === 'rtl'; 


// Fetch formations
    const fetchFormations = async () => {
        try {
            const response = await axiosInstance.get(`/cours/participants/${participantId}`);
            setFormations(response.data.map(f => ({ value: f.id, label: f.titre }))); // Format the response for React Select
        } catch (error) {
            console.error(error);
            toast.error(t("fetchFormationsError"));
        }
    };


    useEffect(() => {
        const fetchLibraries = async () => {
            try {

            const params = {};
            if (libraryName) params.libraryName = libraryName;
            if (formationId) params.formationId = formationId; // Include formationId in the params

                const response = await axiosInstance.get(`/participants/${participantId}/libraries`, {params});
                setLibraries(response.data);
            } catch (error) {
                toast.error(t('toastError'));
            }
        };
        fetchFormations(); // Fetch formations
        fetchLibraries();
    }, [libraryName, formationId]); 



    const handleFormationChange = (selectedOption) => {
            setFormationId(selectedOption ? selectedOption.value : null); // Update formationId
        };

    const handleSearchChange = (e) => {
            setLibraryName(e.target.value); // Update search query
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
            toast.error(t('toastErrorResources'));
        }
    };

    const handleResourceView = async (resourceId, resourceTitle , isDownloadable) => {
        try {
            const response = await axiosInstance.get(`/resources/${resourceId}`, { responseType: 'blob' });
            
        const mimeTypeMap = {
            mp4: 'video/mp4',
            avi: 'video/x-msvideo',
            mov: 'video/quicktime',
        };

            const fileExtension = resourceTitle.split('.').pop().toLowerCase();
            const mimeType = mimeTypeMap[fileExtension] || 'application/octet-stream';
            const url = window.URL.createObjectURL(new Blob([response.data] , { type: mimeType }));

            if (['mp4', 'avi', 'mov'].includes(fileExtension)) {
                setFile({ url, type: 'video' ,isDownloadable});
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
            console.error('Error fetching resource:', error);
            toast.error(t('toastErrorLoadingResource'));
        }
    };

const getFileIcon = (fileName) => {
    const ext = fileName?.split('.').pop().toLowerCase();

    const iconMap = {
        pdf: <FaFilePdf className="text-red-500" />,
        doc: <FaFileWord className="text-blue-500" />,
        docx: <FaFileWord className="text-blue-500" />,
        xls: <FaFileExcel className="text-green-500" />,
        xlsx: <FaFileExcel className="text-green-500" />,
        jpg: <FaFileImage className="text-yellow-500" />,
        jpeg: <FaFileImage className="text-yellow-500" />,
        png: <FaFileImage className="text-yellow-500" />,
        gif: <FaFileImage className="text-yellow-500" />,
        mp4: <FaFileVideo className="text-purple-500" />,
        avi: <FaFileVideo className="text-purple-500" />,
        mov: <FaFileVideo className="text-purple-500" />,
        mp3: <FaFileAudio className="text-orange-500" />,
        wav: <FaFileAudio className="text-orange-500" />,
        zip: <FaFileArchive className="text-gray-500" />,
        rar: <FaFileArchive className="text-gray-500" />,
        html: <FaFileCode className="text-teal-500" />,
        css: <FaFileCode className="text-teal-500" />,
        js: <FaFileCode className="text-teal-500" />,
        json: <FaFileCode className="text-teal-500" />,
    };

    // Default icon if extension not matched
    return iconMap[ext] || <FaFileAlt className="text-gray-500" />;
};


    return (
        <div className={`p-6 bg-gray-100 ${isRTL ? 'rtl' : ''}`}>  {/* Applying RTL if Arabic */}
            <ToastContainer />
            <h1 className="text-3xl font-bold mb-4 text-gray-800">{t('librariesTitle')}</h1>

            {/* Formation Filter */}
             <div className="mb-6">
                <Select
                    value={formations.find(f => f.value === formationId)} // Select the currently selected formation
                    onChange={handleFormationChange} // Handle change event
                    options={formations} // Options from the backend
                    isClearable
                    placeholder={t("labels.selectFormation")}
                    className="react-select-container"
                    classNamePrefix="react-select"
                />
            </div>
            <div className="mb-6">
                <input
                    type="text"
                    value={libraryName}
                    onChange={handleSearchChange}
                    className="p-2 border border-gray-300 rounded-lg w-full"
                    placeholder={t("labels.searchLibrary")}
                />
            </div>

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
                        <video controls className="w-full max-w-lg mx-auto" controlsList={file?.isDownloadable ? "download" : "nodownload"}>
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

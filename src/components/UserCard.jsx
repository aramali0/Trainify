import React, { useState, useEffect } from 'react';
import axiosInstance from '../helper/axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaLock, FaUnlock } from 'react-icons/fa'; // Example icons

const UserCard = ({ user, onUpdate, onDelete, onBlock }) => {
    const [loadedImageUrl, setLoadedImageUrl] = useState(null);

    useEffect(() => {
        const fetchImageWithAuth = async () => {
            try {
                const response = await axiosInstance.get(`http://localhost:8087/api${user.profileImagePath}`, {
                    responseType: 'blob',
                });
                const imageUrl = URL.createObjectURL(response.data);
                setLoadedImageUrl(imageUrl);
            } catch (error) {
                console.error("Error fetching image:", error);
                setLoadedImageUrl("https://via.placeholder.com/150");
            }
        };

        if (user.profileImagePath) {
            fetchImageWithAuth();
        } else {
            setLoadedImageUrl("https://via.placeholder.com/150");
        }
    }, [user.profileImagePath]);

    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img
                src={loadedImageUrl || "https://via.placeholder.com/150"}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-full h-40 object-cover"
            />
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{user.firstName} {user.lastName}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <div className="mt-4 flex space-x-3">
                    <button
                        onClick={() => onUpdate(user.id)}
                        className="text-blue-500 hover:text-blue-700"
                    >
                        <FaEdit />
                    </button>
                    <button
                        onClick={() => onDelete(user.id)}
                        className="text-red-500 hover:text-red-700"
                    >
                        <FaTrash />
                    </button>
                    <button
                        onClick={() => onBlock(user.id)}
                        className={`text-gray-500 ${user.isEnabled ? 'hover:text-gray-700' : 'text-red-500 hover:text-red-700'}`}
                    >
                        {user.isEnabled ? <FaLock /> : <FaUnlock />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserCard;

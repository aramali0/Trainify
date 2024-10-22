import React, { useEffect, useState } from 'react';
import axiosInstance from '../helper/axios';
import ReactPaginate from 'react-paginate';
import UserCard from '../components/UserCard';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next'; // Hook for translations

const UsersPage = () => {
    const { entrepriseId } = useParams(); // Get entrepriseId from URL params
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [roleFilter, setRoleFilter] = useState('all'); // New state for role filter
    const usersPerPage = 10;
    const navigate = useNavigate();
    
    const { t, i18n } = useTranslation('pages/usersPage'); // Import the translation hook
    const isRTL = i18n.language === 'ar'; // Check if the language is Arabic (RTL)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                let url = '/users/all';
                if (entrepriseId) {
                    url = `/entreprises/${entrepriseId}/users`;
                    if (roleFilter !== 'all') {
                        url += `?role=${roleFilter}`;
                    }
                }
                const response = await axiosInstance.get(url);
                setAllUsers(response.data);
                setFilteredUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
                toast.error(t('fetchError'));
            }
        };

        fetchUsers();
    }, [entrepriseId, roleFilter, t]);

    useEffect(() => {
        let results = allUsers;
        results = results.filter(user =>
            user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredUsers(results);
    }, [searchQuery, allUsers, roleFilter]);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleRoleFilterChange = (e) => {
        setRoleFilter(e.target.value);
    };

    const handleUpdate = (userId) => {
        navigate(`/admin/update/${userId}`);
    };

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/users/${id}`);
            toast.success(t('userDeleted'));
            navigate(`/admin/users${entrepriseId ? `/${entrepriseId}` : ''}`); // Redirect to users list
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error(t('deleteError'));
        }
    };

    const handleBlock = async (id, isEnabled) => {
        try {
            await axiosInstance.put(`/users/${id}/block`);
            toast.success(isEnabled ? t('userUnblocked') : t('userBlocked'));
        } catch (error) {
            console.error("Error blocking user:", error);
            toast.error(t('blockError'));
        }
    };

    const paginatedUsers = filteredUsers.slice(
        currentPage * usersPerPage,
        (currentPage + 1) * usersPerPage
    );

    return (
        <div className={`p-6 max-w-7xl mx-auto ${isRTL ? 'rtl' : ''}`}> {/* RTL class if Arabic */}
            <ToastContainer />
            <div className="mb-6 flex flex-col md:flex-row items-center justify-between">
                <input
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {entrepriseId && (
                    <select
                        value={roleFilter}
                        onChange={handleRoleFilterChange}
                        className="mt-4 md:mt-0 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">{t('allRoles')}</option>
                        <option value="participants">{t('participants')}</option>
                        <option value="formateurs">{t('formateurs')}</option>
                        <option value="responsableFormation">{t('responsableFormation')}</option>
                    </select>
                )}
            </div>
            <h1 className="text-3xl font-bold mb-6">{entrepriseId ? t('usersForEnterprise') : t('allUsers')}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedUsers.map(user => (
                    <UserCard
                        key={user.userId}
                        user={user}
                        onUpdate={() => handleUpdate(user.userId)}
                        onDelete={() => handleDelete(user.userId)}
                        onBlock={() => handleBlock(user.userId, user.isEnabled)}
                    />
                ))}
            </div>
            <div className="mt-6 flex justify-center">
                <ReactPaginate
                    previousLabel={t('previous')}
                    nextLabel={t('next')}
                    pageCount={Math.ceil(filteredUsers.length / usersPerPage)}
                    onPageChange={handlePageClick}
                    containerClassName={"flex space-x-2"}
                    pageClassName={"px-3 py-1 border rounded-lg cursor-pointer"}
                    previousClassName={"px-3 py-1 border rounded-lg cursor-pointer"}
                    nextClassName={"px-3 py-1 border rounded-lg cursor-pointer"}
                    activeClassName={"bg-blue-500 text-white"}
                    disabledClassName={"text-gray-400 cursor-not-allowed"}
                />
            </div>
        </div>
    );
};

export default UsersPage;

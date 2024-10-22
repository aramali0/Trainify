import React, { useState, useEffect } from 'react';
import axiosInstance from '../helper/axios';

const PaymentsList = () => {
    const [payments, setPayments] = useState([]);
    const [users, setUsers] = useState({});

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await axiosInstance.get('/admin/payments');
                setPayments(response.data);
                const userResponse = await axiosInstance.get('/users/all');
                const userMap = {};
                userResponse.data.forEach(user => {
                    userMap[user.userId] = user;
                });
                setUsers(userMap);
            } catch (error) {
                console.error('Failed to fetch payments or users:', error);
            }
        };
        fetchPayments();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Payments List</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {payments.map(payment => {
                        const user = users[payment.userId] || {};
                        return (
                            <div key={payment.id} className="bg-white p-6 rounded-lg shadow-xl transform transition-transform hover:scale-105 hover:shadow-2xl">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-2xl font-semibold text-gray-800">{user.firstName} {user.lastName}</h3>
                                    <span className="text-sm text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-lg text-gray-700 mb-2"><strong>Plan:</strong> {payment.plan}</p>
                                <p className="text-lg text-gray-700 mb-2"><strong>Amount:</strong> ${payment.amount / 100}</p>
                                <p className="text-lg text-gray-700 mb-2"><strong>Status:</strong> {payment.status}</p>
                                <div className="mt-4">
                                    {payment.receiptUrl && (
                                        <a href={payment.receiptUrl} className="inline-block px-4 py-2 bg-gradient-to-r from-teal-400 to-green-500 text-white rounded-lg shadow-md hover:from-teal-500 hover:to-green-600 transition" target="_blank" rel="noopener noreferrer">
                                            Download Receipt
                                        </a>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PaymentsList;

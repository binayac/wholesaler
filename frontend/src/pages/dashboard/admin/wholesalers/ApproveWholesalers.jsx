import { useEffect, useState } from 'react';
import axios from 'axios';
import { useApproveWholesalerMutation, useGetPendingWholesalersQuery } from '../../../../redux/features/auth/authApi';

const ApproveWholesalers = () => {
    const { data, isLoading, isError } = useGetPendingWholesalersQuery();
    const [approveWholesaler, { isLoading: approving }] = useApproveWholesalerMutation();

    const handleApprove = async (userId) => {
        try {
            await approveWholesaler(userId);
        } catch (err) {
            console.error("Approval failed", err);
        }
    };

    if (isLoading) return <p>Loading wholesalers...</p>;
    if (isError || !data?.wholesalers) return <p>Failed to fetch wholesalers. {err?.message || 'Unknown error occurred'}</p>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Pending Wholesaler Approvals</h2>
            {data.wholesalers.length === 0 ? (
                <p>No pending wholesalers.</p>
            ) : (
                <ul className="space-y-4">
                    {data.wholesalers.map(user => (
                        <li key={user._id} className="border p-4 rounded">
                            <p><strong>{user.username}</strong> ({user.email})</p>
                            <p>Business: {user.businessName}</p>
                            <p>License: {user.businessLicense}</p>
                            <p>Tax ID: {user.taxId}</p>
                            <button
                                onClick={() => handleApprove(user._id)}
                                disabled={approving}
                                className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                {approving ? 'Approving...' : 'Approve'}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
export default ApproveWholesalers
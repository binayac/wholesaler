import { useEffect, useState } from 'react';
import { useApproveWholesalerMutation, useGetPendingWholesalersQuery } from '../../../../redux/features/auth/authApi';

const ManageWholesalers = () => {
    const { data, isLoading, isError } = useGetPendingWholesalersQuery();
    const [updateStatus, { isLoading: updatingStatus }] = useApproveWholesalerMutation();
    const [statusFilter, setStatusFilter] = useState('all');

    const handleStatusChange = async (userId, newStatus) => {
        try {
            await updateStatus({ userId, status: newStatus });
        } catch (err) {
            console.error('Status update failed', err);
        }
    };

    if (isLoading) return <p className="text-center py-8">Loading wholesalers...</p>;
    if (isError || !data?.wholesalers) return <p className="text-center py-8 text-red-500">Failed to fetch wholesalers. {isError}</p>;

    // Filter wholesalers by wholesalerStatus
    const filteredWholesalers = statusFilter === 'all' 
        ? data.wholesalers 
        : data.wholesalers.filter(wholesaler => wholesaler.wholesalerStatus === statusFilter);

    return (
        <section className="py-1 bg-blueGray-50">
            <div className="w-full mb-12 xl:mb-0 px-4 mx-auto">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 border rounded">
                    <div className="rounded-t mb-0 px-4 py-3 border-0">
                        <div className="flex flex-wrap items-center">
                            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                                <h3 className="font-semibold text-base text-blueGray-700">Wholesaler Requests</h3>
                            </div>
                            <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                                <select
                                    id="statusFilter"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                >
                                    <option value="all">All Wholesalers</option>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="block w-full overflow-x-auto">
                        {filteredWholesalers.length === 0 ? (
                            <p className="text-center py-4">No wholesalers to display.</p>
                        ) : (
                            <table className="items-center bg-transparent w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                            Wholesaler
                                        </th>
                                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                            Business Details
                                        </th>
                                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                            Status
                                        </th>
                                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredWholesalers.map(wholesaler => (
                                        <tr key={wholesaler._id}>
                                            <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700">
                                                <div><strong>{wholesaler.username}</strong></div>
                                                <div className="text-xs text-blueGray-500">{wholesaler.email}</div>
                                            </th>
                                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                <div>Business: {wholesaler.businessName}</div>
                                                <div>License: {wholesaler.businessLicense}</div>
                                                <div>Tax ID: {wholesaler.taxId}</div>
                                            </td>
                                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                <span 
                                                    className={
                                                        wholesaler.wholesalerStatus === 'approved' 
                                                            ? 'text-emerald-500' 
                                                            : wholesaler.wholesalerStatus === 'rejected' 
                                                                ? 'text-red-500' 
                                                                : 'text-orange-500'
                                                    }
                                                >
                                                    <i className={`fas fa-${wholesaler.wholesalerStatus === 'approved' ? 'arrow-up text-emerald-500' : 'arrow-down text-orange-500'} mr-2`}></i>
                                                    {wholesaler.wholesalerStatus.charAt(0).toUpperCase() + wholesaler.wholesalerStatus.slice(1)}
                                                </span>
                                            </td>
                                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleStatusChange(wholesaler._id, 'approved')}
                                                        disabled={updatingStatus || wholesaler.wholesalerStatus === 'approved'}
                                                        className="bg-emerald-500 text-white active:bg-emerald-600 text-xs px-3 py-1 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:opacity-50"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(wholesaler._id, 'rejected')}
                                                        disabled={updatingStatus || wholesaler.wholesalerStatus === 'rejected'}
                                                        className="bg-red-500 text-white active:bg-red-600 text-xs px-3 py-1 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:opacity-50"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ManageWholesalers;
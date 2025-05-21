import React, { useState, useEffect } from 'react';
import { useUpdateOrderStatusMutation } from '../../../../redux/features/orders/orderApi';

const UpdateOrderModal = ({ order, isOpen, onClose }) => {
    const [status, setStatus] = useState(order?.status);
    const [availableStatuses, setAvailableStatuses] = useState([]);

    const [updateOrderStatus, { isLoading, error }] = useUpdateOrderStatusMutation();

    // Define valid status transitions
    const statusFlow = ['pending', 'processing', 'shipped', 'completed'];

    // Update available statuses based on current order status
    useEffect(() => {
        if (order?.status) {
            const currentIndex = statusFlow.indexOf(order.status);
            const validStatuses = [];
            if (currentIndex > 0) validStatuses.push(statusFlow[currentIndex - 1]); // Previous status
            validStatuses.push(statusFlow[currentIndex]); // Current status
            if (currentIndex < statusFlow.length - 1) validStatuses.push(statusFlow[currentIndex + 1]); // Next status
            setAvailableStatuses(validStatuses);
            setStatus(order.status); // Reset to current status when order changes
        }
    }, [order?.status]);

    const handleUpdateOrderStatus = async () => {
        try {
            await updateOrderStatus({ id: order?.orderId, status }).unwrap();
            onClose();
        } catch (error) {
            console.error("Failed to update order status:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-xl font-semibold mb-4">Update Order Status</h2>
                
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="status">Status</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="border border-gray-300 p-2 rounded w-full"
                    >
                        {availableStatuses.map((statusOption) => (
                            <option key={statusOption} value={statusOption}>
                                {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
                
                {error && <p className="text-red-500 mb-4">{error?.data?.message || 'Failed to update status.'}</p>}
                
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpdateOrderStatus}
                        disabled={isLoading}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        {isLoading ? 'Updating...' : 'Update'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateOrderModal;
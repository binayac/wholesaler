import React, { useState } from 'react'
import { useDeleteOrderMutation, useGetAllOrdersQuery } from '../../../../redux/features/orders/orderApi'
import { Link } from 'react-router-dom';
import UpdateOrderModal from './UpdateOrderModal';
import { formatDate } from '../../../../utils/formatDate'


const ManageOrders = () => {
    const { data: orders, error, isLoading, refetch } = useGetAllOrdersQuery();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteOrder] = useDeleteOrderMutation();

    const handleEditOrder = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    const handleDeleteOder = async (orderId) => {
        try {
            await deleteOrder(orderId).unwrap();
            alert("Order deleted successfully");
            refetch();
        } catch (error) {
            console.error("Failed to delete order:", error);
        }
    };

    if (isLoading) return <div>Loading....</div>;
    if (error) return <div>Something went wrong!</div>;

    return (
        <div className='content__container'>
            <h2 className='text-2xl font-semibold mb-4'>Manage Orders</h2>
            <table className='min-w-full bg-white border border-gray-200 rounded-lg'>
                <thead className='bg-gray-100 text-left'>
                    <tr>
                        <th className='py-3 px-4 border-b'>Order Id</th>
                        <th className='py-3 px-4 border-b'>Customer</th>
                        <th className='py-3 px-4 border-b'>Order Status</th>
                        <th className='py-3 px-4 border-b'>Payment Status</th>
                        <th className='py-3 px-4 border-b'>Date</th>
                        <th className='py-3 px-4 border-b'>Actions</th>
                    </tr>
                </thead>

                <tbody className='text-sm'>
                    {orders &&
                        orders.map((order, index) => (
                            <tr key={index}>
                                <td className='py-3 px-4 border-b'>{order?.orderId}</td>
                                <td className='py-3 px-4 border-b'>{order?.email}</td>
                                <td className='py-3 px-4 border-b'>
                                    <span
                                        className={`inline-block px-3 py-1 text-xs text-white rounded-full ${getStatusColor(
                                            order?.status,
                                            'status'
                                        )}`}
                                    >
                                        {order?.status}
                                    </span>
                                </td>
                                <td className='py-3 px-4 border-b'>
                                    <span
                                        className={`inline-block px-3 py-1 text-xs text-white rounded-full ${getStatusColor(
                                            order?.paymentStatus || 'Unknown',
                                            'paymentStatus'
                                        )}`}
                                    >
                                        {order?.paymentStatus || 'Unknown'}
                                    </span>
                                </td>
                                <td className='py-3 px-4 border-b'>{formatDate(order?.updatedAt)}</td>
                                <td className='py-3 px-4 border-b flex items-center space-x-4'>
                                    <Link to={`/dashboard/view-orders/${order.orderId}`} className="text-blue-500 hover:underline">
                                        View
                                    </Link>
                                    <button
                                        className="text-green-500 hover:underline"
                                        onClick={() => handleEditOrder(order)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="text-red-500 hover:underline"
                                        onClick={() => handleDeleteOder(order?._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>

            {/* Update order modal */}
            {selectedOrder && (
                <UpdateOrderModal order={selectedOrder} isOpen={isModalOpen} onClose={handleCloseModal} />
            )}
        </div>
    );
};

const getStatusColor = (status, type) => {
    if (type === 'status') {
        switch (status) {
            case 'pending':
                return 'bg-yellow-500';
            case 'processing':
                return 'bg-blue-500';
            case 'shipped':
                return 'bg-green-500';
            case 'completed':
                return 'bg-gray-500';
            default:
                return 'bg-gray-300';
        }
    } else if (type === 'paymentStatus') {
        switch (status) {
            case 'pending':
                return 'bg-yellow-500';
            case 'completed':
                return 'bg-green-500';
            case 'failed':
                return 'bg-red-500';
            default:
                return 'bg-gray-300';
        }
    }
    return 'bg-gray-300';
};

export default ManageOrders
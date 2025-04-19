import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetOrderByIdQuery } from '../../../../redux/features/orders/orderApi';
import { Copy } from 'lucide-react';

const ViewOrder = () => {
  const { orderId } = useParams();
  const [copied, setCopied] = useState(false);

  const { data: order, isLoading, error } = useGetOrderByIdQuery(orderId);
  console.log(order)

  const copyTrackingNumber = () => {
    if (order?.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load order.</p>;

  if (!order) {
    return <p>No order found.</p>;
  }

  const items = order?.products || [];
  const totalAmount = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);

  return (
    <div className="w-full mx-auto bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Order Detail</h1>
        <div className="flex items-center gap-2">
          <span className="text-gray-700 font-medium">#{order?._id}</span>
          <span className="bg-green-100 text-green-600 px-2 py-1 rounded-md text-xs font-medium">{order?.status}</span>
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Items</h2>
          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">{items.length}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item._id} className="flex bg-gray-50 p-4 rounded-lg">
              <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden mr-4">
                <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{item.name}</div>
                <div className="text-sm font-semibold mt-1">$ {item.price?.toLocaleString() || 'N/A'}</div>
                <div className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Order Summary</h2>
          <span className="bg-green-100 text-green-600 px-2 py-1 rounded-md text-xs font-medium">{order?.paymentStatus}</span>
        </div>
        <div className="text-sm text-gray-500 mb-4">Here's your summary for the stuff you bought.</div>

        <div className="space-y-2 mb-4">
          {items.map((item) => (
            <div key={item._id} className="flex justify-between">
              <span className="text-sm">{item.name}</span>
              <span className="text-sm font-medium">$ {(item.price * item.quantity).toLocaleString() || 'N/A'}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between pt-4 border-t">
          <span className="font-semibold">Total</span>
          <span className="font-semibold">$ {totalAmount.toLocaleString() || '0'}</span>
        </div>

        <div className="flex justify-between items-center mt-8">
          <div className="text-sm text-gray-700">
            <span className="font-semibold">$ {totalAmount.toLocaleString() || '0'}</span>
            <span className="text-gray-500 ml-1">({items.length} Items)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOrder;
